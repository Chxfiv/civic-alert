import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>

      {/* ── Left decorative panel ── */}
      <div style={s.left}>
        {/* blurred circles */}
        <div style={{ ...s.blob, width: 320, height: 320, top: -80, left: -80, background: 'rgba(139,92,246,0.35)' }} />
        <div style={{ ...s.blob, width: 240, height: 240, bottom: 40, right: -60, background: 'rgba(99,102,241,0.3)' }} />
        <div style={{ ...s.blob, width: 160, height: 160, top: '45%', left: '55%', background: 'rgba(167,139,250,0.2)' }} />

        <div style={s.leftInner}>
          <div style={s.brand}>
            <span style={s.brandEmoji}>🏙️</span>
            <span style={s.brandName}>CivicAlert</span>
          </div>

          <h1 style={s.leftHeading}>
            Report Issues.<br />
            <span style={s.leftAccent}>Track Progress.</span><br />
            Build Better Cities.
          </h1>
          <p style={s.leftDesc}>
            An AI-powered platform that connects citizens with authorities to resolve civic issues faster.
          </p>

          <div style={s.features}>
            {[
              ['🤖', 'AI auto-categorizes your complaint'],
              ['📍', 'Pin exact location on interactive map'],
              ['📊', 'Track real-time resolution status'],
              ['🔔', 'Get email alerts on every update'],
            ].map(([icon, text]) => (
              <div key={text} style={s.featureRow}>
                <div style={s.featureIconBox}>{icon}</div>
                <span style={s.featureText}>{text}</span>
              </div>
            ))}
          </div>

          <div style={s.statsRow}>
            {[['500+', 'Reports Filed'], ['92%', 'Resolved'], ['48h', 'Avg Response']].map(([v, l]) => (
              <div key={l} style={s.statBox}>
                <span style={s.statNum}>{v}</span>
                <span style={s.statLbl}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div style={s.right}>
        <div style={s.card}>

          <div style={s.cardTop}>
            <div style={s.waveEmoji}>👋</div>
            <h2 style={s.cardTitle}>Welcome back!</h2>
            <p style={s.cardSub}>Sign in to continue to CivicAlert</p>
          </div>

          {error && (
            <div style={s.errorAlert}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={s.field}>
              <label style={s.label}>Email Address</label>
              <div style={s.inputBox}>
                <span style={s.fieldIcon}>✉️</span>
                <input
                  style={s.input}
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div style={s.field}>
              <label style={s.label}>Password</label>
              <div style={s.inputBox}>
                <span style={s.fieldIcon}>🔒</span>
                <input
                  style={s.input}
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button type="button" style={s.eyeBtn} onClick={() => setShowPass(p => !p)}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button style={s.submitBtn} type="submit" disabled={loading}>
              {loading
                ? <span style={s.loadRow}><span style={s.spin} /> Signing in...</span>
                : '🚀  Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div style={s.dividerRow}>
            <div style={s.dividerLine} />
            <span style={s.dividerWord}>or try a demo</span>
            <div style={s.dividerLine} />
          </div>

          {/* Demo buttons */}
          <div style={s.demoRow}>
            <button style={s.demoBtn} onClick={() => setForm({ email: 'citizen@demo.com', password: 'demo123' })}>
              👤 Citizen Demo
            </button>
            <button style={s.demoBtnPurple} onClick={() => setForm({ email: 'admin@demo.com', password: 'demo123' })}>
              🛡️ Admin Demo
            </button>
          </div>

          <p style={s.footerText}>
            Don't have an account?{' '}
            <Link to="/register" style={s.footerLink}>Create one free →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: {
    display: 'flex', minHeight: '100vh', fontFamily: "'Inter', sans-serif",
  },

  /* Left */
  left: {
    flex: 1,
    background: 'linear-gradient(145deg,#0f0c29,#302b63,#24243e)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '48px 40px', position: 'relative', overflow: 'hidden',
  },
  blob: {
    position: 'absolute', borderRadius: '50%',
    filter: 'blur(60px)', pointerEvents: 'none',
  },
  leftInner: { position: 'relative', zIndex: 1, maxWidth: 420 },
  brand: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36 },
  brandEmoji: { fontSize: '2rem' },
  brandName: { fontSize: '1.4rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' },
  leftHeading: {
    fontSize: '2.2rem', fontWeight: 900, color: '#fff',
    lineHeight: 1.25, marginBottom: 16,
  },
  leftAccent: { color: '#a78bfa' },
  leftDesc: { color: '#a5b4fc', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 32 },
  features: { display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36 },
  featureRow: { display: 'flex', alignItems: 'center', gap: 12 },
  featureIconBox: {
    width: 38, height: 38, borderRadius: 10,
    background: 'rgba(255,255,255,0.1)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.1rem', flexShrink: 0,
    backdropFilter: 'blur(4px)',
    border: '1px solid rgba(255,255,255,0.12)',
  },
  featureText: { color: '#c7d2fe', fontSize: '0.875rem', fontWeight: 500 },
  statsRow: {
    display: 'flex', gap: 28,
    paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.12)',
  },
  statBox: { display: 'flex', flexDirection: 'column', gap: 2 },
  statNum: { fontSize: '1.6rem', fontWeight: 800, color: '#fff' },
  statLbl: { fontSize: '0.72rem', color: '#a5b4fc', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' },

  /* Right */
  right: {
    width: 500,
    background: '#f8fafc',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '40px 32px',
  },
  card: { width: '100%', maxWidth: 400 },
  cardTop: { textAlign: 'center', marginBottom: 28 },
  waveEmoji: { fontSize: '3rem', marginBottom: 10 },
  cardTitle: { fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', marginBottom: 6 },
  cardSub: { color: '#64748b', fontSize: '0.9rem' },

  errorAlert: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: '#fef2f2', border: '1px solid #fecaca',
    color: '#dc2626', padding: '10px 14px',
    borderRadius: 10, fontSize: '0.875rem', marginBottom: 18,
  },

  field: { marginBottom: 18 },
  label: { display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: 6 },
  inputBox: {
    display: 'flex', alignItems: 'center',
    background: '#fff', border: '1.5px solid #e2e8f0',
    borderRadius: 12, overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    transition: 'border-color 0.2s',
  },
  fieldIcon: { padding: '0 12px', fontSize: '1rem', flexShrink: 0 },
  input: {
    flex: 1, padding: '12px 4px', border: 'none', outline: 'none',
    fontSize: '0.95rem', background: 'transparent',
    color: '#1e293b', fontFamily: 'inherit',
  },
  eyeBtn: {
    padding: '0 12px', background: 'none', border: 'none',
    cursor: 'pointer', fontSize: '1rem',
  },

  submitBtn: {
    width: '100%', padding: '13px',
    background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
    color: '#fff', border: 'none', borderRadius: 12,
    fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(99,102,241,0.45)',
    transition: 'opacity 0.2s, transform 0.15s',
    fontFamily: 'inherit', marginTop: 4,
    letterSpacing: '0.02em',
  },
  loadRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 },
  spin: {
    width: 16, height: 16,
    border: '2px solid rgba(255,255,255,0.35)',
    borderTop: '2px solid #fff',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 0.7s linear infinite',
  },

  dividerRow: { display: 'flex', alignItems: 'center', gap: 10, margin: '22px 0 16px' },
  dividerLine: { flex: 1, height: 1, background: '#e2e8f0' },
  dividerWord: { fontSize: '0.78rem', color: '#94a3b8', whiteSpace: 'nowrap', fontWeight: 500 },

  demoRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 22 },
  demoBtn: {
    padding: '10px 8px', background: '#fff',
    border: '1.5px solid #e2e8f0', borderRadius: 10,
    fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
    color: '#374151', fontFamily: 'inherit',
    transition: 'border-color 0.2s, background 0.2s',
  },
  demoBtnPurple: {
    padding: '10px 8px', background: '#f5f3ff',
    border: '1.5px solid #ddd6fe', borderRadius: 10,
    fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
    color: '#4f46e5', fontFamily: 'inherit',
    transition: 'border-color 0.2s, background 0.2s',
  },

  footerText: { textAlign: 'center', fontSize: '0.875rem', color: '#64748b' },
  footerLink: { color: '#4f46e5', fontWeight: 700, textDecoration: 'none' },
};
