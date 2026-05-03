import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'citizen' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await register(form);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>

      {/* ── Left panel ── */}
      <div style={s.left}>
        <div style={{ ...s.blob, width: 300, height: 300, top: -60, left: -60, background: 'rgba(139,92,246,0.35)' }} />
        <div style={{ ...s.blob, width: 220, height: 220, bottom: 60, right: -40, background: 'rgba(99,102,241,0.3)' }} />
        <div style={{ ...s.blob, width: 150, height: 150, top: '50%', left: '50%', background: 'rgba(167,139,250,0.2)' }} />

        <div style={s.leftInner}>
          <div style={s.brand}>
            <span style={s.brandEmoji}>🏙️</span>
            <span style={s.brandName}>CivicAlert</span>
          </div>

          <h1 style={s.leftHeading}>
            Your voice<br />
            <span style={s.leftAccent}>shapes the city.</span>
          </h1>
          <p style={s.leftDesc}>
            Create your free account and start reporting civic issues in your area. Our AI handles the rest.
          </p>

          <div style={s.steps}>
            {[
              { num: '01', title: 'Create Account', desc: 'Register in under 60 seconds' },
              { num: '02', title: 'Report an Issue', desc: 'Describe, photo & pin location' },
              { num: '03', title: 'Track & Resolve', desc: 'Get notified when it\'s fixed' },
            ].map(step => (
              <div key={step.num} style={s.stepRow}>
                <div style={s.stepNum}>{step.num}</div>
                <div>
                  <div style={s.stepTitle}>{step.title}</div>
                  <div style={s.stepDesc}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={s.trustRow}>
            <span style={s.trustBadge}>🔒 Secure & Private</span>
            <span style={s.trustBadge}>✅ Free Forever</span>
            <span style={s.trustBadge}>🤖 AI Powered</span>
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div style={s.right}>
        <div style={s.card}>

          <div style={s.cardTop}>
            <div style={s.topEmoji}>🎉</div>
            <h2 style={s.cardTitle}>Create your account</h2>
            <p style={s.cardSub}>Join CivicAlert and help improve your city</p>
          </div>

          {error && (
            <div style={s.errorAlert}>
              <span>⚠️</span><span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Name + Phone row */}
            <div style={s.twoCol}>
              <div style={s.field}>
                <label style={s.label}>Full Name</label>
                <div style={s.inputBox}>
                  <span style={s.fieldIcon}>👤</span>
                  <input style={s.input} placeholder="John Doe" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
              </div>
              <div style={s.field}>
                <label style={s.label}>Phone <span style={s.optional}>(optional)</span></label>
                <div style={s.inputBox}>
                  <span style={s.fieldIcon}>📱</span>
                  <input style={s.input} placeholder="+91 98765 43210" value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
            </div>

            {/* Email */}
            <div style={s.field}>
              <label style={s.label}>Email Address</label>
              <div style={s.inputBox}>
                <span style={s.fieldIcon}>✉️</span>
                <input style={s.input} type="email" placeholder="you@example.com" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>

            {/* Password */}
            <div style={s.field}>
              <label style={s.label}>Password</label>
              <div style={s.inputBox}>
                <span style={s.fieldIcon}>🔒</span>
                <input style={s.input} type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                <button type="button" style={s.eyeBtn} onClick={() => setShowPass(p => !p)}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Role selector */}
            <div style={s.field}>
              <label style={s.label}>I am registering as</label>
              <div style={s.roleGrid}>
                {[
                  { val: 'citizen', icon: '👤', title: 'Citizen', desc: 'Report & track issues' },
                  { val: 'admin', icon: '🛡️', title: 'Admin', desc: 'Manage & resolve issues' },
                ].map(r => (
                  <div key={r.val} onClick={() => setForm({ ...form, role: r.val })}
                    style={{ ...s.roleCard, ...(form.role === r.val ? s.roleCardActive : {}) }}>
                    <span style={s.roleIcon}>{r.icon}</span>
                    <span style={s.roleTitle}>{r.title}</span>
                    <span style={s.roleDesc}>{r.desc}</span>
                    {form.role === r.val && <span style={s.roleCheck}>✓</span>}
                  </div>
                ))}
              </div>
            </div>

            <button style={s.submitBtn} type="submit" disabled={loading}>
              {loading
                ? <span style={s.loadRow}><span style={s.spin} /> Creating account...</span>
                : '🚀  Create Account'}
            </button>
          </form>

          <p style={s.footerText}>
            Already have an account?{' '}
            <Link to="/login" style={s.footerLink}>Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { display: 'flex', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },

  left: {
    flex: 1,
    background: 'linear-gradient(145deg,#0f0c29,#302b63,#24243e)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '48px 40px', position: 'relative', overflow: 'hidden',
  },
  blob: { position: 'absolute', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' },
  leftInner: { position: 'relative', zIndex: 1, maxWidth: 400 },
  brand: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36 },
  brandEmoji: { fontSize: '2rem' },
  brandName: { fontSize: '1.4rem', fontWeight: 800, color: '#fff' },
  leftHeading: { fontSize: '2.2rem', fontWeight: 900, color: '#fff', lineHeight: 1.25, marginBottom: 16 },
  leftAccent: { color: '#a78bfa' },
  leftDesc: { color: '#a5b4fc', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 36 },

  steps: { display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 36 },
  stepRow: { display: 'flex', alignItems: 'flex-start', gap: 14 },
  stepNum: {
    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
    background: 'rgba(167,139,250,0.2)', border: '1px solid rgba(167,139,250,0.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.75rem', fontWeight: 800, color: '#a78bfa',
  },
  stepTitle: { fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: 2 },
  stepDesc: { fontSize: '0.8rem', color: '#a5b4fc' },

  trustRow: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  trustBadge: {
    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
    color: '#c7d2fe', padding: '5px 12px', borderRadius: 20,
    fontSize: '0.75rem', fontWeight: 600,
  },

  right: {
    width: 520, background: '#f8fafc',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '32px',
  },
  card: { width: '100%', maxWidth: 440 },
  cardTop: { textAlign: 'center', marginBottom: 24 },
  topEmoji: { fontSize: '2.8rem', marginBottom: 10 },
  cardTitle: { fontSize: '1.6rem', fontWeight: 800, color: '#1e293b', marginBottom: 6 },
  cardSub: { color: '#64748b', fontSize: '0.875rem' },

  errorAlert: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: '#fef2f2', border: '1px solid #fecaca',
    color: '#dc2626', padding: '10px 14px',
    borderRadius: 10, fontSize: '0.875rem', marginBottom: 16,
  },

  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  field: { marginBottom: 14 },
  label: { display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: 5 },
  optional: { fontWeight: 400, color: '#94a3b8' },
  inputBox: {
    display: 'flex', alignItems: 'center',
    background: '#fff', border: '1.5px solid #e2e8f0',
    borderRadius: 11, overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  },
  fieldIcon: { padding: '0 10px', fontSize: '0.95rem', flexShrink: 0 },
  input: {
    flex: 1, padding: '11px 4px', border: 'none', outline: 'none',
    fontSize: '0.9rem', background: 'transparent',
    color: '#1e293b', fontFamily: 'inherit',
  },
  eyeBtn: { padding: '0 10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.95rem' },

  roleGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
  roleCard: {
    border: '1.5px solid #e2e8f0', borderRadius: 12, padding: '14px 12px',
    cursor: 'pointer', display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: 4, background: '#fff',
    transition: 'all 0.2s', position: 'relative',
  },
  roleCardActive: { border: '1.5px solid #6366f1', background: '#f5f3ff', boxShadow: '0 0 0 3px rgba(99,102,241,0.1)' },
  roleIcon: { fontSize: '1.6rem', marginBottom: 2 },
  roleTitle: { fontSize: '0.875rem', fontWeight: 700, color: '#1e293b' },
  roleDesc: { fontSize: '0.72rem', color: '#64748b', textAlign: 'center' },
  roleCheck: {
    position: 'absolute', top: 8, right: 8,
    width: 18, height: 18, borderRadius: '50%',
    background: '#6366f1', color: '#fff',
    fontSize: '0.65rem', fontWeight: 800,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },

  submitBtn: {
    width: '100%', padding: '13px',
    background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
    color: '#fff', border: 'none', borderRadius: 12,
    fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
    fontFamily: 'inherit', marginTop: 6,
    letterSpacing: '0.02em',
  },
  loadRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 },
  spin: {
    width: 16, height: 16,
    border: '2px solid rgba(255,255,255,0.35)',
    borderTop: '2px solid #fff',
    borderRadius: '50%', display: 'inline-block',
    animation: 'spin 0.7s linear infinite',
  },

  footerText: { textAlign: 'center', marginTop: 18, fontSize: '0.875rem', color: '#64748b' },
  footerLink: { color: '#4f46e5', fontWeight: 700, textDecoration: 'none' },
};
