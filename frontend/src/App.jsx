import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, LogIn, LogOut, Briefcase, UserCheck, Building2,
  ArrowLeft, ArrowRight, Plus, Film, Download, CheckCircle,
  XCircle, MapPin, Clock, ChevronRight, X, Zap, FileText, Eye,
  Lock, Unlock, ShieldAlert, Cpu, Database, KeyRound, Search,
  Activity, RefreshCw, BarChart3, Layers, Check, AlertTriangle,
  Camera, Users, Target, Fingerprint, Radio
} from 'lucide-react';

/* ─────────────────────────────────────────
   CONSTANTS & 3-TIER HIERARCHY ROLES
───────────────────────────────────────── */
const ROLES = [
  {
    id: 'INVESTIGATOR',
    type: 'INVESTIGATOR',
    tier: 'Tier 1: Investigation',
    label: 'Investigator',
    icon: Briefcase,
    desc: 'Ground investigator: Exclusive authority to log new cases and upload crime scene photos, inspect evidence, and generate visual reconstructions.',
    username: 'investigator',
    password: 'investigator@123'
  },
  {
    id: 'OFFICER',
    type: 'OFFICER',
    tier: 'Tier 2: Evidence Audit',
    label: 'Police Officer',
    icon: UserCheck,
    desc: 'Audit & Forensics: Inspect uploaded crime scene photos, cross-examine evidence timelines, and submit forensic verification findings.',
    username: 'officer',
    password: 'officer@456'
  },
  {
    id: 'COMMISSIONER',
    type: 'COMMISSIONER',
    tier: 'Tier 3: Executive Clearance',
    label: 'Commissioner (Chief of Police)',
    icon: Building2,
    desc: 'Executive authority: Review crime scene photos & investigation dossiers, manage clearance restrictions, and issue final case decisions.',
    username: 'commissioner',
    password: 'commissioner@789'
  },
];

