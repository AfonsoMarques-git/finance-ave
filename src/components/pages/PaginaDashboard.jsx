import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import Card from '../ui/Card';
import CardTitle from '../ui/CardTitle';
import KpiCard from '../ui/KpiCard';
import Prio from '../ui/Prio';
import PieTooltip from '../charts/PieTooltip';
import CustomTooltip from '../charts/CustomTooltip';
import { getCat, fM, fD } from '../../utils/formatters';

export default function PaginaDashboard({ rel, relAnt, dadosLinha, ultimosLanc, sugestoes }) {
  const vAnt = relAnt || { receitas: 0, totalD: 0, saldo: 0 };
  const varR = vAnt.receitas > 0 ? ((rel.receitas - vAnt.receitas) / vAnt.receitas) * 100 : 0;
  const varD = vAnt.totalD > 0 ? ((rel.totalD - vAnt.totalD) / vAnt.totalD) * 100 : 0;
  const varS = vAnt.saldo !== 0 ? ((rel.saldo - vAnt.saldo) / Math.abs(vAnt.saldo)) * 100 : 0;
  const pieData = rel.gastosPorCat.filter(g => g.total > 0).map(g => {
    const cat = getCat(g.catId);
    return { name: cat?.n || 'Outros', value: g.total, pct: g.pct, fill: cat?.c || '#94a3b8' };
  }).slice(0, 8);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <KpiCard label="Receitas do Mês" valor={rel.receitas} variacao={varR} icone="💰" cor="#22c55e" sub={`${rel.receitas > 0 ? '✅' : '—'} ${rel.total} lançamentos`} />
        <KpiCard label="Despesas do Mês" valor={rel.totalD} variacao={varD} icone="📉" cor="#ef4444" sub={`Fixas: ${fM(rel.fixas)} · Variáveis: ${fM(rel.variaveis)}`} />
        <KpiCard label="Saldo Disponível" valor={rel.saldo} variacao={varS} icone={rel.saldo >= 0 ? '✅' : '⚠️'} cor={rel.saldo >= 0 ? '#3b82f6' : '#ef4444'} sub={`Taxa poupança: ${rel.taxaPoupanca.toFixed(1)}%`} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 16 }}>
        <Card>
          <CardTitle>Distribuição de Despesas</CardTitle>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={2} dataKey="value" animationDuration={600}>
                  {pieData.map((e, i) => <Cell key={i} fill={e.fill} stroke="none" />)}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend formatter={v => <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: 'var(--color-text-tertiary)', fontSize: 13, padding: '2rem', textAlign: 'center' }}>Sem despesas registadas este mês</p>
          )}
        </Card>
        <Card>
          <CardTitle>Evolução Mensal</CardTitle>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={dadosLinha} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }} tickFormatter={v => `€${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={v => <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{v}</span>} />
              <Line type="monotone" dataKey="receitas" name="Receitas" stroke="#22C55E" strokeWidth={2} dot={{ r: 3, fill: '#22C55E' }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="despesas" name="Despesas" stroke="#EF4444" strokeWidth={2} dot={{ r: 3, fill: '#EF4444' }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="poupanca" name="Poupança" stroke="#3B82F6" strokeWidth={1.5} strokeDasharray="4 4" dot={{ r: 2, fill: '#3B82F6' }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 16 }}>
        <Card>
          <CardTitle>Últimos Lançamentos</CardTitle>
          {ultimosLanc.length === 0 ? (
            <p style={{ color: 'var(--color-text-tertiary)', fontSize: 13, padding: '1rem 0' }}>Ainda não tens lançamentos este mês. Começa por adicionar as tuas receitas e despesas fixas.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {ultimosLanc.map((l, i) => {
                const cat = getCat(l.categoriaId);
                return (
                  <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < ultimosLanc.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none' }}>
                    <span style={{ fontSize: 18 }}>{cat?.i || '•'}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.descricao}</p>
                      <p style={{ fontSize: 11, color: 'var(--color-text-tertiary)', margin: 0 }}>{cat?.n} · {fD(l.data)}</p>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: l.tipo === 'r' ? '#16a34a' : '#dc2626', whiteSpace: 'nowrap' }}>{l.tipo === 'r' ? '+' : '-'}{fM(l.valor)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
        <Card>
          <CardTitle>💡 Consultor FinançasAve</CardTitle>
          {sugestoes.length === 0 ? (
            <p style={{ color: 'var(--color-text-tertiary)', fontSize: 13 }}>Adiciona lançamentos para receberes análises personalizadas.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sugestoes.slice(0, 3).map((s, i) => (
                <div key={i} style={{ padding: '10px 12px', borderRadius: 'var(--border-radius-md)', background: 'var(--color-background-secondary)', borderLeft: `3px solid ${s.tipo === 'alerta' ? '#ef4444' : s.tipo === 'parabens' ? '#22c55e' : '#f59e0b'}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <Prio p={s.p} /><span style={{ fontSize: 13, fontWeight: 500 }}>{s.titulo}</span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>{s.desc.slice(0, 120)}…</p>
                </div>
              ))}
              {sugestoes.length > 3 && <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', textAlign: 'center' }}>+{sugestoes.length - 3} sugestões no Consultor</p>}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
