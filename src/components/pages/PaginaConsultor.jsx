import Card from '../ui/Card';
import CardTitle from '../ui/CardTitle';
import ScoreGauge from '../ui/ScoreGauge';
import Pill from '../ui/Pill';
import Prio from '../ui/Prio';
import { fM } from '../../utils/formatters';

export default function PaginaConsultor({ rel, sugestoes }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>
        <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <CardTitle>🧠 Saúde Financeira Global</CardTitle>
          <ScoreGauge score={rel.score} />
          <div style={{ width: '100%', background: 'var(--color-background-secondary)', borderRadius: 'var(--border-radius-md)', padding: '12px 16px' }}>
            <p style={{ fontSize: 13, fontWeight: 500, margin: '0 0 8px' }}>Regra 50/30/20 — Guimarães</p>
            {[
              ['Necessidades', rel.fixas + rel.gastosPorCat.filter(g => ['alimentacao', 'saude'].includes(g.catId)).reduce((s, g) => s + g.total, 0), 55, '#ef4444'],
              ['Desejos', rel.gastosPorCat.filter(g => ['restauracao', 'lazer', 'vestuario', 'cuidados'].includes(g.catId)).reduce((s, g) => s + g.total, 0), 25, '#f59e0b'],
              ['Poupança', Math.max(0, rel.saldo), 20, '#22c55e'],
            ].map(([l, v, meta, c]) => {
              const pct = rel.receitas > 0 ? (v / rel.receitas) * 100 : 0;
              return (
                <div key={l} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                    <span>{l}</span>
                    <span style={{ color: Math.abs(pct - meta) < 5 ? '#22c55e' : '#f59e0b' }}>{pct.toFixed(0)}% (meta: {meta}%)</span>
                  </div>
                  <div style={{ background: 'var(--color-background-tertiary)', borderRadius: 3, height: 6 }}>
                    <div style={{ width: `${Math.min(pct / meta * 100, 100)}%`, height: 6, borderRadius: 3, background: c }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
        <Card>
          <CardTitle>📊 Potencial de Poupança</CardTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sugestoes.filter(s => s.poupanca).map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: 'var(--border-radius-md)', background: 'var(--color-background-secondary)' }}>
                <span style={{ fontSize: 13 }}>{s.titulo}</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#16a34a', whiteSpace: 'nowrap', marginLeft: 8 }}>~{fM(s.poupanca)}/mês</span>
              </div>
            ))}
            {sugestoes.some(s => s.poupanca) && (
              <div style={{ padding: '10px 12px', borderRadius: 'var(--border-radius-md)', background: '#dcfce7', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#15803d' }}>Potencial total identificado</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#15803d' }}>{fM(sugestoes.filter(s => s.poupanca).reduce((s, sg) => s + sg.poupanca, 0))}/mês</span>
              </div>
            )}
            {!sugestoes.some(s => s.poupanca) && (
              <p style={{ color: 'var(--color-text-tertiary)', fontSize: 13, padding: '1rem 0' }}>Adiciona mais lançamentos para identificar potencial de poupança.</p>
            )}
          </div>
        </Card>
      </div>
      <Card>
        <CardTitle>💡 Sugestões Personalizadas para Guimarães</CardTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sugestoes.length === 0 ? (
            <p style={{ color: 'var(--color-text-tertiary)', fontSize: 13 }}>Adiciona lançamentos para receberes análises personalizadas baseadas na realidade económica de Guimarães.</p>
          ) : sugestoes.map((s, i) => (
            <div key={i} style={{ borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-tertiary)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--color-background-secondary)' }}>
                <Prio p={s.p} />
                <p style={{ margin: 0, fontSize: 14, fontWeight: 500, flex: 1 }}>{s.titulo}</p>
                <Pill tipo={s.tipo} />
                {s.poupanca && <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 20, background: '#dcfce7', color: '#15803d', whiteSpace: 'nowrap' }}>~{fM(s.poupanca)}</span>}
              </div>
              <div style={{ padding: '10px 14px' }}>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card style={{ background: 'var(--color-background-secondary)' }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', margin: 0, lineHeight: 1.6 }}>⚠️ As médias regionais são estimativas baseadas em dados públicos e levantamento de mercado local 2025/2026. As análises são orientativas e não substituem aconselhamento financeiro profissional. Fontes: INE, Pordata, Numbeo, DECO Proteste, relatórios CIM do Ave.</p>
      </Card>
    </div>
  );
}
