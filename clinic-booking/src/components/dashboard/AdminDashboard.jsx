import React, { useState } from 'react';
import Sidebar  from '../common/Sidebar';
import Navbar   from '../common/Navbar';
import Notifications from '../common/Notifications';
import {
  DOCTORS, PATIENTS, APPOINTMENTS_SEED, PRESCRIPTIONS_SEED,
  getInitials, statusClass
} from '../../data';
import '../dashboard/dashboard.css';

// ─── NAV ICONS (inline SVG snippets) ───────────────────────────────
const Icons = {
  home:       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  calendar:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  users:      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  user:       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="8" r="4"/></svg>,
};

const NAV_ITEMS = [
  { id: 'dashboard',    label: 'Dashboard',       icon: Icons.home },
  { id: 'appointments', label: 'Appointments',    icon: Icons.calendar },
  { id: 'doctors',      label: 'Doctor List',     icon: Icons.users },
  { id: 'patients',     label: 'Patient List',    icon: Icons.user },
  { id: 'calendar',     label: 'Calendar View',   icon: Icons.calendar },
];

const PAGE_TITLES = {
  dashboard: 'Dashboard', appointments: 'Appointment List',
  doctors: 'Doctor List', patients: 'Patient List', calendar: 'Calendar View',
};

// ─── ADMIN DASHBOARD SHELL ─────────────────────────────────────────
const AdminDashboard = () => {
  const [page, setPage]                   = useState('dashboard');
  const [doctors, setDoctors]             = useState(DOCTORS);
  const [appointments, setAppointments]   = useState(APPOINTMENTS_SEED);
  const [notification, setNotification]   = useState(null);
  const [modal, setModal]                 = useState(null);

  const notify = (message, type = 'success') => setNotification({ message, type });

  return (
    <div className="dashboard-layout">
      <Sidebar navItems={NAV_ITEMS} activePage={page} onNavigate={setPage} role="admin" />
      <div className="dashboard-main">
        <Navbar pageTitle={PAGE_TITLES[page]} />
        <Notifications notification={notification} onDismiss={() => setNotification(null)} />

        {page === 'dashboard'    && <AdminStats appointments={appointments} doctors={doctors} />}
        {page === 'appointments' && <AppointmentList appointments={appointments} setAppointments={setAppointments} setModal={setModal} notify={notify} />}
        {page === 'doctors'      && <DoctorList doctors={doctors} setDoctors={setDoctors} setModal={setModal} notify={notify} />}
        {page === 'patients'     && <PatientList />}
        {page === 'calendar'     && <CalendarView appointments={appointments} />}
      </div>

      {/* MODAL */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modal.type === 'doctor' ? 'Doctor Details' : 'Appointment Details'}</h3>
              <button className="btn btn-sm" style={{ border:'none', background:'none', padding:'2px' }} onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              {modal.type === 'doctor' && <DoctorModal doc={modal.data} />}
              {modal.type === 'appointment' && <AppointmentModal appt={modal.data} />}
            </div>
            <div className="modal-footer">
              <button className="btn btn-sm" onClick={() => setModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── SUB-PAGES ──────────────────────────────────────────────────────

/* Stats dashboard */
const AdminStats = ({ appointments, doctors }) => {
  const pending   = appointments.filter(a => a.status === 'Pending').length;
  const enabled   = doctors.filter(d => d.status === 'Enabled').length;

  return (
    <div className="content-pad">
      <div className="stats-row">
        <div className="stat-card"><div className="stat-value">{appointments.length}</div><div className="stat-label">Total Appointments</div><div className="stat-sub">this month</div></div>
        <div className="stat-card"><div className="stat-value">{pending}</div><div className="stat-label">Pending</div><div className="stat-sub">awaiting action</div></div>
        <div className="stat-card"><div className="stat-value">{enabled}</div><div className="stat-label">Active Doctors</div><div className="stat-sub">enabled</div></div>
        <div className="stat-card"><div className="stat-value">{doctors.length}</div><div className="stat-label">Total Doctors</div><div className="stat-sub">registered</div></div>
      </div>
      {/* Recent list */}
      <div className="card">
        <div className="card-header"><h3>Recent Appointments</h3></div>
        {appointments.slice(0, 4).map(a => (
          <div className="list-row" key={a.id}>
            <div className="avatar">{getInitials(a.patientName)}</div>
            <div style={{ marginLeft: 12, flex: 1 }}>
              <div className="list-row-name">{a.patientName}</div>
              <div className="list-row-sub">{a.doctorName} · {a.disease}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className={`indicator indicator-${statusClass(a.status)}`}>{a.status}</span>
              <div style={{ fontSize: 11, color: 'var(--color-gray-300)', marginTop: 2 }}>{a.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* Appointment list with accept / cancel */
const AppointmentList = ({ appointments, setAppointments, setModal, notify }) => {
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'Pending', 'Accepted', 'Completed', 'Cancelled'];
  const filtered = filter === 'All' ? appointments : appointments.filter(a => a.status === filter);

  const changeStatus = (id, status) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    notify(`Appointment ${status.toLowerCase()}.`);
  };

  return (
    <div className="content-pad">
      <div className="filter-pills">
        {filters.map(f => (
          <button key={f} className="btn btn-sm" style={{ background: filter === f ? 'var(--color-black)' : 'var(--color-white)', color: filter === f ? '#fff' : 'var(--color-black)' }} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      <div className="card">
        {filtered.map(a => (
          <div className="list-row" key={a.id} onClick={() => setModal({ type: 'appointment', data: a })}>
            <div className="avatar">{getInitials(a.patientName)}</div>
            <div style={{ marginLeft: 12, flex: 1 }}>
              <div className="list-row-name">{a.patientName}</div>
              <div className="list-row-sub">{a.doctorName} · {a.specialty} · {a.date} {a.time}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} onClick={e => e.stopPropagation()}>
              <span className={`indicator indicator-${statusClass(a.status)}`}>{a.status}</span>
              {a.status === 'Pending' && <>
                <button className="btn btn-sm btn-primary" onClick={() => changeStatus(a.id, 'Accepted')}>Accept</button>
                <button className="btn btn-sm btn-danger"  onClick={() => changeStatus(a.id, 'Cancelled')}>Cancel</button>
              </>}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="empty-state">No appointments match this filter.</div>}
      </div>
    </div>
  );
};

/* Doctor list with enable / disable toggle */
const DoctorList = ({ doctors, setDoctors, setModal, notify }) => {
  const [filter, setFilter] = useState('All');
  const specialties = ['All', ...new Set(doctors.map(d => d.specialty))];
  const filtered = filter === 'All' ? doctors : doctors.filter(d => d.specialty === filter);

  const toggle = (id) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, status: d.status === 'Enabled' ? 'Pending' : 'Enabled' } : d));
    notify('Doctor status updated.');
  };

  return (
    <div className="content-pad">
      <div className="filter-pills">
        {specialties.map(s => (
          <button key={s} className="btn btn-sm" style={{ background: filter === s ? 'var(--color-black)' : 'var(--color-white)', color: filter === s ? '#fff' : 'var(--color-black)' }} onClick={() => setFilter(s)}>{s}</button>
        ))}
      </div>
      <div className="card">
        {filtered.map(d => (
          <div className="list-row" key={d.id} onClick={() => setModal({ type: 'doctor', data: d })}>
            <div className="avatar">{d.initials}</div>
            <div style={{ marginLeft: 12, flex: 1 }}>
              <div className="list-row-name">{d.name}</div>
              <div className="list-row-sub">{d.specialty} · {d.experience}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }} onClick={e => e.stopPropagation()}>
              <span className={`indicator indicator-${statusClass(d.status)}`}>{d.status}</span>
              <button className="btn btn-sm" onClick={() => toggle(d.id)}>{d.status === 'Enabled' ? 'Disable' : 'Enable'}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* Patient list */
const PatientList = () => (
  <div className="content-pad">
    <div className="card">
      {PATIENTS.map(p => (
        <div className="list-row" key={p.id}>
          <div className="avatar">{getInitials(p.name)}</div>
          <div style={{ marginLeft: 12, flex: 1 }}>
            <div className="list-row-name">{p.name}</div>
            <div className="list-row-sub">{p.email} · DOB: {p.dob}</div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-gray-400)' }}>{p.phone}</div>
        </div>
      ))}
    </div>
  </div>
);

/* Calendar */
const CalendarView = ({ appointments }) => {
  const today = new Date();
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selDay, setSelDay] = useState(today.getDate());

  const daysInMonth  = new Date(year, month + 1, 0).getDate();
  const firstDay     = new Date(year, month, 1).getDay();
  const monthNames   = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dayNames     = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  const apptDates    = new Set(appointments.map(a => a.date));
  const selDateStr   = `${year}-${String(month+1).padStart(2,'0')}-${String(selDay).padStart(2,'0')}`;
  const dayAppts     = appointments.filter(a => a.date === selDateStr);

  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y-1); } else setMonth(m => m-1); };
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y+1); } else setMonth(m => m+1); };

  return (
    <div className="content-pad calendar-layout">
      <div className="card">
        <div className="card-body">
          <div className="cal-nav">
            <button className="btn btn-sm" onClick={prev}>‹</button>
            <span>{monthNames[month]} {year}</span>
            <button className="btn btn-sm" onClick={next}>›</button>
          </div>
          <div className="cal-grid">
            {dayNames.map(d => <div className="cal-day-header" key={d}>{d}</div>)}
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day     = i + 1;
              const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
              const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              return (
                <div key={day} className={`cal-day ${isToday ? 'today' : ''} ${day === selDay ? 'selected' : ''} ${apptDates.has(dateStr) ? 'has-appt' : ''}`} onClick={() => setSelDay(day)}>
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="calendar-sidebar">
        <div className="card">
          <div className="card-header"><h3>Appointments — {selDateStr}</h3></div>
          {dayAppts.length === 0 && <div className="empty-state">No appointments on this day.</div>}
          {dayAppts.map(a => (
            <div className="list-row" key={a.id}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{a.patientName}</div>
                <div style={{ fontSize: 12, color: 'var(--color-gray-400)' }}>{a.doctorName} · {a.time}</div>
              </div>
              <span className={`indicator indicator-${statusClass(a.status)}`}>{a.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* Modal bodies */
const DoctorModal = ({ doc }) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
      <div className="avatar" style={{ width: 44, height: 44, fontSize: 16 }}>{doc.initials}</div>
      <div><div style={{ fontWeight: 600, fontSize: 15 }}>{doc.name}</div><div style={{ fontSize: 12, color: 'var(--color-gray-400)' }}>{doc.specialty} · {doc.experience}</div></div>
    </div>
    <div style={{ fontSize: 13 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--color-gray-100)' }}><span style={{ color: 'var(--color-gray-400)' }}>Email</span><span>{doc.email}</span></div>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}><span style={{ color: 'var(--color-gray-400)' }}>Status</span><span className={`indicator indicator-${statusClass(doc.status)}`}>{doc.status}</span></div>
    </div>
  </div>
);

const AppointmentModal = ({ appt }) => (
  <div style={{ fontSize: 13 }}>
    {[['Patient', appt.patientName],['Doctor', appt.doctorName],['Specialty', appt.specialty],['Concern', appt.disease],['Date', appt.date],['Time', appt.time]].map(([k,v]) => (
      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--color-gray-100)' }}>
        <span style={{ color: 'var(--color-gray-400)' }}>{k}</span><span style={{ fontWeight: 500 }}>{v}</span>
      </div>
    ))}
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
      <span style={{ color: 'var(--color-gray-400)' }}>Status</span>
      <span className={`indicator indicator-${statusClass(appt.status)}`}>{appt.status}</span>
    </div>
    {appt.notes && <div style={{ marginTop: 10, fontSize: 12, color: 'var(--color-gray-500)', background: 'var(--color-off-white)', padding: '8px 10px', borderRadius: 'var(--radius-md)' }}>📋 {appt.notes}</div>}
  </div>
);

export default AdminDashboard;
