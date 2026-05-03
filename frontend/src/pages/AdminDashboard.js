import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer, AreaChart, Area } from 'recharts';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#7c3aed'];
const catIcons = { pothole: '🕳️', garbage: '🗑️', water_leakage: '💧', streetlight: '💡', other: '📌' };

/* ─── Sidebar ─────────────────────────────────────────────── */
function Sidebar({ analytics }) {
  const loc = useLocation();
  const active = (path) => loc.pathname === path;

  const navItems = [
    { path: '/admin', icon: '📊', label: 'Overview' },
    { path: '/admin/complaints', icon: '📋', label: 'All Complaints' },
    { path: '/admin/complaints?status=pending', icon: '⏳', label: 'Pending', count: analytics?.statusStats?.find(s => s._id === 'pending')?.count },
    { path: '/admin/complaints?status=in_progress', icon: '🔧', label: 'In Progress', count: analytics?.statusStats?.find(s => s._id === 'in_progress')?.count },
    { path: '/admin/complaints?status=resolved', icon: '✅', label: 'Resolved', count: analytics?.statusStats?.find(s => s._id === 'resolved')?.count },
    { path: '/admin/complaints?priority=critical', icon: '🚨', label: 'Critical', count: analytics?.priorityStats?.find(s => s._id === 'critical')?.count },
  ];

  return (
    <aside style={s.sidebar}>
      <div style={s.sidebarTitle}>Admin Panel</div>
      <nav>
        {navItems.map(item => (
          <Link key={item.path} to={item.path}
            style={{ ...s.navItem, ...(active(item.path.split('?')[0]) && !item.path.includes('?') ? s.navActive : (loc.search && item.path.includes(loc.search) ? s.navActive : {})) }}>
            <span style={s.navIcon}>{item.icon}</span>
            <span style={s.navLabel}>{item.label}</span>
            {item.count !== undefined && <span style={s.navBadge}>{item.count}</span>}
          </Link>
        ))}
      </nav>
      <div style={s.sidebarDivider} />
      <Link to="/" style={s.navItem}><span style={s.navIcon}>🏠</span><span style={s.navLabel}>Back to Site</span></Link>
    </aside>
  );
}

