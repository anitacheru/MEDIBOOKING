// ─── DISEASE → SPECIALTY MAPPING ───────────────────────────────────
export const DISEASE_SPECIALTY_MAP = {
  'Skin Rash':          'Dermatologist',
  'Acne':               'Dermatologist',
  'Eczema':             'Dermatologist',
  'Hair Loss':          'Dermatologist',
  'Chest Pain':         'Cardiologist',
  'High Blood Pressure':'Cardiologist',
  'Heart Palpitations': 'Cardiologist',
  'Headache':           'Neurologist',
  'Seizures':           'Neurologist',
  'Memory Issues':      'Neurologist',
  'Broken Bone':        'Orthopedist',
  'Joint Pain':         'Orthopedist',
  'Back Pain':          'Orthopedist',
  'Fever':              'General Practitioner',
  'Cough':              'General Practitioner',
  'Cold':               'General Practitioner',
  'Diabetes':           'Endocrinologist',
  'Thyroid Issues':     'Endocrinologist',
  'Blurry Vision':      'Ophthalmologist',
  'Eye Infection':      'Ophthalmologist',
};

// ─── DOCTORS ────────────────────────────────────────────────────────
export const DOCTORS = [
  { id:'doc1', name:'Dr. Sarah Chen',        specialty:'Dermatologist',          status:'Enabled', experience:'12 yrs', initials:'SC', email:'sarah.chen@medibook.com' },
  { id:'doc2', name:'Dr. James Okafor',      specialty:'Cardiologist',           status:'Enabled', experience:'18 yrs', initials:'JO', email:'james.okafor@medibook.com' },
  { id:'doc3', name:'Dr. Amina Patel',       specialty:'Neurologist',            status:'Enabled', experience:'9 yrs',  initials:'AP', email:'amina.patel@medibook.com' },
  { id:'doc4', name:'Dr. Robert Kim',        specialty:'Orthopedist',            status:'Enabled', experience:'15 yrs', initials:'RK', email:'robert.kim@medibook.com' },
  { id:'doc5', name:'Dr. Lena Martinez',     specialty:'General Practitioner',   status:'Enabled', experience:'7 yrs',  initials:'LM', email:'lena.martinez@medibook.com' },
  { id:'doc6', name:'Dr. Ethan Brooks',      specialty:'Endocrinologist',        status:'Pending', experience:'5 yrs',  initials:'EB', email:'ethan.brooks@medibook.com' },
  { id:'doc7', name:'Dr. Fatima Al-Rashid',  specialty:'Ophthalmologist',        status:'Enabled', experience:'11 yrs', initials:'FA', email:'fatima.alrashid@medibook.com' },
];

// ─── PATIENTS ───────────────────────────────────────────────────────
export const PATIENTS = [
  { id:'pat1', name:'Michael Torres',  email:'michael.t@email.com', dob:'1990-03-15', phone:'555-0101' },
  { id:'pat2', name:'Grace Nakamura', email:'grace.n@email.com',   dob:'1985-07-22', phone:'555-0102' },
  { id:'pat3', name:'David Osei',     email:'david.o@email.com',   dob:'1992-11-08', phone:'555-0103' },
  { id:'pat4', name:'Emma Lindqvist', email:'emma.l@email.com',    dob:'1988-01-30', phone:'555-0104' },
];

// ─── APPOINTMENTS (seed) ────────────────────────────────────────────
export const APPOINTMENTS_SEED = [
  { id:'appt1', patientName:'Michael Torres',  doctorId:'doc1', doctorName:'Dr. Sarah Chen',       specialty:'Dermatologist',        date:'2026-02-10', time:'10:00 AM', status:'Pending',   disease:'Acne',          notes:'' },
  { id:'appt2', patientName:'Grace Nakamura', doctorId:'doc2', doctorName:'Dr. James Okafor',     specialty:'Cardiologist',         date:'2026-02-12', time:'02:00 PM', status:'Accepted',  disease:'Chest Pain',    notes:'' },
  { id:'appt3', patientName:'David Osei',     doctorId:'doc3', doctorName:'Dr. Amina Patel',      specialty:'Neurologist',          date:'2026-02-08', time:'09:00 AM', status:'Completed', disease:'Headache',      notes:'Referred for MRI' },
  { id:'appt4', patientName:'Emma Lindqvist', doctorId:'doc5', doctorName:'Dr. Lena Martinez',    specialty:'General Practitioner', date:'2026-02-15', time:'11:00 AM', status:'Pending',   disease:'Fever',         notes:'' },
];

// ─── PRESCRIPTIONS (seed) ──────────────────────────────────────────
export const PRESCRIPTIONS_SEED = [
  {
    id:'rx1',
    patientName:'David Osei',
    doctorName:'Dr. Amina Patel',
    date:'2026-02-08',
    medicines:[
      { name:'Paracetamol', dosage:'500mg',  frequency:'Twice daily', duration:'7 days' },
      { name:'Ibuprofen',   dosage:'400mg',  frequency:'Once daily',  duration:'5 days' },
    ],
    notes:'Rest for 2 days. Stay hydrated.',
  },
];

// ─── TIME SLOTS GENERATOR ──────────────────────────────────────────
export const generateSlots = (doctorId) => {
  const base = ['09:00 AM','10:00 AM','11:00 AM','12:00 PM','02:00 PM','03:00 PM','04:00 PM'];
  return base.map((time, i) => ({
    id: `${doctorId}-slot-${i}`,
    time,
    available: ![1, 4].includes(i), // simulate two booked slots
  }));
};

// ─── HELPERS ────────────────────────────────────────────────────────
export const getInitials = (name) =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

export const statusClass = (status) => {
  const map = { Accepted:'green', Completed:'green', Pending:'orange', Cancelled:'red', Enabled:'green' };
  return map[status] || 'orange';
};
