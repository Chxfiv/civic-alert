const config = {
  pending:     { bg: '#fffbeb', color: '#b45309', border: '#fde68a', label: '⏳ Pending' },
  in_progress: { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', label: '🔧 In Progress' },
  resolved:    { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0', label: '✅ Resolved' },
};

export default function StatusBadge({ status }) {
  const c = config[status] || { bg: '#f1f5f9', color: '#475569', border: '#e2e8f0', label: status };
  return (
    <span style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}`, padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
      {c.label}
    </span>
  );
}
