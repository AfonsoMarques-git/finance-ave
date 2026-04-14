import { fM } from '../../utils/formatters';

export default function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 'var(--border-radius-md)', padding: '10px 14px', fontSize: 13 }}>
      <p style={{ fontWeight: 500 }}>{d.name}</p>
      <p style={{ color: 'var(--color-text-secondary)' }}>{fM(d.value)} · {d.pct.toFixed(1)}%</p>
    </div>
  );
}
