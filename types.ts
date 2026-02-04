export interface Transfer {
  data: string;
  deposito_saida: string;
  deposito_entrada: string;
  produto: string;
  descricao: string;
  quantidade: number;
}

export interface DataSet {
  updatedAt: string;
  transfers: Transfer[];
}

export interface FilterState {
  month: string; // 'YYYY-MM' or 'custom'
  startDate: string;
  endDate: string;
  route: 'all' | '1-300->1-700' | '1-700->1-300';
  search: string;
}

export interface SortState {
  key: 'data' | 'quantidade';
  direction: 'asc' | 'desc';
}

export interface KPIData {
  totalQty: number;
  transferCount: number;
  distinctProducts: number;
  predominantRoute: string;
}

export interface ChartDataSeries {
  date: string;
  total: number;
}

export interface TopProduct {
  name: string;
  value: number;
}