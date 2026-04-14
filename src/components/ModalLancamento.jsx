import { useState } from 'react';
import { CATS } from '../constants/categories';
import { getCat } from '../utils/formatters';

export default function ModalLancamento({ lancamento, mesAtual, onGuardar, onFechar }) {
  const hoje = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    tipo: lancamento?.tipo || 'd',
    subtipo: lancamento?.subtipo || 'v',
    categoriaId: lancamento?.categoriaId || '',
    subcategoria: lancamento?.subcategoria || '',
    descricao: lancamento?.descricao || '',
    valor: lancamento?.valor || '',
    data: lancamento?.data || hoje,
    mesReferencia: lancamento?.mesReferencia || mesAtual,
    recorrente: lancamento?.recorrente || false,
    frequenciaRecorrencia: lancamento?.frequenciaRecorrencia || 'mensal',
  });
  const [erro, setErro] = useState('');
  const catsF = CATS.filter(c => c.t === form.tipo);
  const catAtual = getCat(form.categoriaId);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const guardar = () => {
    if (!form.categoriaId) { setErro('Seleciona uma categoria.'); return; }
    if (!form.descricao.trim()) { setErro('Adiciona uma descrição.'); return; }
    if (!form.valor || isNaN(parseFloat(form.valor)) || parseFloat(form.valor) <= 0) { setErro('Insere um valor válido e positivo.'); return; }
    if (!form.data) { setErro('Seleciona uma data.'); return; }
    onGuardar({ ...form, valor: parseFloat(parseFloat(form.valor).toFixed(2)), mesReferencia: form.data.slice(0, 7) });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100 }} onClick={e => { if (e.target === e.currentTarget) onFechar(); }}>
      <div style={{ background: 'var(--color-background-primary)', borderRadius: 'var(--border-radius-xl) var(--border-radius-xl) 0 0', width: '100%', maxWidth: 520, maxHeight: '90vh', overflow: 'auto', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 500 }}>{lancamento ? 'Editar Lançamento' : 'Novo Lançamento'}</h2>
          <button onClick={onFechar} style={{ border: 'none', background: 'transparent', fontSize: 20, cursor: 'pointer', color: 'var(--color-text-secondary)' }}>✕</button>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {[['r', '💰 Receita', '#dcfce7', '#15803d'], ['d', '💸 Despesa', '#fee2e2', '#dc2626']].map(([v, l, bg, c]) => (
            <button key={v} onClick={() => { set('tipo', v); set('categoriaId', ''); set('subcategoria', ''); }} style={{ flex: 1, padding: '10px', borderRadius: 'var(--border-radius-md)', border: `1.5px solid ${form.tipo === v ? c : 'var(--color-border-tertiary)'}`, background: form.tipo === v ? bg : 'transparent', color: form.tipo === v ? c : 'var(--color-text-secondary)', fontSize: 14, fontWeight: form.tipo === v ? 500 : 400, cursor: 'pointer' }}>{l}</button>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Valor (€) *</label>
            <input type="number" step="0.01" min="0" value={form.valor} onChange={e => set('valor', e.target.value)} placeholder="0,00" style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-secondary)', fontSize: 16, fontWeight: 500, background: 'var(--color-background-secondary)', color: 'var(--color-text-primary)', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Categoria *</label>
            <select value={form.categoriaId} onChange={e => { set('categoriaId', e.target.value); set('subcategoria', ''); const c = getCat(e.target.value); if (c) set('subtipo', c.s); }} style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-secondary)', fontSize: 13, background: 'var(--color-background-secondary)', color: 'var(--color-text-primary)' }}>
              <option value="">Selecionar categoria…</option>
              {catsF.map(c => <option key={c.id} value={c.id}>{c.i} {c.n}</option>)}
            </select>
          </div>
          {catAtual?.sub && (
            <div>
              <label style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Subcategoria</label>
              <select value={form.subcategoria} onChange={e => set('subcategoria', e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-secondary)', fontSize: 13, background: 'var(--color-background-secondary)', color: 'var(--color-text-primary)' }}>
                <option value="">Selecionar…</option>
                {catAtual.sub.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          )}
          <div>
            <label style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Descrição *</label>
            <input type="text" value={form.descricao} onChange={e => set('descricao', e.target.value)} placeholder="Ex: Compras no Continente GuimarãeShopping" style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-secondary)', fontSize: 13, background: 'var(--color-background-secondary)', color: 'var(--color-text-primary)', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Data *</label>
              <input type="date" value={form.data} onChange={e => set('data', e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-secondary)', fontSize: 13, background: 'var(--color-background-secondary)', color: 'var(--color-text-primary)', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Tipo *</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {[['f', '🔒 Fixa'], ['v', '📊 Variável']].map(([v, l]) => (
                  <button key={v} onClick={() => set('subtipo', v)} style={{ flex: 1, padding: '8px 4px', borderRadius: 'var(--border-radius-md)', border: `0.5px solid ${form.subtipo === v ? '#3b82f6' : 'var(--color-border-secondary)'}`, background: form.subtipo === v ? '#eff6ff' : 'transparent', color: form.subtipo === v ? '#1d4ed8' : 'var(--color-text-secondary)', fontSize: 11, cursor: 'pointer' }}>{l}</button>
                ))}
              </div>
            </div>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.recorrente} onChange={e => set('recorrente', e.target.checked)} style={{ width: 16, height: 16, accentColor: '#3b82f6' }} />
            <span style={{ fontSize: 13 }}>Lançamento recorrente</span>
          </label>
          {form.recorrente && (
            <div>
              <label style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Frequência</label>
              <select value={form.frequenciaRecorrencia} onChange={e => set('frequenciaRecorrencia', e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-secondary)', fontSize: 13, background: 'var(--color-background-secondary)', color: 'var(--color-text-primary)' }}>
                <option value="mensal">Mensal</option>
                <option value="trimestral">Trimestral</option>
                <option value="semestral">Semestral</option>
                <option value="anual">Anual</option>
              </select>
            </div>
          )}
        </div>
        {erro && <p style={{ fontSize: 12, color: '#dc2626', marginTop: 12, padding: '8px 12px', background: '#fee2e2', borderRadius: 'var(--border-radius-md)' }}>{erro}</p>}
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button onClick={onFechar} style={{ flex: 1, padding: '11px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-secondary)', background: 'transparent', fontSize: 14, cursor: 'pointer', color: 'var(--color-text-secondary)' }}>Cancelar</button>
          <button onClick={guardar} style={{ flex: 2, padding: '11px', borderRadius: 'var(--border-radius-md)', border: 'none', background: '#3b82f6', color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>💾 Guardar Lançamento</button>
        </div>
      </div>
    </div>
  );
}
