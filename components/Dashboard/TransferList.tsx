import React from 'react';
import { Transfer, SortState } from '../../types';
import { Button, Card, CardContent, Select } from '../ui/Layout';
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface TransferListProps {
  data: Transfer[];
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  sort: SortState;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSortChange: (key: 'data' | 'quantidade') => void;
}

const TransferList: React.FC<TransferListProps> = ({
  data,
  currentPage,
  pageSize,
  totalRecords,
  sort,
  onPageChange,
  onPageSizeChange,
  onSortChange
}) => {

  const totalPages = Math.ceil(totalRecords / pageSize);

  const SortIcon = ({ colKey }: { colKey: 'data' | 'quantidade' }) => {
    if (sort.key !== colKey) return <ArrowUpDown className="ml-2 h-3 w-3 text-muted" />;
    return sort.direction === 'asc' 
      ? <ArrowUp className="ml-2 h-3 w-3 text-primary" /> 
      : <ArrowDown className="ml-2 h-3 w-3 text-primary" />;
  };

  return (
    <div className="space-y-4">
      {/* Mobile Card View (Hidden on Desktop) */}
      <div className="md:hidden space-y-3">
        {data.map((item, idx) => (
          <Card key={`${item.data}-${idx}`} className="bg-surface border-border">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between items-center border-b border-border pb-2">
                <span className="text-sm text-muted">{item.data}</span>
                <span className="font-bold text-primary">{item.quantidade} un.</span>
              </div>
              <div>
                <p className="font-medium text-text">{item.produto}</p>
                <p className="text-xs text-muted truncate">{item.descricao}</p>
              </div>
              <div className="flex items-center gap-2 text-xs bg-zinc-800 p-2 rounded">
                <span className="font-mono">{item.deposito_saida}</span>
                <span>→</span>
                <span className="font-mono">{item.deposito_entrada}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop Table View (Hidden on Mobile) */}
      <div className="hidden md:block rounded-md border border-border bg-surface overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-zinc-800 text-muted font-medium">
            <tr>
              <th 
                className="h-10 px-4 cursor-pointer hover:text-white transition-colors"
                onClick={() => onSortChange('data')}
              >
                <div className="flex items-center">Data <SortIcon colKey="data" /></div>
              </th>
              <th className="h-10 px-4">Rota</th>
              <th className="h-10 px-4">Produto</th>
              <th className="h-10 px-4">Descrição</th>
              <th 
                className="h-10 px-4 text-right cursor-pointer hover:text-white transition-colors"
                onClick={() => onSortChange('quantidade')}
              >
                <div className="flex items-center justify-end">Qtd <SortIcon colKey="quantidade" /></div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((item, idx) => (
              <tr key={`${item.data}-${idx}`} className="hover:bg-zinc-800/50 transition-colors">
                <td className="p-4 font-mono text-xs">{item.data}</td>
                <td className="p-4">
                  <span className="px-2 py-1 rounded bg-zinc-900 text-xs border border-border">
                    {item.deposito_saida} → {item.deposito_entrada}
                  </span>
                </td>
                <td className="p-4 font-medium">{item.produto}</td>
                <td className="p-4 text-muted truncate max-w-[200px]">{item.descricao}</td>
                <td className="p-4 text-right font-bold text-primary">{item.quantidade}</td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted">Nenhum registro encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
        <div className="flex items-center gap-2 text-sm text-muted">
          <span>Mostrar</span>
          <Select 
            value={pageSize} 
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="w-[70px] h-8"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </Select>
          <span>registros</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted mr-2">
            Página {currentPage} de {totalPages || 1}
          </span>
          <Button 
            variant="outline" 
            size="icon" 
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransferList;