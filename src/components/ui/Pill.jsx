export default function Pill({ tipo }) {
  const cfg = {
    alerta: { bg: '#fee2e2', c: '#dc2626', t: 'Alerta' },
    otimizacao: { bg: '#fef3c7', c: '#d97706', t: 'Otimização' },
    parabens: { bg: '#dcfce7', c: '#16a34a', t: 'Parabéns' },
  };
  const s = cfg[tipo] || cfg.otimizacao;
  return (
    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: s.bg, color: s.c, fontWeight: 500 }}>{s.t}</span>
  );
}
