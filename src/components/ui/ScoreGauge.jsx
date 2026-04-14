export default function ScoreGauge({ score }) {
  const n = score >= 80 ? { l: 'Excelente', c: '#22C55E', e: '🏆' }
    : score >= 60 ? { l: 'Bom', c: '#3B82F6', e: '👍' }
    : score >= 40 ? { l: 'Razoável', c: '#F59E0B', e: '⚡' }
    : score >= 20 ? { l: 'Preocupante', c: '#F97316', e: '⚠️' }
    : { l: 'Crítico', c: '#EF4444', e: '🚨' };
  const r = 60, circ = 2 * Math.PI * r, arc = circ * 0.75, offset = arc - ((score / 100) * arc);
  return (
    <div style={{ textAlign: 'center' }}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#e2e8f0" strokeWidth="10" strokeDasharray={arc} strokeLinecap="round" transform="rotate(135,70,70)" />
        <circle cx="70" cy="70" r={r} fill="none" stroke={n.c} strokeWidth="10" strokeDasharray={arc} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(135,70,70)" style={{ transition: 'stroke-dashoffset 1s ease' }} />
        <text x="70" y="62" textAnchor="middle" fontSize="20">{n.e}</text>
        <text x="70" y="82" textAnchor="middle" fontSize="22" fontWeight="700" fill={n.c}>{score}</text>
        <text x="70" y="96" textAnchor="middle" fontSize="11" fill="#94a3b8">/100</text>
      </svg>
      <p style={{ fontWeight: 600, color: n.c, marginTop: 4 }}>{n.l}</p>
    </div>
  );
}
