import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, LogIn, Briefcase, UserCheck, Building2,
  ArrowLeft, ArrowRight, Plus, Film, Download, CheckCircle,
  XCircle, MapPin, Clock, ChevronRight, X, Zap, FileText, Eye
} from 'lucide-react';

/* ─────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────── */
const ROLES = [
  {
    id: 'INVESTIGATOR',
    label: 'Investigator',
    icon: Briefcase,
    desc: 'Log cases, view AI suspect predictions, generate reconstruction videos.',
  },
  {
    id: 'OFFICER',
    label: 'Police Officer',
    icon: UserCheck,
    desc: 'Review collected evidence and submit verification findings.',
  },
  {
    id: 'COMMISSIONER',
    label: 'Commissioner',
    icon: Building2,
    desc: 'Monitor all cases and issue final approval or rejection.',
  },
];

const DEMO_CREDENTIALS = {
  INVESTIGATOR: { username: 'investigator', password: 'inv123' },
  OFFICER:      { username: 'officer',       password: 'off123' },
  COMMISSIONER: { username: 'commissioner',  password: 'com123' },
};

/* ─────────────────────────────────────────
   TOPBAR
───────────────────────────────────────── */
function TopBar({ breadcrumbs = [], onBack }) {
  return (
    <div className="topbar">
      {onBack && (
        <button className="topbar-back" onClick={onBack}>
          <ArrowLeft size={14} /> Back
        </button>
      )}
      <ShieldCheck size={16} color="#6366f1" />
      <span className="topbar-title">Criminal Investigation Tracker</span>
      {breadcrumbs.length > 0 && (
        <div className="breadcrumb" style={{ marginLeft: 'auto' }}>
          {breadcrumbs.map((b, i) => (
            <React.Fragment key={i}>
              {i > 0 && <ChevronRight size={12} />}
              <span>{b}</span>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE 1 — LOGIN
───────────────────────────────────────── */
function LoginPage({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!selectedRole) { setError('Please select a role.'); return; }
    const cred = DEMO_CREDENTIALS[selectedRole.id];
    if (username === cred.username && password === cred.password) {
      onLogin(selectedRole);
    } else {
      setError(`Invalid credentials. Try: ${cred.username} / ${cred.password}`);
    }
  };

  return (
    <div className="page" style={{ alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '460px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

        {/* Logo + Title */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0' }}>
          {/* Icon */}
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '54px', height: '54px', background: 'rgba(99,102,241,0.12)', borderRadius: '14px', marginBottom: '20px', border: '1px solid rgba(99,102,241,0.2)' }}>
            <ShieldCheck size={26} color="#6366f1" />
          </div>

          {/* Each title line as its own separated block */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--surface)', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ width: '3px', height: '28px', borderRadius: '2px', background: '#6366f1', flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '2px' }}>System</p>
                <p style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text)' }}>Criminal Investigation Tracker</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--surface)', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ width: '3px', height: '28px', borderRadius: '2px', background: '#22c55e', flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '2px' }}>Feature</p>
                <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>AI Suspect Prediction Engine</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--surface)', padding: '12px 16px' }}>
              <div style={{ width: '3px', height: '28px', borderRadius: '2px', background: '#38bdf8', flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '2px' }}>Feature</p>
                <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>Crime Reconstruction Video System</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--sub)' }}>Select your role</p>

          {/* Role cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {ROLES.map((r) => {
              const Icon = r.icon;
              const active = selectedRole?.id === r.id;
              return (
                <div key={r.id} onClick={() => { setSelectedRole(r); setError(''); setUsername(DEMO_CREDENTIALS[r.id].username); setPassword(DEMO_CREDENTIALS[r.id].password); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', borderRadius: '10px', border: `1px solid ${active ? 'rgba(99,102,241,0.5)' : 'var(--border)'}`, background: active ? 'var(--accent-bg)' : 'var(--surface2)', cursor: 'pointer', transition: 'all .15s' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: active ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} color={active ? '#6366f1' : '#64748b'} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: '700', fontSize: '13px', color: active ? 'var(--accent)' : 'var(--text)' }}>{r.label}</p>
                    <p style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>{r.desc}</p>
                    <p style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '5px', background: 'rgba(255,255,255,0.03)', padding: '4px 8px', borderRadius: '5px', display: 'inline-block' }}>
                      ID: <span style={{ color: 'var(--sub)', fontWeight: '600' }}>{DEMO_CREDENTIALS[r.id].username}</span> &nbsp;·&nbsp; Pass: <span style={{ color: 'var(--sub)', fontWeight: '600' }}>{DEMO_CREDENTIALS[r.id].password}</span>
                    </p>
                  </div>
                  {active && <CheckCircle size={16} color="#6366f1" style={{ marginLeft: 'auto', flexShrink: 0 }} />}
                </div>
              );
            })}
          </div>

          {/* Credentials */}
          {selectedRole && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', animation: 'fadeUp .2s ease' }}>
              <hr />
              <div>
                <label>Username</label>
                <input value={username} onChange={e => setUsername(e.target.value)} placeholder={DEMO_CREDENTIALS[selectedRole.id].username} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
              </div>
              <div>
                <label>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••" onKeyDown={e => e.key === 'Enter' && handleLogin()} />
              </div>
            </div>
          )}

          {error && <p style={{ fontSize: '12px', color: '#f87171', background: 'rgba(239,68,68,0.08)', padding: '8px 12px', borderRadius: '7px' }}>{error}</p>}

          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleLogin} disabled={!selectedRole}>
            <LogIn size={15} /> Sign In as {selectedRole?.label || '…'}
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--muted)' }}>
          Final Year Project · AI-Powered Criminal Investigation System
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE 2 — ROLE DASHBOARD (case list)
───────────────────────────────────────── */
function DashboardPage({ role, cases, onSelectCase, onAddCase, onLogout, loadingCases }) {
  const Icon = role.icon;
  return (
    <div className="page">
      <TopBar breadcrumbs={[role.label, 'Dashboard']} />

      <div style={{ flex: 1, maxWidth: '860px', width: '100%', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Welcome row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '11px', background: 'var(--accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={20} color="#6366f1" />
            </div>
            <div>
              <h2 style={{ fontWeight: '800', fontSize: '18px' }}>Welcome, {role.label}</h2>
              <p style={{ fontSize: '12px', color: 'var(--sub)', marginTop: '2px' }}>{role.desc}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {role.id === 'INVESTIGATOR' && (
              <button className="btn btn-primary" onClick={onAddCase}>
                <Plus size={14} /> New Case
              </button>
            )}
            <button className="btn btn-outline" onClick={onLogout}>Sign out</button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
          {[
            { label: 'Total Cases', value: cases.length },
            { label: 'Approved', value: cases.filter(c => c.commissioner_approval === 'APPROVED').length, color: 'var(--green)' },
            { label: 'Pending', value: cases.filter(c => !c.commissioner_approval || c.commissioner_approval === 'PENDING').length, color: 'var(--amber)' },
          ].map(({ label, value, color }) => (
            <div key={label} className="card" style={{ padding: '16px' }}>
              <p style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
              <p style={{ fontSize: '26px', fontWeight: '800', color: color || 'var(--text)' }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Case list */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontWeight: '700', fontSize: '14px' }}>Active Case Files</p>
            <span className="badge badge-purple">{cases.length} cases in MongoDB</span>
          </div>
          {loadingCases ? (
            <p style={{ padding: '32px', textAlign: 'center', color: 'var(--muted)', fontSize: '13px' }}>Loading cases…</p>
          ) : cases.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--muted)' }}>
              <FileText size={32} style={{ marginBottom: '10px', opacity: .3 }} />
              <p style={{ fontSize: '13px' }}>No cases yet. Click "New Case" to add one.</p>
            </div>
          ) : (
            <div>
              {cases.map((c, i) => (
                <div key={c.case_id} onClick={() => onSelectCase(c.case_id)}
                  style={{ padding: '16px 20px', borderBottom: i < cases.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', transition: 'background .15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '12px', fontWeight: '800', color: 'var(--accent)' }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: '600', fontSize: '14px', marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.title}</p>
                    <p style={{ fontSize: '12px', color: 'var(--sub)', display: 'flex', gap: '12px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={11} /> {c.location}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={11} /> {c.timestamp}</span>
                    </p>
                  </div>
                  <span className={`badge ${c.commissioner_approval === 'APPROVED' ? 'badge-green' : c.commissioner_approval === 'REJECTED' ? 'badge-amber' : 'badge-purple'}`}>
                    {c.commissioner_approval || 'Pending'}
                  </span>
                  <Eye size={15} color="var(--muted)" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE 3 — CASE DETAIL
───────────────────────────────────────── */
function CaseDetailPage({ role, caseData, onBack, onOpenVideo, onOfficerVerify, onCommDecide }) {
  const [notes, setNotes]       = useState(caseData.officer_verification?.notes || '');
  const [status, setStatus]     = useState('Evidence Verified');
  const [comments, setComments] = useState('');
  const [toast, setToast]       = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  const handleVerify = async () => {
    await onOfficerVerify(notes, status);
    showToast('Verification saved to MongoDB.');
  };
  const handleDecide = async (decision) => {
    await onCommDecide(decision, comments);
    showToast(`Decision recorded: ${decision}`);
  };

  const s = caseData.suspect_prediction || {};

  return (
    <div className="page">
      <TopBar onBack={onBack} breadcrumbs={[role.label, 'Dashboard', `Case #${caseData.case_id}`]} />

      <div style={{ flex: 1, maxWidth: '860px', width: '100%', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Case title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '5px' }}>Case #{caseData.case_id}</p>
            <h2 style={{ fontWeight: '800', fontSize: '20px' }}>{caseData.title}</h2>
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '12px', color: 'var(--sub)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} /> {caseData.location}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {caseData.timestamp}</span>
            </div>
          </div>
          <span className={`badge ${caseData.commissioner_approval === 'APPROVED' ? 'badge-green' : 'badge-amber'}`} style={{ fontSize: '12px', padding: '5px 12px' }}>
            {caseData.commissioner_approval || 'Pending Approval'}
          </span>
        </div>

        {toast && (
          <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'var(--green-bg)', border: '1px solid rgba(34,197,94,.25)', color: 'var(--green)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '7px' }}>
            <CheckCircle size={14} /> {toast}
          </div>
        )}

        {/* Evidence + Timeline */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div className="card" style={{ padding: '18px' }}>
            <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '12px' }}>Evidence Collected</p>
            <ul style={{ paddingLeft: '18px', fontSize: '13px', color: 'var(--sub)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {caseData.evidence?.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          </div>

          <div className="card" style={{ padding: '18px' }}>
            <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '12px' }}>Crime Timeline</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {caseData.timeline?.map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', fontSize: '13px' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: '700', flexShrink: 0 }}>{i + 1}.</span>
                  <span style={{ color: 'var(--sub)' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Suspect Prediction */}
        <div className="card" style={{ padding: '18px', borderColor: 'rgba(99,102,241,0.2)' }}>
          <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '12px' }}>AI Suspect Prediction</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' }}>
            {[
              { label: 'Suspect Name', value: s.name },
              { label: 'AI Confidence', value: s.confidence, color: 'var(--accent)' },
              { label: 'Motive',        value: s.motive },
              { label: 'Risk Level',    value: s.risk_level, color: 'var(--amber)' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ background: 'var(--surface2)', borderRadius: '9px', padding: '12px' }}>
                <p style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '5px' }}>{label}</p>
                <p style={{ fontWeight: '700', fontSize: '14px', color: color || 'var(--text)' }}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Role-specific actions */}
        {role.id === 'INVESTIGATOR' && (
          <div className="card" style={{ padding: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontWeight: '700', fontSize: '14px' }}>Crime Reconstruction Video</p>
              <p style={{ fontSize: '12px', color: 'var(--sub)', marginTop: '3px' }}>
                {caseData.video_reconstruction ? 'Video has been generated. Click to view or regenerate.' : 'No video yet — generate a scene animation based on the crime timeline.'}
              </p>
            </div>
            <button className="btn btn-primary" onClick={onOpenVideo}>
              <Film size={14} /> {caseData.video_reconstruction ? 'View Video' : 'Generate Video'}
            </button>
          </div>
        )}

        {role.id === 'OFFICER' && (
          <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ fontWeight: '700', fontSize: '14px' }}>Submit Verification Findings</p>
            <div>
              <label>Verification Notes</label>
              <textarea rows={4} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Describe your forensic findings, alibi status, evidence cross-checks…" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <select value={status} onChange={e => setStatus(e.target.value)} style={{ width: 'auto' }}>
                <option value="Evidence Verified">✅ Evidence Verified</option>
                <option value="In Progress">🔄 In Progress</option>
              </select>
              <button className="btn btn-primary" onClick={handleVerify}>
                <CheckCircle size={14} /> Submit to MongoDB
              </button>
            </div>
          </div>
        )}

        {role.id === 'COMMISSIONER' && (
          <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ fontWeight: '700', fontSize: '14px' }}>Final Decision</p>
            {caseData.officer_verification?.notes && (
              <div style={{ background: 'var(--surface2)', borderRadius: '8px', padding: '12px', fontSize: '13px', color: 'var(--sub)' }}>
                <p style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px', fontWeight: '600' }}>Officer Notes</p>
                {caseData.officer_verification.notes}
              </div>
            )}
            <div>
              <label>Commissioner Directive / Comments</label>
              <textarea rows={3} value={comments} onChange={e => setComments(e.target.value)} placeholder="Enter approval directive or reason for rejection…" />
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button className="btn btn-danger" onClick={() => handleDecide('REJECTED')}>
                <XCircle size={14} /> Reject & Re-Investigate
              </button>
              <button className="btn btn-success" onClick={() => handleDecide('APPROVED')}>
                <CheckCircle size={14} /> Approve & Close Case
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE 4 — VIDEO
───────────────────────────────────────── */
function VideoPage({ role, caseData, onBack, onRegenerate, generating }) {
  const vid = caseData.video_reconstruction;
  return (
    <div className="page">
      <TopBar onBack={onBack} breadcrumbs={[role.label, 'Dashboard', `Case #${caseData.case_id}`, 'Reconstruction Video']} />
      <div style={{ flex: 1, maxWidth: '860px', width: '100%', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '5px' }}>Case #{caseData.case_id}</p>
            <h2 style={{ fontWeight: '800', fontSize: '20px' }}>Crime Reconstruction Video</h2>
            <p style={{ fontSize: '13px', color: 'var(--sub)', marginTop: '5px' }}>
              Auto-generated animation showing how the crime took place, with audio narration based on the crime timeline.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
            <button className="btn btn-primary" onClick={onRegenerate} disabled={generating}>
              <Zap size={14} /> {generating ? 'Generating…' : 'Re-Generate'}
            </button>
            {vid && (
              <a href={vid.video_url} download className="btn btn-ghost" style={{ textDecoration: 'none' }}>
                <Download size={14} /> Download MP4
              </a>
            )}
          </div>
        </div>

        {generating && (
          <div style={{ padding: '14px', borderRadius: '10px', background: 'var(--accent-bg)', border: '1px solid rgba(99,102,241,.2)', color: 'var(--accent)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={14} /> Generating crime reconstruction animation with audio narration… this may take a moment.
          </div>
        )}

        {vid ? (
          <div style={{ borderRadius: '12px', overflow: 'hidden', background: '#000', border: '1px solid var(--border)' }}>
            <video src={vid.video_url} controls autoPlay style={{ width: '100%', maxHeight: '480px', display: 'block' }} />
          </div>
        ) : !generating && (
          <div style={{ border: '1px dashed var(--border)', borderRadius: '12px', padding: '60px', textAlign: 'center', color: 'var(--muted)' }}>
            <Film size={36} style={{ margin: '0 auto 12px', display: 'block', opacity: .3 }} />
            <p style={{ fontSize: '14px', fontWeight: '600' }}>No video generated yet</p>
            <p style={{ fontSize: '12px', marginTop: '5px' }}>Click Re-Generate above to create the reconstruction.</p>
          </div>
        )}

        {/* Crime timeline recap */}
        <div className="card" style={{ padding: '18px' }}>
          <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '12px' }}>Crime Timeline (used for narration)</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {caseData.timeline?.map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', fontSize: '13px' }}>
                <span style={{ color: 'var(--accent)', fontWeight: '700', flexShrink: 0 }}>{i + 1}.</span>
                <span style={{ color: 'var(--sub)' }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const SAMPLE_CASES = [
  {
    title: 'Central Bank Armed Robbery',
    location: 'Downtown Financial District, Vault B',
    timestamp: '2026-10-04 02:45 AM',
    evidenceStr: 'CCTV Footage from Entrance, Fingerprints on Vault Lock, Recovered Getaway Vehicle',
    timelineStr: 'Suspect disabled rooftop security cameras at 02:40 AM.\nTwo masked individuals breached the secondary vault door at 02:45 AM.\nVault contents accessed and security guard was disarmed.\nSuspects fled through rear corridor into a black sedan.',
    suspect_name: 'Marcus Vance', suspect_alias: 'The Architect',
    confidence: '91.4%', motive: 'Financial Debt & High-Yield Asset Theft', risk_level: 'CRITICAL'
  },
  {
    title: 'Jewelry Store Diamond Heist',
    location: 'Central Plaza Mall, Shop 104',
    timestamp: '2026-10-05 03:15 AM',
    evidenceStr: 'Cut Display Glass, Rooftop Glass Saw, Motorcycle Tire Marks on Parking Lot',
    timelineStr: 'Suspect entered through rooftop ventilation shaft.\nUsed diamond-tipped glass saw to cut display case.\nStole 12 uncut diamonds worth $2.4 million.\nEscaped on motorcycle through service alley.',
    suspect_name: 'Victor Krum', suspect_alias: 'The Shadow',
    confidence: '87.2%', motive: 'Black Market Diamond Trade', risk_level: 'HIGH'
  },
  {
    title: 'City Museum Cyber Heist',
    location: 'National History Museum, Server Room B2',
    timestamp: '2026-10-06 11:30 PM',
    evidenceStr: 'Tampered Server Logs, USB Device Found, Disabled Fire Alarm Wiring',
    timelineStr: 'Suspect posed as night security contractor.\nPlugged USB exploit device into museum server.\nDownloaded auction records and donor financial data.\nExited through fire escape after disabling alarm.',
    suspect_name: 'Elena Zhao', suspect_alias: 'Ghost Wire',
    confidence: '93.7%', motive: 'Corporate Espionage & Data Ransom', risk_level: 'CRITICAL'
  },
  {
    title: 'Highway Armored Truck Ambush',
    location: 'Interstate 45, Mile Marker 112',
    timestamp: '2026-10-03 04:20 AM',
    evidenceStr: 'Spike Strip Fragments, Shell Casings (9mm), Abandoned Pickup Truck',
    timelineStr: 'Suspects deployed spike strips across highway at 04:15 AM.\nArmored truck tires burst and driver lost control.\nThree armed suspects approached and forced open rear doors.\nStole cash shipment of $800,000 and fled in pickup truck.',
    suspect_name: 'Ray Donovan', suspect_alias: 'The Roadrunner',
    confidence: '78.5%', motive: 'Organized Crime Syndicate Operation', risk_level: 'HIGH'
  },
  {
    title: 'Pharmaceutical Lab Break-In',
    location: 'MedTech Research Park, Building C, Lab 7',
    timestamp: '2026-10-07 01:00 AM',
    evidenceStr: 'Broken Biometric Scanner, Chemical Residue on Gloves, Stolen Access Badge',
    timelineStr: 'Suspect cloned employee access badge using RFID scanner.\nBypassed biometric lock by tampering with sensor.\nStole 15 vials of experimental drug compound.\nLeft through loading dock in stolen delivery van.',
    suspect_name: 'Dr. Niles Harmon', suspect_alias: 'The Chemist',
    confidence: '89.1%', motive: 'Illegal Drug Manufacturing & Sale', risk_level: 'CRITICAL'
  },
  {
    title: 'Warehouse Arson & Insurance Fraud',
    location: 'Industrial Zone, Warehouse 14, Dock Street',
    timestamp: '2026-10-02 11:45 PM',
    evidenceStr: 'Accelerant Traces (Gasoline), Burner Phone, Altered Insurance Documents',
    timelineStr: 'Suspect purchased 20 gallons of gasoline from nearby station.\nEntered warehouse using owner key at 11:30 PM.\nPoured accelerant across storage floor and ignited.\nFled scene and reported fire 20 minutes later for insurance claim.',
    suspect_name: 'Gerald Finch', suspect_alias: 'The Torchman',
    confidence: '95.3%', motive: 'Insurance Fraud - $3.2M Policy', risk_level: 'CRITICAL'
  }
];

let sampleCaseIndex = 0;

function AddCasePage({ role, onBack, onSubmit, submitting }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(() => {
    const sample = SAMPLE_CASES[sampleCaseIndex % SAMPLE_CASES.length];
    sampleCaseIndex++;
    return { ...sample };
  });
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const stepLabels = ['Incident Details', 'Evidence & Timeline', 'Suspect Profile'];

  return (
    <div className="page">
      <TopBar onBack={onBack} breadcrumbs={[role.label, 'Dashboard', 'New Case']} />

      <div style={{ flex: 1, maxWidth: '620px', width: '100%', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Step indicator */}
        <div>
          <h2 style={{ fontWeight: '800', fontSize: '20px', marginBottom: '18px' }}>Add New Case</h2>
          <div className="steps">
            {stepLabels.map((label, i) => {
              const n = i + 1;
              const isDone = step > n;
              const isActive = step === n;
              return (
                <React.Fragment key={n}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <div className={`step-dot ${isDone ? 'done' : isActive ? 'active' : 'pending'}`}>
                      {isDone ? <CheckCircle size={13} /> : n}
                    </div>
                    <span style={{ fontSize: '11px', color: isActive ? 'var(--accent)' : 'var(--muted)', whiteSpace: 'nowrap' }}>{label}</span>
                  </div>
                  {i < 2 && <div className={`step-line ${step > n ? 'done' : ''}`} style={{ margin: '0 6px', marginBottom: '18px' }} />}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Step 1 */}
          {step === 1 && (
            <>
              <p style={{ fontSize: '13px', color: 'var(--sub)', marginBottom: '4px' }}>Enter the basic incident information for this case.</p>
              {[
                { label: 'Case Title', key: 'title', placeholder: 'e.g. Central Bank Armed Robbery' },
                { label: 'Crime Scene Location', key: 'location', placeholder: 'e.g. Downtown Financial District, Vault B' },
                { label: 'Incident Date & Time', key: 'timestamp', placeholder: 'e.g. 2026-10-06 02:45 AM' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label>{label}</label>
                  <input value={form[key]} onChange={e => f(key, e.target.value)} placeholder={placeholder} />
                </div>
              ))}
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <p style={{ fontSize: '13px', color: 'var(--sub)', marginBottom: '4px' }}>Log evidence and describe how the crime took place. The timeline is used to generate video narration.</p>
              <div>
                <label>Evidence Items <span style={{ color: 'var(--muted)', fontWeight: '400' }}>(comma separated)</span></label>
                <input value={form.evidenceStr} onChange={e => f('evidenceStr', e.target.value)} placeholder="e.g. CCTV Footage, Fingerprints on vault, Getaway car" />
              </div>
              <div>
                <label>Crime Timeline <span style={{ color: 'var(--muted)', fontWeight: '400' }}>(one step per line)</span></label>
                <textarea rows={6} value={form.timelineStr} onChange={e => f('timelineStr', e.target.value)}
                  placeholder={"Suspect disabled security cameras.\nBypassed the vault lock using a stolen keycard.\nFled through the rear service corridor."} />
              </div>
            </>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <>
              <p style={{ fontSize: '13px', color: 'var(--sub)', marginBottom: '4px' }}>Enter the AI suspect prediction details for this case.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label>Suspect Name</label>
                  <input value={form.suspect_name} onChange={e => f('suspect_name', e.target.value)} placeholder="e.g. Marcus Vance" />
                </div>
                <div>
                  <label>AI Confidence Score</label>
                  <input value={form.confidence} onChange={e => f('confidence', e.target.value)} placeholder="e.g. 91.4%" />
                </div>
              </div>
              <div>
                <label>Crime Motive</label>
                <input value={form.motive} onChange={e => f('motive', e.target.value)} placeholder="e.g. Financial Debt & High-Yield Asset Theft" />
              </div>
              <div>
                <label>Risk Level</label>
                <select value={form.risk_level} onChange={e => f('risk_level', e.target.value)}>
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MODERATE">MODERATE</option>
                </select>
              </div>
            </>
          )}

          <hr />

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {step > 1
              ? <button className="btn btn-ghost" onClick={() => setStep(s => s - 1)}><ArrowLeft size={14} /> Back</button>
              : <div />
            }
            {step < 3
              ? <button className="btn btn-primary" onClick={() => setStep(s => s + 1)}>Next <ArrowRight size={14} /></button>
              : <button className="btn btn-primary" onClick={() => onSubmit(form)} disabled={submitting}>
                  {submitting ? 'Saving…' : 'Save & Generate Video'}
                </button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   ROOT APP — Page router
───────────────────────────────────────── */
export default function App() {
  const [page, setPage]         = useState('login');   // login | dashboard | detail | video | add
  const [role, setRole]         = useState(null);
  const [cases, setCases]       = useState([]);
  const [loadingCases, setLoadingCases] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [generating, setGenerating]     = useState(false);
  const [submitting, setSubmitting]     = useState(false);

  const loadCases = async () => {
    setLoadingCases(true);
    try {
      const r = await fetch('/api/cases');
      if (r.ok) setCases(await r.json());
    } finally { setLoadingCases(false); }
  };

  const loadCase = async (id) => {
    const r = await fetch(`/api/cases/${id}`);
    if (r.ok) setSelectedCase(await r.json());
  };

  const handleLogin = (r) => {
    setRole(r);
    loadCases();
    setPage('dashboard');
  };

  const handleSelectCase = async (id) => {
    await loadCase(id);
    setPage('detail');
  };

  const handleOpenVideo = () => setPage('video');

  const handleGenerateVideo = async () => {
    setGenerating(true);
    try {
      const r = await fetch(`/api/investigator/cases/${selectedCase.case_id}/generate-reconstruction-video`, { method: 'POST' });
      if (r.ok) { await loadCase(selectedCase.case_id); }
    } finally { setGenerating(false); }
  };

  const handleOfficerVerify = async (notes, status) => {
    await fetch(`/api/officer/cases/${selectedCase.case_id}/verify`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ officer_name: role.label, findings_notes: notes, verified_status: status })
    });
    await loadCase(selectedCase.case_id);
  };

  const handleCommDecide = async (decision, comments) => {
    await fetch(`/api/commissioner/cases/${selectedCase.case_id}/decision`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commissioner_name: role.label, decision, comments })
    });
    await loadCase(selectedCase.case_id);
    loadCases();
  };

  const handleSubmitCase = async (form) => {
    setSubmitting(true);
    const payload = {
      ...form,
      evidence: form.evidenceStr.split(',').map(s => s.trim()).filter(Boolean),
      timeline: form.timelineStr.split('\n').map(s => s.trim()).filter(Boolean),
    };
    try {
      const r = await fetch('/api/investigator/cases/create-and-generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (r.ok) {
        const d = await r.json();
        setSelectedCase(d.case);
        loadCases();
        setPage('video');
      }
    } finally { setSubmitting(false); }
  };

  /* Render */
  if (page === 'login') return <LoginPage onLogin={handleLogin} />;

  if (page === 'dashboard') return (
    <DashboardPage
      role={role}
      cases={cases}
      loadingCases={loadingCases}
      onSelectCase={handleSelectCase}
      onAddCase={() => setPage('add')}
      onLogout={() => { setPage('login'); setRole(null); setCases([]); }}
    />
  );

  if (page === 'detail') return (
    <CaseDetailPage
      role={role}
      caseData={selectedCase}
      onBack={() => setPage('dashboard')}
      onOpenVideo={handleOpenVideo}
      onOfficerVerify={handleOfficerVerify}
      onCommDecide={handleCommDecide}
    />
  );

  if (page === 'video') return (
    <VideoPage
      role={role}
      caseData={selectedCase}
      onBack={() => setPage('detail')}
      onRegenerate={handleGenerateVideo}
      generating={generating}
    />
  );

  if (page === 'add') return (
    <AddCasePage
      role={role}
      onBack={() => setPage('dashboard')}
      onSubmit={handleSubmitCase}
      submitting={submitting}
    />
  );

  return null;
}
