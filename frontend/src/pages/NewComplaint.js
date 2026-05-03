import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../api/axios';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const categories = [
  { val: 'pothole', icon: '🕳️', label: 'Pothole' },
  { val: 'garbage', icon: '🗑️', label: 'Garbage' },
  { val: 'water_leakage', icon: '💧', label: 'Water Leakage' },
  { val: 'streetlight', icon: '💡', label: 'Streetlight' },
  { val: 'other', icon: '📌', label: 'Other' },
];

function LocationPicker({ onSelect }) {
  useMapEvents({ click(e) { onSelect({ lat: e.latlng.lat, lng: e.latlng.lng }); } });
  return null;
}

export default function NewComplaint() {
  const [form, setForm] = useState({ title: '', description: '', address: '' });
  const [hint, setHint] = useState('');
  const [location, setLocation] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSelect = useCallback((loc) => setLocation(loc), []);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (location) { data.append('lat', location.lat); data.append('lng', location.lng); }
      if (image) data.append('image', image);
      await api.post('/complaints', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/complaints');
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={s.page}>
      {/* Hero Header */}
      <div style={s.heroBar}>
        <div style={s.heroInner}>
          <div style={s.heroLeft}>
            <div style={s.heroIcon}>🚨</div>
            <div>
              <h1 style={s.heroTitle}>Report a Civic Issue</h1>
              <p style={s.heroSub}>Our AI will auto-categorize and prioritize your complaint instantly</p>
            </div>
          </div>
          <div style={s.heroBadges}>
            <span style={s.heroBadge}>🤖 AI Powered</span>
            <span style={s.heroBadge}>📍 Location Tracking</span>
            <span style={s.heroBadge}>🔔 Instant Alerts</span>
          </div>
        </div>
      </div>

      <div style={s.container}>
        {error && (
          <div style={s.errorBox}>
            <span style={s.errorIcon}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={s.grid}>
            {/* Left Column */}
            <div style={s.leftCol}>

              {/* Step 1 — Describe */}
              <div style={s.card}>
                <div style={s.cardHeader}>
                  <div style={s.stepBadge}>
                    <span style={s.stepBadgeNum}>1</span>
                    <span style={s.stepBadgeLabel}>Step</span>
                  </div>
                  <div>
                    <h2 style={s.cardTitle}>Describe the Issue</h2>
                    <p style={s.cardSub}>Be specific — it helps authorities respond faster</p>
                  </div>
                </div>

                <div style={s.fieldWrap}>
                  <label style={s.label}>
                    <span style={s.labelIcon}>📝</span> Issue Title
                    <span style={s.required}>*</span>
                  </label>
                  <input style={s.input} placeholder="e.g. Large pothole on Main Street causing accidents"
                    value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                  <span style={s.charCount}>{form.title.length}/100</span>
                </div>

                <div style={s.fieldWrap}>
                  <label style={s.label}>
                    <span style={s.labelIcon}>📋</span> Detailed Description
                    <span style={s.required}>*</span>
                  </label>
                  <textarea style={s.textarea}
                    placeholder="Describe the issue in detail — size, severity, how long it's been there, impact on residents..."
                    value={form.description} onChange={e => { setForm({ ...form, description: e.target.value }); setHint(''); }}
                    required />
                  <div style={s.hintBox}>
                    <span style={s.hintIcon}>💡</span>
                    <span style={s.hintText}>The more detail you provide, the better our AI can prioritize your complaint.</span>
                  </div>
                </div>

                <div style={s.fieldWrap}>
                  <label style={s.label}>
                    <span style={s.labelIcon}>🏠</span> Street Address
                    <span style={s.optional}>(optional)</span>
                  </label>
                  <input style={s.input} placeholder="e.g. 12 MG Road, near City Park"
                    value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                </div>
              </div>

              {/* Step 2 — Photo */}
              <div style={s.card}>
                <div style={s.cardHeader}>
                  <div style={s.stepBadge}>
                    <span style={s.stepBadgeNum}>2</span>
                    <span style={s.stepBadgeLabel}>Step</span>
                  </div>
                  <div>
                    <h2 style={s.cardTitle}>Upload a Photo</h2>
                    <p style={s.cardSub}>Visual evidence speeds up resolution</p>
                  </div>
                </div>

                <label style={{ ...s.uploadZone, ...(preview ? s.uploadZoneActive : {}) }}>
                  {preview ? (
                    <div style={s.previewWrap}>
                      <img src={preview} alt="preview" style={s.previewImg} />
                      <div style={s.previewOverlay}>
                        <span style={s.previewOverlayText}>📷 Click to change photo</span>
                      </div>
                    </div>
                  ) : (
                    <div style={s.uploadInner}>
                      <div style={s.uploadCircle}>📷</div>
                      <p style={s.uploadTitle}>Drag & drop or click to upload</p>
                      <p style={s.uploadMeta}>JPG, PNG or WebP · Max 5MB</p>
                      <div style={s.uploadBtn}>Choose File</div>
                    </div>
                  )}
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImage} />
                </label>

                {preview && (
                  <button type="button" style={s.removeBtn}
                    onClick={() => { setImage(null); setPreview(null); }}>
                    🗑️ Remove photo
                  </button>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div style={s.rightCol}>

              {/* Step 3 — Map */}
              <div style={s.card}>
                <div style={s.cardHeader}>
                  <div style={s.stepBadge}>
                    <span style={s.stepBadgeNum}>3</span>
                    <span style={s.stepBadgeLabel}>Step</span>
                  </div>
                  <div>
                    <h2 style={s.cardTitle}>Pin Location on Map</h2>
                    <p style={s.cardSub}>Click anywhere on the map to mark the issue</p>
                  </div>
                </div>

                <div style={s.mapWrapper}>
                  <MapContainer center={[20.5937, 78.9629]} zoom={5} style={s.map}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' />
                    <LocationPicker onSelect={handleSelect} />
                    {location && <Marker position={[location.lat, location.lng]} />}
                  </MapContainer>
                </div>

                {location ? (
                  <div style={s.locationPinned}>
                    <div style={s.locationPinnedLeft}>
                      <span style={s.locationDot} />
                      <div>
                        <p style={s.locationTitle}>Location Pinned ✓</p>
                        <p style={s.locationCoords}>{location.lat.toFixed(5)}, {location.lng.toFixed(5)}</p>
                      </div>
                    </div>
                    <button type="button" style={s.clearLocBtn} onClick={() => setLocation(null)}>✕ Clear</button>
                  </div>
                ) : (
                  <div style={s.locationEmpty}>
                    <span>👆</span>
                    <span>Click on the map to drop a pin</span>
                  </div>
                )}
              </div>

              {/* AI Panel */}
              <div style={s.aiPanel}>
                <div style={s.aiPanelTop}>
                  <span style={s.aiEmoji}>🤖</span>
                  <div>
                    <p style={s.aiTitle}>AI Auto-Detection Active</p>
                    <p style={s.aiDesc}>Analyzing your description in real-time</p>
                  </div>
                  <span style={s.aiLiveDot} />
                </div>
                <div style={s.aiFeatures}>
                  {[
                    ['🏷️', 'Auto Category', 'Detects issue type'],
                    ['⚡', 'Priority Score', 'Rates severity 1–4'],
                    ['🔍', 'Duplicate Check', 'Finds similar reports'],
                  ].map(([icon, title, desc]) => (
                    <div key={title} style={s.aiFeatureItem}>
                      <span style={s.aiFeatureIcon}>{icon}</span>
                      <div>
                        <p style={s.aiFeatureTitle}>{title}</p>
                        <p style={s.aiFeatureDesc}>{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Bar */}
          <div style={s.submitBar}>
            <button type="button" style={s.cancelBtn} onClick={() => navigate('/complaints')}>
              ← Cancel
            </button>
            <button type="submit" disabled={submitting} style={s.submitBtn}>
              {submitting ? (
                <span style={s.submitLoading}><span style={s.submitSpinner} /> Submitting...</span>
              ) : (
                '🚀 Submit Complaint'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const s = {
  page: { background: '#f0f4f8', minHeight: 'calc(100vh - 64px)' },

  /* Hero */
  heroBar: { background: 'linear-gradient(135deg,#1e1b4b,#312e81,#4338ca)', padding: '28px 24px' },
  heroInner: { maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' },
  heroLeft: { display: 'flex', alignItems: 'center', gap: '16px' },
  heroIcon: { width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', flexShrink: 0 },
  heroTitle: { fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '4px' },
  heroSub: { fontSize: '0.85rem', color: '#a5b4fc' },
  heroBadges: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  heroBadge: { background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#e0e7ff', padding: '5px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, backdropFilter: 'blur(4px)' },

  container: { maxWidth: '1000px', margin: '0 auto', padding: '28px 16px' },

  errorBox: { display: 'flex', alignItems: 'center', gap: '10px', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.875rem' },
  errorIcon: { fontSize: '1.1rem', flexShrink: 0 },

  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' },
  leftCol: { display: 'flex', flexDirection: 'column', gap: '16px' },
  rightCol: { display: 'flex', flexDirection: 'column', gap: '16px' },

  /* Card */
  card: { background: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)' },
  cardHeader: { display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '22px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' },
  stepBadge: { display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', borderRadius: '12px', padding: '8px 10px', flexShrink: 0, minWidth: '44px' },
  stepBadgeNum: { fontSize: '1.1rem', fontWeight: 900, color: '#fff', lineHeight: 1 },
  stepBadgeLabel: { fontSize: '0.55rem', color: '#c7d2fe', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' },
  cardTitle: { fontSize: '1rem', fontWeight: 800, color: '#1e293b', marginBottom: '3px' },
  cardSub: { fontSize: '0.8rem', color: '#94a3b8' },

  /* Fields */
  fieldWrap: { marginBottom: '18px', position: 'relative' },
  label: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '7px' },
  labelIcon: { fontSize: '0.9rem' },
  required: { color: '#ef4444', marginLeft: '2px' },
  optional: { color: '#94a3b8', fontWeight: 400, fontSize: '0.78rem', marginLeft: '4px' },
  input: { width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '0.9rem', fontFamily: 'inherit', color: '#1e293b', background: '#fafafa', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s' },
  textarea: { width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '0.9rem', fontFamily: 'inherit', color: '#1e293b', background: '#fafafa', outline: 'none', boxSizing: 'border-box', resize: 'vertical', minHeight: '110px', transition: 'border-color 0.2s' },
  charCount: { position: 'absolute', right: '12px', bottom: '-18px', fontSize: '0.7rem', color: '#94a3b8' },
  hintBox: { display: 'flex', alignItems: 'flex-start', gap: '6px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '8px 10px', marginTop: '8px' },
  hintIcon: { fontSize: '0.85rem', flexShrink: 0, marginTop: '1px' },
  hintText: { fontSize: '0.75rem', color: '#92400e', lineHeight: 1.5 },

  /* Upload */
  uploadZone: { display: 'block', border: '2px dashed #e2e8f0', borderRadius: '16px', cursor: 'pointer', overflow: 'hidden', transition: 'all 0.2s', background: '#fafafa' },
  uploadZoneActive: { border: '2px dashed #6366f1', background: '#f5f3ff' },
  uploadInner: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '36px 20px', gap: '8px' },
  uploadCircle: { width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg,#f5f3ff,#ede9fe)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', marginBottom: '4px', border: '2px solid #ddd6fe' },
  uploadTitle: { fontWeight: 700, color: '#374151', fontSize: '0.9rem' },
  uploadMeta: { fontSize: '0.75rem', color: '#94a3b8' },
  uploadBtn: { marginTop: '8px', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', padding: '7px 20px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600 },
  previewWrap: { position: 'relative' },
  previewImg: { width: '100%', height: '180px', objectFit: 'cover', display: 'block' },
  previewOverlay: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0 },
  previewOverlayText: { color: '#fff', fontWeight: 600, fontSize: '0.85rem' },
  removeBtn: { background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, marginTop: '8px', padding: '0', display: 'flex', alignItems: 'center', gap: '4px' },

  /* Map */
  mapWrapper: { borderRadius: '12px', overflow: 'hidden', border: '1.5px solid #e2e8f0', marginBottom: '10px' },
  map: { height: '280px' },
  locationPinned: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', border: '1.5px solid #86efac', borderRadius: '10px', padding: '10px 14px' },
  locationPinnedLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  locationDot: { width: '10px', height: '10px', borderRadius: '50%', background: '#16a34a', boxShadow: '0 0 0 3px rgba(22,163,74,0.2)', flexShrink: 0 },
  locationTitle: { fontSize: '0.82rem', fontWeight: 700, color: '#15803d' },
  locationCoords: { fontSize: '0.72rem', color: '#16a34a', marginTop: '1px' },
  clearLocBtn: { background: '#fff', border: '1px solid #86efac', color: '#15803d', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 },
  locationEmpty: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#f8fafc', border: '1.5px dashed #e2e8f0', borderRadius: '10px', padding: '10px', fontSize: '0.82rem', color: '#94a3b8' },

  /* AI Panel */
  aiPanel: { background: 'linear-gradient(145deg,#1e1b4b,#312e81)', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 20px rgba(99,102,241,0.2)' },
  aiPanelTop: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', paddingBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.1)' },
  aiEmoji: { fontSize: '1.8rem', filter: 'drop-shadow(0 0 8px rgba(165,180,252,0.8))' },
  aiTitle: { fontSize: '0.9rem', fontWeight: 800, color: '#fff', marginBottom: '2px' },
  aiDesc: { fontSize: '0.75rem', color: '#a5b4fc' },
  aiLiveDot: { width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 0 3px rgba(74,222,128,0.3)', marginLeft: 'auto', flexShrink: 0 },
  aiFeatures: { display: 'flex', flexDirection: 'column', gap: '10px' },
  aiFeatureItem: { display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.07)', borderRadius: '10px', padding: '10px 12px', border: '1px solid rgba(255,255,255,0.08)' },
  aiFeatureIcon: { fontSize: '1.1rem', width: '28px', textAlign: 'center', flexShrink: 0 },
  aiFeatureTitle: { fontSize: '0.82rem', fontWeight: 700, color: '#e0e7ff', marginBottom: '1px' },
  aiFeatureDesc: { fontSize: '0.72rem', color: '#a5b4fc' },

  /* Submit Bar */
  submitBar: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', background: '#fff', borderRadius: '16px', padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  cancelBtn: { padding: '11px 24px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', color: '#64748b', fontSize: '0.9rem', fontFamily: 'inherit' },
  submitBtn: { padding: '12px 32px', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.4)', fontFamily: 'inherit', letterSpacing: '0.02em' },
  submitLoading: { display: 'flex', alignItems: 'center', gap: '8px' },
  submitSpinner: { width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.35)', borderTop: '2px solid #fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' },
};
