import { CATS } from '../constants/categories';
import { getCat, uid } from './formatters';

export const calcRel = (lncs, mes) => {
  const lm = lncs.filter(l => l.mesReferencia === mes);
  const receitas = lm.filter(l => l.tipo === 'r').reduce((s, l) => s + l.valor, 0);
  const desp = lm.filter(l => l.tipo === 'd');
  const totalD = desp.reduce((s, l) => s + l.valor, 0);
  const fixas = desp.filter(l => l.subtipo === 'f').reduce((s, l) => s + l.valor, 0);
  const variaveis = desp.filter(l => l.subtipo === 'v').reduce((s, l) => s + l.valor, 0);
  const saldo = receitas - totalD;
  const taxaPoupanca = receitas > 0 ? (saldo / receitas) * 100 : 0;
  const gastosCat = {};
  desp.forEach(l => { gastosCat[l.categoriaId] = (gastosCat[l.categoriaId] || 0) + l.valor; });
  const gastosPorCat = Object.entries(gastosCat)
    .map(([catId, total]) => ({ catId, total, pct: totalD > 0 ? (total / totalD) * 100 : 0 }))
    .sort((a, b) => b.total - a.total);
  const comparativo = gastosPorCat.map(g => {
    const cat = getCat(g.catId);
    if (!cat || !cat.m) return null;
    const diff = (g.total - cat.m) / cat.m * 100;
    const estado = diff <= -10 ? 'abaixo' : diff > 30 ? 'muito_acima' : diff > 10 ? 'acima' : 'na_media';
    return { catId: g.catId, gastoUser: g.total, media: cat.m, diff: Math.round(diff * 10) / 10, estado };
  }).filter(Boolean);
  let score = 50;
  if (taxaPoupanca >= 30) score += 30;
  else if (taxaPoupanca >= 20) score += 25;
  else if (taxaPoupanca >= 10) score += 15;
  else if (taxaPoupanca >= 0) score += 5;
  else score -= 15;
  const ratioF = receitas > 0 ? (fixas / receitas) * 100 : 100;
  if (ratioF <= 40) score += 20;
  else if (ratioF <= 55) score += 10;
  else if (ratioF > 70) score -= 10;
  comparativo.forEach(c => {
    if (c.estado === 'muito_acima') score -= 5;
    if (c.estado === 'abaixo') score += 3;
  });
  return { receitas, totalD, fixas, variaveis, saldo, taxaPoupanca, gastosPorCat, comparativo, score: Math.max(0, Math.min(100, Math.round(score))), total: lm.length };
};

export const gerarSugestoes = (rel, mes) => {
  const sugs = [];
  const g = {};
  rel.gastosPorCat.forEach(c => g[c.catId] = c.total);
  const mesN = parseInt(mes?.split('-')[1] || 0);
  if (rel.taxaPoupanca < 5) sugs.push({ tipo: 'alerta', p: 'alta', titulo: '⚠️ Taxa de poupança crítica', desc: 'A tua taxa de poupança está abaixo de 5%. Estás a viver praticamente mês a mês. A meta recomendada para Guimarães é 20% (Regra 50/30/20). Identifica as 3 despesas variáveis mais altas e tenta cortar 20% em cada uma.', poupanca: null });
  else if (rel.taxaPoupanca >= 30) sugs.push({ tipo: 'parabens', p: 'baixa', titulo: '🏆 Taxa de poupança excelente!', desc: 'Mais de 30% de poupança é notável. Com esta disciplina em Guimarães, podes acumular para entrada de casa própria mais rapidamente — o imobiliário no Ave ainda é mais acessível que no Porto. Considera ETFs globais (ex: VWCE).', poupanca: null });
  else if (rel.taxaPoupanca >= 20) sugs.push({ tipo: 'parabens', p: 'baixa', titulo: '🎉 Boa taxa de poupança!', desc: 'Estás a poupar entre 20-30% — acima da meta mínima! Considera diversificar: Certificados de Aforro (IGCP.pt), PPR com benefício fiscal IRS até €400/ano, ou ETFs de baixo custo via DEGIRO.', poupanca: null });
  if ((g.habitacao || 0) > 650) sugs.push({ tipo: 'alerta', p: 'alta', titulo: '🏠 Habitação acima da média regional', desc: 'O teu gasto com habitação excede €650. A média em Guimarães é €520 (T1 centro). Zonas como Caldas das Taipas, Brito ou Fermentões têm rendas 20-25% mais baixas. Se tens crédito habitação, considera renegociar o spread ou transferir o crédito.', poupanca: 80 });
  if ((g.alimentacao || 0) > 280) sugs.push({ tipo: 'otimizacao', p: 'media', titulo: '🛒 Supermercado acima do esperado', desc: 'Para uma pessoa sozinha em Guimarães, a média é €230/mês. O Mercado Municipal de Guimarães tem frescos 15-25% mais baratos. As feiras de terça e sexta também. Usa a app Folhetos.app para comparar promoções no Continente, Pingo Doce, Lidl e Mercadona.', poupanca: 40 });
  if ((g.restauracao || 0) > 120) sugs.push({ tipo: 'otimizacao', p: 'media', titulo: '🍽️ Restauração a consumir margem', desc: 'Estás a gastar mais de €120/mês em restaurantes — a média regional é €80. Menus nas zonas industriais (Campelos, Pevidém) custam €6.50-€8.00 com sopa, prato e café. Reduzir cafés de 3 para 1/dia poupa ~€15/mês.', poupanca: 35 });
  if ((g.transporte || 0) > 200) sugs.push({ tipo: 'otimizacao', p: 'media', titulo: '🚗 Custos de transporte elevados', desc: 'Os teus gastos com transporte excedem €200/mês. O passe CIM do Ave (€40/mês) cobre autocarros e comboio para Braga e Porto. Usar transporte público 3 dias/semana pode reduzir combustível em 40%. Compara seguros no ComparaJá.pt.', poupanca: 50 });
  if ((g.servicos || 0) > 150) sugs.push({ tipo: 'otimizacao', p: 'alta', titulo: '⚡ Serviços essenciais acima da média', desc: 'A média em Guimarães é €120/mês. Ações: 1) Compara fornecedores de eletricidade no simulador da ERSE — mudar para Iberdrola ou Coopernico poupa 10-15%. 2) Renegocia telecomunicações (linha de retenção). 3) Verifica tarifa social Vimágua.', poupanca: 25 });
  if ((g.lazer || 0) > 100) sugs.push({ tipo: 'otimizacao', p: 'baixa', titulo: '🎭 Lazer acima do orçamentado', desc: 'Guimarães tem opções gratuitas: Centro Cultural Vila Flor, Parque da Cidade, Montanha da Penha. Streaming: partilhar contas familiares poupa 50%. Ginásios municipais são mais baratos que cadeias comerciais.', poupanca: 25 });
  if ([11, 12, 1, 2, 3].includes(mesN) && (g.servicos || 0) > 130) sugs.push({ tipo: 'otimizacao', p: 'media', titulo: '🌧️ Poupança energética de inverno', desc: 'Inverno em Guimarães é frio e húmido. Dicas: aquecedor a óleo é mais eficiente que termoventilador. Tarifa bi-horária pode compensar se usas mais energia à noite. Fitas vedantes nas janelas (<€10) reduzem perdas térmicas.', poupanca: 20 });
  if ([6, 7].includes(mesN)) sugs.push({ tipo: 'otimizacao', p: 'media', titulo: '📋 Subsídio de férias: oportunidade', desc: 'Mês de subsídio de férias! Usa este rendimento extra para reforçar o fundo de emergência, amortizar dívidas ou investir. Destina pelo menos 50% do subsídio a poupança ou investimento — não o trates como dinheiro "extra" para gastar.', poupanca: null });
  if ([11, 12].includes(mesN)) sugs.push({ tipo: 'alerta', p: 'media', titulo: '🎄 Atenção aos gastos de Natal', desc: 'Novembro e dezembro trazem gastos adicionais (presentes, jantares, Nicolinas em Guimarães). Define um orçamento máximo para presentes. O comércio tradicional vimaranense pode ter preços mais competitivos que grandes cadeias.', poupanca: null });
  return sugs.slice(0, 8);
};

