import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';

const COLORS = ['#f59e0b', '#6366f1', '#10b981', '#ef4444'];
const catIcons = { pothole: '🕳️', garbage: '🗑️', water_leakage: '💧', streetlight: '💡', other: '📌' };

/* ─── AI Insight Engine (client-side) ─────────────────────── */
function generateAIInsights(complaints) {
  if (!complaints.length) return null;

  const total = complaints.length;
  const resolved = complaints.filter(c => c.status === 'resolved').length;
  const pending = complaints.filter(c => c.status === 'pending').length;
  const inProgress = complaints.filter(c => c.status === 'in_progress').length;
  const critical = complaints.filter(c => c.priority === 'critical').length;
  const duplicates = complaints.filter(c => c.isDuplicate).length;

  const catCount = {};
  complaints.forEach(c => { catCount[c.category] = (catCount[c.category] || 0) + 1; });
  const topCategory = Object.entries(catCount).sort((a, b) => b[1] - a[1])[0];

  const resolutionRate = total ? ((resolved / total) * 100).toFixed(0) : 0;

  // Avg resolution time for resolved complaints
  const resolvedComplaints = complaints.filter(c => c.status === 'resolved' && c.statusHistory?.length > 1);
  let avgDays = null;
  if (resolvedComplaints.length) {
    const totalMs = resolvedComplaints.reduce((sum, c) => {
      const first = new Date(c.createdAt);
      const last = new Date(c.statusHistory[c.statusHistory.length - 1].changedAt);
      return sum + (last - first);
    }, 0);
    avgDays = Math.round(totalMs / resolvedComplaints.length / (1000 * 60 * 60 * 24));
  }

  const tips = [];
  if (pending > 2) tips.push({ icon: '⏳', text: `You have ${pending} pending complaints. Follow up with authorities if they've been pending over 7 days.` });
  if (critical > 0) tips.push({ icon: '🚨', text: `${critical} critical issue${critical > 1 ? 's' : ''} detected. These are prioritized for faster resolution.` });
  if (duplicates > 0) tips.push({ icon: '⚠️', text: `${duplicates} of your complaints were flagged as duplicates. They're linked to existing reports.` });
  if (resolutionRate >= 70) tips.push({ icon: '🎉', text: `Great news! ${resolutionRate}% of your complaints have been resolved. Keep reporting!` });
  if (topCategory) tips.push({ icon: catIcons[topCategory[0]], text: `Your most reported issue type is "${topCategory[0].replace('_', ' ')}" (${topCategory[1]} reports). This area may need more attention.` });

  return { total, resolved, pending, inProgress, critical, resolutionRate, avgDays, catCount, tips };
}

