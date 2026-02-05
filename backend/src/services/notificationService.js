const nodemailer  = require('nodemailer');
const Notification = require('../models/Notification');
const User         = require('../models/User');

/* ── Email transporter ────────────────────────────────────────
   Configure this with your SMTP credentials in .env
   For development: use Ethereal (fake SMTP) or Mailtrap
   For production: use SendGrid, AWS SES, or Gmail
*/
const createTransporter = () => {
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  // Default: custom SMTP
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

/* ── Main notification function ───────────────────────────────
   Creates in-app notification + sends email if user preferences allow
*/
const notify = async ({ userId, type, title, message, relatedId }) => {
  try {
    // 1. Create in-app notification
    const notif = await Notification.create({
      user: userId,
      type,
      title,
      message,
      relatedId,
    });

    // 2. Check if user wants email notifications
    const user = await User.findById(userId);
    if (!user) return;

    // Check role-specific notification preferences
    let emailEnabled = true;
    if (user.role === 'doctor') {
      const Doctor = require('../models/Doctor');
      const doc = await Doctor.findOne({ userId });
      emailEnabled = doc?.notifications?.email ?? true;
    } else if (user.role === 'patient') {
      const Patient = require('../models/Patient');
      const patient = await Patient.findOne({ userId });
      emailEnabled = patient?.notifications?.email ?? true;
    }

    if (!emailEnabled) return;

    // 3. Send email
    const transporter = createTransporter();
    await transporter.sendMail({
      from:    process.env.EMAIL_FROM || '"MediBook" <noreply@medibook.com>',
      to:      user.email,
      subject: title,
      html:    `
        <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto;">
          <h2 style="color: #0f0f0f;">${title}</h2>
          <p style="color: #6b6b66; line-height: 1.6;">${message}</p>
          <hr style="border: none; border-top: 1px solid #e0e0dd; margin: 24px 0;" />
          <p style="font-size: 12px; color: #9a9a96;">
            This is an automated notification from MediBook. 
            <a href="${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}/notifications" style="color: #0f0f0f;">View all notifications</a>
          </p>
        </div>
      `,
    });

    // mark as sent
    notif.emailSent = true;
    await notif.save();

    console.log(`[Notification] Sent to ${user.email}: ${title}`);
  } catch (err) {
    console.error('[Notification] Failed:', err.message);
  }
};

/* ── Convenience helpers ──────────────────────────────────────*/

const notifyAppointmentBooked = async (appointment, patientUser, doctorUser) => {
  // notify doctor
  await notify({
    userId:    doctorUser._id,
    type:      'appointment_booked',
    title:     'New Appointment Request',
    message:   `${patientUser.name} has booked an appointment with you on ${appointment.date} at ${appointment.time} for ${appointment.disease}.`,
    relatedId: appointment._id,
  });

  // notify patient (confirmation)
  await notify({
    userId:    patientUser._id,
    type:      'appointment_booked',
    title:     'Appointment Booked',
    message:   `Your appointment with Dr. ${doctorUser.name} on ${appointment.date} at ${appointment.time} is pending confirmation.`,
    relatedId: appointment._id,
  });
};

const notifyAppointmentAccepted = async (appointment, patientUser, doctorUser) => {
  await notify({
    userId:    patientUser._id,
    type:      'appointment_accepted',
    title:     'Appointment Confirmed',
    message:   `Dr. ${doctorUser.name} has accepted your appointment on ${appointment.date} at ${appointment.time}.`,
    relatedId: appointment._id,
  });
};

const notifyAppointmentCompleted = async (appointment, patientUser, doctorUser) => {
  await notify({
    userId:    patientUser._id,
    type:      'appointment_completed',
    title:     'Appointment Completed',
    message:   `Your appointment with Dr. ${doctorUser.name} on ${appointment.date} has been marked as completed.`,
    relatedId: appointment._id,
  });
};

const notifyAppointmentCancelled = async (appointment, patientUser, doctorUser, cancelledBy) => {
  const toUser = cancelledBy === 'doctor' ? patientUser : doctorUser;
  const byName = cancelledBy === 'doctor' ? `Dr. ${doctorUser.name}` : patientUser.name;

  await notify({
    userId:    toUser._id,
    type:      'appointment_cancelled',
    title:     'Appointment Cancelled',
    message:   `${byName} has cancelled the appointment scheduled for ${appointment.date} at ${appointment.time}.`,
    relatedId: appointment._id,
  });
};

const notifyPrescriptionIssued = async (prescription, patientUser, doctorUser) => {
  await notify({
    userId:    patientUser._id,
    type:      'prescription_issued',
    title:     'New Prescription',
    message:   `Dr. ${doctorUser.name} has issued a prescription for you with ${prescription.medicines.length} medicine(s).`,
    relatedId: prescription._id,
  });
};

const notifyDoctorEnabled = async (doctorUser) => {
  await notify({
    userId: doctorUser._id,
    type:   'doctor_enabled',
    title:  'Account Approved',
    message:'Your doctor account has been approved by an administrator. You can now accept appointments and manage your schedule.',
  });
};

module.exports = {
  notify,
  notifyAppointmentBooked,
  notifyAppointmentAccepted,
  notifyAppointmentCompleted,
  notifyAppointmentCancelled,
  notifyPrescriptionIssued,
  notifyDoctorEnabled,
};
