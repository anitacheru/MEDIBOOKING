import React, { useState } from 'react';
import Sidebar  from '../common/Sidebar';
import Navbar   from '../common/Navbar';
import Notifications from '../common/Notifications';
import { APPOINTMENTS_SEED, PRESCRIPTIONS_SEED, PATIENTS, getInitials, statusClass } from '../../data';
import '../dashboard/dashboard.css';

// ─── NAV ICONS ──────────────────────────────────────────────────────
const Icons = {
  home:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  calendar: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  clock:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  file:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
};

const NAV_ITEMS = [
  { id: 'dashboard',     label: 'Dashboard',       icon: Icons.home },
  { id: 'appointments',  label: 'My Appointments', icon: Icons.calendar },
  { id: 'availability',  label: 'Availability',    icon: Icons.clock },
  { id: 'prescriptions', label: 'Prescriptions',   icon: Icons.file },
];

const PAGE_TITLES = { dashboard:'Dashboard', appointments:'My Appointments', availability:'My Availability', prescriptions:'Prescriptions' };

// ─── SHELL ──────────────────────────────────────────────────────────
const DoctorDashboard = () => {
  const [page, setPage]                 = useState('dashboard');
  const [appointments, setAppointments] = useState(APPOINTMENTS_SEED);
  const [prescriptions, setPrescriptions] = useState(PRESCRIPTIONS_SEED);
  const [notification, setNotification] = useState(null);
  const notify = (msg, type='success') => setNotification({ message: msg, type });

  return (
    <div className="dashboard-layout">
      <Sidebar navItems={NAV_ITEMS} activePage={page} onNavigate={setPage} role="doctor" />
      <div className="dashboard-main">
        <Navbar pageTitle={PAGE_TITLES[page]} />
        <Notifications notification={notification} onDismiss={() => setNotification(null)} />

        {page === 'dashboard'     && <DoctorStats appointments={appointments} prescriptions={prescriptions} />}
        {page === 'appointments'  && <MyAppointments appointments={appointments} setAppointments={setAppointments} notify={notify} />}
        {page === 'availability'  && <AvailabilityPage />}
        {page === 'prescriptions' && <PrescriptionsPage prescriptions={prescriptions} setPrescriptions={setPrescriptions} notify={notify} />}
      </div>
    </div>
  );
};

