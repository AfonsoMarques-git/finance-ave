import { useState, useMemo, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { calcRel, gerarSugestoes, gerarDadosDemo } from './utils/calculations';
import { getMesAtual, getMesShort, navMes, getSaudacao, getMesLabel, uid } from './utils/formatters';
import Onboarding from './components/Onboarding';
import ModalLancamento from './components/ModalLancamento';
import PaginaDashboard from './components/pages/PaginaDashboard';
import PaginaLancamentos from './components/pages/PaginaLancamentos';
import PaginaRelatorios from './components/pages/PaginaRelatorios';
import PaginaOrcamento from './components/pages/PaginaOrcamento';
import PaginaConsultor from './components/pages/PaginaConsultor';
import PaginaDefinicoes from './components/pages/PaginaDefinicoes';

const navItems = [
  { id: 'dashboard', l: 'Dashboard', i: '📊' },
  { id: 'lancamentos', l: 'Lançamentos', i: '📝' },
  { id: 'relatorios', l: 'Relatórios', i: '📈' },
  { id: 'orcamento', l: 'Orçamento', i: '💰' },
  { id: 'consultor', l: 'Consultor', i: '🧠' },
  { id: 'definicoes', l: 'Definições', i: '⚙️' },
];

export default function FinancasAve() {
  const [perfil, setPerfil] = useLocalStorage('perfil', null);
  const [lancamentos, setLancamentos] = useLocalStorage('lancamentos', []);
  const [orcamentos, setOrcamentos] = useLocalStorage('orcamentos', {});
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  const [mesAtual, setMesAtual] = useState(getMesAtual());
  const [pagina, setPagina] = useState('dashboard');
  const [modalAberto, setModalAberto] = useState(false);
  const [lancEdit, setLancEdit] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const rel = useMemo(() => calcRel(lancamentos, mesAtual), [lancamentos, mesAtual]);
  const relAnt = useMemo(() => calcRel(lancamentos, navMes(mesAtual, -1)), [lancamentos, mesAtual]);
  const sugestoes = useMemo(() => gerarSugestoes(rel, mesAtual), [rel, mesAtual]);
  const dadosLinha = useMemo(() => {
    const hoje = new Date();
    const out = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const mr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const r = calcRel(lancamentos, mr);
      out.push({ mes: getMesShort(mr), receitas: r.receitas, despesas: r.totalD, poupanca: Math.max(0, r.saldo) });
    }
    return out;
  }, [lancamentos]);

  const ultimosLanc = useMemo(() =>
    lancamentos.filter(l => l.mesReferencia === mesAtual).sort((a, b) => new Date(b.data) - new Date(a.data)).slice(0, 8),
    [lancamentos, mesAtual]
  );

  const adicionarLanc = useCallback(dados => {
    const novo = { ...dados, id: uid(), criadoEm: new Date().toISOString() };
    setLancamentos(p => [...p, novo]);
    showToast('✅ Lançamento guardado com sucesso!');
    setModalAberto(false);
    setLancEdit(null);
  }, []);

  const editarLanc = useCallback((id, dados) => {
    setLancamentos(p => p.map(l => l.id === id ? { ...l, ...dados } : l));
    showToast('✅ Lançamento atualizado!');
    setModalAberto(false);
    setLancEdit(null);
  }, []);

  const removerLanc = useCallback(id => {
    setLancamentos(p => p.filter(l => l.id !== id));
    showToast('🗑️ Lançamento eliminado.');
  }, []);

  const carregarDemo = () => {
    setLancamentos(gerarDadosDemo());
    if (!perfil) setPerfil({ nome: 'Demo', rendimento: 1182, agregado: 1, habitacao: 'arrendamento', zona: 'periferia', tipologia: 't2', veiculo: true, combustivel: 'gasolina', metaPoupanca: 20, id: uid(), dataCriacao: new Date().toISOString() });
    showToast('🎭 Dados de demonstração carregados!');
  };

  if (!perfil) return <Onboarding onConcluir={p => { setPerfil(p); }} />;

  return (
    <div className={darkMode ? 'dark' : ''} style={{ minHeight: '100vh', display: 'flex', fontFamily: 'var(--font-sans)', fontSize: 14 }}>
      {/* Sidebar */}
      <aside style={{ width: 200, flexShrink: 0, background: 'var(--color-background-primary)', borderRight: '0.5px solid var(--color-border-tertiary)', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1rem', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
          <p style={{ fontWeight: 500, fontSize: 15, margin: 0, color: '#2563eb' }}>🏦 FinançasAve</p>
          <p style={{ fontSize: 11, color: 'var(--color-text-tertiary)', margin: '2px 0 0' }}>📍 Guimarães, Minho</p>
        </div>
        <nav style={{ flex: 1, padding: '0.75rem 0.5rem', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setPagina(item.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 'var(--border-radius-md)', border: 'none', background: pagina === item.id ? '#eff6ff' : 'transparent', color: pagina === item.id ? '#2563eb' : 'var(--color-text-secondary)', fontSize: 13, cursor: 'pointer', textAlign: 'left', fontWeight: pagina === item.id ? 500 : 400 }}>
              <span style={{ fontSize: 15 }}>{item.i}</span>{item.l}
            </button>
          ))}
        </nav>
        <div style={{ padding: '0.75rem', borderTop: '0.5px solid var(--color-border-tertiary)', fontSize: 11, color: 'var(--color-text-tertiary)', lineHeight: 1.4, textAlign: 'center' }}>
          Dados guardados no browser · v1.0
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header */}
        <header style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--color-background-primary)', borderBottom: '0.5px solid var(--color-border-tertiary)', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>{getSaudacao()}, {perfil.nome}! 👋</p>
            <p style={{ margin: 0, fontSize: 11, color: 'var(--color-text-tertiary)' }}>Guimarães, Sub-região do Ave</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button onClick={() => setMesAtual(navMes(mesAtual, -1))} style={{ padding: '5px 10px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-secondary)', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: 13 }}>◀</button>
            <span style={{ fontSize: 13, fontWeight: 500, minWidth: 140, textAlign: 'center' }}>{getMesLabel(mesAtual)}</span>
            <button onClick={() => setMesAtual(navMes(mesAtual, 1))} style={{ padding: '5px 10px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-secondary)', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: 13 }}>▶</button>
          </div>
          <button onClick={() => { setLancEdit(null); setModalAberto(true); }} style={{ padding: '8px 16px', borderRadius: 'var(--border-radius-md)', border: 'none', background: '#3b82f6', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Novo Lançamento
          </button>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: '1.5rem', overflow: 'auto' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            {pagina === 'dashboard' && <PaginaDashboard rel={rel} relAnt={relAnt} dadosLinha={dadosLinha} ultimosLanc={ultimosLanc} sugestoes={sugestoes} />}
            {pagina === 'lancamentos' && <PaginaLancamentos lancamentos={lancamentos.filter(l => l.mesReferencia === mesAtual).sort((a, b) => new Date(b.data) - new Date(a.data))} onEdit={l => { setLancEdit(l); setModalAberto(true); }} onDelete={removerLanc} />}
            {pagina === 'relatorios' && <PaginaRelatorios rel={rel} mes={mesAtual} dadosLinha={dadosLinha} />}
            {pagina === 'orcamento' && <PaginaOrcamento rel={rel} orcamentos={orcamentos} setOrcamentos={setOrcamentos} />}
            {pagina === 'consultor' && <PaginaConsultor rel={rel} sugestoes={sugestoes} />}
            {pagina === 'definicoes' && <PaginaDefinicoes perfil={perfil} setPerfil={setPerfil} onCarregarDemo={carregarDemo} onReset={() => { setLancamentos([]); setOrcamentos({}); showToast('🗑️ Todos os dados foram eliminados.'); }} darkMode={darkMode} setDarkMode={setDarkMode} />}
          </div>
        </main>

        {/* Mobile bottom nav */}
        <nav style={{ display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0, background: 'var(--color-background-primary)', borderTop: '0.5px solid var(--color-border-tertiary)', justifyContent: 'space-around', padding: '8px 0', zIndex: 20 }}>
          {navItems.slice(0, 5).map(item => (
            <button key={item.id} onClick={() => setPagina(item.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '4px 8px', border: 'none', background: 'transparent', cursor: 'pointer', color: pagina === item.id ? '#3b82f6' : 'var(--color-text-tertiary)', fontSize: 9 }}>
              <span style={{ fontSize: 20 }}>{item.i}</span>{item.l}
            </button>
          ))}
        </nav>
      </div>

      {/* Modal */}
      {modalAberto && (
        <ModalLancamento
          lancamento={lancEdit}
          mesAtual={mesAtual}
          onGuardar={dados => { if (lancEdit) editarLanc(lancEdit.id, dados); else adicionarLanc(dados); }}
          onFechar={() => { setModalAberto(false); setLancEdit(null); }}
        />
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-secondary)', borderRadius: 'var(--border-radius-lg)', padding: '10px 20px', fontSize: 13, fontWeight: 500, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 200, whiteSpace: 'nowrap', color: 'var(--color-text-primary)' }}>{toast}</div>
      )}
    </div>
  );
}
