export default function Prio({ p }) {
  const c = { alta: '#ef4444', media: '#f59e0b', baixa: '#22c55e' }[p] || '#94a3b8';
  return (
    <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, display: 'inline-block', marginRight: 6 }} />
  );
}
