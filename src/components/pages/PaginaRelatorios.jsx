import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../ui/Card';
import CardTitle from '../ui/CardTitle';
import ScoreGauge from '../ui/ScoreGauge';
import CustomTooltip from '../charts/CustomTooltip';
import { getCat, fM, getMesLabel } from '../../utils/formatters';

export default function PaginaRelatorios({ rel, mes, dadosLinha }) {
  const estadoLabel = {
    abaixo: { t: '✅ Abaixo', c: '#16a34a', bg: '#dcfce7' },
    na_media: { t: '📊 Na média', c: '#2563eb', bg: '#eff6ff' },
    acima: { t: '⚠️ Acima', c: '#d97706', bg: '#fef3c7' },
    muito_acima: { t: '🔴 Muito acima', c: '#dc2626', bg: '#fee2e2' },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card>
        <CardTitle>📋 Relatório Mensal — {getMesLabel(mes)}</CardTitle>
        <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', margin: '-8px 0 16px' }}>📍 Guimarães, Região Norte</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12 }}>
          {[
            ['💰 Receitas', rel.receitas, '#16a34a'],
            ['📉 Desp. Fixas', rel.fixas, '#7c3aed'],
            ['📊 Desp. Variáveis', rel.variaveis, '#ea580c'],
            ['💵 Total Desp.', rel.totalD, '#dc2626'],
            ['✅ Saldo', rel.saldo, rel.saldo >= 0 ? '#2563eb' : '#dc2626'],
          ].map(([l, v, c], i) => (
            <div key={i} style={{ background: 'var(--color-background-secondary)', borderRadius: 'var(--border-radius-md)', padding: '0.75rem 1rem' }}>
              <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: '0 0 4px' }}>{l}</p>
              <p style={{ fontSize: 18, fontWeight: 500, color: c, margin: 0, fontVariantNumeric: 'tabular-nums' }}>{fM(v)}</p>
            </div>
          ))}
          <div style={{ background: 'var(--color-background-secondary)', borderRadius: 'var(--border-radius-md)', padding: '0.75rem 1rem' }}>
            <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: '0 0 4px' }}>📈 Taxa Poupança</p>
            <p style={{ fontSize: 18, fontWeight: 500, color: rel.taxaPoupanca >= 20 ? '#16a34a' : '#dc2626', margin: 0 }}>{rel.taxaPoupanca.toFixed(1)}%</p>
          </div>
        </div>
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 'var(--border-radius-md)', background: rel.taxaPoupanca >= 20 ? '#dcfce7' : '#fee2e2' }}>
          <span>{rel.taxaPoupanca >= 20 ? '✅' : '⚠️'}</span>
          <span style={{ fontSize: 13, color: rel.taxaPoupanca >= 20 ? '#15803d' : '#dc2626' }}>
            {rel.taxaPoupanca >= 20
              ? `Meta de poupança atingida! (+${(rel.taxaPoupanca - 20).toFixed(1)}%)`
              : `Meta de 20% não atingida (${(rel.taxaPoupanca - 20).toFixed(1)}%)`}
          </span>
        </div>
      </Card>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>
        <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <CardTitle>Score de Saúde Financeira</CardTitle>
          <ScoreGauge score={rel.score} />
          <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', textAlign: 'center', maxWidth: 220, margin: 0 }}>
            {rel.score >= 80 ? 'Parabéns! A tua saúde financeira é exemplar.'
              : rel.score >= 60 ? 'Estás no bom caminho. Há margem para melhorar.'
              : rel.score >= 40 ? 'Atenção a alguns indicadores. Consulta as sugestões.'
              : 'Vários indicadores precisam de atenção urgente.'}
          </p>
        </Card>
        <Card>
          <CardTitle>Comparativo Regional — Guimarães 2026</CardTitle>
          <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', margin: '-8px 0 12px' }}>Os teus gastos vs. média regional estimada</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {rel.comparativo.length === 0 ? (
              <p style={{ color: 'var(--color-text-tertiary)', fontSize: 13 }}>Sem dados suficientes para comparação.</p>
            ) : rel.comparativo.map(c => {
              const cat = getCat(c.catId);
              const st = estadoLabel[c.estado];
              const maxV = Math.max(c.gastoUser, c.media);
              return (
                <div key={c.catId}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{cat?.i} {cat?.n}</span>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: st.bg, color: st.c, fontWeight: 500 }}>{st.t}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)', width: 24 }}>Tu</span>
                    <div style={{ flex: 1, background: 'var(--color-background-tertiary)', borderRadius: 4, height: 8 }}>
                      <div style={{ width: `${(c.gastoUser / maxV) * 100}%`, height: 8, borderRadius: 4, background: cat?.c || '#94a3b8', transition: 'width 0.5s' }} />
                    </div>
                    <span style={{ fontSize: 12, width: 64, textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--color-text-primary)' }}>{fM(c.gastoUser)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)', width: 24 }}>Méd.</span>
                    <div style={{ flex: 1, background: 'var(--color-background-tertiary)', borderRadius: 4, height: 8 }}>
                      <div style={{ width: `${(c.media / maxV) * 100}%`, height: 8, borderRadius: 4, background: '#94a3b8', transition: 'width 0.5s' }} />
                    </div>
                    <span style={{ fontSize: 12, width: 64, textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--color-text-secondary)' }}>{fM(c.media)}</span>
                  </div>
                  <p style={{ fontSize: 11, color: st.c, margin: '4px 0 0' }}>{c.diff > 0 ? '+' : ''}{c.diff}% vs. média regional</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
      <Card>
        <CardTitle>Evolução dos últimos 6 meses</CardTitle>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={dadosLinha} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" />
            <XAxis dataKey="mes" tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }} tickFormatter={v => `€${v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend formatter={v => <span style={{ fontSize: 12 }}>{v}</span>} />
            <Line type="monotone" dataKey="receitas" name="Receitas" stroke="#22C55E" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="despesas" name="Despesas" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="poupanca" name="Poupança" stroke="#3B82F6" strokeWidth={1.5} strokeDasharray="4 4" dot={{ r: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