/* ─────────────────────────────────────────
   TOPBAR
───────────────────────────────────────── */
function TopBar({ breadcrumbs = [], onBack, role }) {
  return (
    <div className="topbar">
      {onBack && (
        <button className="topbar-back" onClick={onBack}>
          <ArrowLeft size={14} /> Back
        </button>
      )}
      <ShieldCheck size={18} color="#6366f1" />
      <span className="topbar-title">Criminal Investigation Tracker</span>
      
      {role && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '14px' }}>
          <span style={{ fontSize: '11px', background: 'rgba(99,102,241,0.15)', color: '#818cf8', padding: '3px 9px', borderRadius: '6px', border: '1px solid rgba(99,102,241,0.3)', fontWeight: '600' }}>
            🔒 AES-256 Encrypted · {role.tier}
          </span>
          <span style={{ fontSize: '11px', background: 'rgba(34,197,94,0.12)', color: '#4ade80', padding: '3px 8px', borderRadius: '6px', border: '1px solid rgba(34,197,94,0.25)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} /> Online
          </span>
        </div>
      )}

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
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSelect = (r) => {
    setSelectedRole(r);
    setUsername('');
    setPassword('');
    setError('');
  };

  const handleLogin = () => {
    if (!selectedRole) { setError('Please select an authorized personnel profile.'); return; }
    if (username === selectedRole.username && password === selectedRole.password) {
      onLogin(selectedRole);
    } else {
      setError('Invalid credentials. Access denied.');
    }
  };

  return (
    <div className="page" style={{ alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '520px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Header Branding */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', background: 'rgba(99,102,241,0.14)', borderRadius: '16px', marginBottom: '16px', border: '1px solid rgba(99,102,241,0.25)', boxShadow: '0 0 24px rgba(99,102,241,0.2)' }}>
            <ShieldCheck size={30} color="#6366f1" />
          </div>

          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1px', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', background: 'var(--surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ width: '3px', height: '32px', borderRadius: '2px', background: '#6366f1', flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '2px' }}>Forensic Law Enforcement Platform</p>
                <p style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text)' }}>Criminal Investigation Tracker</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 18px', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ width: '3px', height: '24px', borderRadius: '2px', background: '#10b981', flexShrink: 0 }} />
              <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                <strong style={{ color: '#34d399' }}>AES-256 Security</strong> · 3-Tier Command Hierarchy · Dynamic Audit Trail · Video Reconstruction
              </p>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--sub)' }}>Select 3-Tier Authorized Personnel Role</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {ROLES.map((r) => {
              const Icon = r.icon;
              const active = selectedRole?.id === r.id;
              return (
                <div key={r.id} onClick={() => handleSelect(r)}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '10px', border: `1px solid ${active ? 'rgba(99,102,241,0.5)' : 'var(--border)'}`, background: active ? 'var(--accent-bg)' : 'var(--surface2)', cursor: 'pointer', transition: 'all .15s' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: active ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} color={active ? '#6366f1' : '#64748b'} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <p style={{ fontWeight: '700', fontSize: '13px', color: active ? 'var(--accent)' : 'var(--text)' }}>{r.label}</p>
                      <span className="badge badge-purple" style={{ fontSize: '10px', padding: '2px 6px' }}>{r.tier}</span>
                    </div>
                    <p style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px', lineHeight: '1.3' }}>{r.desc}</p>
                  </div>
                  {active && <CheckCircle size={16} color="#6366f1" style={{ marginLeft: 'auto', flexShrink: 0 }} />}
                </div>
              );
            })}
          </div>

          {/* Credentials Box */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'var(--surface2)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
              <div>
                <label>Username</label>
                <input value={username} onChange={e => setUsername(e.target.value)} />
              </div>
              <div>
                <label>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
              </div>
            </div>
          </div>

          {error && <p style={{ fontSize: '12px', color: '#f87171', background: 'rgba(239,68,68,0.08)', padding: '8px 12px', borderRadius: '7px' }}>{error}</p>}

          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleLogin}>
            <LogIn size={15} /> Authenticate & Access {selectedRole.label}
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--muted)' }}>
          Final Year Engineering Project · Cryptographically Secured Law Enforcement Dossier
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE 2 — ELEVATED ROLE DASHBOARD
───────────────────────────────────────── */
function DashboardPage({ role, cases, onSelectCase, onAddCase, onLogout, loadingCases }) {
  const [activeTab, setActiveTab] = useState('cases'); // cases | audit | analytics
  const [searchQuery, setSearchQuery] = useState('');
  const [clearanceFilter, setClearanceFilter] = useState('ALL'); // ALL | GRANTED | RESTRICTED
  const [auditLogs, setAuditLogs] = useState([]);
  const [loadingAudit, setLoadingAudit] = useState(false);
  const [authLogs, setAuthLogs] = useState([]);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [syndicateData, setSyndicateData] = useState(null);
  const [loadingSyndicate, setLoadingSyndicate] = useState(false);
  const [similarNetwork, setSimilarNetwork] = useState(null);
  const [loadingSimilarNetwork, setLoadingSimilarNetwork] = useState(false);

  const Icon = role.icon;
  const isCommissioner = role.type === 'COMMISSIONER';

  const fetchAuditLogs = async () => {
    setLoadingAudit(true);
    try {
      const r = await fetch('/api/audit-logs');
      if (r.ok) setAuditLogs(await r.json());
    } finally { setLoadingAudit(false); }
  };

  const fetchAuthLogs = async () => {
    setLoadingAuth(true);
    try {
      const r = await fetch('/api/auth/session-logs');
      if (r.ok) setAuthLogs(await r.json());
    } finally { setLoadingAuth(false); }
  };

  const fetchSyndicateData = async () => {
    setLoadingSyndicate(true);
    try {
      const r = await fetch('/api/suspects/all-matches');
      if (r.ok) setSyndicateData(await r.json());
    } finally { setLoadingSyndicate(false); }
  };

  const fetchSimilarNetwork = async () => {
    if (similarNetwork) return; // already loaded
    setLoadingSimilarNetwork(true);
    try {
      // For each case, fetch its similar-cases data, then build a network map
      const caseIds = cases.map(c => c.case_id).filter(Boolean);
      const results = await Promise.all(
        caseIds.map(id =>
          fetch(`/api/cases/${id}/similar`)
            .then(r => r.ok ? r.json() : null)
            .catch(() => null)
        )
      );
      setSimilarNetwork(results.filter(Boolean));
    } finally { setLoadingSimilarNetwork(false); }
  };

  useEffect(() => {
    if (activeTab === 'audit') fetchAuditLogs();
    if (activeTab === 'auth_logs') fetchAuthLogs();
    if (activeTab === 'suspects') fetchSyndicateData();
    if (activeTab === 'similar_network') fetchSimilarNetwork();
  }, [activeTab]);

  useEffect(() => {
    // Background pre-fetch for tab badges
    fetchAuthLogs();
    fetchSyndicateData();
  }, []);

  // Filter cases by search and clearance status
  const filteredCases = cases.filter(c => {
    const matchesSearch = !searchQuery ||
      c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.case_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.suspect_prediction?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const isRestricted = c.commissioner_clearance_status === 'RESTRICTED';
    const matchesClearance =
      clearanceFilter === 'ALL' ||
      (clearanceFilter === 'GRANTED' && !isRestricted) ||
      (clearanceFilter === 'RESTRICTED' && isRestricted);

    return matchesSearch && matchesClearance;
  });

  return (
    <div className="page">
      <TopBar role={role} breadcrumbs={[role.label, 'Dashboard']} />

      <div style={{ flex: 1, maxWidth: '1020px', width: '100%', margin: '0 auto', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '22px' }}>

        {/* Welcome Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(99,102,241,0.25)' }}>
              <Icon size={24} color="#6366f1" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontWeight: '800', fontSize: '19px' }}>Welcome, {role.label}</h2>
                <span className="badge badge-purple" style={{ fontSize: '11px' }}>{role.tier}</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--sub)', marginTop: '2px' }}>{role.desc}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {role.type === 'INVESTIGATOR' && (
              <button className="btn btn-primary" onClick={onAddCase}>
                <FileText size={14} /> 📄 Generate Case Dossier
              </button>
            )}
            <button className="btn btn-outline" onClick={onLogout}>Sign out</button>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' }}>
          {[
            { label: 'Active Investigations', value: cases.length, icon: Briefcase, color: '#38bdf8' },
            { label: 'Reconstruction Videos', value: cases.filter(c => c.video_reconstruction).length, icon: Film, color: '#ec4899' },
            { label: 'Clearance Granted', value: cases.filter(c => c.commissioner_clearance_status !== 'RESTRICTED').length, icon: Unlock, color: 'var(--green)' },
            { label: 'Commissioner Approved', value: cases.filter(c => c.commissioner_approval === 'APPROVED').length, icon: CheckCircle, color: '#818cf8' },
          ].map(({ label, value, icon: StatIcon, color }) => (
            <div key={label} className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
                <StatIcon size={14} color={color} />
              </div>
              <p style={{ fontSize: '24px', fontWeight: '800', color: color }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Navigation Tabs (Cases vs Suspect Matching vs Auth Tracking vs Audit vs Authority) */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '10px', overflowX: 'auto' }}>
          {[
            { id: 'cases', label: '📁 Case Files & Dossiers', count: cases.length },
            { id: 'similar_network', label: '🔍 Similar Case Detection', count: null },
            { id: 'suspects', label: '🎯 Suspect Correlation & Recidivism', count: syndicateData?.repeat_offenders_count || null },
            { id: 'auth_logs', label: '🔐 Login & Session Tracking', count: authLogs.length || null },
            { id: 'audit', label: '🛡️ Cryptographic Security & Audit Trail', count: auditLogs.length || null, commissionerOnly: true },
            { id: 'analytics', label: '📊 3-Tier Authority & Suspect Matrix', count: null }
          ].filter(tab => !tab.commissionerOnly || isCommissioner).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '9px 16px',
                borderRadius: '8px',
                border: activeTab === tab.id ? '1px solid rgba(99,102,241,0.4)' : '1px solid transparent',
                background: activeTab === tab.id ? 'var(--accent-bg)' : 'transparent',
                color: activeTab === tab.id ? 'var(--accent)' : 'var(--muted)',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all .15s'
              }}
            >
              {tab.label}
              {tab.count !== null && (
                <span style={{ fontSize: '10px', background: activeTab === tab.id ? '#6366f1' : 'rgba(255,255,255,0.06)', color: '#fff', padding: '2px 6px', borderRadius: '10px' }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ──────────────── TAB 1: CASES ──────────────── */}
        {activeTab === 'cases' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Filter / Search Bar */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search size={15} color="var(--muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search investigations by case title, location, suspect name, or ID…"
                  style={{ paddingLeft: '36px' }}
                />
              </div>

              {/* Clearance Filter Buttons */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {[
                  { id: 'ALL', label: 'All Cases' },
                  { id: 'GRANTED', label: '🔓 Cleared' },
                  { id: 'RESTRICTED', label: '🔒 Restricted' }
                ].map(flt => {
                  const active = clearanceFilter === flt.id;
                  return (
                    <button
                      key={flt.id}
                      onClick={() => setClearanceFilter(flt.id)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '7px',
                        border: `1px solid ${active ? 'rgba(99,102,241,0.5)' : 'var(--border)'}`,
                        background: active ? 'var(--accent-bg)' : 'var(--surface2)',
                        color: active ? 'var(--accent)' : 'var(--muted)',
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      {flt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Case List Card */}
            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ fontWeight: '700', fontSize: '14px' }}>Active Case Files ({filteredCases.length})</p>
                <span className="badge badge-purple">AES-256 Protected</span>
              </div>

              {loadingCases ? (
                <p style={{ padding: '32px', textAlign: 'center', color: 'var(--muted)', fontSize: '13px' }}>Loading cases…</p>
              ) : filteredCases.length === 0 ? (
                <div style={{ padding: '48px', textAlign: 'center', color: 'var(--muted)' }}>
                  <FileText size={32} style={{ marginBottom: '10px', opacity: .3 }} />
                  <p style={{ fontSize: '13px' }}>No cases found matching your filter criteria.</p>
                </div>
              ) : (
                <div>
                  {filteredCases.map((c, i) => {
                    const isRestricted = c.commissioner_clearance_status === 'RESTRICTED';

                    return (
                      <div key={c.case_id} onClick={() => onSelectCase(c.case_id)}
                        style={{ padding: '16px 20px', borderBottom: i < filteredCases.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', transition: 'background .15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '12px', fontWeight: '800', color: 'var(--accent)' }}>
                          {i + 1}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                            <p style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.title}</p>
                            <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(99,102,241,0.12)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)', fontWeight: '600' }}>
                              #{c.case_id}
                            </span>
                          </div>
                          <p style={{ fontSize: '12px', color: 'var(--sub)', display: 'flex', gap: '14px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={11} /> {c.location}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={11} /> {c.timestamp}</span>
                          </p>
                        </div>

                        {/* Video Reconstruction Indicator */}
                        {c.video_reconstruction ? (
                          <span style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(236,72,153,0.14)', color: '#f472b6', padding: '3px 8px', borderRadius: '6px', fontWeight: '700', border: '1px solid rgba(236,72,153,0.25)' }}>
                            <Film size={12} /> Video Ready
                          </span>
                        ) : (
                          <span style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--muted)', background: 'var(--surface2)', padding: '3px 8px', borderRadius: '6px' }}>
                            <Clock size={11} /> No Video
                          </span>
                        )}

                        {/* Clearance Badge */}
                        {isRestricted ? (
                          <span className="badge badge-amber" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Lock size={12} /> Restricted
                          </span>
                        ) : (
                          <span className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Unlock size={12} /> Cleared
                          </span>
                        )}

                        <span className={`badge ${c.commissioner_approval === 'APPROVED' ? 'badge-green' : c.commissioner_approval === 'REJECTED' ? 'badge-amber' : 'badge-purple'}`}>
                          {c.commissioner_approval || 'Pending'}
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            className="btn btn-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectCase(c.case_id);
                            }}
                            style={{ fontSize: '11px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '5px' }}
                          >
                            <Eye size={12} /> 👁 View Case Dossier
                          </button>
                          <a
                            href={`http://localhost:8000/api/cases/${c.case_id}/download-pdf`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="btn btn-outline"
                            style={{ fontSize: '11px', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '5px', color: '#4ade80', borderColor: 'rgba(74,222,128,0.3)' }}
                            title="Download Formal Investigation Dossier PDF"
                          >
                            <Download size={12} /> ⬇ Download PDF
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ──────────────── TAB 2: AUDIT LOGS ──────────────── */}
        {activeTab === 'audit' && (
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: '800', fontSize: '15px' }}>Cryptographic Security Audit Log</p>
                <p style={{ fontSize: '12px', color: 'var(--sub)', marginTop: '2px' }}>
                  Immutable chronological log of all case actions, SHA-256 integrity signatures, and clearance updates.
                </p>
              </div>
              <button className="btn btn-ghost" onClick={fetchAuditLogs} disabled={loadingAudit}>
                <RefreshCw size={13} /> Refresh Logs
              </button>
            </div>

            {loadingAudit ? (
              <p style={{ padding: '32px', textAlign: 'center', color: 'var(--muted)', fontSize: '13px' }}>Loading audit logs…</p>
            ) : auditLogs.length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center', color: 'var(--muted)' }}>
                <KeyRound size={32} style={{ marginBottom: '10px', opacity: .3 }} />
                <p style={{ fontSize: '13px' }}>No audit trail entries recorded yet.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)', color: 'var(--muted)' }}>
                      <th style={{ padding: '12px 16px' }}>Timestamp</th>
                      <th style={{ padding: '12px 16px' }}>Case ID</th>
                      <th style={{ padding: '12px 16px' }}>Action & Actor</th>
                      <th style={{ padding: '12px 16px' }}>Encryption / Hash Seal</th>
                      <th style={{ padding: '12px 16px' }}>Audit Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log, idx) => {
                      return (
                        <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background .1s' }}>
                          <td style={{ padding: '12px 16px', color: 'var(--sub)', whiteSpace: 'nowrap' }}>{log.timestamp}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <p style={{ fontWeight: '700', color: 'var(--text)' }}>{log.case_id}</p>
                            <span style={{ fontSize: '10px', color: 'var(--muted)' }}>{log.case_title}</span>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span className={`badge ${log.severity === 'VERIFIED' ? 'badge-green' : log.severity === 'SECURITY_CRITICAL' ? 'badge-amber' : 'badge-purple'}`} style={{ fontSize: '10px', marginBottom: '3px' }}>
                              {log.action}
                            </span>
                            <p style={{ fontSize: '11px', color: 'var(--muted)' }}>By: {log.performed_by}</p>
                          </td>
                          <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: '11px' }}>
                            <p style={{ color: '#4ade80' }}>🔒 {log.encryption}</p>
                            <p style={{ color: 'var(--muted)' }}>{log.hash_signature}</p>
                          </td>
                          <td style={{ padding: '12px 16px', color: 'var(--sub)', maxWidth: '280px' }}>{log.details}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ──────────────── TAB: SUSPECT CORRELATION & RECIDIVISM ──────────────── */}
        {activeTab === 'suspects' && (
          <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Target size={18} color="#ec4899" />
                  <p style={{ fontWeight: '800', fontSize: '16px' }}>Cross-Case Suspect Correlation & Recidivism Matrix</p>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--sub)', marginTop: '4px' }}>
                  Automated intelligence scanning across all jurisdiction sectors to detect serial offenders, shared aliases, and repeat criminal patterns.
                </p>
              </div>
              <button className="btn btn-outline" onClick={fetchSyndicateData} style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <RefreshCw size={12} /> Refresh Correlation
              </button>
            </div>

            {/* Quick Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div style={{ background: 'var(--surface2)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border)' }}>
                <p style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase' }}>Tracked Suspect Dossiers</p>
                <p style={{ fontSize: '22px', fontWeight: '800', color: '#38bdf8', marginTop: '4px' }}>
                  {syndicateData?.total_tracked || cases.length}
                </p>
              </div>
              <div style={{ background: 'rgba(236,72,153,0.08)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(236,72,153,0.3)' }}>
                <p style={{ fontSize: '11px', color: '#ec4899', textTransform: 'uppercase', fontWeight: '700' }}>Serial / Repeat Offenders</p>
                <p style={{ fontSize: '22px', fontWeight: '800', color: '#f43f5e', marginTop: '4px' }}>
                  {syndicateData?.repeat_offenders_count || 0}
                </p>
              </div>
              <div style={{ background: 'rgba(99,102,241,0.08)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(99,102,241,0.3)' }}>
                <p style={{ fontSize: '11px', color: '#818cf8', textTransform: 'uppercase', fontWeight: '700' }}>Cross-Sector Correlation Rate</p>
                <p style={{ fontSize: '22px', fontWeight: '800', color: '#a78bfa', marginTop: '4px' }}>100% Automated</p>
              </div>
            </div>

            {loadingSyndicate ? (
              <p style={{ padding: '32px', textAlign: 'center', color: 'var(--muted)', fontSize: '13px' }}>Scanning criminal database for suspect correlations…</p>
            ) : (!syndicateData?.repeat_offenders || syndicateData.repeat_offenders.length === 0) ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', border: '1px dashed var(--border)', borderRadius: '10px', background: 'var(--surface2)' }}>
                <Users size={32} color="var(--muted)" style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                <p style={{ fontSize: '14px', fontWeight: '700' }}>All Active Suspects Evaluated</p>
                <p style={{ fontSize: '12px', color: 'var(--sub)', maxWidth: '480px', margin: '6px auto 0' }}>
                  Each filed case currently has an isolated suspect profile. When multiple cases match the same suspect name, alias, or Modus Operandi, they will link automatically here.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {syndicateData.repeat_offenders.map((offender, i) => (
                  <div key={i} className="card" style={{ padding: '18px', borderColor: 'rgba(236,72,153,0.4)', background: 'linear-gradient(135deg, rgba(236,72,153,0.05) 0%, rgba(15,23,42,0.4) 100%)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(236,72,153,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Fingerprint size={22} color="#ec4899" />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <p style={{ fontWeight: '800', fontSize: '16px', color: 'var(--text)' }}>{offender.name}</p>
                            {offender.alias && (
                              <span style={{ fontSize: '11px', color: '#818cf8', background: 'rgba(99,102,241,0.15)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(99,102,241,0.3)' }}>
                                Alias: "{offender.alias}"
                              </span>
                            )}
                          </div>
                          <p style={{ fontSize: '12px', color: '#f43f5e', fontWeight: '600', marginTop: '2px' }}>
                            ⚠️ Linked to {offender.cases.length} Criminal Incidents Across City Sectors
                          </p>
                        </div>
                      </div>
                      <span className="badge badge-amber" style={{ fontSize: '11px' }}>
                        {offender.risk_level || 'CRITICAL'} RISK
                      </span>
                    </div>

                    <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <p style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: '700', textTransform: 'uppercase' }}>Associated Criminal Records:</p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
                        {offender.cases.map((cs, cIdx) => (
                          <div
                            key={cIdx}
                            onClick={() => onSelectCase(cs.case_id)}
                            style={{
                              background: 'var(--surface2)',
                              padding: '10px 14px',
                              borderRadius: '8px',
                              border: '1px solid var(--border)',
                              cursor: 'pointer',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              transition: 'all .15s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                          >
                            <div>
                              <p style={{ fontWeight: '700', fontSize: '12px', color: 'var(--text)' }}>{cs.case_id}: {cs.title}</p>
                              <p style={{ fontSize: '11px', color: 'var(--muted)' }}>📍 {cs.location || cs.sector}</p>
                            </div>
                            <span style={{ fontSize: '10px', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                              View <ChevronRight size={11} />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ──────────────── TAB: AUTHENTICATION & LOGIN/LOGOUT TRACKING ──────────────── */}
        {activeTab === 'auth_logs' && (
          <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} color="#4ade80" />
                  <p style={{ fontWeight: '800', fontSize: '15px' }}>User Authentication & Session Audit Trail</p>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--sub)', marginTop: '2px' }}>
                  Real-time tamper-proof logging of all login and logout events with timestamps, authority tiers, and SHA-256 session seals.
                </p>
              </div>
              <button className="btn btn-outline" onClick={fetchAuthLogs} style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <RefreshCw size={12} /> Refresh Sessions
              </button>
            </div>

            {loadingAuth ? (
              <p style={{ padding: '32px', textAlign: 'center', color: 'var(--muted)', fontSize: '13px' }}>Loading session logs…</p>
            ) : authLogs.length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center', color: 'var(--muted)' }}>
                <LogIn size={32} style={{ marginBottom: '10px', opacity: .3 }} />
                <p style={{ fontSize: '13px' }}>No session logs recorded yet. Events record automatically on sign-in & sign-out.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)', color: 'var(--muted)' }}>
                      <th style={{ padding: '12px 16px' }}>Timestamp</th>
                      <th style={{ padding: '12px 16px' }}>User / Identity</th>
                      <th style={{ padding: '12px 16px' }}>Authority Tier</th>
                      <th style={{ padding: '12px 16px' }}>Event Action</th>
                      <th style={{ padding: '12px 16px' }}>Client Workstation</th>
                      <th style={{ padding: '12px 16px' }}>Cryptographic Hash Seal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {authLogs.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '12px 16px', color: 'var(--sub)', whiteSpace: 'nowrap' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Clock size={12} color="var(--muted)" /> {item.timestamp}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <p style={{ fontWeight: '700', color: 'var(--text)' }}>{item.role_label || item.username}</p>
                          <span style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'monospace' }}>@{item.username}</span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span className="badge badge-purple" style={{ fontSize: '10px' }}>
                            {item.tier || item.role}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          {item.action === 'LOGIN' ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(34,197,94,0.12)', color: '#4ade80', padding: '3px 8px', borderRadius: '4px', fontWeight: '700', fontSize: '11px', border: '1px solid rgba(34,197,94,0.3)' }}>
                              <LogIn size={11} /> USER_LOGIN
                            </span>
                          ) : (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(251,191,36,0.12)', color: '#fbbf24', padding: '3px 8px', borderRadius: '4px', fontWeight: '700', fontSize: '11px', border: '1px solid rgba(251,191,36,0.3)' }}>
                              <LogOut size={11} /> USER_LOGOUT
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '12px 16px', color: 'var(--muted)', fontSize: '11px' }}>
                          <p style={{ color: 'var(--sub)' }}>🖥️ {item.ip_address}</p>
                          <span style={{ fontSize: '10px' }}>{item.session_id}</span>
                        </td>
                        <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: '11px' }}>
                          <span style={{ color: '#4ade80' }}>🔒 SHA-256</span>
                          <p style={{ color: 'var(--muted)', fontSize: '10px' }}>{item.integrity_hash}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ──────────────── TAB 3: 3-TIER AUTHORITY & RISK MATRIX ──────────────── */}
        {activeTab === 'analytics' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="card" style={{ padding: '20px' }}>
              <p style={{ fontWeight: '800', fontSize: '14px', marginBottom: '14px' }}>3-Tier Law Enforcement Hierarchy</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  {
                    tier: 'Tier 1: Investigator',
                    desc: 'Field investigation, case logging, AI suspect analysis & video reconstruction triggers.',
                    color: '#38bdf8'
                  },
                  {
                    tier: 'Tier 2: Police Officer',
                    desc: 'Forensic evidence inspection, physical proof cross-checks & verification submissions.',
                    color: '#22c55e'
                  },
                  {
                    tier: 'Tier 3: Commissioner',
                    desc: 'Master clearance gatekeeper: grants/restricts investigator access & issues case decisions.',
                    color: '#a855f7'
                  }
                ].map(item => (
                  <div key={item.tier} style={{ background: 'var(--surface2)', padding: '12px 14px', borderRadius: '8px', borderLeft: `3px solid ${item.color}` }}>
                    <p style={{ fontSize: '12px', fontWeight: '700', color: item.color }}>{item.tier}</p>
                    <p style={{ fontSize: '11px', color: 'var(--sub)', marginTop: '3px' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <p style={{ fontWeight: '800', fontSize: '14px', marginBottom: '14px' }}>Suspect Risk Level Distribution</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { level: 'CRITICAL', color: '#f87171' },
                  { level: 'HIGH', color: '#fbbf24' },
                  { level: 'MODERATE', color: '#38bdf8' }
                ].map(({ level, color }) => {
                  const count = cases.filter(c => c.suspect_prediction?.risk_level === level).length;
                  return (
                    <div key={level} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface2)', padding: '10px 14px', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertTriangle size={14} color={color} />
                        <span style={{ fontSize: '12px', fontWeight: '700', color: color }}>{level} RISK</span>
                      </div>
                      <span className="badge badge-amber">{count} Suspects</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ──────────────── TAB: SIMILAR CASE DETECTION NETWORK ──────────────── */}
        {activeTab === 'similar_network' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(56,189,248,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Layers size={18} color="#38bdf8" />
                  </div>
                  <h2 style={{ fontWeight: '800', fontSize: '18px', color: 'var(--text)' }}>Similar Case Detection & MO Pattern Network</h2>
                  <span className="badge badge-purple" style={{ fontSize: '10px' }}>
                    {similarNetwork ? similarNetwork.reduce((acc, n) => acc + (n.similar_cases?.length || 0), 0) : '–'} Cross-Links
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--sub)', marginLeft: '46px' }}>
                  Automated forensic engine correlating evidence artifacts, MO signatures, sector parity & temporal patterns across all active cases.
                </p>
              </div>
              <button className="btn btn-outline" onClick={() => { setSimilarNetwork(null); setTimeout(() => fetchSimilarNetwork(), 50); }} style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <RefreshCw size={13} /> Re-scan Network
              </button>
            </div>

            {loadingSimilarNetwork ? (
              <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', border: '3px solid rgba(56,189,248,0.3)', borderTopColor: '#38bdf8', animation: 'spin 1s linear infinite' }} />
                  <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Running forensic similarity correlation across all {cases.length} cases in database…</p>
                </div>
              </div>
            ) : !similarNetwork ? (
              <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
                <Layers size={32} color="var(--muted)" style={{ margin: '0 auto 12px' }} />
                <p style={{ color: 'var(--text)', fontWeight: '700', marginBottom: '6px' }}>Cross-Case MO Analysis</p>
                <p style={{ color: 'var(--sub)', fontSize: '13px', marginBottom: '16px' }}>Detect shared criminal patterns, evidence overlap & recurring suspects across all cases in the database.</p>
                <button className="btn btn-primary" onClick={fetchSimilarNetwork} style={{ margin: '0 auto' }}>
                  <Layers size={14} /> Run Similar Case Detection
                </button>
              </div>
            ) : (
              <>
                {/* Summary stats bar */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                  {(() => {
                    const allSim = similarNetwork.flatMap(n => n.similar_cases || []);
                    const veryHigh = allSim.filter(s => s.similarity_grade === 'VERY HIGH SIMILARITY').length;
                    const high     = allSim.filter(s => s.similarity_grade === 'HIGH SIMILARITY').length;
                    const moderate = allSim.filter(s => s.similarity_grade === 'MODERATE SIMILARITY').length;
                    const avgPct   = allSim.length ? Math.round(allSim.reduce((a, s) => a + s.similarity_percentage, 0) / allSim.length) : 0;
                    return [
                      { label: 'Very High Links',  value: veryHigh,     color: '#ec4899', icon: '🔴' },
                      { label: 'High Links',        value: high,         color: '#38bdf8', icon: '🔵' },
                      { label: 'Moderate Links',    value: moderate,     color: '#fbbf24', icon: '🟡' },
                      { label: 'Avg Similarity',    value: `${avgPct}%`, color: '#a855f7', icon: '📊' },
                    ].map((stat, i) => (
                      <div key={i} className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', background: `${stat.color}0d`, borderColor: `${stat.color}33` }}>
                        <span style={{ fontSize: '22px' }}>{stat.icon}</span>
                        <div>
                          <p style={{ fontSize: '20px', fontWeight: '800', color: stat.color }}>{stat.value}</p>
                          <p style={{ fontSize: '11px', color: 'var(--muted)' }}>{stat.label}</p>
                        </div>
                      </div>
                    ));
                  })()}
                </div>

                {/* Per-case similar case cards */}
                {similarNetwork.filter(n => n.similar_cases?.length > 0).map((node, nIdx) => (
                  <div key={nIdx} className="card" style={{ padding: '20px', borderColor: 'rgba(56,189,248,0.2)', background: 'linear-gradient(180deg, rgba(56,189,248,0.03) 0%, rgba(15,23,42,0.4) 100%)' }}>
                    {/* Source Case Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(56,189,248,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <FileText size={15} color="#38bdf8" />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <p style={{ fontWeight: '800', fontSize: '14px' }}>{node.target_title || node.target_case_id}</p>
                            <span style={{ fontSize: '10px', color: 'var(--muted)', background: 'rgba(255,255,255,0.05)', padding: '1px 6px', borderRadius: '3px' }}>#{node.target_case_id}</span>
                            <span className="badge badge-purple" style={{ fontSize: '10px' }}>{node.similar_cases.length} Correlated</span>
                          </div>
                          <p style={{ fontSize: '11px', color: 'var(--sub)', marginTop: '2px' }}>Analyzed against {node.total_analyzed} other cases in database</p>
                        </div>
                      </div>
                      <button
                        className="btn btn-outline"
                        onClick={() => onSelectCase(node.target_case_id)}
                        style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Eye size={12} /> Open Dossier
                      </button>
                    </div>

                    {/* Correlated cases grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '10px' }}>
                      {node.similar_cases.slice(0, 4).map((sim, sIdx) => {
                        const pct = sim.similarity_percentage;
                        const meterColor = pct >= 75 ? '#ec4899' : (pct >= 55 ? '#38bdf8' : '#fbbf24');
                        const gradeBg    = pct >= 75 ? 'rgba(236,72,153,0.08)' : (pct >= 55 ? 'rgba(56,189,248,0.08)' : 'rgba(251,191,36,0.08)');
                        return (
                          <div
                            key={sIdx}
                            style={{
                              background: gradeBg,
                              border: `1px solid ${meterColor}33`,
                              borderRadius: '10px',
                              padding: '14px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '8px',
                              cursor: 'pointer',
                              transition: 'transform .12s, box-shadow .12s'
                            }}
                            onClick={() => onSelectCase(sim.case_id)}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 4px 16px ${meterColor}22`; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                          >
                            {/* Title + score */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px' }}>
                              <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: '700', fontSize: '12px', color: 'var(--text)', lineHeight: 1.3 }}>
                                  {sim.title || sim.case_id}
                                </p>
                                <p style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '2px' }}>#{sim.case_id}</p>
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px', flexShrink: 0 }}>
                                <span style={{ fontWeight: '800', fontSize: '16px', color: meterColor }}>{pct}%</span>
                                <span style={{ fontSize: '9px', fontWeight: '700', color: meterColor, background: `${meterColor}22`, padding: '1px 5px', borderRadius: '3px', border: `1px solid ${meterColor}44` }}>
                                  {sim.similarity_grade}
                                </span>
                              </div>
                            </div>

                            {/* Similarity bar */}
                            <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                              <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${meterColor}99, ${meterColor})`, borderRadius: '2px' }} />
                            </div>

                            {/* Matching factor tags */}
                            {sim.matching_factors?.length > 0 && (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                {sim.matching_factors.slice(0, 2).map((f, fIdx) => (
                                  <span key={fIdx} style={{ fontSize: '9px', color: 'var(--sub)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '3px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                    <Check size={8} color={meterColor} />{f.split(':')[0]}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Shared MO keyword tokens */}
                            {sim.shared_keywords?.length > 0 && (
                              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                {sim.shared_keywords.slice(0, 4).map((kw, kIdx) => (
                                  <span key={kIdx} style={{ fontSize: '9px', fontFamily: 'monospace', color: '#818cf8', background: 'rgba(99,102,241,0.1)', padding: '1px 5px', borderRadius: '3px' }}>#{kw}</span>
                                ))}
                              </div>
                            )}

                            {/* Footer: location + suspect */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '10px', color: 'var(--muted)' }}>
                              <span>📍 {sim.location || 'Unknown'}</span>
                              {sim.suspect_name && <span style={{ color: '#f87171' }}>🎯 {sim.suspect_name}</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {similarNetwork.every(n => !n.similar_cases?.length) && (
                  <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
                    <p style={{ fontSize: '13px', color: 'var(--sub)' }}>No significant cross-case MO correlations detected in the current database.</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE 3 — CASE DETAIL
───────────────────────────────────────── */
function CaseDetailPage({ role, caseData, onBack, onOpenVideo, onOfficerVerify, onCommDecide, onToggleClearance, onSelectCase }) {
  const [notes, setNotes]       = useState(caseData.officer_verification?.notes || '');
  const [status, setStatus]     = useState('Evidence Verified');
  const [comments, setComments] = useState('');
  const [toast, setToast]       = useState('');
  const [activePhotoModal, setActivePhotoModal] = useState(null);

  const isCommissioner = role.type === 'COMMISSIONER';
  const isInvestigator = role.type === 'INVESTIGATOR';
  const isOfficer      = role.type === 'OFFICER';
  const isRestricted   = caseData.commissioner_clearance_status === 'RESTRICTED';

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return url.startsWith('/') ? `http://localhost:8000${url}` : `http://localhost:8000/${url}`;
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  const handleVerify = async () => {
    await onOfficerVerify(notes, status);
    showToast('Verification findings secured in MongoDB.');
  };
  const handleDecide = async (decision) => {
    await onCommDecide(decision, comments);
    showToast(`Decision recorded: ${decision}`);
  };
  const handleClearanceToggle = async () => {
    const nextStatus = isRestricted ? 'GRANTED' : 'RESTRICTED';
    await onToggleClearance(caseData.case_id, nextStatus);
    showToast(`Commissioner clearance updated to: ${nextStatus}`);
  };

  const [suspectMatches, setSuspectMatches] = useState(null);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [similarCases, setSimilarCases] = useState(null);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  const fetchSimilar = () => {
    if (caseData?.case_id) {
      setLoadingSimilar(true);
      fetch(`/api/cases/${caseData.case_id}/similar`)
        .then(r => r.json())
        .then(d => setSimilarCases(d))
        .catch(err => console.error("Similar case detection failed:", err))
        .finally(() => setLoadingSimilar(false));
    }
  };

  useEffect(() => {
    fetchSimilar();
  }, [caseData?.case_id]);

  useEffect(() => {
    const sName = caseData.suspect_prediction?.name;
    const sAlias = caseData.suspect_prediction?.alias;
    if (sName || sAlias) {
      setLoadingMatches(true);
      fetch(`/api/suspects/match?name=${encodeURIComponent(sName || '')}&alias=${encodeURIComponent(sAlias || '')}&current_case_id=${encodeURIComponent(caseData.case_id || '')}`)
        .then(r => r.json())
        .then(data => setSuspectMatches(data))
        .catch(err => console.error("Suspect match check failed:", err))
        .finally(() => setLoadingMatches(false));
    }
  }, [caseData.case_id, caseData.suspect_prediction?.name, caseData.suspect_prediction?.alias]);

  const s = caseData.suspect_prediction || {};

  return (
    <div className="page">
      <TopBar role={role} onBack={onBack} breadcrumbs={[role.label, 'Dashboard', `Case Dossier #${caseData.case_id}`]} />

      <div style={{ flex: 1, maxWidth: '920px', width: '100%', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Case Title & Badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
              <span style={{ fontSize: '11px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>📁 CASE DOSSIER / INVESTIGATION REPORT</span>
              <span style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.5px' }}>#{caseData.case_id}</span>
              <span style={{ fontSize: '11px', background: 'rgba(99, 102, 241, 0.12)', color: '#818cf8', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(99, 102, 241, 0.3)', fontWeight: '600' }}>
                {caseData.status || 'Under Investigation'}
              </span>
              <span style={{ fontSize: '11px', background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                🔒 AES-256 Sealed
              </span>
            </div>
            <h2 style={{ fontWeight: '800', fontSize: '20px' }}>{caseData.title}</h2>
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '12px', color: 'var(--sub)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} /> {caseData.location}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {caseData.timestamp}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <a
              href={`http://localhost:8000/api/cases/${caseData.case_id}/download-pdf`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline"
              style={{ fontSize: '12px', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px', color: '#4ade80', borderColor: 'rgba(74,222,128,0.4)', textDecoration: 'none' }}
              title="Download Official PDF Report"
            >
              <Download size={14} /> ⬇ Download PDF
            </a>
            <span className={`badge ${isRestricted ? 'badge-amber' : 'badge-green'}`} style={{ fontSize: '12px', padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {isRestricted ? <Lock size={13} /> : <Unlock size={13} />} {isRestricted ? 'Restricted' : 'Clearance Granted'}
            </span>
            <span className={`badge ${caseData.commissioner_approval === 'APPROVED' ? 'badge-green' : 'badge-purple'}`} style={{ fontSize: '12px', padding: '5px 12px' }}>
              {caseData.commissioner_approval || 'Pending Approval'}
            </span>
          </div>
        </div>

        {toast && (
          <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'var(--green-bg)', border: '1px solid rgba(34,197,94,.25)', color: 'var(--green)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '7px' }}>
            <CheckCircle size={14} /> {toast}
          </div>
        )}

        {/* IMMUTABILITY NOTICE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)', fontSize: '12px', color: '#818cf8' }}>
          <Lock size={13} color="#818cf8" />
          <span><strong>Cryptographically Sealed:</strong> Core case details (title, location, evidence, timeline, suspect profile) are immutable once submitted. No role — including Commissioner — can alter the original filed record.</span>
        </div>


        {/* RESTRICTED ACCESS SCREEN FOR INVESTIGATORS */}
        {isInvestigator && isRestricted ? (
          <div className="card" style={{ padding: '40px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', borderColor: 'rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.04)' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={28} color="#ef4444" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#f87171' }}>Access Restricted by Chief Commissioner</h3>
              <p style={{ fontSize: '13px', color: 'var(--sub)', maxWidth: '520px', marginTop: '6px' }}>
                You do not currently have clearance to access this investigation dossier or generate reconstruction videos. The Commissioner must explicitly grant investigator access for this case file.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Evidence + Timeline */}
            {/* Jurisdiction & Sector */}
            {caseData.sector && (() => {
              const sec = SECTORS.find(s => s.id === caseData.sector);
              if (!sec) return null;
              return (
                <div className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px', borderColor: sec.color + '44' }}>
                  <div style={{ fontSize: '22px' }}>{sec.icon}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '4px' }}>Jurisdiction Sector</p>
                    <p style={{ fontWeight: '700', fontSize: '13px', color: sec.color, marginBottom: '3px' }}>{sec.name}</p>
                    <p style={{ fontSize: '11px', color: 'var(--muted)' }}>📍 {sec.regionFrom} → {sec.regionTo}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '3px' }}>Assigned Officer</p>
                    <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text)' }}>👮 {sec.officer}</p>
                  </div>
                </div>
              );
            })()}

            {/* Evidence + Timeline */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="card" style={{ padding: '18px' }}>
                <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '12px' }}>Forensic Evidence Items</p>
                <ul style={{ paddingLeft: '18px', fontSize: '13px', color: 'var(--sub)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {caseData.evidence?.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </div>

              <div className="card" style={{ padding: '18px' }}>
                <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '12px' }}>Crime Timeline Sequence</p>
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

            {/* DEDICATED CRIME SCENE PHOTOGRAPHIC EVIDENCE SECTION */}
            <div className="card" style={{ padding: '20px', borderColor: 'rgba(99,102,241,0.25)', background: 'linear-gradient(180deg, rgba(30,27,75,0.15) 0%, rgba(15,23,42,0.3) 100%)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Camera size={18} color="#818cf8" />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <p style={{ fontWeight: '800', fontSize: '14px' }}>Crime Scene Photographic Evidence</p>
                      <span className="badge badge-purple" style={{ fontSize: '10px' }}>
                        {caseData.images?.length || 0} {caseData.images?.length === 1 ? 'Photo' : 'Photos'} Attached
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--sub)', marginTop: '2px' }}>
                      {isOfficer && '🔍 Forensic Cross-Examination Mode: Inspect crime scene photos to verify against the timeline & evidence items.'}
                      {isCommissioner && '👁️ Executive Review Mode: Inspect ground-level photographic captures to evaluate case closure decisions.'}
                      {isInvestigator && '📸 Ground Field Records: Photos uploaded on-site by Tier 1 Investigator.'}
                    </p>
                  </div>
                </div>
              </div>

              {caseData.images && caseData.images.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px' }}>
                  {caseData.images.map((imgUrl, idx) => {
                    const resolvedSrc = getImageUrl(imgUrl);
                    return (
                      <div
                        key={idx}
                        onClick={() => setActivePhotoModal(resolvedSrc)}
                        style={{
                          position: 'relative',
                          height: '140px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: '1px solid rgba(255,255,255,0.12)',
                          cursor: 'pointer',
                          background: '#090d16',
                          transition: 'all .2s ease'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'scale(1.03)';
                          e.currentTarget.style.borderColor = 'var(--accent)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                        }}
                      >
                        <img
                          src={resolvedSrc}
                          alt={`Crime Scene Evidence #${idx + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          padding: '6px 10px',
                          background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <span style={{ fontSize: '11px', fontWeight: '700', color: '#fff' }}>Evidence #{idx + 1}</span>
                          <span style={{ fontSize: '10px', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Eye size={11} /> Click to Zoom
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ padding: '24px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
                  <Camera size={24} color="var(--muted)" style={{ margin: '0 auto 8px', opacity: 0.6 }} />
                  <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--sub)' }}>No Crime Scene Photos Attached</p>
                  <p style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>
                    Tier 1 Investigators upload crime scene photos on-site when logging cases.
                  </p>
                </div>
              )}
            </div>

            {/* LIGHTBOX MODAL FOR HIGH-RESOLUTION PHOTO INSPECTION */}
            {activePhotoModal && (
              <div
                onClick={() => setActivePhotoModal(null)}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.85)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 9999,
                  padding: '24px'
                }}
              >
                <div
                  onClick={e => e.stopPropagation()}
                  style={{
                    maxWidth: '850px',
                    width: '100%',
                    background: 'var(--surface)',
                    border: '1px solid rgba(99,102,241,0.3)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.7)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid var(--border)', background: 'var(--surface2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Camera size={16} color="#818cf8" />
                      <span style={{ fontWeight: '700', fontSize: '13px' }}>Crime Scene Photographic Evidence — Case #{caseData.case_id}</span>
                    </div>
                    <button className="btn btn-ghost" onClick={() => setActivePhotoModal(null)} style={{ padding: '4px 8px', fontSize: '12px' }}>
                      <X size={16} /> Close
                    </button>
                  </div>
                  <div style={{ padding: '16px', background: '#05070d', display: 'flex', justifyContent: 'center', alignItems: 'center', maxHeight: '70vh', overflow: 'auto' }}>
                    <img
                      src={activePhotoModal}
                      alt="Full Resolution Evidence"
                      style={{ maxWidth: '100%', maxHeight: '65vh', objectFit: 'contain', borderRadius: '6px' }}
                    />
                  </div>
                  <div style={{ padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--sub)', borderTop: '1px solid var(--border)' }}>
                    <span>Official Evidence Attachment — Sealed in MongoDB Dossier</span>
                    <a href={activePhotoModal} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ fontSize: '11px', padding: '4px 10px' }}>
                      Open Original in New Tab
                    </a>
                  </div>
                </div>
              </div>
            )}


            {/* AI Suspect Prediction */}
            <div className="card" style={{ padding: '18px', borderColor: 'rgba(99,102,241,0.2)' }}>
              <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '12px' }}>AI Suspect Prediction & Biometric Profile</p>
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

              {/* CROSS-CASE PREVIOUS SUSPECT MATCHING ALERT */}
              {suspectMatches && suspectMatches.matched && (
                <div style={{ marginTop: '16px', padding: '16px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.35)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Target size={18} color="#f87171" />
                      <span style={{ fontWeight: '800', fontSize: '13px', color: '#f87171' }}>
                        🚨 PREVIOUS SUSPECT MATCH DETECTED ({suspectMatches.total_prior_records} PRIOR RECORD{suspectMatches.total_prior_records > 1 ? 'S' : ''})
                      </span>
                    </div>
                    <span className="badge badge-amber" style={{ fontSize: '10px' }}>
                      RECIDIVISM: {suspectMatches.recidivism_risk}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--sub)' }}>
                    Cross-case correlation engine matched "{s.name}" with prior criminal records across other jurisdiction sectors.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                    {suspectMatches.matches.map((m, idx) => (
                      <div key={idx} style={{ background: 'var(--surface2)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: '700', fontSize: '12px', color: 'var(--text)' }}>Prior Case #{m.case_id}: {m.case_title}</span>
                            <span className="badge badge-purple" style={{ fontSize: '10px' }}>{m.sector}</span>
                          </div>
                          <p style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
                            📍 {m.location} • Prior Confidence: {m.prior_confidence} • Motive: {m.motive}
                          </p>
                        </div>
                        <span style={{ fontSize: '11px', color: '#f43f5e', fontWeight: '700' }}>
                          {m.match_score} Match
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 🔍 SIMILAR CASE DETECTION & MODUS OPERANDI (MO) PATTERN ENGINE */}
            <div className="card" style={{ padding: '22px', borderColor: 'rgba(56,189,248,0.3)', background: 'linear-gradient(180deg, rgba(56,189,248,0.04) 0%, rgba(15,23,42,0.4) 100%)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(56,189,248,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Layers size={18} color="#38bdf8" />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <p style={{ fontWeight: '800', fontSize: '15px' }}>Similar Case Detection & Modus Operandi (MO) Pattern Matching</p>
                      <span className="badge badge-purple" style={{ fontSize: '10px' }}>
                        {similarCases?.similar_cases?.length || 0} Precedents Analyzed
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--sub)', marginTop: '2px' }}>
                      Automated forensic pattern engine comparing evidence artifacts, timeline tactics, and operational signatures against historical crimes.
                    </p>
                  </div>
                </div>
                <button className="btn btn-outline" onClick={fetchSimilar} style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <RefreshCw size={12} /> Re-analyze MO
                </button>
              </div>

              {loadingSimilar ? (
                <p style={{ padding: '24px', textAlign: 'center', color: 'var(--muted)', fontSize: '13px' }}>
                  Running forensic similarity correlation algorithm across database…
                </p>
              ) : (!similarCases?.similar_cases || similarCases.similar_cases.length === 0) ? (
                <div style={{ padding: '24px', textAlign: 'center', border: '1px dashed var(--border)', borderRadius: '8px' }}>
                  <p style={{ fontSize: '13px', color: 'var(--sub)' }}>No correlated precedent investigations detected.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {similarCases.similar_cases.slice(0, 3).map((sim, sIdx) => {
                    const pct = sim.similarity_percentage;
                    const meterColor = pct >= 75 ? '#ec4899' : (pct >= 55 ? '#38bdf8' : '#fbbf24');
                    return (
                      <div
                        key={sIdx}
                        style={{
                          background: 'var(--surface2)',
                          padding: '16px 18px',
                          borderRadius: '10px',
                          border: '1px solid rgba(255,255,255,0.08)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                          transition: 'all .15s'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <p style={{ fontWeight: '800', fontSize: '14px', color: 'var(--text)' }}>
                                Precedent #{sim.case_id}: {sim.title}
                              </p>
                              <span className="badge badge-purple" style={{ fontSize: '10px' }}>{sim.sector || 'City Jurisdiction'}</span>
                            </div>
                            <p style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '3px' }}>
                              📍 {sim.location} • Timestamp: {sim.timestamp} {sim.suspect_name ? `• Suspect: ${sim.suspect_name}` : ''}
                            </p>
                          </div>

                          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontWeight: '800', fontSize: '15px', color: meterColor }}>{pct}%</span>
                              <span style={{ fontSize: '10px', fontWeight: '700', color: meterColor, background: `${meterColor}22`, padding: '2px 6px', borderRadius: '4px', border: `1px solid ${meterColor}44` }}>
                                {sim.similarity_grade}
                              </span>
                            </div>
                            <div style={{ width: '130px', height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                              <div style={{ width: `${pct}%`, height: '100%', background: meterColor, borderRadius: '3px' }} />
                            </div>
                          </div>
                        </div>

                        {sim.matching_factors && sim.matching_factors.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '2px' }}>
                            {sim.matching_factors.map((factor, fIdx) => (
                              <span
                                key={fIdx}
                                style={{
                                  fontSize: '10px',
                                  color: 'var(--sub)',
                                  background: 'rgba(255,255,255,0.03)',
                                  border: '1px solid rgba(255,255,255,0.08)',
                                  padding: '3px 8px',
                                  borderRadius: '4px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                <Check size={10} color={meterColor} /> {factor}
                              </span>
                            ))}
                          </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                          <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                            <span style={{ fontSize: '10px', color: 'var(--muted)' }}>Signature Signature Tokens:</span>
                            {sim.shared_keywords?.map((kw, kIdx) => (
                              <span key={kIdx} style={{ fontSize: '10px', fontFamily: 'monospace', color: '#818cf8', background: 'rgba(99,102,241,0.1)', padding: '1px 5px', borderRadius: '3px' }}>
                                #{kw}
                              </span>
                            ))}
                          </div>

                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              className="btn btn-outline"
                              onClick={() => onSelectCase && onSelectCase(sim.case_id)}
                              style={{ fontSize: '11px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              <Eye size={12} /> Cross-Reference Dossier
                            </button>
                            <a
                              href={`http://localhost:8000/api/cases/${sim.case_id}/download-pdf`}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-ghost"
                              style={{ fontSize: '11px', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px', color: '#4ade80' }}
                              title="Download Precedent PDF Dossier"
                            >
                              <Download size={12} /> Precedent PDF
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 🎬 CORE FLAGSHIP OBJECTIVE: CRIME RECONSTRUCTION VIDEO */}
            <div className="card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(30,27,75,0.2) 100%)', border: '1px solid rgba(99,102,241,0.3)', boxShadow: '0 4px 20px rgba(99,102,241,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(99,102,241,0.4)' }}>
                  <Film size={24} color="#818cf8" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                    <p style={{ fontWeight: '800', fontSize: '15px', color: 'var(--text)' }}>AI-Assisted Visual Crime Scene Reconstruction Video</p>
                    <span className="badge badge-purple" style={{ fontSize: '10px' }}>Core Objective</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--sub)' }}>
                    {caseData.video_reconstruction
                      ? '5-Stage chronological visual simulation generated with dynamic speech narration & incident timeline.'
                      : 'Generate multi-stage visual simulation with dynamic audio narration showing blueprint, infiltration, actions & escape.'}
                  </p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <span style={{ fontSize: '10px', color: '#818cf8', background: 'rgba(99,102,241,0.12)', padding: '2px 6px', borderRadius: '4px' }}>Tactical Blueprint</span>
                    <span style={{ fontSize: '10px', color: '#38bdf8', background: 'rgba(56,189,248,0.12)', padding: '2px 6px', borderRadius: '4px' }}>Suspect Trajectory</span>
                    <span style={{ fontSize: '10px', color: '#4ade80', background: 'rgba(74,222,128,0.12)', padding: '2px 6px', borderRadius: '4px' }}>Incident Execution</span>
                    <span style={{ fontSize: '10px', color: '#fbbf24', background: 'rgba(251,191,36,0.12)', padding: '2px 6px', borderRadius: '4px' }}>Escape Tracking</span>
                    <span style={{ fontSize: '10px', color: '#f472b6', background: 'rgba(244,114,182,0.12)', padding: '2px 6px', borderRadius: '4px' }}>AI Speech Audio</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                {caseData.video_reconstruction ? (
                  <button className="btn btn-primary" onClick={onOpenVideo} style={{ boxShadow: '0 0 16px rgba(99,102,241,0.4)' }}>
                    <Film size={15} /> Play Reconstruction Video
                  </button>
                ) : (isInvestigator || isCommissioner) ? (
                  <button className="btn btn-primary" onClick={onOpenVideo}>
                    <Zap size={15} /> Generate Crime Video
                  </button>
                ) : (
                  <button className="btn btn-outline" onClick={onOpenVideo}>
                    <Film size={15} /> View Video Simulation
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {/* COMMISSIONER CLEARANCE & APPROVAL CONTROLS */}
        {isCommissioner && (
          <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px', borderColor: 'rgba(99,102,241,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: '800', fontSize: '15px' }}>Chief Commissioner Clearance & Delegation Control</p>
                <p style={{ fontSize: '12px', color: 'var(--sub)', marginTop: '2px' }}>
                  Grant or revoke investigator access to this case across authorized sectors.
                </p>
              </div>
              <button className={`btn ${isRestricted ? 'btn-primary' : 'btn-outline'}`} onClick={handleClearanceToggle}>
                {isRestricted ? <Unlock size={14} /> : <Lock size={14} />} {isRestricted ? 'Grant Investigator Clearance' : 'Revoke / Restrict Access'}
              </button>
            </div>

            <hr />

            {/* Final Case Closure Decision */}
            <div>
              <p style={{ fontWeight: '700', fontSize: '14px', marginBottom: '8px' }}>Final Closure Decision</p>
              <label>Commissioner Directive / Remarks</label>
              <textarea rows={3} value={comments} onChange={e => setComments(e.target.value)} placeholder="Enter approval directive or reason for rejection…" />
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button className="btn btn-danger" onClick={() => handleDecide('REJECTED')}>
                <XCircle size={14} /> Reject & Order Re-Investigation
              </button>
              <button className="btn btn-success" onClick={() => handleDecide('APPROVED')}>
                <CheckCircle size={14} /> Approve & Close Case File
              </button>
            </div>
          </div>
        )}

        {/* POLICE OFFICER & COMMISSIONER VERIFICATION */}
        {(role.type === 'OFFICER' || role.type === 'COMMISSIONER') && (
          <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontWeight: '700', fontSize: '14px' }}>
                {isCommissioner ? 'Forensic Findings Review & Executive Override' : 'Submit Forensic Verification Findings'}
              </p>
              {isCommissioner && (
                <span className="badge badge-purple" style={{ fontSize: '10px' }}>Chief Commissioner Authority</span>
              )}
            </div>
            <div>
              <label>Verification Notes</label>
              <textarea rows={4} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Describe forensic cross-checks, ballistic findings, alibi audit…" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <select value={status} onChange={e => setStatus(e.target.value)} style={{ width: 'auto' }}>
                <option value="Evidence Verified">✅ Evidence Verified</option>
                <option value="In Progress">🔄 In Progress</option>
              </select>
              <button className="btn btn-primary" onClick={handleVerify}>
                <CheckCircle size={14} /> {isCommissioner ? 'Save / Override Findings in MongoDB' : 'Submit Findings to MongoDB'}
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
  const s = caseData.suspect_prediction || {};
  const isRestricted = caseData.commissioner_clearance_status === 'RESTRICTED';

  return (
    <div className="page">
      <TopBar role={role} onBack={onBack} breadcrumbs={[role.label, 'Dashboard', `Case #${caseData.case_id}`, 'Reconstruction Video']} />
      <div style={{ flex: 1, maxWidth: '920px', width: '100%', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
              <p style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.5px' }}>Case #{caseData.case_id}</p>
              <span style={{ fontSize: '11px', background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                🔒 AES-256 Encrypted Dossier
              </span>
            </div>
            <h2 style={{ fontWeight: '800', fontSize: '20px' }}>AI-Assisted Visual Crime Reconstruction</h2>
            <p style={{ fontSize: '13px', color: 'var(--sub)', marginTop: '5px' }}>
              Chronological visual simulation showing incident location, suspect approach trajectory, crime execution sequence, escape corridor, and AI suspect dossier.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
            <button className="btn btn-primary" onClick={onRegenerate} disabled={generating || (role.type === 'INVESTIGATOR' && isRestricted)}>
              <Zap size={14} /> {generating ? 'Generating Video…' : 'Generate Reconstruction Video'}
            </button>
            {vid && (
              <a href={vid.video_url} download className="btn btn-ghost" style={{ textDecoration: 'none' }}>
                <Download size={14} /> Download MP4
              </a>
            )}
          </div>
        </div>

        {/* Legal & Investigative Disclaimer Banner */}
        <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#fbbf24', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={18} color="#fbbf24" style={{ flexShrink: 0 }} />
          <span>
            <strong>Investigative Disclaimer:</strong> AI-assisted reconstruction for investigation support. This visualization is not actual CCTV footage and does not establish guilt.
          </span>
        </div>

        {generating && (
          <div style={{ padding: '14px', borderRadius: '10px', background: 'var(--accent-bg)', border: '1px solid rgba(99,102,241,.2)', color: 'var(--accent)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={14} /> Synthesizing multi-stage forensic visual scenes, movement vectors, and audio narration… please wait.
          </div>
        )}

        {/* Video Player Display */}
        {vid ? (
          <div style={{ borderRadius: '12px', overflow: 'hidden', background: '#000', border: '1px solid var(--border)', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>
            <video src={vid.video_url} controls autoPlay style={{ width: '100%', maxHeight: '520px', display: 'block' }} />
          </div>
        ) : !generating && (
          <div style={{ border: '1px dashed var(--border)', borderRadius: '12px', padding: '60px', textAlign: 'center', color: 'var(--muted)' }}>
            <Film size={36} style={{ margin: '0 auto 12px', display: 'block', opacity: .3 }} />
            <p style={{ fontSize: '14px', fontWeight: '600' }}>No reconstruction video generated yet</p>
            <p style={{ fontSize: '12px', marginTop: '5px' }}>Click "Generate Reconstruction Video" above to create the full simulation.</p>
          </div>
        )}

        {/* Evidence vs AI-Inference Distinction Panel */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div className="card" style={{ padding: '18px', borderLeft: '3px solid var(--green)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <CheckCircle size={15} color="var(--green)" />
              <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '.5px' }}>Actual Evidence / Facts</p>
            </div>
            <ul style={{ paddingLeft: '18px', fontSize: '12px', color: 'var(--sub)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {caseData.evidence?.map((e, i) => (
                <li key={i}><span style={{ color: 'var(--text)', fontWeight: '600' }}>{e}</span></li>
              ))}
              <li><span style={{ color: 'var(--muted)' }}>Incident Time: {caseData.timestamp}</span></li>
              <li><span style={{ color: 'var(--muted)' }}>Location: {caseData.location}</span></li>
            </ul>
          </div>

          <div className="card" style={{ padding: '18px', borderLeft: '3px solid var(--accent)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Zap size={15} color="var(--accent)" />
              <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '.5px' }}>AI-Generated / Inferred Visualization</p>
            </div>
            <ul style={{ paddingLeft: '18px', fontSize: '12px', color: 'var(--sub)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><span>Spatial blueprint and zone boundary reconstruction</span></li>
              <li><span>Infiltration & entry trajectory vector approximation</span></li>
              <li><span>Chronological action sequence and escape corridor tracking</span></li>
              <li><span>Suspect prediction: <strong style={{ color: 'var(--accent)' }}>{s.name}</strong> ({s.confidence} confidence)</span></li>
            </ul>
          </div>
        </div>

        {/* Chronological Incident Timeline Recap */}
        <div className="card" style={{ padding: '18px' }}>
          <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '12px' }}>Incident Timeline & Scene Narration Script</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {caseData.timeline?.map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', fontSize: '13px' }}>
                <span style={{ color: 'var(--accent)', fontWeight: '700', flexShrink: 0 }}>Step {i + 1}:</span>
                <span style={{ color: 'var(--sub)' }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE 5 — ADD CASE
───────────────────────────────────────── */
const SAMPLE_CASES = [
  {
    title: 'Central Bank Armed Robbery',
    location: 'Downtown Financial District, Vault B',
    timestamp: '2026-10-04 02:45 AM',
    sector: 'SECTOR_1',
    images: ['/media/images/crime_scene_vault_1.png'],
    evidenceStr: 'CCTV Footage from Entrance, Fingerprints on Vault Lock, Recovered Getaway Vehicle',
    timelineStr: 'Suspect disabled rooftop security cameras at 02:40 AM.\nTwo masked individuals breached the secondary vault door at 02:45 AM.\nVault contents accessed and security guard was disarmed.\nSuspects fled through rear corridor into a black sedan.',
    suspect_name: 'Marcus Vance', suspect_alias: 'The Architect',
    confidence: '91.4%', motive: 'Financial Debt & High-Yield Asset Theft', risk_level: 'CRITICAL'
  },
  {
    title: 'Jewelry Store Diamond Heist',
    location: 'Central Plaza Mall, Shop 104',
    timestamp: '2026-10-05 03:15 AM',
    sector: 'SECTOR_1',
    images: ['/media/images/crime_scene_diamond_1.png'],
    evidenceStr: 'Cut Display Glass, Rooftop Glass Saw, Motorcycle Tire Marks on Parking Lot',
    timelineStr: 'Suspect entered through rooftop ventilation shaft.\nUsed diamond-tipped glass saw to cut display case.\nStole 12 uncut diamonds worth $2.4 million.\nEscaped on motorcycle through service alley.',
    suspect_name: 'Victor Krum', suspect_alias: 'The Shadow',
    confidence: '87.2%', motive: 'Black Market Diamond Trade', risk_level: 'HIGH'
  },
  {
    title: 'City Museum Cyber Heist',
    location: 'National History Museum, Server Room B2',
    timestamp: '2026-10-06 11:30 PM',
    sector: 'SECTOR_2',
    images: ['/media/images/crime_scene_server_1.png'],
    evidenceStr: 'Tampered Server Logs, USB Device Found, Disabled Fire Alarm Wiring',
    timelineStr: 'Suspect posed as night security contractor.\nPlugged USB exploit device into museum server.\nDownloaded auction records and donor financial data.\nExited through fire escape after disabling alarm.',
    suspect_name: 'Elena Zhao', suspect_alias: 'Ghost Wire',
    confidence: '93.7%', motive: 'Corporate Espionage & Data Ransom', risk_level: 'CRITICAL'
  },
  {
    title: 'Highway Armored Truck Ambush',
    location: 'Interstate 45, Mile Marker 112',
    timestamp: '2026-10-03 04:20 AM',
    sector: 'SECTOR_3',
    images: ['/media/images/crime_scene_vault_1.png'],
    evidenceStr: 'Spike Strip Fragments, Shell Casings (9mm), Abandoned Pickup Truck',
    timelineStr: 'Suspects deployed spike strips across highway at 04:15 AM.\nArmored truck tires burst and driver lost control.\nThree armed suspects approached and forced open rear doors.\nStole cash shipment of $800,000 and fled in pickup truck.',
    suspect_name: 'Ray Donovan', suspect_alias: 'The Roadrunner',
    confidence: '78.5%', motive: 'Organized Crime Syndicate Operation', risk_level: 'HIGH'
  },
  {
    title: 'Pharmaceutical Lab Break-In',
    location: 'MedTech Research Park, Building C, Lab 7',
    timestamp: '2026-10-07 01:00 AM',
    sector: 'SECTOR_4',
    images: ['/media/images/crime_scene_diamond_1.png'],
    evidenceStr: 'Broken Biometric Scanner, Chemical Residue on Gloves, Stolen Access Badge',
    timelineStr: 'Suspect cloned employee access badge using RFID scanner.\nBypassed biometric lock by tampering with sensor.\nStole 15 vials of experimental drug compound.\nLeft through loading dock in stolen delivery van.',
    suspect_name: 'Dr. Niles Harmon', suspect_alias: 'The Chemist',
    confidence: '89.1%', motive: 'Illegal Drug Manufacturing & Sale', risk_level: 'CRITICAL'
  },
  {
    title: 'Warehouse Arson & Insurance Fraud',
    location: 'Industrial Zone, Warehouse 14, Dock Street',
    timestamp: '2026-10-02 11:45 PM',
    sector: 'SECTOR_4',
    images: ['/media/images/crime_scene_server_1.png'],
    evidenceStr: 'Accelerant Traces (Gasoline), Burner Phone, Altered Insurance Documents',
    timelineStr: 'Suspect purchased 20 gallons of gasoline from nearby station.\nEntered warehouse using owner key at 11:30 PM.\nPoured accelerant across storage floor and ignited.\nFled scene and reported fire 20 minutes later for insurance claim.',
    suspect_name: 'Gerald Finch', suspect_alias: 'The Torchman',
    confidence: '95.3%', motive: 'Insurance Fraud - $3.2M Policy', risk_level: 'CRITICAL'
  }
];

/* ─────────────────────────────────────────
   JURISDICTION SECTORS
───────────────────────────────────────── */
const SECTORS = [
  {
    id: 'SECTOR_1',
    name: 'Sector 1 — North Zone',
    regionFrom: 'Northern Boundary (Ring Road)',
    regionTo: 'City Centre Overpass',
    officer: 'Sr. Inspector Arjun Mehta',
    color: '#38bdf8',
    icon: '🏙️'
  },
  {
    id: 'SECTOR_2',
    name: 'Sector 2 — East Zone',
    regionFrom: 'City Centre Overpass',
    regionTo: 'Eastern Industrial Corridor',
    officer: 'Sr. Inspector Priya Nair',
    color: '#4ade80',
    icon: '🏭'
  },
  {
    id: 'SECTOR_3',
    name: 'Sector 3 — South Zone',
    regionFrom: 'Southern Highway Junction',
    regionTo: 'Port & Dockyard Area',
    officer: 'Sr. Inspector Ramesh Pillai',
    color: '#fbbf24',
    icon: '🚢'
  },
  {
    id: 'SECTOR_4',
    name: 'Sector 4 — West Zone',
    regionFrom: 'Western Suburb Limits',
    regionTo: 'Airport Access Road',
    officer: 'Sr. Inspector Kavya Sharma',
    color: '#f472b6',
    icon: '✈️'
  },
  {
    id: 'SECTOR_5',
    name: 'Sector 5 — Central District',
    regionFrom: 'Financial District Core',
    regionTo: 'Government & Civic Zone',
    officer: 'Sr. Inspector Vikram Das',
    color: '#a78bfa',
    icon: '🏛️'
  },
];

let sampleCaseIndex = 0;

function AddCasePage({ role, onBack, onSubmit, submitting }) {
  const [step, setStep] = useState(1);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [suspectCheck, setSuspectCheck] = useState(null);
  const [form, setForm] = useState(() => {
    const sample = SAMPLE_CASES[sampleCaseIndex % SAMPLE_CASES.length];
    sampleCaseIndex++;
    return { ...sample, images: sample.images || [] };
  });
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  useEffect(() => {
    if (form.suspect_name && form.suspect_name.length > 2) {
      const timer = setTimeout(() => {
        fetch(`/api/suspects/match?name=${encodeURIComponent(form.suspect_name)}&alias=${encodeURIComponent(form.suspect_alias || '')}`)
          .then(r => r.json())
          .then(d => setSuspectCheck(d))
          .catch(() => {});
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSuspectCheck(null);
    }
  }, [form.suspect_name, form.suspect_alias]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const r = await fetch('http://localhost:8000/api/upload-image', { method: 'POST', body: formData });
      if (r.ok) {
        const data = await r.json();
        setForm(p => ({ ...p, images: [...(p.images || []), data.url] }));
      }
    } finally {
      setUploadingImage(false);
    }
  };

  const stepLabels = ['Jurisdiction & Sector', 'Incident Details', 'Evidence & Timeline', 'Suspect Profile'];

  return (
    <div className="page">
      <TopBar role={role} onBack={onBack} breadcrumbs={[role.label, 'Dashboard', 'New Case']} />

      <div style={{ flex: 1, maxWidth: '640px', width: '100%', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        <div>
          <h2 style={{ fontWeight: '800', fontSize: '20px', marginBottom: '18px' }}>Log New Criminal Investigation</h2>
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
                  {i < 3 && <div className={`step-line ${step > n ? 'done' : ''}`} style={{ margin: '0 6px', marginBottom: '18px' }} />}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* STEP 1 — JURISDICTION & SECTOR */}
          {step === 1 && (() => {
            const selectedSector = SECTORS.find(s => s.id === form.sector);
            return (
              <>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text)', marginBottom: '2px' }}>Assign Jurisdiction Sector</p>
                  <p style={{ fontSize: '12px', color: 'var(--sub)', marginBottom: '12px' }}>Select the geographic sector this case falls under. Each sector has a dedicated officer and region boundary.</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {SECTORS.map(sec => {
                    const isSelected = form.sector === sec.id;
                    return (
                      <div key={sec.id} onClick={() => f('sector', sec.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', borderRadius: '10px', border: `1px solid ${isSelected ? sec.color : 'var(--border)'}`, background: isSelected ? `rgba(${sec.color === '#38bdf8' ? '56,189,248' : sec.color === '#4ade80' ? '74,222,128' : sec.color === '#fbbf24' ? '251,191,36' : sec.color === '#f472b6' ? '244,114,182' : '167,139,250'},0.08)` : 'var(--surface2)', cursor: 'pointer', transition: 'all .15s' }}>
                        <div style={{ fontSize: '24px', flexShrink: 0 }}>{sec.icon}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <p style={{ fontWeight: '700', fontSize: '13px', color: isSelected ? sec.color : 'var(--text)' }}>{sec.name}</p>
                            {isSelected && <span style={{ fontSize: '10px', background: sec.color, color: '#000', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>SELECTED</span>}
                          </div>
                          <p style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '2px' }}>📍 <strong>From:</strong> {sec.regionFrom}</p>
                          <p style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '3px' }}>📍 <strong>To:</strong> {sec.regionTo}</p>
                          <p style={{ fontSize: '11px', color: 'var(--sub)' }}>👮 Assigned Officer: <strong style={{ color: isSelected ? sec.color : 'var(--text)' }}>{sec.officer}</strong></p>
                        </div>
                        {isSelected && <CheckCircle size={18} color={sec.color} style={{ flexShrink: 0 }} />}
                      </div>
                    );
                  })}
                </div>

                {selectedSector && (
                  <div style={{ padding: '12px 14px', borderRadius: '8px', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)', fontSize: '12px', color: 'var(--sub)' }}>
                    ✅ <strong style={{ color: 'var(--accent)' }}>{selectedSector.name}</strong> selected — Region: <em>{selectedSector.regionFrom}</em> → <em>{selectedSector.regionTo}</em>
                  </div>
                )}
              </>
            );
          })()}

          {/* STEP 2 — INCIDENT DETAILS */}
          {step === 2 && (
            <>
              <p style={{ fontSize: '13px', color: 'var(--sub)', marginBottom: '4px' }}>Enter the basic incident and jurisdiction details.</p>
              <div>
                <label>Case Title</label>
                <input value={form.title} onChange={e => f('title', e.target.value)} placeholder="e.g. Central Bank Armed Robbery" />
              </div>
              <div>
                <label>Crime Scene Location</label>
                <input value={form.location} onChange={e => f('location', e.target.value)} placeholder="e.g. Downtown Financial District, Vault B" />
              </div>
              <div>
                <label>Incident Date & Time</label>
                <input value={form.timestamp} onChange={e => f('timestamp', e.target.value)} placeholder="e.g. 2026-10-06 02:45 AM" />
              </div>
            </>
          )}

          {/* STEP 3 — EVIDENCE & TIMELINE */}
          {step === 3 && (
            <>
              <p style={{ fontSize: '13px', color: 'var(--sub)', marginBottom: '4px' }}>Log evidence and describe how the crime took place. The timeline drives the reconstruction video narration.</p>
              <div>
                <label>Evidence Items <span style={{ color: 'var(--muted)', fontWeight: '400' }}>(comma separated)</span></label>
                <input value={form.evidenceStr} onChange={e => f('evidenceStr', e.target.value)} placeholder="e.g. CCTV Footage, Fingerprints on vault, Getaway car" />
              </div>
              <div>
                <label>Crime Scene Photos</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <label className="btn btn-outline" style={{ cursor: 'pointer', padding: '8px 12px' }}>
                    {uploadingImage ? 'Uploading...' : 'Upload Image'}
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} disabled={uploadingImage} />
                  </label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {form.images && form.images.map((img, i) => (
                      <img key={i} src={'http://localhost:8000' + img} alt="Uploaded evidence" style={{ width: '36px', height: '36px', borderRadius: '4px', objectFit: 'cover', border: '1px solid var(--border)' }} />
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label>Crime Timeline Sequence <span style={{ color: 'var(--muted)', fontWeight: '400' }}>(one step per line)</span></label>
                <textarea rows={6} value={form.timelineStr} onChange={e => f('timelineStr', e.target.value)}
                  placeholder={"Suspect disabled security cameras.\nBypassed the vault lock using a stolen keycard.\nFled through the rear service corridor."} />
              </div>
            </>
          )}

          {/* STEP 4 — SUSPECT PROFILE */}
          {step === 4 && (
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

              {/* REAL-TIME PREVIOUS SUSPECT MATCHING ALERT */}
              {suspectCheck && suspectCheck.matched && (
                <div style={{ marginTop: '12px', padding: '12px 14px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.09)', border: '1px solid rgba(239, 68, 68, 0.35)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Target size={16} color="#f87171" />
                    <span style={{ fontWeight: '800', fontSize: '12px', color: '#f87171' }}>
                      ⚠️ PREVIOUS RECORD MATCH: Suspect linked to {suspectCheck.total_prior_records} prior investigation dossier(s)!
                    </span>
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--sub)' }}>
                    Matched prior record: <strong>Case #{suspectCheck.matches[0]?.case_id} ({suspectCheck.matches[0]?.case_title})</strong> in {suspectCheck.matches[0]?.sector}. Recidivism Assessment: <strong style={{ color: '#f43f5e' }}>{suspectCheck.recidivism_risk}</strong>.
                  </p>
                </div>
              )}
            </>
          )}

          <hr />

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {step > 1
              ? <button className="btn btn-ghost" onClick={() => setStep(s => s - 1)}><ArrowLeft size={14} /> Back</button>
              : <div />
            }
            {step < 4
              ? <button className="btn btn-primary" onClick={() => setStep(s => s + 1)} disabled={step === 1 && !form.sector}>Next <ArrowRight size={14} /></button>
              : <button className="btn btn-primary" onClick={() => onSubmit(form)} disabled={submitting}>
                  {submitting ? 'Encrypting & Generating…' : 'Save, Encrypt & Generate Video'}
                </button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   ROOT APP
───────────────────────────────────────── */
export default function App() {
  const [page, setPage]         = useState('login');
  const [role, setRole]         = useState(null);
  const [cases, setCases]       = useState([]);
  const [loadingCases, setLoadingCases] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [generating, setGenerating]     = useState(false);
  const [submitting, setSubmitting]     = useState(false);

  const loadCases = async (currentRole = role) => {
    if (!currentRole) return;
    setLoadingCases(true);
    try {
      const url = `/api/cases?role=${currentRole.type}&username=${currentRole.username}`;
      const r = await fetch(url);
      if (r.ok) setCases(await r.json());
    } finally { setLoadingCases(false); }
  };

  const loadCase = async (id) => {
    const r = await fetch(`/api/cases/${id}`);
    if (r.ok) setSelectedCase(await r.json());
  };

  const handleLogin = async (r) => {
    setRole(r);
    loadCases(r);
    setPage('dashboard');
    try {
      await fetch('/api/auth/log-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: r.username,
          role: r.type,
          role_label: r.label,
          tier: r.tier,
          action: 'LOGIN',
          ip_address: '192.168.1.42 (Forensic Terminal)',
          device: 'Mac Forensic Workstation'
        })
      });
    } catch (e) {
      console.error('Auth login logging failed:', e);
    }
  };

  const handleLogout = async () => {
    if (role) {
      try {
        await fetch('/api/auth/log-event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: role.username,
            role: role.type,
            role_label: role.label,
            tier: role.tier,
            action: 'LOGOUT',
            ip_address: '192.168.1.42 (Forensic Terminal)',
            device: 'Mac Forensic Workstation'
          })
        });
      } catch (e) {
        console.error('Auth logout logging failed:', e);
      }
    }
    setRole(null);
    setCases([]);
    setSelectedCase(null);
    setPage('login');
  };

  const handleSelectCase = async (id) => {
    await loadCase(id);
    setPage('detail');
  };

  const handleOpenVideo = () => setPage('video');

  const handleGenerateVideo = async () => {
    setGenerating(true);
    try {
      const r = await fetch(`/api/investigator/cases/${selectedCase.case_id}/generate-reconstruction-video?investigator_user=${role.username}&role=${role.type}`, { method: 'POST' });
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

  const handleToggleClearance = async (caseId, clearanceStatus) => {
    await fetch(`/api/commissioner/cases/${caseId}/grant-clearance`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commissioner_name: role.label, clearance_status: clearanceStatus })
    });
    await loadCase(caseId);
    loadCases();
  };

  const handleSubmitCase = async (form) => {
    setSubmitting(true);
    const payload = {
      ...form,
      assigned_investigator: role.type === 'COMMISSIONER' ? 'investigator' : role.username,
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

  if (page === 'login') return <LoginPage onLogin={handleLogin} />;

  if (page === 'dashboard') return (
    <DashboardPage
      role={role}
      cases={cases}
      loadingCases={loadingCases}
      onSelectCase={handleSelectCase}
      onAddCase={() => setPage('add')}
      onLogout={handleLogout}
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
      onToggleClearance={handleToggleClearance}
      onSelectCase={handleSelectCase}
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
