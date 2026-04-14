import { fM } from '../../utils/formatters';

export default function KpiCard({ label, valor, variacao, icone, cor, sub }) {
  return (
    <div style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 'var(--border-radius-lg)', padding: '1rem 1.25rem', flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{label}</span>
        <span style={{ fontSize: 20, padding: '4px', borderRadius: 'var(--border-radius-md)', background: cor + '22' }}>{icone}</span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 500, color: 'var(--color-text-primary)', fontVariantNumeric: 'tabular-nums' }}>{fM(valor)}</div>
      {variacao !== undefined && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
          <span style={{ fontSize: 12, padding: '2px 6px', borderRadius: 20, background: variacao >= 0 ? '#dcfce7' : '#fee2e2', color: variacao >= 0 ? '#16a34a' : '#dc2626', fontWeight: 500 }}>
            {variacao >= 0 ? '▲' : '▼'} {Math.abs(variacao).toFixed(1)}%
          </span>
          <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>vs. mês anterior</span>
        </div>
      )}
      {sub && <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}