/* ─── Overview Page ───────────────────────────────────────── */
function Overview({ analytics }) {
  const navigate = useNavigate();
  if (!analytics) return <div style={s.loading}>Loading analytics...</div>;

  const statCards = [
    { label: 'Total Complaints', value: analytics.total, icon: '📋', bg: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8', filter: '/admin/complaints' },
    { label: 'Resolution Rate', value: `${analytics.resolutionRate}%`, icon: '✅', bg: '#f0fdf4', border: '#bbf7d0', color: '#15803d', filter: null },
    { label: 'Pending', value: analytics.statusStats.find(s => s._id === 'pending')?.count || 0, icon: '⏳', bg: '#fffbeb', border: '#fde68a', color: '#b45309', filter: '/admin/complaints?status=pending' },
    { label: 'In Progress', value: analytics.statusStats.find(s => s._id === 'in_progress')?.count || 0, icon: '🔧', bg: '#f5f3ff', border: '#ddd6fe', color: '#6d28d9', filter: '/admin/complaints?status=in_progress' },
    { label: 'Resolved', value: analytics.statusStats.find(s => s._id === 'resolved')?.count || 0, icon: '🎉', bg: '#f0fdf4', border: '#bbf7d0', color: '#15803d', filter: '/admin/complaints?status=resolved' },
    { label: 'Critical Issues', value: analytics.priorityStats.find(s => s._id === 'critical')?.count || 0, icon: '🚨', bg: '#faf5ff', border: '#ddd6fe', color: '#7c3aed', filter: '/admin/complaints?priority=critical' },
  ];

  return (
    <div>
      <div style={s.pageHeader}>
        <h1 style={s.pageTitle}>Dashboard Overview</h1>
        <p style={s.pageSub}>Click any card to view filtered complaints</p>
      </div>

      {/* Stat Cards */}
      <div style={s.statsGrid}>
        {statCards.map(card => (
          <div key={card.label}
            onClick={() => card.filter && navigate(card.filter)}
            style={{ ...s.statCard, background: card.bg, border: `1.5px solid ${card.border}`, cursor: card.filter ? 'pointer' : 'default' }}>
            <div style={s.statTop}>
              <span style={s.statIcon}>{card.icon}</span>
              {card.filter && <span style={s.statArrow}>→</span>}
            </div>
            <div style={{ ...s.statVal, color: card.color }}>{card.value}</div>
            <div style={s.statLabel}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={s.chartsGrid}>
        <div style={s.chartCard}>
          <div style={s.chartHeader}>
            <h3 style={s.chartTitle}>📂 By Category</h3>
            <Link to="/admin/complaints" style={s.chartLink}>View all →</Link>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analytics.categoryStats.map(s => ({ name: s._id?.replace('_', ' '), count: s.count }))} barSize={28}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#f5f3ff' }} contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={s.chartCard}>
          <div style={s.chartHeader}>
            <h3 style={s.chartTitle}>🎯 Priority Split</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={analytics.priorityStats.map(s => ({ name: s._id, value: s.count }))}
                dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} innerRadius={38}>
                {analytics.priorityStats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={s.legend}>
            {analytics.priorityStats.map((item, i) => (
              <div key={item._id} style={s.legendItem}>
                <span style={{ ...s.legendDot, background: COLORS[i % COLORS.length] }} />
                <span style={s.legendText}>{item._id} ({item.count})</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...s.chartCard, gridColumn: '1 / -1' }}>
          <div style={s.chartHeader}>
            <h3 style={s.chartTitle}>📈 Complaints Trend — Last 30 Days</h3>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={analytics.recentTrend.map(t => ({ date: t._id?.slice(5), count: t.count }))}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2.5} fill="url(#grad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent complaints quick view */}
      <RecentComplaints />
    </div>
  );
}

/* ─── Recent Complaints (overview widget) ─────────────────── */
function RecentComplaints() {
  const [recent, setRecent] = useState([]);
  useEffect(() => {
    api.get('/complaints', { params: { limit: 5 } }).then(({ data }) => setRecent(data.complaints));
  }, []);

  return (
    <div style={s.chartCard}>
      <div style={s.chartHeader}>
        <h3 style={s.chartTitle}>🕐 Recent Complaints</h3>
        <Link to="/admin/complaints" style={s.chartLink}>View all →</Link>
      </div>
      {recent.map(c => (
        <Link to={`/complaints/${c._id}`} key={c._id} style={s.recentRow}>
          <span style={s.recentIcon}>{catIcons[c.category] || '📌'}</span>
          <div style={s.recentBody}>
            <span style={s.recentTitle}>{c.title}</span>
            <span style={s.recentMeta}>{c.citizen?.name} · {new Date(c.createdAt).toLocaleDateString('en-IN')}</span>
          </div>
          <div style={s.recentBadges}>
            <StatusBadge status={c.status} />
            <PriorityBadge priority={c.priority} />
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ─── Complaints Management Page ──────────────────────────── */
function ComplaintsManage() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const [filters, setFilters] = useState({
    status: params.get('status') || '',
    category: params.get('category') || '',
    priority: params.get('priority') || '',
    page: 1
  });
  const [complaints, setComplaints] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const p = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    api.get('/complaints', { params: { ...p, limit: 15 } }).then(({ data }) => {
      setComplaints(data.complaints);
      setTotal(data.total);
      setPages(data.pages);
    }).finally(() => setLoading(false));
  }, [filters]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this complaint?')) return;
    await api.delete(`/complaints/${id}`);
    setComplaints(c => c.filter(x => x._id !== id));
    setTotal(t => t - 1);
  };

  return (
    <div>
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.pageTitle}>
            {filters.status ? `${filters.status.replace('_', ' ')} Complaints` :
             filters.priority ? `${filters.priority} Priority Complaints` : 'All Complaints'}
          </h1>
          <p style={s.pageSub}>{total} complaint{total !== 1 ? 's' : ''} found</p>
        </div>
      </div>

      {/* Filters */}
      <div style={s.filterBar}>
        {[
          ['status', [['', 'All Status'], ['pending', '⏳ Pending'], ['in_progress', '🔧 In Progress'], ['resolved', '✅ Resolved']]],
          ['category', [['', 'All Categories'], ['pothole', '🕳️ Pothole'], ['garbage', '🗑️ Garbage'], ['water_leakage', '💧 Water'], ['streetlight', '💡 Streetlight'], ['other', '📌 Other']]],
          ['priority', [['', 'All Priority'], ['low', 'Low'], ['medium', 'Medium'], ['high', 'High'], ['critical', '🔴 Critical']]],
        ].map(([key, opts]) => (
          <select key={key} style={{ ...s.select, ...(filters[key] ? s.selectActive : {}) }}
            value={filters[key]} onChange={e => setFilters(f => ({ ...f, [key]: e.target.value, page: 1 }))}>
            {opts.map(([val, label]) => <option key={val} value={val}>{label}</option>)}
          </select>
        ))}
        {(filters.status || filters.category || filters.priority) && (
          <button style={s.clearBtn} onClick={() => setFilters({ status: '', category: '', priority: '', page: 1 })}>✕ Clear</button>
        )}
      </div>

      {loading ? (
        <div style={s.loadingBox}><div style={s.spinner} /></div>
      ) : (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                {['Issue', 'Category', 'Status', 'Priority', 'Citizen', 'Date', 'Actions'].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {complaints.map(c => (
                <tr key={c._id} style={s.tr} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = ''}>
                  <td style={s.td}>
                    <div style={s.issueCell}>
                      <span style={s.issueIcon}>{catIcons[c.category] || '📌'}</span>
                      <div>
                        <div style={s.issueTitle}>{c.title}</div>
                        <div style={s.issueSub}>{c.description?.slice(0, 50)}...</div>
                      </div>
                    </div>
                  </td>
                  <td style={s.td}><span style={s.catChip}>{c.category?.replace('_', ' ')}</span></td>
                  <td style={s.td}><StatusBadge status={c.status} /></td>
                  <td style={s.td}><PriorityBadge priority={c.priority} /></td>
                  <td style={s.td}>
                    <div style={s.citizenCell}>
                      <div style={s.citizenAvatar}>{c.citizen?.name?.charAt(0)}</div>
                      <span style={s.citizenName}>{c.citizen?.name}</span>
                    </div>
                  </td>
                  <td style={s.td}><span style={s.dateText}>{new Date(c.createdAt).toLocaleDateString('en-IN')}</span></td>
                  <td style={s.td}>
                    <div style={s.actions}>
                      <button onClick={() => navigate(`/complaints/${c._id}`)} style={s.viewBtn}>👁 View</button>
                      <button onClick={() => handleDelete(c._id)} style={s.deleteBtn}>🗑 Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {complaints.length === 0 && <div style={s.emptyTable}>No complaints found.</div>}
        </div>
      )}

      {pages > 1 && (
        <div style={s.pagination}>
          <button style={s.pageBtn} disabled={filters.page === 1} onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}>← Prev</button>
          <span style={s.pageInfo}>Page {filters.page} of {pages}</span>
          <button style={s.pageBtn} disabled={filters.page === pages} onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}>Next →</button>
        </div>
      )}
    </div>
  );
}

/* ─── Main Admin Dashboard Shell ─────────────────────────── */
export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  useEffect(() => { api.get('/analytics').then(({ data }) => setAnalytics(data)); }, []);

  return (
    <div style={s.shell}>
      <Sidebar analytics={analytics} />
      <main style={s.main}>
        <Routes>
          <Route index element={<Overview analytics={analytics} />} />
          <Route path="complaints" element={<ComplaintsManage />} />
        </Routes>
      </main>
    </div>
  );
}

const s = {
  shell: { display: 'flex', minHeight: 'calc(100vh - 64px)', background: '#f0f4f8' },
  sidebar: { width: '220px', background: '#fff', borderRight: '1px solid #e2e8f0', padding: '20px 12px', flexShrink: 0, position: 'sticky', top: '64px', height: 'calc(100vh - 64px)', overflowY: 'auto' },
  sidebarTitle: { fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 10px', marginBottom: '12px' },
  navItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', borderRadius: '10px', marginBottom: '2px', color: '#475569', fontWeight: 500, fontSize: '0.875rem', transition: 'all 0.15s', textDecoration: 'none' },
  navActive: { background: '#f5f3ff', color: '#4f46e5', fontWeight: 700 },
  navIcon: { fontSize: '1rem', width: '20px', textAlign: 'center' },
  navLabel: { flex: 1 },
  navBadge: { background: '#e0e7ff', color: '#4f46e5', fontSize: '0.7rem', fontWeight: 700, padding: '1px 7px', borderRadius: '10px' },
  sidebarDivider: { height: '1px', background: '#e2e8f0', margin: '12px 0' },
  main: { flex: 1, padding: '28px 28px', overflowY: 'auto' },
  pageHeader: { marginBottom: '24px' },
  pageTitle: { fontSize: '1.5rem', fontWeight: 800, color: '#1e293b' },
  pageSub: { color: '#64748b', fontSize: '0.875rem', marginTop: '2px' },
  loading: { textAlign: 'center', padding: '60px', color: '#64748b' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px', marginBottom: '24px' },
  statCard: { borderRadius: '16px', padding: '18px 16px', transition: 'transform 0.15s, box-shadow 0.15s' },
  statTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  statIcon: { fontSize: '1.6rem' },
  statArrow: { fontSize: '0.9rem', color: '#94a3b8', fontWeight: 700 },
  statVal: { fontSize: '1.8rem', fontWeight: 800, marginBottom: '4px' },
  statLabel: { fontSize: '0.78rem', color: '#64748b', fontWeight: 500 },
  chartsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' },
  chartCard: { background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: '16px' },
  chartHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  chartTitle: { fontSize: '0.9rem', fontWeight: 700, color: '#374151' },
  chartLink: { fontSize: '0.8rem', color: '#6366f1', fontWeight: 600 },
  legend: { display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '8px' },
  legendItem: { display: 'flex', alignItems: 'center', gap: '5px' },
  legendDot: { width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block', flexShrink: 0 },
  legendText: { fontSize: '0.75rem', color: '#64748b', textTransform: 'capitalize' },
  recentRow: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid #f1f5f9', textDecoration: 'none', color: 'inherit' },
  recentIcon: { fontSize: '1.3rem', width: '36px', height: '36px', background: '#f0f4f8', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  recentBody: { flex: 1, minWidth: 0 },
  recentTitle: { display: 'block', fontWeight: 600, fontSize: '0.875rem', color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  recentMeta: { fontSize: '0.75rem', color: '#94a3b8' },
  recentBadges: { display: 'flex', gap: '6px', flexShrink: 0 },
  filterBar: { display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' },
  select: { padding: '7px 12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '0.85rem', background: '#fff', cursor: 'pointer', outline: 'none', color: '#374151' },
  selectActive: { border: '1.5px solid #6366f1', background: '#f5f3ff', color: '#4f46e5' },
  clearBtn: { padding: '7px 12px', border: '1.5px solid #fecaca', borderRadius: '10px', fontSize: '0.85rem', background: '#fef2f2', color: '#dc2626', cursor: 'pointer' },
  loadingBox: { display: 'flex', justifyContent: 'center', padding: '60px' },
  spinner: { width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  tableWrap: { background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
  tr: { borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s', cursor: 'pointer' },
  td: { padding: '12px 16px', fontSize: '0.875rem', verticalAlign: 'middle' },
  issueCell: { display: 'flex', alignItems: 'center', gap: '10px' },
  issueIcon: { fontSize: '1.2rem', flexShrink: 0 },
  issueTitle: { fontWeight: 600, color: '#1e293b', fontSize: '0.875rem' },
  issueSub: { fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' },
  catChip: { background: '#f1f5f9', color: '#475569', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize', whiteSpace: 'nowrap' },
  citizenCell: { display: 'flex', alignItems: 'center', gap: '8px' },
  citizenAvatar: { width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 },
  citizenName: { fontWeight: 500, color: '#374151', fontSize: '0.875rem' },
  dateText: { color: '#94a3b8', fontSize: '0.8rem' },
  actions: { display: 'flex', gap: '6px' },
  viewBtn: { padding: '5px 10px', background: '#eff6ff', color: '#1d4ed8', border: 'none', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' },
  deleteBtn: { padding: '5px 10px', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' },
  emptyTable: { textAlign: 'center', padding: '40px', color: '#94a3b8' },
  pagination: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '20px' },
  pageBtn: { padding: '8px 18px', border: '1.5px solid #e2e8f0', borderRadius: '10px', background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', color: '#374151' },
  pageInfo: { fontSize: '0.875rem', color: '#64748b', fontWeight: 500 },
};
