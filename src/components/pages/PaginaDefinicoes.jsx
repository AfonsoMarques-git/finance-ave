import { useState } from 'react';
import Card from '../ui/Card';
import CardTitle from '../ui/CardTitle';

export default function PaginaDefinicoes({ perfil, setPerfil, onCarregarDemo, onReset, darkMode, setDarkMode }) {
  const [p, setP] = useState(perfil || {});
  const salvar = () => { setPerfil({ ...perfil, ...p }); alert('Definições guardadas!'); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card>
        <CardTitle>👤 Perfil Financeiro</CardTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12 }}>
          {[['Nome', p.nome, 'nome', 'text'], ['Rendimento líquido (€)', p.rendimento, 'rendimento', 'number']].map(([l, v, k, t]) => (
            <div key={k}>
              <label style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>{l}</label>
              <input type={t} value={v || ''} onChange={e => setP(pp => ({ ...pp, [k]: t === 'number' ? parseFloat(e.target.value) || 0 : e.target.value }))} style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-secondary)', fontSize: 13, background: 'var(--color-background-secondary)', color: 'var(--color-text-primary)', boxSizing: 'border-box' }} />
            </div>
          ))}
          <div>
            <label style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Agregado familiar</label>
            <select value={p.agregado || 1} onChange={e => setP(pp => ({ ...pp, agregado: parseInt(e.target.value) }))} style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-secondary)', fontSize: 13, background: 'var(--color-background-secondary)', color: 'var(--color-text-primary)' }}>
              {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} pessoa{n > 1 ? 's' : ''}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Meta de poupança: {p.metaPoupanca || 20}%</label>
            <input type="range" min="5" max="50" step="5" value={p.metaPoupanca || 20} onChange={e => setP(pp => ({ ...pp, metaPoupanca: parseInt(e.target.value) }))} style={{ width: '100%' }} />
          </div>
        </div>
        <button onClick={salvar} style={{ marginTop: 16, padding: '8px 20px', borderRadius: 'var(--border-radius-md)', border: 'none', background: '#3b82f6', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>💾 Guardar Definições</button>
      </Card>
      <Card>
        <CardTitle>🛠️ Ferramentas</CardTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 'var(--border-radius-md)', background: 'var(--color-background-secondary)' }}>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>Carregar Dados de Demonstração</p>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--color-text-tertiary)' }}>3 meses de dados fictícios para um vimaranense com €1.182/mês</p>
            </div>
            <button onClick={onCarregarDemo} style={{ padding: '7px 16px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-secondary)', background: 'transparent', fontSize: 13, cursor: 'pointer', color: 'var(--color-text-primary)', whiteSpace: 'nowrap' }}>🎭 Carregar Demo</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 'var(--border-radius-md)', background: 'var(--color-background-secondary)' }}>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>Modo {darkMode ? 'Claro' : 'Escuro'}</p>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--color-text-tertiary)' }}>Alternar entre tema claro e escuro</p>
            </div>
            <button onClick={() => setDarkMode(d => !d)} style={{ padding: '7px 16px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-secondary)', background: 'transparent', fontSize: 13, cursor: 'pointer', color: 'var(--color-text-primary)' }}>{darkMode ? '☀️ Claro' : '🌙 Escuro'}</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 'var(--border-radius-md)', background: '#fff5f5', border: '0.5px solid #fee2e2' }}>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: '#dc2626' }}>Apagar todos os dados</p>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: '#f87171' }}>Esta ação é irreversível</p>
            </div>
            <button onClick={() => { if (confirm('Tens a certeza? Todos os lançamentos serão eliminados.')) onReset(); }} style={{ padding: '7px 16px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid #fca5a5', background: 'transparent', fontSize: 13, cursor: 'pointer', color: '#dc2626' }}>🗑️ Apagar Tudo</button>
          </div>
        </div>
      </Card>
      <Card style={{ background: 'var(--color-background-secondary)' }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', margin: 0, lineHeight: 1.6 }}>🔒 Os teus dados são guardados localmente neste dispositivo. Não são enviados para nenhum servidor. As médias regionais são estimativas baseadas em dados de 2025/2026 para Guimarães, Sub-região do Ave, Região Norte.</p>
      </Card>
    </div>
  );
}