// ─── DOCTOR STATS ──────────────────────────────────────────────────
const DoctorStats = ({ appointments, prescriptions }) => {
  const pending   = appointments.filter(a => a.status === 'Pending').length;
  const accepted  = appointments.filter(a => a.status === 'Accepted').length;
  return (
    <div className="content-pad">
      <div className="stats-row">
        <div className="stat-card"><div className="stat-value">{appointments.length}</div><div className="stat-label">My Appointments</div><div className="stat-sub">total</div></div>
        <div className="stat-card"><div className="stat-value">{pending}</div><div className="stat-label">Pending</div><div className="stat-sub">to accept</div></div>
        <div className="stat-card"><div className="stat-value">{accepted}</div><div className="stat-label">Accepted</div><div className="stat-sub">upcoming</div></div>
        <div className="stat-card"><div className="stat-value">{prescriptions.length}</div><div className="stat-label">Prescriptions</div><div className="stat-sub">issued</div></div>
      </div>
      <div className="card">
        <div className="card-header"><h3>Today's Schedule</h3></div>
        {appointments.slice(0, 3).map(a => (
          <div className="list-row" key={a.id}>
            <div className="avatar">{getInitials(a.patientName)}</div>
            <div style={{ marginLeft: 12, flex: 1 }}>
              <div className="list-row-name">{a.patientName}</div>
              <div className="list-row-sub">{a.disease} · {a.time}</div>
            </div>
            <span className={`indicator indicator-${statusClass(a.status)}`}>{a.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── MY APPOINTMENTS ────────────────────────────────────────────────
const MyAppointments = ({ appointments, setAppointments, notify }) => {
  const [tab, setTab] = useState('All');
  const tabs = ['All','Pending','Accepted','Completed'];
  const filtered = tab === 'All' ? appointments : appointments.filter(a => a.status === tab);

  const changeStatus = (id, status) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    notify(`Appointment ${status.toLowerCase()}.`);
  };

  return (
    <div className="content-pad">
      <div className="card">
        <div className="tab-bar">
          {tabs.map(t => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t} <span style={{ color: 'var(--color-gray-300)', fontSize: 11 }}>({(t === 'All' ? appointments : appointments.filter(a => a.status === t)).length})</span>
            </button>
          ))}
        </div>
        {filtered.map(a => (
          <div className="list-row" key={a.id}>
            <div className="avatar">{getInitials(a.patientName)}</div>
            <div style={{ marginLeft: 12, flex: 1 }}>
              <div className="list-row-name">{a.patientName}</div>
              <div className="list-row-sub">{a.disease} · {a.date} {a.time}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className={`indicator indicator-${statusClass(a.status)}`}>{a.status}</span>
              {a.status === 'Pending'  && <button className="btn btn-sm btn-primary" onClick={() => changeStatus(a.id, 'Accepted')}>Accept</button>}
              {a.status === 'Accepted' && <button className="btn btn-sm btn-primary" onClick={() => changeStatus(a.id, 'Completed')}>Complete</button>}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="empty-state">No appointments in this category.</div>}
      </div>
    </div>
  );
};

// ─── AVAILABILITY ───────────────────────────────────────────────────
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const TIME_SLOTS = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'];

const AvailabilityPage = () => {
  const [dayOn, setDayOn] = useState({ Mon:true, Tue:true, Wed:false, Thu:true, Fri:true, Sat:false, Sun:false });
  const [slots, setSlots] = useState(() => {
    const init = {};
    DAYS.forEach(d => { init[d] = TIME_SLOTS.map((t, i) => ({ time: t, on: ![0,3,7].includes(i) })); });
    return init;
  });
  const [saved, setSaved] = useState(false);

  const toggleDay = (d) => {
    const next = !dayOn[d];
    setDayOn(prev => ({ ...prev, [d]: next }));
    setSlots(prev => ({ ...prev, [d]: prev[d].map(s => ({ ...s, on: next })) }));
    setSaved(false);
  };
  const toggleSlot = (day, idx) => {
    if (!dayOn[day]) return;
    setSlots(prev => ({ ...prev, [day]: prev[day].map((s, i) => i === idx ? { ...s, on: !s.on } : s) }));
    setSaved(false);
  };

  return (
    <div className="content-pad">
      <div className="card">
        <div className="card-header">
          <h3>Weekly Availability</h3>
          <button className="btn btn-sm btn-primary" onClick={() => setSaved(true)}>
            {saved ? '✓ Saved' : 'Save'}
          </button>
        </div>
        <div className="card-body">
          <p style={{ fontSize: 13, color: 'var(--color-gray-400)', marginBottom: 18 }}>Toggle days on / off, then fine-tune individual time slots.</p>

          {/* Day toggles */}
          <div className="day-toggles">
            {DAYS.map(d => (
              <button key={d} className="btn" onClick={() => toggleDay(d)} style={{ background: dayOn[d] ? 'var(--color-black)' : 'var(--color-white)', color: dayOn[d] ? '#fff' : 'var(--color-black)', minWidth: 50, justifyContent: 'center', fontWeight: 600 }}>{d}</button>
            ))}
          </div>

          {/* Per-day slot grids */}
          {DAYS.filter(d => dayOn[d]).map(d => (
            <div key={d} className="avail-day-block">
              <div className="avail-day-label">{d}</div>
              <div className="avail-slot-row">
                {slots[d].map((s, i) => (
                  <div key={i} className={`slot ${s.on ? 'selected' : ''}`} style={{ width: 72, padding: '5px 0', fontSize: 12 }} onClick={() => toggleSlot(d, i)}>{s.time}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── PRESCRIPTIONS ──────────────────────────────────────────────────
const PrescriptionsPage = ({ prescriptions, setPrescriptions, notify }) => {
  const [showForm, setShowForm] = useState(false);
  const emptyMed = { name:'', dosage:'', frequency:'', duration:'' };
  const [rxForm, setRxForm] = useState({ patientName:'', medicines:[{ ...emptyMed }], notes:'' });

  const addMed    = () => setRxForm(p => ({ ...p, medicines: [...p.medicines, { ...emptyMed }] }));
  const removeMed = (i) => setRxForm(p => ({ ...p, medicines: p.medicines.filter((_,idx) => idx !== i) }));
  const updateMed = (i, field, val) => setRxForm(p => ({ ...p, medicines: p.medicines.map((m, idx) => idx === i ? { ...m, [field]: val } : m) }));

  const submit = () => {
    if (!rxForm.patientName || rxForm.medicines.some(m => !m.name)) return;
    const today = new Date().toISOString().split('T')[0];
    setPrescriptions(prev => [...prev, { id: `rx${Date.now()}`, ...rxForm, doctorName:'Dr. Sarah Chen', date: today }]);
    setRxForm({ patientName:'', medicines:[{ ...emptyMed }], notes:'' });
    setShowForm(false);
    notify('Prescription issued successfully.');
  };

  return (
    <div className="content-pad">
      <div style={{ display:'flex', justifyContent:'flex-end', marginBottom: 16 }}>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ New Prescription'}
        </button>
      </div>

      {/* Issue form */}
      {showForm && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header"><h3>Issue Prescription</h3></div>
          <div className="card-body">
            <div className="form-group">
              <label>Patient</label>
              <select className="form-control" value={rxForm.patientName} onChange={e => setRxForm(p => ({ ...p, patientName: e.target.value }))}>
                <option value="">Select patient…</option>
                {PATIENTS.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
              </select>
            </div>

            <div className="rx-medicines-header">
              <label style={{ margin: 0 }}>Medicines</label>
              <button className="btn btn-sm" onClick={addMed}>+ Add</button>
            </div>

            {rxForm.medicines.map((m, i) => (
              <div className="rx-med-row" key={i}>
                <input className="form-control" placeholder="Medicine name" value={m.name} onChange={e => updateMed(i,'name',e.target.value)} />
                <input className="form-control" placeholder="Dosage" value={m.dosage} onChange={e => updateMed(i,'dosage',e.target.value)} />
                <input className="form-control" placeholder="Frequency" value={m.frequency} onChange={e => updateMed(i,'frequency',e.target.value)} />
                <input className="form-control" placeholder="Duration" value={m.duration} onChange={e => updateMed(i,'duration',e.target.value)} />
                <button className="btn btn-sm btn-danger" onClick={() => removeMed(i)} disabled={rxForm.medicines.length === 1}>✕</button>
              </div>
            ))}

            <div className="form-group" style={{ marginTop: 12 }}>
              <label>Notes / Instructions</label>
              <textarea className="form-control" placeholder="General instructions…" value={rxForm.notes} onChange={e => setRxForm(p => ({ ...p, notes: e.target.value }))} />
            </div>
            <button className="btn btn-primary" onClick={submit}>Issue Prescription</button>
          </div>
        </div>
      )}

      {/* Issued list */}
      <div className="card">
        <div className="card-header"><h3>Issued Prescriptions</h3></div>
        {prescriptions.length === 0 && <div className="empty-state">No prescriptions issued yet.</div>}
        {prescriptions.map(rx => (
          <div className="list-row rx-card" key={rx.id} style={{ flexDirection:'column', alignItems:'flex-start', gap: 8 }}>
            <div style={{ display:'flex', width:'100%', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div className="list-row-name">{rx.patientName}</div>
                <div className="list-row-sub">Issued by {rx.doctorName} · {rx.date}</div>
              </div>
              <span className="indicator indicator-green">Issued</span>
            </div>
            {rx.medicines.map((m, i) => (
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
};

export default DoctorDashboard;
