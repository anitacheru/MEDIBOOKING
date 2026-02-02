// src/components/appointments/BookAppointment.jsx
import React, { useState } from 'react';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';
import '../styles/appointments.css';

const BookAppointment = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('');
  
  // Mock doctors
  const doctors = [
    { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Cardiologist', rating: 4.9 },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'Dermatologist', rating: 4.8 },
    { id: 3, name: 'Dr. Emily Wilson', specialty: 'Neurologist', rating: 4.7 },
    { id: 4, name: 'Dr. David Brown', specialty: 'Pediatrician', rating: 4.9 },
    { id: 5, name: 'Dr. Lisa Williams', specialty: 'Ophthalmologist', rating: 4.6 }
  ];
  
  // Mock available times
  const availableTimes = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', 
    '11:30 AM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
  ];
  
  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };
  
  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit the appointment
    console.log({
      doctor: selectedDoctor,
      date: selectedDate,
      time: selectedTime,
      type: appointmentType
    });
    // Redirect to confirmation page or show success message
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h3>Select a Doctor</h3>
            <div className="doctors-grid">
              {doctors.map(doctor => (
                <div 
                  key={doctor.id} 
                  className={`doctor-card ${selectedDoctor === doctor.id ? 'selected' : ''}`}
                  onClick={() => setSelectedDoctor(doctor.id)}
                >
                  <div className="doctor-avatar">
                    <span>{doctor.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <h4>{doctor.name}</h4>
                  <p className="doctor-specialty">{doctor.specialty}</p>
                  <div className="doctor-rating">
                    <span className="rating-star">★</span> {doctor.rating}
                  </div>
                  <button className="btn-select">Select</button>
                </div>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="step-content">
            <h3>Select Date & Time</h3>
            <div className="booking-calendar">
              <div className="calendar-container">
                {/* Simplified calendar for example */}
                <div className="calendar-header">
                  <button className="calendar-nav">←</button>
                  <h4>March 2025</h4>
                  <button className="calendar-nav">→</button>
                </div>
                <div className="calendar-weekdays">
                  <span>Su</span>
                  <span>Mo</span>
                  <span>Tu</span>
                  <span>We</span>
                  <span>Th</span>
                  <span>Fr</span>
                  <span>Sa</span>
                </div>
                <div className="calendar-days">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                    <div 
                      key={day} 
                      className={`calendar-day ${selectedDate === `2025-03-${day}` ? 'selected' : ''}`}
                      onClick={() => setSelectedDate(`2025-03-${day}`)}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="time-slots">
                <h4>Available Time Slots</h4>
                <div className="time-slots-grid">
                  {availableTimes.map(time => (
                    <div 
                      key={time} 
                      className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="step-content">
            <h3>Select Appointment Type</h3>
            <div className="appointment-types">
              <div 
                className={`type-card ${appointmentType === 'in-person' ? 'selected' : ''}`}
                onClick={() => setAppointmentType('in-person')}
              >
                <div className="type-icon">🏥</div>
                <h4>In-Person Consultation</h4>
                <p>Visit the doctor at the clinic for a face-to-face consultation.</p>
                <button className="btn-select">Select</button>
              </div>
              
              <div 
                className={`type-card ${appointmentType === 'teleconsultation' ? 'selected' : ''}`}
                onClick={() => setAppointmentType('teleconsultation')}
              >
                <div className="type-icon">💻</div>
                <h4>Video Consultation</h4>
                <p>Consult with the doctor through a secure video call from anywhere.</p>
                <button className="btn-select">Select</button>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="step-content">
            <h3>Confirm Appointment Details</h3>
            
            <div className="confirmation-card">
              <div className="confirmation-item">
                <h4>Doctor</h4>
                <p>{doctors.find(d => d.id === selectedDoctor)?.name}</p>
                <p className="confirmation-sub">
                  {doctors.find(d => d.id === selectedDoctor)?.specialty}
                </p>
              </div>
              
              <div className="confirmation-item">
                <h4>Date & Time</h4>
                <p>{selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}</p>
                <p className="confirmation-sub">{selectedTime}</p>
              </div>
              
              <div className="confirmation-item">
                <h4>Appointment Type</h4>
                <p>
                  {appointmentType === 'in-person' ? 
                    'In-Person Consultation' : 
                    appointmentType === 'teleconsultation' ? 'Video Consultation' : ''}
                </p>
              </div>
            </div>
            
            <div className="confirmation-notes">
              <h4>Add Notes (Optional)</h4>
              <textarea 
                className="form-control"
                placeholder="Add any notes or details about your condition that might help the doctor..."
                rows={4}
              ></textarea>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="dashboard-container">
      <Navbar userType="patient" />
      <Sidebar userType="patient" />
      
      <main className="main-content">
        <div className="booking-container">
          <h2>Book an Appointment</h2>
          
          <div className="booking-stepper">
            <div className={`stepper-step ${currentStep >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <span className="step-name">Select Doctor</span>
            </div>
            <div className="stepper-line"></div>
            
            <div className={`stepper-step ${currentStep >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <span className="step-name">Choose Date & Time</span>
            </div>
            <div className="stepper-line"></div>
            
            <div className={`stepper-step ${currentStep >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <span className="step-name">Select Type</span>
            </div>
            <div className="stepper-line"></div>
            
            <div className={`stepper-step ${currentStep >= 4 ? 'active' : ''}`}>
              <div className="step-number">4</div>
              <span className="step-name">Confirm</span>
            </div>
          </div>
          
          <div className="booking-form">
            <form onSubmit={handleSubmit}>
              {renderStepContent()}
              
              <div className="booking-actions">
                {currentStep > 1 && (
                  <button 
                    type="button" 
                    className="btn-outline"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                )}
                
                {currentStep < 4 ? (
                  <button 
                    type="button" 
                    className="btn-primary"
                    onClick={handleNext}
                    disabled={
                      (currentStep === 1 && !selectedDoctor) ||
                      (currentStep === 2 && (!selectedDate || !selectedTime)) ||
                      (currentStep === 3 && !appointmentType)
                    }
                  >
                    Next
                  </button>
                ) : (
                  <button 
                    type="submit" 
                    className="btn-primary"
                  >
                    Confirm Booking
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookAppointment;