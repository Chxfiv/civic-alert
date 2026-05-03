const config = {
  low:      { bg: '#f1f5f9', color: '#475569', border: '#e2e8f0', label: '🟢 Low' },
  medium:   { bg: '#fffbeb', color: '#b45309', border: '#fde68a', label: '🟡 Medium' },
  high:     { bg: '#fef2f2', color: '#dc2626', border: '#fecaca', label: '🔴 High' },
  critical: { bg: '#faf5ff', color: '#7c3aed', border: '#ddd6fe', label: '🚨 Critical' },
};

export default function PriorityBadge({ priority }) {
  const c = config[priority] || { bg: '#f1f5f9', color: '#475569', border: '#e2e8f0', label: priority };
  return (
    <span style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}`, padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
      {c.label}
    </span>
  );
}