export const gerarDadosDemo = () => {
  const hoje = new Date();
  const meses = [];
  for (let i = 2; i >= 0; i--) {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
    meses.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  const items = [];
  const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const add = (tipo, subtipo, catId, sub, desc, valor, dia, mes) => items.push({ id: uid(), tipo, subtipo, categoriaId: catId, subcategoria: sub, descricao: desc, valor, data: `${mes}-${String(dia).padStart(2, '0')}`, mesReferencia: mes, criadoEm: new Date().toISOString() });
  meses.forEach(mes => {
    add('r', 'f', 'salario', 'Salário Líquido', 'Vencimento mensal', 1050, 5, mes);
    add('r', 'f', 'salario', 'Subsídio Alimentação', 'Subsídio alimentação', 132, 5, mes);
    add('d', 'f', 'habitacao', 'Renda', 'Renda T2 — Fermentões', 500, 1, mes);
    add('d', 'f', 'servicos', 'Eletricidade', 'EDP Comercial', 45, 10, mes);
    add('d', 'f', 'servicos', 'Água (Vimágua)', 'Fatura Vimágua', 22, 12, mes);
    add('d', 'f', 'servicos', 'Internet/TV', 'NOS Triple Play', 42, 15, mes);
    add('d', 'v', 'lazer', 'Streaming', 'Netflix + Spotify', 22, 5, mes);
    add('d', 'v', 'lazer', 'Ginásio', 'Fitness Hut Guimarães', 30, 1, mes);
    add('d', 'v', 'alimentacao', 'Supermercado', 'Continente GuimarãeShopping', rnd(85, 115), 8, mes);
    add('d', 'v', 'alimentacao', 'Supermercado', 'Pingo Doce Guimarães', rnd(55, 80), 18, mes);
    add('d', 'v', 'alimentacao', 'Mercado Municipal', 'Mercado Municipal de Guimarães', rnd(28, 42), 20, mes);
    add('d', 'v', 'restauracao', 'Almoço', 'Almoços — zona industrial Pevidém', rnd(50, 72), 15, mes);
    add('d', 'v', 'restauracao', 'Cafés', 'Café ao longo do mês', rnd(16, 26), 28, mes);
    add('d', 'v', 'transporte', 'Combustível', 'Gasolina 95 — Galp Guimarães', rnd(80, 105), 10, mes);
    add('d', 'v', 'saude', 'Farmácia', 'Farmácia Guimarães', rnd(12, 28), 22, mes);
    add('d', 'v', 'cuidados', 'Cabeleireiro', 'Barbeiro', 10, 14, mes);
    add('d', 'v', 'outros', 'Outros', 'Despesas diversas', rnd(18, 38), 25, mes);
  });
  return items;
};
