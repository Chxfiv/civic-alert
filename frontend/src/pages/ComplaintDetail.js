import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import { useAuth } from '../context/AuthContext';

const categoryIcons = { pothole: '🕳️', garbage: '🗑️', water_leakage: '💧', streetlight: '💡', other: '📌' };

export default function ComplaintDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [statusForm, setStatusForm] = useState({ status: '', note: '' });
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api.get(`/complaints/${id}`).then(({ data }) => setComplaint(data));
  }, [id]);

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const { data } = await api.patch(`/complaints/${id}/status`, statusForm);
      setComplaint(data);
      setStatusForm({ status: '', note: '' });
      setSuccess('Status updated successfully! Email notification sent.');
      setTimeout(() => setSuccess(''), 3000);
    } finally {
      setUpdating(false);
    }
  };

  if (!complaint) return (
    <div style={s.loadingPage}>
      <div style={s.spinner} />
      <p style={{ color: '#64748b', marginTop: '12px' }}>Loading complaint...</p>
    </div>
  );

  return (
    <div style={s.page}>
      <div style={s.container}>
        {/* Back */}
        <button onClick={() => navigate(-1)} style={s.backBtn}>← Back</button>

        {/* Title bar */}
        <div style={s.titleBar}>
          <div style={s.titleLeft}>
            <span style={s.catIcon}>{categoryIcons[complaint.category] || '📌'}</span>
            <div>
              <h1 style={s.title}>{complaint.title}</h1>
              <p style={s.titleMeta}>
                Submitted by <strong>{complaint.citizen?.name}</strong> on {new Date(complaint.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
          <div style={s.badges}>
            <StatusBadge status={complaint.status} />
            <PriorityBadge priority={complaint.priority} />
          </div>
        </div>

        <div style={s.grid}>
          {/* Left column */}
          <div style={s.leftCol}>
            {/* Description */}
            <div style={s.card}>
              <h3 style={s.cardTitle}>📝 Description</h3>
              <p style={s.desc}>{complaint.description}</p>
              {complaint.isDuplicate && (
                <div style={s.dupAlert}>⚠️ This complaint has been flagged as a duplicate of an existing report.</div>
              )}
            </div>

            {/* Details */}
            <div style={s.card}>
              <h3 style={s.cardTitle}>📋 Details</h3>
              <div style={s.detailsGrid}>
                {[
                  ['Category', complaint.category?.replace('_', ' ')],
                  ['Priority', complaint.priority],
                  ['Status', complaint.status?.replace('_', ' ')],
                  ['Location', complaint.location?.address || (complaint.location?.lat ? `${complaint.location.lat.toFixed(4)}, ${complaint.location.lng.toFixed(4)}` : 'Not specified')],
                  ['Citizen Email', complaint.citizen?.email],
                  ['Phone', complaint.citizen?.phone || 'Not provided'],
                ].map(([label, val]) => (
                  <div key={label} style={s.detailRow}>
                    <span style={s.detailLabel}>{label}</span>
                    <span style={s.detailVal}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Analysis */}
            {complaint.aiAnalysis && (
              <div style={s.aiCard}>
                <h3 style={s.cardTitle}>🤖 AI Analysis</h3>
                <div style={s.aiGrid}>
                  <div style={s.aiItem}>
                    <span style={s.aiLabel}>Detected Category</span>
                    <span style={s.aiVal}>{complaint.aiAnalysis.detectedCategory?.replace('_', ' ')}</span>
                  </div>
                  <div style={s.aiItem}>
                    <span style={s.aiLabel}>Confidence</span>
                    <div style={s.progressBar}>
                      <div style={{ ...s.progressFill, width: `${(complaint.aiAnalysis.confidence * 100).toFixed(0)}%` }} />
                    </div>
                    <span style={s.aiVal}>{(complaint.aiAnalysis.confidence * 100).toFixed(0)}%</span>
                  </div>
                  {complaint.aiAnalysis.keywords?.length > 0 && (
                    <div style={s.aiItem}>
                      <span style={s.aiLabel}>Keywords Detected</span>
                      <div style={s.keywordRow}>
                        {complaint.aiAnalysis.keywords.map(k => <span key={k} style={s.keyword}>{k}</span>)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right column */}
          <div style={s.rightCol}>
            {/* Image */}
            {complaint.image && (
              <div style={s.card}>
                <h3 style={s.cardTitle}>📷 Photo</h3>
                <img src={`http://localhost:5000${complaint.image}`} alt="complaint"
                  style={s.img} />
              </div>
            )}

            {/* Status Timeline */}
            <div style={s.card}>
              <h3 style={s.cardTitle}>📅 Status Timeline</h3>
              <div style={s.timeline}>
                {complaint.statusHistory?.map((h, i) => (
                  <div key={i} style={s.timelineItem}>
                    <div style={s.timelineDot} />
                    {i < complaint.statusHistory.length - 1 && <div style={s.timelineLine} />}
                    <div style={s.timelineContent}>
                      <StatusBadge status={h.status} />
                      <p style={s.timelineDate}>{new Date(h.changedAt).toLocaleString('en-IN')}</p>
                      {h.note && <p style={s.timelineNote}>{h.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Update */}
            {user?.role === 'admin' && (
              <div style={s.adminCard}>
                <h3 style={s.cardTitle}>🛡️ Update Status</h3>
                {success && <div className="alert-success">{success}</div>}
                <form onSubmit={handleStatusUpdate}>
                  <div className="form-group">
                    <label className="form-label">New Status</label>
                    <select className="form-input" value={statusForm.status}
                      onChange={e => setStatusForm({ ...statusForm, status: e.target.value })} required>
                      <option value="">Select status...</option>
                      {[['pending', '⏳ Pending'], ['in_progress', '🔧 In Progress'], ['resolved', '✅ Resolved']].map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Note <span style={{ color: '#94a3b8', fontWeight: 400 }}>(optional)</span></label>
                    <input className="form-input" placeholder="Add a note for the citizen..." value={statusForm.note}
                      onChange={e => setStatusForm({ ...statusForm, note: e.target.value })} />
                  </div>
                  <button className="btn btn-primary btn-full" type="submit" disabled={updating}>
                    {updating ? '⏳ Updating...' : '✓ Update Status'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { background: '#f0f4f8', minHeight: 'calc(100vh - 64px)', padding: '32px 16px' },
  container: { maxWidth: '1000px', margin: '0 auto' },
  loadingPage: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' },
  spinner: { width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  backBtn: { background: 'none', border: 'none', color: '#6366f1', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', marginBottom: '20px', padding: '0' },
  titleBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' },
  titleLeft: { display: 'flex', gap: '16px', alignItems: 'flex-start' },
  catIcon: { fontSize: '2.5rem', flexShrink: 0 },
  title: { fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', marginBottom: '4px' },
  titleMeta: { color: '#64748b', fontSize: '0.875rem' },
  badges: { display: 'flex', gap: '8px', flexShrink: 0 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' },
  leftCol: { display: 'flex', flexDirection: 'column', gap: '16px' },
  rightCol: { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: { background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  cardTitle: { fontSize: '0.95rem', fontWeight: 700, color: '#374151', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' },
  desc: { color: '#475569', lineHeight: 1.7, fontSize: '0.95rem' },
  dupAlert: { background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginTop: '12px' },
  detailsGrid: { display: 'flex', flexDirection: 'column', gap: '10px' },
  detailRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f5f9' },
  detailLabel: { fontSize: '0.85rem', color: '#64748b', fontWeight: 500 },
  detailVal: { fontSize: '0.875rem', color: '#1e293b', fontWeight: 600, textTransform: 'capitalize', textAlign: 'right', maxWidth: '60%' },
  aiCard: { background: 'linear-gradient(135deg,#f5f3ff,#ede9fe)', border: '1px solid #ddd6fe', borderRadius: '16px', padding: '20px' },
  aiGrid: { display: 'flex', flexDirection: 'column', gap: '12px' },
  aiItem: { display: 'flex', flexDirection: 'column', gap: '4px' },
  aiLabel: { fontSize: '0.8rem', color: '#7c3aed', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' },
  aiVal: { fontSize: '0.9rem', color: '#1e293b', fontWeight: 600, textTransform: 'capitalize' },
  progressBar: { height: '6px', background: '#ddd6fe', borderRadius: '3px', overflow: 'hidden', margin: '4px 0' },
  progressFill: { height: '100%', background: 'linear-gradient(90deg,#6366f1,#7c3aed)', borderRadius: '3px' },
  keywordRow: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  keyword: { background: '#ede9fe', color: '#6d28d9', padding: '2px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600 },
  img: { width: '100%', borderRadius: '10px', objectFit: 'cover', maxHeight: '220px' },
  timeline: { display: 'flex', flexDirection: 'column', gap: '0' },
  timelineItem: { display: 'flex', gap: '12px', position: 'relative', paddingBottom: '16px' },
  timelineDot: { width: '10px', height: '10px', borderRadius: '50%', background: '#6366f1', flexShrink: 0, marginTop: '6px' },
  timelineLine: { position: 'absolute', left: '4px', top: '16px', bottom: '0', width: '2px', background: '#e2e8f0' },
  timelineContent: { flex: 1 },
  timelineDate: { fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' },
  timelineNote: { fontSize: '0.82rem', color: '#64748b', marginTop: '2px', fontStyle: 'italic' },
  adminCard: { background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '2px solid #e0e7ff' },
};
