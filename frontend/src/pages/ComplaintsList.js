import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';

const categoryIcons = { pothole: '🕳️', garbage: '🗑️', water_leakage: '💧', streetlight: '💡', other: '📌' };

export default function ComplaintsList() {
  const [complaints, setComplaints] = useState([]);
  const [filters, setFilters] = useState({ status: '', category: '', priority: '', page: 1 });
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    api.get('/complaints', { params }).then(({ data }) => {
      setComplaints(data.complaints);
      setPages(data.pages);
      setTotal(data.total);
    }).finally(() => setLoading(false));
  }, [filters]);

  const setFilter = (key, value) => setFilters(f => ({ ...f, [key]: value, page: 1 }));

  return (
    <div style={s.page}>
      <div style={s.container}>
        {/* Header */}
        <div style={s.header}>
          <div>
            <h1 style={s.title}>My Complaints</h1>
            <p style={s.sub}>{total} complaint{total !== 1 ? 's' : ''} found</p>
          </div>
          <Link to="/complaints/new" style={s.newBtn}>+ Report New Issue</Link>
        </div>

        {/* Filters */}
        <div style={s.filterBar}>
          <span style={s.filterLabel}>Filter by:</span>
          {[
            ['status', [['', 'All Status'], ['pending', '⏳ Pending'], ['in_progress', '🔧 In Progress'], ['resolved', '✅ Resolved']]],
            ['category', [['', 'All Categories'], ['pothole', '🕳️ Pothole'], ['garbage', '🗑️ Garbage'], ['water_leakage', '💧 Water Leakage'], ['streetlight', '💡 Streetlight'], ['other', '📌 Other']]],
            ['priority', [['', 'All Priority'], ['low', 'Low'], ['medium', 'Medium'], ['high', 'High'], ['critical', '🔴 Critical']]],
          ].map(([key, opts]) => (
            <select key={key} style={{ ...s.select, ...(filters[key] ? s.selectActive : {}) }}
              value={filters[key]} onChange={e => setFilter(key, e.target.value)}>
              {opts.map(([val, label]) => <option key={val} value={val}>{label}</option>)}
            </select>
          ))}
          {(filters.status || filters.category || filters.priority) && (
            <button style={s.clearBtn} onClick={() => setFilters({ status: '', category: '', priority: '', page: 1 })}>
              ✕ Clear
            </button>
          )}
        </div>

        {/* List */}
        {loading ? (
          <div style={s.loadingWrap}>
            <div style={s.spinner} />
            <p style={{ color: '#64748b', marginTop: '12px' }}>Loading complaints...</p>
          </div>
        ) : complaints.length === 0 ? (
          <div style={s.emptyState}>
            <div style={s.emptyIcon}>📭</div>
            <h3 style={s.emptyTitle}>No complaints found</h3>
            <p style={s.emptySub}>Try adjusting your filters or submit a new complaint</p>
            <Link to="/complaints/new" style={s.emptyBtn}>+ Report an Issue</Link>
          </div>
        ) : (
          <>
            <div style={s.list}>
              {complaints.map(c => (
                <Link to={`/complaints/${c._id}`} key={c._id} style={s.card}>
                  <div style={s.cardLeft}>
                    <div style={s.catIcon}>{categoryIcons[c.category] || '📌'}</div>
                  </div>
                  <div style={s.cardBody}>
                    <div style={s.cardTop}>
                      <span style={s.cardTitle}>{c.title}</span>
                      <div style={s.badges}>
                        <StatusBadge status={c.status} />
                        <PriorityBadge priority={c.priority} />
                      </div>
                    </div>
                    <p style={s.cardDesc}>{c.description.slice(0, 110)}{c.description.length > 110 ? '...' : ''}</p>
                    <div style={s.cardMeta}>
                      <span>📂 {c.category?.replace('_', ' ')}</span>
                      {c.location?.address && <span>📍 {c.location.address}</span>}
                      <span>🕐 {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      {c.isDuplicate && <span style={s.dupTag}>⚠ Duplicate</span>}
                    </div>
                  </div>
                  <div style={s.cardArrow}>›</div>
                </Link>
              ))}
            </div>

            {pages > 1 && (
              <div style={s.pagination}>
                <button style={s.pageBtn} disabled={filters.page === 1}
                  onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}>← Prev</button>
                <span style={s.pageInfo}>Page {filters.page} of {pages}</span>
                <button style={s.pageBtn} disabled={filters.page === pages}
                  onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { background: '#f0f4f8', minHeight: 'calc(100vh - 64px)', padding: '32px 16px' },
  container: { maxWidth: '860px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' },
  title: { fontSize: '1.6rem', fontWeight: 800, color: '#1e293b' },
  sub: { color: '#64748b', fontSize: '0.875rem', marginTop: '2px' },
  newBtn: { background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', padding: '10px 20px', borderRadius: '12px', fontWeight: 600, fontSize: '0.9rem', boxShadow: '0 2px 8px rgba(99,102,241,0.3)', whiteSpace: 'nowrap' },
  filterBar: { display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' },
  filterLabel: { fontSize: '0.85rem', fontWeight: 600, color: '#64748b' },
  select: { padding: '7px 12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '0.85rem', background: '#fff', cursor: 'pointer', color: '#374151', outline: 'none' },
  selectActive: { border: '1.5px solid #6366f1', background: '#f5f3ff', color: '#4f46e5' },
  clearBtn: { padding: '7px 12px', border: '1.5px solid #fecaca', borderRadius: '10px', fontSize: '0.85rem', background: '#fef2f2', color: '#dc2626', cursor: 'pointer' },
  loadingWrap: { textAlign: 'center', padding: '60px 0' },
  spinner: { width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' },
  emptyState: { textAlign: 'center', padding: '60px 24px', background: '#fff', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  emptyIcon: { fontSize: '3rem', marginBottom: '16px' },
  emptyTitle: { fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' },
  emptySub: { color: '#64748b', marginBottom: '24px' },
  emptyBtn: { background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', padding: '10px 24px', borderRadius: '12px', fontWeight: 600, fontSize: '0.9rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  card: { display: 'flex', alignItems: 'center', gap: '16px', background: '#fff', borderRadius: '16px', padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', transition: 'all 0.2s', color: 'inherit', border: '1.5px solid transparent' },
  cardLeft: { flexShrink: 0 },
  catIcon: { width: '48px', height: '48px', borderRadius: '12px', background: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' },
  cardBody: { flex: 1, minWidth: 0 },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' },
  cardTitle: { fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' },
  badges: { display: 'flex', gap: '6px', flexShrink: 0 },
  cardDesc: { color: '#64748b', fontSize: '0.85rem', marginBottom: '8px', lineHeight: 1.5 },
  cardMeta: { display: 'flex', gap: '12px', fontSize: '0.78rem', color: '#94a3b8', flexWrap: 'wrap' },
  dupTag: { color: '#d97706', fontWeight: 600 },
  cardArrow: { color: '#cbd5e1', fontSize: '1.4rem', flexShrink: 0 },
  pagination: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '24px' },
  pageBtn: { padding: '8px 18px', border: '1.5px solid #e2e8f0', borderRadius: '10px', background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', color: '#374151' },
  pageInfo: { fontSize: '0.875rem', color: '#64748b', fontWeight: 500 },
};
