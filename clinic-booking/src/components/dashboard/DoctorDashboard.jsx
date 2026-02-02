// src/components/dashboard/DoctorDashboard.jsx
import React from 'react';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';
import '../styles/dashboard.css';

const DoctorDashboard = () => {
  // Mock appointments data for today
  const todayAppointments = [
    {
      id: 1,
      patient: 'John Smith',
      time: '10:00 AM',
      type: 'In-Person',
      status: 'Confirmed',
      purpose: 'Follow-up consultation'
    },
    {
      id: 2,
      patient: 'Sarah Williams',
      time: '11:30 AM',
      type: 'Teleconsultation',
      status: 'Checked-in',
      purpose: 'Annual checkup'
    },
    {
      id: 3,
      patient: 'Michael Brown',
      time: '2:00 PM',
      type: 'In-Person',
      status: 'Waiting',
      purpose: 'New patient consultation'
    }
  ];

  // Mock upcoming appointments
  const upcomingAppointments = [
    {
      id: 4,
      patient: 'Emily Johnson',
      date: '16 Mar 2025',
      time: '9:00 AM',
      type: 'In-Person',
      status: 'Confirmed'
    },
    {
      id: 5,
      patient: 'Robert Davis',
      date: '16 Mar 2025',
      time: '3:30 PM',
      type: 'Teleconsultation',
      status: 'Confirmed'
    },
    {
      id: 6,
      patient: 'Jennifer Lee',
      date: '17 Mar 2025',
      time: '10:30 AM',
      type: 'In-Person',
      status: 'Confirmed'
    }
  ];

  return (
    <div className="dashboard-container">
      <Navbar userType="doctor" />
      <Sidebar userType="doctor" />
      
      <main className="main-content">
        <div className="dashboard-welcome">
          <h2>Welcome, Dr. Johnson!</h2>
          <p>Here's your schedule for today</p>
        </div>
        
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>3</h3>
              <p>Today's Appointments</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>24</h3>
              <p>Total Patients</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">✓</div>
            <div className="stat-content">
              <h3>8</h3>
              <p>Upcoming This Week</p>
            </div>
          </div>
        </div>
        
        <div className="dashboard-today">
          <div className="section-header">
            <h3>Today's Schedule (15 Mar 2025)</h3>
            <div className="today-actions">
              <button className="btn-outline">Update Availability</button>
              <button className="btn-primary">Add Appointment</button>
            </div>
          </div>
          
          <div className="today-timeline">
            {todayAppointments.map(appointment => (
              <div key={appointment.id} className="timeline-card">
                <div className="timeline-time">
                  <div className="time-block">{appointment.time}</div>
                </div>
                
                <div className="timeline-content">
                  <div className={`appointment-card status-${appointment.status.toLowerCase()}`}>
                    <div className="appointment-header">
                      <h4>{appointment.patient}</h4>
                      <span className={`appointment-status status-${appointment.status.toLowerCase()}`}>
                        {appointment.status}
                      </span>
                    </div>
                    
                    <div className="appointment-details">
                      <div className="detail-item">
                        <span className="detail-icon">
                          {appointment.type === 'In-Person' ? '🏥' : '💻'}
                        </span>
                        <span className="detail-text">{appointment.type}</span>
                      </div>
                      
                      <div className="detail-item">
                        <span className="detail-icon">📝</span>
                        <span className="detail-text">{appointment.purpose}</span>
                      </div>
                    </div>
                    
                    <div className="appointment-actions">
                      <button className="btn-outline">View Details</button>
                      <button className="btn-secondary">Start Session</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="dashboard-upcoming">
          <div className="section-header">
            <h3>Upcoming Appointments</h3>
            <button className="btn-outline">View Full Schedule</button>
          </div>
          
          <div className="upcoming-list">
            {upcomingAppointments.map(appointment => (
              <div key={appointment.id} className="appointment-card compact">
                <div className="appointment-header">
                  <h4>{appointment.patient}</h4>
                  <span className={`appointment-status status-${appointment.status.toLowerCase()}`}>
                    {appointment.status}
                  </span>
                </div>
                
                <div className="appointment-details">
                  <div className="detail-item">
                    <span className="detail-icon">📅</span>
                    <span className="detail-text">{appointment.date}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-icon">🕒</span>
                    <span className="detail-text">{appointment.time}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-icon">
                      {appointment.type === 'In-Person' ? '🏥' : '💻'}
                    </span>
                    <span className="detail-text">{appointment.type}</span>
                  </div>
                </div>
                
                <div className="appointment-actions">
                  <button className="btn-outline">Reschedule</button>
                  <button className="btn-outline btn-danger">Cancel</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;