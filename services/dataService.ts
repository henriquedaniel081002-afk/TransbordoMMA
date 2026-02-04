import { DataSet } from '../types';

export const fetchTransfers = async (): Promise<DataSet> => {
  try {
    const response = await fetch('/data/transbordo.json');
    if (!response.ok) {
      throw new Error('Falha ao carregar dados');
    }
    const data: DataSet = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    // Return empty fallback in case of error to prevent crash
    return {
      updatedAt: new Date().toISOString(),
      transfers: []
    };
  }
};