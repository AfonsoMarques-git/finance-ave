import { fM } from '../../utils/formatters';

export default function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 'var(--border-radius-md)', padding: '10px 14px', fontSize: 13 }}>
      <p style={{ fontWeight: 500, marginBottom: 4 }}>{label}</p>
      {payload.map((e, i) => <p key={i} style={{ color: e.color, margin: '2px 0' }}>{e.name}: {fM(e.value)}</p>)}
    </div>
  );
}
