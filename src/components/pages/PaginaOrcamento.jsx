import { useState } from 'react';
import { CATS } from '../../constants/categories';
import Card from '../ui/Card';
import CardTitle from '../ui/CardTitle';
import { fM } from '../../utils/formatters';

export default function PaginaOrcamento({ rel, orcamentos, setOrcamentos }) {
  const [editId, setEditId] = useState(null);
  const [editVal, setEditVal] = useState('');
  const despCats = CATS.filter(c => c.t === 'd');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card>
        <CardTitle>💰 Orçamento por Categoria</CardTitle>
        <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', margin: '-8px 0 16px' }}>Define limites mensais e acompanha o teu progresso. Clica no limite para editar.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {despCats.map(cat => {
            const gasto = (rel.gastosPorCat.find(g => g.catId === cat.id) || { total: 0 }).total;
            const lim = orcamentos[cat.id] || 0;
            const pct = lim > 0 ? Math.min((gasto / lim) * 100, 100) : 0;
            const over = gasto > lim && lim > 0;
            const barCol = pct < 60 ? '#22C55E' : pct < 85 ? '#F59E0B' : pct < 100 ? '#F97316' : '#EF4444';
            return (
              <div key={cat.id}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{cat.i} {cat.n}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{fM(gasto)}</span>
                    <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>/</span>
                    {editId === cat.id ? (
                      <div style={{ display: 'flex', gap: 4 }}>
                        <input type="number" value={editVal} onChange={e => setEditVal(e.target.value)} style={{ width: 80, padding: '2px 6px', fontSize: 12, border: '0.5px solid var(--color-border-secondary)', borderRadius: 'var(--border-radius-md)', background: 'var(--color-background-secondary)', color: 'var(--color-text-primary)' }} autoFocus />
                        <button onClick={() => { setOrcamentos(p => ({ ...p, [cat.id]: parseFloat(editVal) || 0 })); setEditId(null); }} style={{ padding: '2px 8px', fontSize: 12, borderRadius: 'var(--border-radius-md)', border: 'none', background: '#3b82f6', color: '#fff', cursor: 'pointer' }}>✓</button>
                        <button onClick={() => setEditId(null)} style={{ padding: '2px 8px', fontSize: 12, borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-secondary)', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-secondary)' }}>✕</button>
                      </div>
                    ) : (
                      <button onClick={() => { setEditId(cat.id); setEditVal(String(lim || cat.m || 0)); }} style={{ fontSize: 12, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-secondary)', textDecoration: 'underline dotted', padding: 0 }}>
                        {lim > 0 ? fM(lim) : 'Definir'}
                      </button>
                    )}
                    {over && <span style={{ fontSize: 11, color: '#dc2626', fontWeight: 600 }}>🔴 EXCEDIDO</span>}
                    {!over && lim > 0 && pct >= 85 && <span style={{ fontSize: 11, color: '#f97316' }}>⚠️</span>}
                    {!over && lim > 0 && pct < 85 && <span style={{ fontSize: 11, color: '#22c55e' }}>✅</span>}
                  </div>
                </div>
                {lim > 0 && (
                  <div style={{ background: 'var(--color-background-tertiary)', borderRadius: 4, height: 8 }}>
                    <div style={{ width: `${pct}%`, height: 8, borderRadius: 4, background: barCol, transition: 'width 0.5s', animation: over ? 'pulse 1s infinite' : '' }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
