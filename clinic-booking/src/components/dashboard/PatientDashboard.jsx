import React, { useState } from 'react';
import Sidebar  from '../common/Sidebar';
import Navbar   from '../common/Navbar';
import Notifications from '../common/Notifications';
import {
  DISEASE_SPECIALTY_MAP, DOCTORS, APPOINTMENTS_SEED, PRESCRIPTIONS_SEED,
  generateSlots, getInitials, statusClass
} from '../../data';
import './dashboard.css';

// ─── ICONS ──────────────────────────────────────────────────────────
const Icons = {
  home:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  plus:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  calendar: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  file:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
};

const NAV_ITEMS = [
  { id:'dashboard',       label:'Dashboard',        icon: Icons.home },
  { id:'book',            label:'Book Appointment', icon: Icons.plus },
  { id:'myappointments',  label:'My Appointments',  icon: Icons.calendar },
  { id:'myprescriptions', label:'Prescriptions',    icon: Icons.file },
];

const PAGE_TITLES = { dashboard:'Dashboard', book:'Book Appointment', myappointments:'My Appointments', myprescriptions:'My Prescriptions' };

// ─── SHELL ──────────────────────────────────────────────────────────
const PatientDashboard = () => {
  const [page, setPage]                 = useState('dashboard');
  const [appointments, setAppointments] = useState(APPOINTMENTS_SEED);
  const [notification, setNotification] = useState(null);
  const notify = (msg, type='success') => setNotification({ message: msg, type });

  return (
    <div className="dashboard-layout">
      <Sidebar navItems={NAV_ITEMS} activePage={page} onNavigate={setPage} role="patient" />
      <div className="dashboard-main">
        <Navbar pageTitle={PAGE_TITLES[page]} />
        <Notifications notification={notification} onDismiss={() => setNotification(null)} />

        {page === 'dashboard'       && <PatientStats appointments={appointments} />}
        {page === 'book'            && <BookingWizard appointments={appointments} setAppointments={setAppointments} notify={notify} />}
        {page === 'myappointments'  && <MyAppointments appointments={appointments} />}
        {page === 'myprescriptions' && <MyPrescriptions />}
      </div>
    </div>
  );
};

