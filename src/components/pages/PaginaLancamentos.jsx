import { useState } from 'react';
import Card from '../ui/Card';
import { getCat, fM, fD } from '../../utils/formatters';

export default function PaginaLancamentos({ lancamentos, onEdit, onDelete }) {
  const [filtro, setFiltro] = useState({ tipo: 'todos', busca: '' });
  const filtrados = lancamentos.filter(l =>
    (filtro.tipo === 'todos' || l.tipo === filtro.tipo) &&
    (!filtro.busca || l.descricao.toLowerCase().includes(filtro.busca.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card style={{ padding: '0.875rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            value={filtro.busca}
            onChange={e => setFiltro(p => ({ ...p, busca: e.target.value }))}
            placeholder="Pesquisar lançamentos…"
            style={{ flex: 1, minWidth: 160, padding: '7px 12px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-secondary)', fontSize: 13, background: 'var(--color-background-secondary)', color: 'var(--color-text-primary)' }}
          />
          {['todos', 'r', 'd'].map(t => (
            <button key={t} onClick={() => setFiltro(p => ({ ...p, tipo: t }))} style={{ padding: '6px 14px', borderRadius: 'var(--border-radius-md)', border: `0.5px solid ${filtro.tipo === t ? '#3b82f6' : 'var(--color-border-secondary)'}`, background: filtro.tipo === t ? '#3b82f6' : 'transparent', color: filtro.tipo === t ? '#fff' : 'var(--color-text-secondary)', fontSize: 13, cursor: 'pointer' }}>
              {t === 'todos' ? 'Todos' : t === 'r' ? 'Receitas' : 'Despesas'}
            </button>
          ))}
        </div>
      </Card>
      <Card style={{ padding: 0 }}>
        {filtrados.length === 0 ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-tertiary)', fontSize: 13 }}>Nenhum lançamento encontrado.</p>
        ) : filtrados.map((l, i) => {
          const cat = getCat(l.categoriaId);
          return (
            <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: i < filtrados.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none' }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{cat?.i || '•'}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>{l.descricao}</p>
                  <span style={{ fontSize: 11, padding: '1px 6px', borderRadius: 20, background: l.subtipo === 'f' ? '#eff6ff' : '#f0fdf4', color: l.subtipo === 'f' ? '#1d4ed8' : '#15803d' }}>{l.subtipo === 'f' ? 'Fixa' : 'Variável'}</span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', margin: '2px 0 0' }}>{cat?.n}{l.subcategoria ? ` · ${l.subcategoria}` : ''} · {fD(l.data)}</p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: l.tipo === 'r' ? '#16a34a' : '#dc2626' }}>{l.tipo === 'r' ? '+' : '-'}{fM(l.valor)}</p>
              </div>
              <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                <button onClick={() => onEdit(l)} style={{ padding: '4px 10px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-secondary)', fontSize: 12, cursor: 'pointer', background: 'transparent', color: 'var(--color-text-secondary)' }}>✏️</button>
                <button onClick={() => { if (confirm('Eliminar este lançamento?')) onDelete(l.id); }} style={{ padding: '4px 10px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid #fee2e2', fontSize: 12, cursor: 'pointer', background: 'transparent', color: '#dc2626' }}>🗑️</button>
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
