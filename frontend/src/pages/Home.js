import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: '🤖', title: 'AI-Powered', desc: 'Auto-categorizes and prioritizes complaints using NLP', color: '#f5f3ff', border: '#ddd6fe' },
  { icon: '📍', title: 'Map Location', desc: 'Pin exact issue location on an interactive map', color: '#eff6ff', border: '#bfdbfe' },
  { icon: '📊', title: 'Live Analytics', desc: 'Track trends, resolution rates and area-wise data', color: '#f0fdf4', border: '#bbf7d0' },
  { icon: '🔔', title: 'Notifications', desc: 'Get email alerts on every complaint status update', color: '#fff7ed', border: '#fed7aa' },
];

const steps = [
  { num: '1', title: 'Register', desc: 'Create your free citizen account in seconds' },
  { num: '2', title: 'Report', desc: 'Describe the issue, upload a photo and pin location' },
  { num: '3', title: 'Track', desc: 'Follow real-time status updates on your complaint' },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div style={s.page}>
      {/* Hero */}
      <div style={s.hero}>
        <div style={s.heroInner}>
          <div style={s.badge}>🚀 AI-Powered Civic Platform</div>
          <h1 style={s.heroTitle}>Report Civic Issues,<br /><span style={s.heroAccent}>Get Them Resolved</span></h1>
          <p style={s.heroSub}>
            Potholes, garbage overflow, water leakage, broken streetlights — report any civic issue
            and track it until it's fixed. Our AI handles categorization and prioritization automatically.
          </p>
          <div style={s.heroActions}>
            {user ? (
              <>
                <Link to="/complaints/new" className="btn btn-primary" style={s.heroPrimary}>+ Report an Issue</Link>
                <Link to="/complaints" className="btn btn-secondary" style={s.heroSecondary}>View My Complaints</Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary" style={s.heroPrimary}>Get Started Free</Link>
                <Link to="/login" className="btn btn-secondary" style={s.heroSecondary}>Sign In</Link>
              </>
            )}
          </div>
        </div>
        <div style={s.heroVisual}>
          <div style={s.mockCard}>
            <div style={s.mockHeader}>
              <span style={{ ...s.mockDot, background: '#ef4444' }} />
              <span style={{ ...s.mockDot, background: '#f59e0b' }} />
              <span style={{ ...s.mockDot, background: '#10b981' }} />
            </div>
            {[
              { icon: '🕳️', title: 'Large pothole on MG Road', status: 'critical', color: '#7c3aed' },
              { icon: '🗑️', title: 'Garbage overflow near park', status: 'high', color: '#ef4444' },
              { icon: '💡', title: 'Streetlight not working', status: 'resolved', color: '#10b981' },
            ].map((item, i) => (
              <div key={i} style={s.mockItem}>
                <span style={s.mockItemIcon}>{item.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={s.mockItemTitle}>{item.title}</div>
                  <div style={{ ...s.mockItemBadge, background: item.color }}>{item.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={s.content}>
        {/* Stats */}
        <div style={s.statsRow}>
          {[['500+', 'Issues Reported'], ['92%', 'Resolution Rate'], ['48h', 'Avg Response Time'], ['4', 'Issue Categories']].map(([val, label]) => (
            <div key={label} style={s.statCard}>
              <div style={s.statVal}>{val}</div>
              <div style={s.statLabel}>{label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <h2 style={s.sectionTitle}>Why CivicAlert?</h2>
        <div style={s.featuresGrid}>
          {features.map(f => (
            <div key={f.title} style={{ ...s.featureCard, background: f.color, border: `1px solid ${f.border}` }}>
              <div style={s.featureIcon}>{f.icon}</div>
              <h3 style={s.featureTitle}>{f.title}</h3>
              <p style={s.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <h2 style={s.sectionTitle}>How It Works</h2>
        <div style={s.stepsRow}>
          {steps.map((step, i) => (
            <div key={i} style={s.stepCard}>
              <div style={s.stepNum}>{step.num}</div>
              <h3 style={s.stepTitle}>{step.title}</h3>
              <p style={s.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        {!user && (
          <div style={s.cta}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '8px' }}>Ready to make your city better?</h2>
            <p style={{ color: '#94a3b8', marginBottom: '24px' }}>Join thousands of citizens already using CivicAlert</p>
            <Link to="/register" className="btn btn-primary" style={{ padding: '13px 32px', fontSize: '1rem' }}>Create Free Account</Link>
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { background: '#f0f4f8' },
  hero: { background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)', padding: '60px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' },
  heroInner: { maxWidth: '520px', color: '#fff' },
  badge: { display: 'inline-block', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '20px', border: '1px solid rgba(255,255,255,0.2)' },
  heroTitle: { fontSize: '2.6rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '16px' },
  heroAccent: { color: '#a5b4fc' },
  heroSub: { fontSize: '1.05rem', color: '#c7d2fe', lineHeight: 1.7, marginBottom: '32px' },
  heroActions: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  heroPrimary: { background: '#fff', color: '#4f46e5', padding: '13px 28px', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' },
  heroSecondary: { background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '13px 28px', borderRadius: '12px', fontWeight: 600, fontSize: '1rem', border: '1.5px solid rgba(255,255,255,0.3)' },
  heroVisual: { flexShrink: 0 },
  mockCard: { background: '#fff', borderRadius: '16px', padding: '16px', width: '280px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' },
  mockHeader: { display: 'flex', gap: '6px', marginBottom: '16px' },
  mockDot: { width: '10px', height: '10px', borderRadius: '50%' },
  mockItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '10px', background: '#f8fafc', marginBottom: '8px' },
  mockItemIcon: { fontSize: '1.3rem' },
  mockItemTitle: { fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', marginBottom: '4px' },
  mockItemBadge: { display: 'inline-block', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', textTransform: 'uppercase' },
  content: { maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '56px' },
  statCard: { background: '#fff', borderRadius: '16px', padding: '24px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  statVal: { fontSize: '2rem', fontWeight: 800, color: '#4f46e5', marginBottom: '4px' },
  statLabel: { fontSize: '0.875rem', color: '#64748b', fontWeight: 500 },
  sectionTitle: { fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginBottom: '24px', textAlign: 'center' },
  featuresGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '56px' },
  featureCard: { borderRadius: '16px', padding: '24px' },
  featureIcon: { fontSize: '2rem', marginBottom: '12px' },
  featureTitle: { fontSize: '1rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' },
  featureDesc: { fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6 },
  stepsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '56px' },
  stepCard: { background: '#fff', borderRadius: '16px', padding: '28px 24px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  stepNum: { width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' },
  stepTitle: { fontSize: '1rem', fontWeight: 700, marginBottom: '8px' },
  stepDesc: { fontSize: '0.875rem', color: '#64748b' },
  cta: { background: 'linear-gradient(135deg,#1e1b4b,#4338ca)', borderRadius: '20px', padding: '48px', textAlign: 'center', color: '#fff' },
};