// ─── PATIENT STATS ──────────────────────────────────────────────────
const PatientStats = ({ appointments }) => {
  const upcoming  = appointments.filter(a => a.status === 'Pending' || a.status === 'Accepted').length;
  const completed = appointments.filter(a => a.status === 'Completed').length;
  return (
    <div className="content-pad">
      <div className="stats-row">
        <div className="stat-card"><div className="stat-value">{appointments.length}</div><div className="stat-label">Total Appointments</div><div className="stat-sub">all time</div></div>
        <div className="stat-card"><div className="stat-value">{upcoming}</div><div className="stat-label">Upcoming</div><div className="stat-sub">scheduled</div></div>
        <div className="stat-card"><div className="stat-value">{completed}</div><div className="stat-label">Completed</div><div className="stat-sub">past visits</div></div>
        <div className="stat-card"><div className="stat-value">{PRESCRIPTIONS_SEED.length}</div><div className="stat-label">Prescriptions</div><div className="stat-sub">received</div></div>
      </div>
      <div className="card">
        <div className="card-header"><h3>Recent Appointments</h3></div>
        {appointments.slice(0,3).map(a => (
          <div className="list-row" key={a.id}>
            <div className="avatar">{a.doctorName.split(' ').pop()[0]}</div>
            <div style={{ marginLeft:12, flex:1 }}>
              <div className="list-row-name">{a.doctorName}</div>
              <div className="list-row-sub">{a.specialty} · {a.disease} · {a.date}</div>
            </div>
            <span className={`indicator indicator-${statusClass(a.status)}`}>{a.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── BOOKING WIZARD ─────────────────────────────────────────────────
const BookingWizard = ({ appointments, setAppointments, notify }) => {
  const [step, setStep]               = useState(0);
  const [disease, setDisease]         = useState('');
  const [doctor, setDoctor]           = useState(null);
  const [date, setDate]               = useState(null);
  const [time, setTime]               = useState(null);
  const [notes, setNotes]             = useState('');

  const diseases         = Object.keys(DISEASE_SPECIALTY_MAP);
  const specialty        = DISEASE_SPECIALTY_MAP[disease] || null;
  const matchedDoctors   = specialty ? DOCTORS.filter(d => d.specialty === specialty && d.status === 'Enabled') : [];
  const slots            = doctor ? generateSlots(doctor.id) : [];

  const reset = () => { setStep(0); setDisease(''); setDoctor(null); setDate(null); setTime(null); setNotes(''); };

  const confirm = () => {
    setAppointments(prev => [...prev, {
      id: `appt${Date.now()}`,
      patientName:'You',
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      date, time, status:'Pending', disease, notes,
    }]);
    notify('Appointment booked successfully!');
    setStep(4);
  };

  // ── STEP LABELS + PROGRESS ────────────────────────────────────────
  const stepLabels = ['Select Concern','Choose Doctor','Date & Time','Confirm','Done'];

  return (
    <div className="content-pad">
      <div className="wizard-wrap">
        {/* Progress bar */}
        <div className="wizard-progress">
          {stepLabels.map((label, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div className="wizard-line" style={{ background: i <= step ? 'var(--color-black)' : 'var(--color-gray-200)' }} />}
              <div className="wizard-dot-wrap">
                <div className="wizard-dot" style={{ background: i <= step ? 'var(--color-black)' : 'var(--color-gray-200)', color: i <= step ? '#fff' : 'var(--color-gray-400)' }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className="wizard-label" style={{ color: i === step ? 'var(--color-black)' : 'var(--color-gray-400)', fontWeight: i === step ? 600 : 400 }}>{label}</span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* ── STEP 0: Disease ─────────────────────────────────────── */}
        {step === 0 && (
          <div className="card">
            <div className="card-header"><h3>What is your concern?</h3></div>
            <div className="card-body">
              <p style={{ fontSize:13, color:'var(--color-gray-400)', marginBottom:14 }}>We'll match you with the right specialist automatically.</p>
              <div className="disease-grid">
                {diseases.map(d => (
                  <button key={d} className="btn" style={{ background: disease === d ? 'var(--color-black)' : 'var(--color-white)', color: disease === d ? '#fff' : 'var(--color-black)', justifyContent:'flex-start' }} onClick={() => setDisease(d)}>{d}</button>
                ))}
              </div>
              {disease && (
                <div className="match-badge">Recommended: <strong>{specialty}</strong></div>
              )}
              <div className="wizard-actions">
                <button className="btn btn-primary" disabled={!disease} style={{ opacity: disease ? 1 : 0.4 }} onClick={() => setStep(1)}>Next →</button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 1: Doctor ──────────────────────────────────────── */}
        {step === 1 && (
          <div className="card">
            <div className="card-header"><h3>Choose a {specialty}</h3></div>
            <div className="card-body">
              {matchedDoctors.length === 0 && <div className="empty-state">No available doctors for this specialty.</div>}
              {matchedDoctors.map(d => (
                <div key={d.id} className={`doctor-pick ${doctor?.id === d.id ? 'selected' : ''}`} onClick={() => setDoctor(d)}>
                  <div className="avatar" style={{ width:42, height:42 }}>{d.initials}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600, fontSize:14 }}>{d.name}</div>
                    <div style={{ fontSize:12, color:'var(--color-gray-400)' }}>{d.specialty} · {d.experience} experience</div>
                  </div>
                  {doctor?.id === d.id && <span>✓</span>}
                </div>
              ))}
              <div className="wizard-actions">
                <button className="btn btn-sm btn-outline" onClick={() => setStep(0)}>← Back</button>
                <button className="btn btn-primary" disabled={!doctor} style={{ opacity: doctor ? 1 : 0.4 }} onClick={() => setStep(2)}>Next →</button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: Date + Slot ─────────────────────────────────── */}
        {step === 2 && (
          <div className="card">
            <div className="card-header"><h3>Pick Date & Time</h3></div>
            <div className="card-body">
              <div className="date-slot-grid">
                <div>
                  <label style={{ display:'block', fontSize:11, fontWeight:600, color:'var(--color-gray-500)', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.5px' }}>Date</label>
                  <MiniCalendar selected={date} onSelect={setDate} />
                </div>
                <div>
                  <label style={{ display:'block', fontSize:11, fontWeight:600, color:'var(--color-gray-500)', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.5px' }}>Time Slot</label>
                  <div className="slot-col">
                    {slots.map(s => (
                      <div key={s.id} className={`slot ${!s.available ? 'booked' : ''} ${time === s.time ? 'selected' : ''}`} onClick={() => s.available && setTime(s.time)}>
                        {s.time}{!s.available && <span style={{ fontSize:10 }}> (Booked)</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="form-group" style={{ marginTop:16 }}>
                <label>Additional Notes (optional)</label>
                <textarea className="form-control" placeholder="Anything the doctor should know…" value={notes} onChange={e => setNotes(e.target.value)} />
              </div>
              <div className="wizard-actions">
                <button className="btn btn-sm btn-outline" onClick={() => setStep(1)}>← Back</button>
                <button className="btn btn-primary" disabled={!date || !time} style={{ opacity: date && time ? 1 : 0.4 }} onClick={() => setStep(3)}>Next →</button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Confirm ─────────────────────────────────────── */}
        {step === 3 && (
          <div className="card">
            <div className="card-header"><h3>Confirm Booking</h3></div>
            <div className="card-body">
              <div className="confirm-summary">
                {[['Concern', disease],['Specialist', specialty],['Doctor', doctor?.name],['Date', date],['Time', time]].map(([k,v]) => (
                  <div className="confirm-row" key={k}>
                    <span className="confirm-label">{k}</span>
                    <span className="confirm-value">{v}</span>
                  </div>
                ))}
                {notes && <div className="confirm-notes">📋 {notes}</div>}
              </div>
              <div className="wizard-actions">
                <button className="btn btn-sm btn-outline" onClick={() => setStep(2)}>← Back</button>
                <button className="btn btn-primary" onClick={confirm}>Confirm Booking</button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4: Success ─────────────────────────────────────── */}
        {step === 4 && (
          <div className="card" style={{ textAlign:'center', padding: '3rem 2rem' }}>
            <div className="success-icon" style={{ margin:'0 auto 16px' }}>✓</div>
            <h3 style={{ fontSize:18, marginBottom:6 }}>Booking Confirmed!</h3>
            <p style={{ color:'var(--color-gray-400)', fontSize:13, maxWidth:300, margin:'0 auto 24px' }}>
              Your appointment with <strong>{doctor?.name}</strong> on <strong>{date}</strong> at <strong>{time}</strong> is pending confirmation.
            </p>
            <button className="btn btn-primary" onClick={reset}>Book Another</button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── MINI CALENDAR ──────────────────────────────────────────────────
const MiniCalendar = ({ selected, onSelect }) => {
  const today = new Date();
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const daysInMonth = new Date(year, month+1, 0).getDate();
  const firstDay    = new Date(year, month, 1).getDay();
  const monthNames  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const dayNames    = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  const prev = () => { if (month===0){setMonth(11);setYear(y=>y-1);}else setMonth(m=>m-1); };
  const next = () => { if (month===11){setMonth(0);setYear(y=>y+1);}else setMonth(m=>m+1); };

  return (
    <div>
      <div className="cal-nav">
        <button className="btn btn-sm" onClick={prev}>‹</button>
        <span style={{ fontSize:13 }}>{monthNames[month]} {year}</span>
        <button className="btn btn-sm" onClick={next}>›</button>
      </div>
      <div className="cal-grid">
        {dayNames.map(d => <div className="cal-day-header" key={d}>{d}</div>)}
        {Array.from({ length: firstDay }).map((_,i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_,i) => {
          const day     = i+1;
          const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
          const todayStr= `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
          const isPast  = dateStr < todayStr;
          return (
            <div key={day} className={`cal-day ${isPast ? 'past' : ''} ${selected === dateStr ? 'selected' : ''} ${dateStr === todayStr ? 'today' : ''}`} onClick={() => !isPast && onSelect(dateStr)}>
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── MY APPOINTMENTS ────────────────────────────────────────────────
const MyAppointments = ({ appointments }) => (
  <div className="content-pad">
    <div className="card">
      {appointments.map(a => (
        <div className="list-row" key={a.id}>
          <div className="avatar">{a.doctorName.split(' ').pop()[0]}</div>
          <div style={{ marginLeft:12, flex:1 }}>
            <div className="list-row-name">{a.doctorName}</div>
            <div className="list-row-sub">{a.specialty} · {a.disease} · {a.date} {a.time}</div>
          </div>
          <span className={`indicator indicator-${statusClass(a.status)}`}>{a.status}</span>
        </div>
      ))}
    </div>
  </div>
);

// ─── MY PRESCRIPTIONS ───────────────────────────────────────────────
const MyPrescriptions = () => (
  <div className="content-pad">
    <div className="card">
      {PRESCRIPTIONS_SEED.length === 0 && <div className="empty-state">No prescriptions yet.</div>}
      {PRESCRIPTIONS_SEED.map(rx => (
        <div className="list-row rx-card" key={rx.id} style={{ flexDirection:'column', alignItems:'flex-start', gap:8 }}>
          <div style={{ display:'flex', width:'100%', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div className="list-row-name">Prescription — {rx.date}</div>
              <div className="list-row-sub">By {rx.doctorName}</div>
            </div>
            <span className="indicator indicator-green">Active</span>
          </div>
          {rx.medicines.map((m,i) => (
            <div className="rx-med-item" key={i}>
              <span className="rx-num">Rx{i+1}</span>
              <span><strong>{m.name}</strong> — {m.dosage}, {m.frequency} for {m.duration}</span>
            </div>
          ))}
          {rx.notes && <div className="rx-notes">📋 {rx.notes}</div>}
        </div>
      ))}
    </div>
  </div>
);

export default PatientDashboard;
