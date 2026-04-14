import { useState } from 'react';
import { uid } from '../utils/formatters';

export default function Onboarding({ onConcluir }) {
  const [step, setStep] = useState(1);
  const [d, setD] = useState({ nome: '', rendimento: 1100, agregado: 1, habitacao: 'arrendamento', zona: 'periferia', tipologia: 't2', veiculo: true, combustivel: 'gasolina', metaPoupanca: 20 });
  const set = (k, v) => setD(p => ({ ...p, [k]: v }));

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'var(--color-background-secondary)' }}>
      <div style={{ width: '100%', maxWidth: 440, background: 'var(--color-background-primary)', borderRadius: 'var(--border-radius-xl)', padding: '2rem', border: '0.5px solid var(--color-border-tertiary)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 28 }}>
          {[1, 2, 3, 4].map(i => <div key={i} style={{ height: 4, borderRadius: 2, transition: 'width 0.3s,background 0.3s', width: i === step ? 32 : 8, background: i <= step ? '#3b82f6' : 'var(--color-border-tertiary)' }} />)}
        </div>

        {step === 1 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🏦</div>
            <h1 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 500 }}>Bem-vindo ao FinançasAve!</h1>
            <p style={{ color: '#3b82f6', fontStyle: 'italic', margin: '0 0 16px', fontSize: 14 }}>"A tua bússola financeira no coração do Minho"</p>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 13, lineHeight: 1.6, margin: '0 0 20px' }}>Vamos configurar a tua conta em menos de 2 minutos. Esta informação personaliza a análise para a realidade de Guimarães.</p>
            <div style={{ background: 'var(--color-background-secondary)', borderRadius: 'var(--border-radius-md)', padding: '10px 14px', fontSize: 12, color: 'var(--color-text-tertiary)', marginBottom: 20 }}>🔒 Os dados ficam apenas no teu dispositivo.</div>
            <button onClick={() => setStep(2)} style={{ width: '100%', padding: '12px', borderRadius: 'var(--border-radius-md)', border: 'none', background: '#3b82f6', color: '#fff', fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>Começar →</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 500 }}>Dados Pessoais</h2>
            {[['Como te chamas?', 'nome', 'text', 'O teu nome'], ['Rendimento mensal líquido (€)', 'rendimento', 'number', 'ex: 1.100']].map(([l, k, t, ph]) => (
              <div key={k} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>{l}</label>
                <input type={t} value={d[k]} onChange={e => set(k, t === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)} placeholder={ph} style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-secondary)', fontSize: 14, background: 'var(--color-background-secondary)', color: 'var(--color-text-primary)', boxSizing: 'border-box' }} />
              </div>
            ))}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Pessoas no agregado</label>
              <select value={d.agregado} onChange={e => set('agregado', parseInt(e.target.value))} style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-secondary)', fontSize: 14, background: 'var(--color-background-secondary)', color: 'var(--color-text-primary)' }}>
                {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} pessoa{n > 1 ? 's' : ''}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, padding: '10px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-secondary)', background: 'transparent', fontSize: 14, cursor: 'pointer', color: 'var(--color-text-secondary)' }}>← Voltar</button>
              <button onClick={() => { if (d.nome.trim()) setStep(3); }} style={{ flex: 2, padding: '10px', borderRadius: 'var(--border-radius-md)', border: 'none', background: '#3b82f6', color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Continuar →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 500 }}>Habitação e Transporte</h2>
            <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 8 }}>Situação habitacional</p>
            {[['arrendamento', 'Arrendamento'], ['creditoHabitacao', 'Crédito Habitação'], ['casaPropria', 'Casa Própria (paga)'], ['comFamilia', 'Vivo com família']].map(([v, l]) => (
              <label key={v} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, cursor: 'pointer', fontSize: 13 }}>
                <input type="radio" name="hab" checked={d.habitacao === v} onChange={() => set('habitacao', v)} style={{ accentColor: '#3b82f6' }} />{l}
              </label>
            ))}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12, marginBottom: 14 }}>
              {[['Zona', 'zona', [['centro', 'Centro'], ['periferia', 'Periferia']]], ['Tipologia', 'tipologia', [['t1', 'T1'], ['t2', 'T2'], ['t3', 'T3+']]]].map(([l, k, opts]) => (
                <div key={k}>
                  <label style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>{l}</label>
                  <select value={d[k]} onChange={e => set(k, e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-secondary)', fontSize: 13, background: 'var(--color-background-secondary)', color: 'var(--color-text-primary)' }}>
                    {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 6 }}>Veículo próprio?</p>
            <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
              {[[true, 'Sim'], [false, 'Não']].map(([v, l]) => (
                <label key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13 }}>
                  <input type="radio" name="vei" checked={d.veiculo === v} onChange={() => set('veiculo', v)} style={{ accentColor: '#3b82f6' }} />{l}
                </label>
              ))}
            </div>
            {d.veiculo && (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
                {['gasolina', 'gasoleo', 'eletrico', 'hibrido'].map(c => (
                  <label key={c} style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', fontSize: 12 }}>
                    <input type="radio" name="comb" checked={d.combustivel === c} onChange={() => set('combustivel', c)} style={{ accentColor: '#3b82f6' }} /><span style={{ textTransform: 'capitalize' }}>{c}</span>
                  </label>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={() => setStep(2)} style={{ flex: 1, padding: '10px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-secondary)', background: 'transparent', fontSize: 14, cursor: 'pointer', color: 'var(--color-text-secondary)' }}>← Voltar</button>
              <button onClick={() => setStep(4)} style={{ flex: 2, padding: '10px', borderRadius: 'var(--border-radius-md)', border: 'none', background: '#3b82f6', color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Continuar →</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 500 }}>Meta de Poupança</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
              <span>Meta mensal</span>
              <span style={{ fontWeight: 500, color: '#3b82f6' }}>{d.metaPoupanca}%</span>
            </div>
            <input type="range" min="5" max="50" step="5" value={d.metaPoupanca} onChange={e => set('metaPoupanca', parseInt(e.target.value))} style={{ width: '100%', accentColor: '#3b82f6' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--color-text-tertiary)', marginBottom: 16 }}>
              <span>5%</span><span>50%</span>
            </div>
            <div style={{ background: 'var(--color-background-secondary)', borderRadius: 'var(--border-radius-md)', padding: '14px 16px', marginBottom: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 10, color: 'var(--color-text-primary)' }}>🎯 Regra 55/25/20 — Guimarães</p>
              {[['Necessidades (habitação, alimentação…)', '55%'], ['Desejos (lazer, restauração…)', '25%'], ['Poupança / Investimento', '20% ✓']].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>{l}</span>
                  <span style={{ fontWeight: 500 }}>{v}</span>
                </div>
              ))}
              <div style={{ borderTop: '0.5px solid var(--color-border-tertiary)', marginTop: 10, paddingTop: 10, fontSize: 12, color: '#3b82f6' }}>
                Com €{d.rendimento}/mês, deves poupar pelo menos €{Math.round(d.rendimento * d.metaPoupanca / 100)}/mês
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setStep(3)} style={{ flex: 1, padding: '10px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-secondary)', background: 'transparent', fontSize: 14, cursor: 'pointer', color: 'var(--color-text-secondary)' }}>← Voltar</button>
              <button onClick={() => onConcluir({ ...d, id: uid(), dataCriacao: new Date().toISOString() })} style={{ flex: 2, padding: '10px', borderRadius: 'var(--border-radius-md)', border: 'none', background: '#22c55e', color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>✓ Concluir Configuração</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