export default function CitizenDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiOpen, setAiOpen] = useState(true);

  useEffect(() => {
    api.get('/complaints', { params: { limit: 100 } }).then(({ data }) => {
      setComplaints(data.complaints);
    }).finally(() => setLoading(false));
  }, []);

  const insights = generateAIInsights(complaints);
  const recent = complaints.slice(0, 5);

  const catData = insights ? Object.entries(insights.catCount).map(([name, value]) => ({ name: name.replace('_', ' '), value })) : [];
  const statusData = insights ? [
    { name: 'Pending', value: insights.pending, color: '#f59e0b' },
    { name: 'In Progress', value: insights.inProgress, color: '#6366f1' },
    { name: 'Resolved', value: insights.resolved, color: '#10b981' },
  ].filter(d => d.value > 0) : [];

  if (loading) return (
    <div style={s.loadingPage}>
      <div style={s.spinner} />
      <p style={{ color: '#64748b', marginTop: '12px' }}>Loading your dashboard...</p>
    </div>
  );

  return (
    <div style={s.page}>
      <div style={s.container}>

        {/* Welcome Header */}
        <div style={s.welcomeBar}>
          <div style={s.welcomeLeft}>
            <div style={s.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
            <div>
              <h1 style={s.welcomeTitle}>Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
              <p style={s.welcomeSub}>Here's a summary of your civic activity</p>
            </div>
          </div>
          <Link to="/complaints/new" style={s.reportBtn}>+ Report New Issue</Link>
        </div>

        {/* Quick Stats */}
        {insights && (
          <div style={s.statsRow}>
            {[
              { label: 'Total Reported', value: insights.total, icon: '📋', bg: '#eff6ff', color: '#1d4ed8', link: '/complaints' },
              { label: 'Pending', value: insights.pending, icon: '⏳', bg: '#fffbeb', color: '#b45309', link: '/complaints?status=pending' },
              { label: 'In Progress', value: insights.inProgress, icon: '🔧', bg: '#f5f3ff', color: '#6d28d9', link: '/complaints?status=in_progress' },
              { label: 'Resolved', value: insights.resolved, icon: '✅', bg: '#f0fdf4', color: '#15803d', link: '/complaints?status=resolved' },
            ].map(card => (
              <div key={card.label} onClick={() => navigate(card.link)}
                style={{ ...s.statCard, background: card.bg, cursor: 'pointer' }}>
                <span style={s.statIcon}>{card.icon}</span>
                <span style={{ ...s.statVal, color: card.color }}>{card.value}</span>
                <span style={s.statLabel}>{card.label}</span>
              </div>
            ))}
          </div>
        )}

        <div style={s.grid}>
          {/* Left Column */}
          <div style={s.leftCol}>

            {/* AI Insights Panel */}
            <div style={s.aiPanel}>
              <div style={s.aiHeader} onClick={() => setAiOpen(o => !o)}>
                <div style={s.aiHeaderLeft}>
                  <span style={s.aiGlow}>🤖</span>
                  <div>
                    <h2 style={s.aiTitle}>AI Insights</h2>
                    <p style={s.aiSub}>Personalized analysis of your complaints</p>
                  </div>
                </div>
                <button style={s.aiToggle}>{aiOpen ? '▲' : '▼'}</button>
              </div>

              {aiOpen && insights && (
                <div style={s.aiBody}>
                  {/* Resolution Rate */}
                  <div style={s.aiMetricRow}>
                    <div style={s.aiMetric}>
                      <span style={s.aiMetricVal}>{insights.resolutionRate}%</span>
                      <span style={s.aiMetricLabel}>Resolution Rate</span>
                      <div style={s.progressTrack}>
                        <div style={{ ...s.progressFill, width: `${insights.resolutionRate}%` }} />
                      </div>
                    </div>
                    {insights.avgDays !== null && (
                      <div style={s.aiMetric}>
                        <span style={s.aiMetricVal}>{insights.avgDays}d</span>
                        <span style={s.aiMetricLabel}>Avg Resolution Time</span>
                      </div>
                    )}
                    <div style={s.aiMetric}>
                      <span style={s.aiMetricVal}>{insights.critical}</span>
                      <span style={s.aiMetricLabel}>Critical Issues</span>
                    </div>
                  </div>

                  {/* AI Tips */}
                  {insights.tips.length > 0 && (
                    <div style={s.tipsSection}>
                      <h4 style={s.tipsTitle}>💡 Smart Suggestions</h4>
                      {insights.tips.map((tip, i) => (
                        <div key={i} style={s.tipCard}>
                          <span style={s.tipIcon}>{tip.icon}</span>
                          <p style={s.tipText}>{tip.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Category breakdown */}
                  {catData.length > 0 && (
                    <div style={s.aiChartSection}>
                      <h4 style={s.tipsTitle}>📂 Your Issue Categories</h4>
                      <ResponsiveContainer width="100%" height={160}>
                        <BarChart data={catData} barSize={24}>
                          <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                          <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                          <Bar dataKey="value" fill="#6366f1" radius={[5, 5, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {/* Status donut */}
                  {statusData.length > 0 && (
                    <div style={s.aiChartSection}>
                      <h4 style={s.tipsTitle}>🎯 Status Breakdown</h4>
                      <div style={s.donutRow}>
                        <ResponsiveContainer width={140} height={140}>
                          <PieChart>
                            <Pie data={statusData} dataKey="value" cx="50%" cy="50%" outerRadius={60} innerRadius={35}>
                              {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '10px', border: 'none' }} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div style={s.donutLegend}>
                          {statusData.map(d => (
                            <div key={d.name} style={s.donutLegendItem}>
                              <span style={{ ...s.donutDot, background: d.color }} />
                              <span style={s.donutLabel}>{d.name}</span>
                              <span style={s.donutCount}>{d.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {!insights.total && (
                    <div style={s.aiEmpty}>
                      <p>No complaints yet. Submit your first complaint to get AI insights!</p>
                      <Link to="/complaints/new" style={s.aiEmptyBtn}>+ Report an Issue</Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div style={s.rightCol}>
            {/* Recent Complaints */}
            <div style={s.recentCard}>
              <div style={s.recentHeader}>
                <h2 style={s.recentTitle}>Recent Complaints</h2>
                <Link to="/complaints" style={s.viewAllLink}>View all →</Link>
              </div>

              {recent.length === 0 ? (
                <div style={s.emptyRecent}>
                  <span style={{ fontSize: '2.5rem' }}>📭</span>
                  <p style={{ color: '#64748b', marginTop: '8px' }}>No complaints yet</p>
                  <Link to="/complaints/new" style={s.emptyRecentBtn}>Report your first issue</Link>
                </div>
              ) : (
                recent.map(c => (
                  <div key={c._id} onClick={() => navigate(`/complaints/${c._id}`)} style={s.recentRow}>
                    <div style={s.recentIconWrap}>{catIcons[c.category] || '📌'}</div>
                    <div style={s.recentBody}>
                      <span style={s.recentItemTitle}>{c.title}</span>
                      <div style={s.recentMeta}>
                        <StatusBadge status={c.status} />
                        <PriorityBadge priority={c.priority} />
                      </div>
                      <span style={s.recentDate}>{new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <span style={s.recentArrow}>›</span>
                  </div>
                ))
              )}
            </div>

            {/* Quick Actions */}
            <div style={s.quickActions}>
              <h2 style={s.recentTitle}>Quick Actions</h2>
              <div style={s.actionGrid}>
                {[
                  { icon: '🕳️', label: 'Report Pothole', link: '/complaints/new', color: '#fef3c7' },
                  { icon: '🗑️', label: 'Report Garbage', link: '/complaints/new', color: '#dcfce7' },
                  { icon: '💧', label: 'Water Leakage', link: '/complaints/new', color: '#dbeafe' },
                  { icon: '💡', label: 'Streetlight', link: '/complaints/new', color: '#fae8ff' },
                ].map(a => (
                  <Link key={a.label} to={a.link} style={{ ...s.actionCard, background: a.color }}>
                    <span style={s.actionIcon}>{a.icon}</span>
                    <span style={s.actionLabel}>{a.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { background: '#f0f4f8', minHeight: 'calc(100vh - 64px)', padding: '28px 16px' },
  container: { maxWidth: '1100px', margin: '0 auto' },
  loadingPage: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' },
  spinner: { width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  welcomeBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' },
  welcomeLeft: { display: 'flex', alignItems: 'center', gap: '14px' },
  avatar: { width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 800, flexShrink: 0 },
  welcomeTitle: { fontSize: '1.4rem', fontWeight: 800, color: '#1e293b' },
  welcomeSub: { color: '#64748b', fontSize: '0.875rem', marginTop: '2px' },
  reportBtn: { background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', padding: '10px 22px', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', boxShadow: '0 2px 8px rgba(99,102,241,0.3)', whiteSpace: 'nowrap' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' },
  statCard: { borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', transition: 'transform 0.15s, box-shadow 0.15s', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  statIcon: { fontSize: '1.5rem' },
  statVal: { fontSize: '1.7rem', fontWeight: 800 },
  statLabel: { fontSize: '0.75rem', color: '#64748b', fontWeight: 500, textAlign: 'center' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px', alignItems: 'start' },
  leftCol: { display: 'flex', flexDirection: 'column', gap: '16px' },
  rightCol: { display: 'flex', flexDirection: 'column', gap: '16px' },
  aiPanel: { background: 'linear-gradient(135deg,#1e1b4b,#312e81)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(99,102,241,0.2)' },
  aiHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 22px', cursor: 'pointer' },
  aiHeaderLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  aiGlow: { fontSize: '2rem', filter: 'drop-shadow(0 0 8px rgba(165,180,252,0.8))' },
  aiTitle: { fontSize: '1.1rem', fontWeight: 800, color: '#fff' },
  aiSub: { fontSize: '0.8rem', color: '#a5b4fc', marginTop: '2px' },
  aiToggle: { background: 'rgba(255,255,255,0.1)', border: 'none', color: '#a5b4fc', width: '28px', height: '28px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem' },
  aiBody: { padding: '0 22px 22px' },
  aiMetricRow: { display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' },
  aiMetric: { flex: 1, minWidth: '80px', background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' },
  aiMetricVal: { fontSize: '1.5rem', fontWeight: 800, color: '#fff' },
  aiMetricLabel: { fontSize: '0.72rem', color: '#a5b4fc', fontWeight: 500 },
  progressTrack: { height: '4px', background: 'rgba(255,255,255,0.15)', borderRadius: '2px', marginTop: '6px', overflow: 'hidden' },
  progressFill: { height: '100%', background: 'linear-gradient(90deg,#a5b4fc,#818cf8)', borderRadius: '2px', transition: 'width 0.6s ease' },
  tipsSection: { marginBottom: '16px' },
  tipsTitle: { fontSize: '0.8rem', fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' },
  tipCard: { display: 'flex', gap: '10px', alignItems: 'flex-start', background: 'rgba(255,255,255,0.07)', borderRadius: '10px', padding: '10px 12px', marginBottom: '8px' },
  tipIcon: { fontSize: '1.1rem', flexShrink: 0, marginTop: '1px' },
  tipText: { fontSize: '0.82rem', color: '#c7d2fe', lineHeight: 1.5 },
  aiChartSection: { marginBottom: '16px' },
  donutRow: { display: 'flex', alignItems: 'center', gap: '16px' },
  donutLegend: { display: 'flex', flexDirection: 'column', gap: '8px' },
  donutLegendItem: { display: 'flex', alignItems: 'center', gap: '8px' },
  donutDot: { width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0 },
  donutLabel: { fontSize: '0.82rem', color: '#c7d2fe', flex: 1 },
  donutCount: { fontSize: '0.82rem', color: '#fff', fontWeight: 700 },
  aiEmpty: { textAlign: 'center', padding: '20px', color: '#a5b4fc', fontSize: '0.875rem' },
  aiEmptyBtn: { display: 'inline-block', marginTop: '10px', background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '8px 18px', borderRadius: '10px', fontWeight: 600, fontSize: '0.85rem' },
  recentCard: { background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  recentHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  recentTitle: { fontSize: '1rem', fontWeight: 700, color: '#1e293b' },
  viewAllLink: { fontSize: '0.82rem', color: '#6366f1', fontWeight: 600 },
  recentRow: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.15s' },
  recentIconWrap: { width: '38px', height: '38px', borderRadius: '10px', background: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 },
  recentBody: { flex: 1, minWidth: 0 },
  recentItemTitle: { display: 'block', fontWeight: 600, fontSize: '0.875rem', color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '4px' },
  recentMeta: { display: 'flex', gap: '6px', marginBottom: '3px' },
  recentDate: { fontSize: '0.75rem', color: '#94a3b8' },
  recentArrow: { color: '#cbd5e1', fontSize: '1.3rem', flexShrink: 0 },
  emptyRecent: { textAlign: 'center', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' },
  emptyRecentBtn: { background: '#f5f3ff', color: '#4f46e5', padding: '8px 16px', borderRadius: '10px', fontWeight: 600, fontSize: '0.85rem', marginTop: '4px' },
  quickActions: { background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  actionGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '14px' },
  actionCard: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '16px 10px', borderRadius: '12px', textDecoration: 'none', transition: 'transform 0.15s' },
  actionIcon: { fontSize: '1.6rem' },
  actionLabel: { fontSize: '0.78rem', fontWeight: 600, color: '#374151', textAlign: 'center' },
};
