import { CATS, MESES } from '../constants/categories';

export const getCat = id => CATS.find(c => c.id === id);

export const fM = v => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(v || 0);

export const fD = s => s ? new Intl.DateTimeFormat('pt-PT').format(new Date(s + 'T12:00:00')) : '';

export const uid = () => (Math.random().toString(36).slice(2) + Date.now().toString(36));

export const getMesLabel = mr => {
  if (!mr) return '';
  const [a, m] = mr.split('-');
  return `${MESES[parseInt(m) - 1]} de ${a}`;
};

export const getMesShort = mr => {
  if (!mr) return '';
  const [, m] = mr.split('-');
  return MESES[parseInt(m) - 1].slice(0, 3);
};

export const getSaudacao = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Bom dia' : h < 20 ? 'Boa tarde' : 'Boa noite';
};

export const getMesAtual = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

export const navMes = (mr, d) => {
  const [a, m] = mr.split('-').map(Number);
  const dt = new Date(a, m - 1 + d, 1);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
};
