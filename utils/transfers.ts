import { Transfer, FilterState, SortState, KPIData, ChartDataSeries, TopProduct } from '../types';
import { parseISO, format, isWithinInterval, startOfMonth, endOfMonth, isValid, compareAsc, compareDesc } from 'date-fns';

// --- Normalization ---
export const getUniqueMonths = (transfers: Transfer[]): string[] => {
  const months = new Set<string>();
  transfers.forEach(t => {
    if (t.data && t.data.length >= 7) {
      months.add(t.data.substring(0, 7)); // YYYY-MM
    }
  });
  return Array.from(months).sort().reverse();
};

export const getMonthRange = (monthStr: string): { start: string, end: string } => {
  const date = parseISO(`${monthStr}-01`);
  if (!isValid(date)) return { start: '', end: '' };
  
  return {
    start: format(startOfMonth(date), 'yyyy-MM-dd'),
    end: format(endOfMonth(date), 'yyyy-MM-dd')
  };
};

// --- Filtering ---
export const filterTransfers = (transfers: Transfer[], filters: FilterState): Transfer[] => {
  return transfers.filter(t => {
    // Date Range
    if (filters.startDate && filters.endDate) {
      if (t.data < filters.startDate || t.data > filters.endDate) return false;
    }

    // Route
    if (filters.route !== 'all') {
      const routeStr = `${t.deposito_saida}->${t.deposito_entrada}`;
      if (routeStr !== filters.route) return false;
    }

    // Search (Product or Description)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchProd = t.produto.toLowerCase().includes(searchLower);
      const matchDesc = t.descricao.toLowerCase().includes(searchLower);
      if (!matchProd && !matchDesc) return false;
    }

    return true;
  });
};

// --- Sorting ---
export const sortTransfers = (transfers: Transfer[], sort: SortState): Transfer[] => {
  return [...transfers].sort((a, b) => {
    let res = 0;
    if (sort.key === 'data') {
      res = a.data.localeCompare(b.data);
    } else if (sort.key === 'quantidade') {
      res = a.quantidade - b.quantidade;
    }

    return sort.direction === 'asc' ? res : -res;
  });
};

// --- KPIs ---
export const calculateKPIs = (transfers: Transfer[]): KPIData => {
  const totalQty = transfers.reduce((acc, t) => acc + t.quantidade, 0);
  const transferCount = transfers.length;
  const uniqueProducts = new Set(transfers.map(t => t.produto)).size;

  let r1 = 0; // 1-300->1-700
  let r2 = 0; // 1-700->1-300

  transfers.forEach(t => {
    if (t.deposito_saida === '1-300' && t.deposito_entrada === '1-700') r1++;
    else if (t.deposito_saida === '1-700' && t.deposito_entrada === '1-300') r2++;
  });

  const predominantRoute = r1 > r2 
    ? '1-300 → 1-700' 
    : r2 > r1 
      ? '1-700 → 1-300' 
      : r1 === 0 && r2 === 0 ? 'N/A' : 'Equilibrado';

  return {
    totalQty,
    transferCount,
    distinctProducts: uniqueProducts,
    predominantRoute
  };
};

// --- Charts ---
export const prepareLineChartData = (transfers: Transfer[]): ChartDataSeries[] => {
  const map = new Map<string, number>();
  
  transfers.forEach(t => {
    const curr = map.get(t.data) || 0;
    map.set(t.data, curr + t.quantidade);
  });

  const sortedDates = Array.from(map.keys()).sort();
  
  return sortedDates.map(date => ({
    date,
    total: map.get(date) || 0
  }));
};

export const prepareBarChartData = (transfers: Transfer[]): TopProduct[] => {
  const map = new Map<string, number>();

  transfers.forEach(t => {
    const curr = map.get(t.produto) || 0;
    map.set(t.produto, curr + t.quantidade);
  });

  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
};