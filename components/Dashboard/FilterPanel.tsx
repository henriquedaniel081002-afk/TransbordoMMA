import React from 'react';
import { FilterState } from '../../types';
import { Button, Input, Select } from '../ui/Layout';
import { getMonthRange } from '../../utils/transfers';
import { FilterX } from 'lucide-react';

interface FilterPanelProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  availableMonths: string[];
  onClose?: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, setFilters, availableMonths, onClose }) => {
  
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'custom') {
      setFilters(prev => ({ ...prev, month: 'custom' }));
    } else {
      const { start, end } = getMonthRange(val);
      setFilters(prev => ({ ...prev, month: val, startDate: start, endDate: end }));
    }
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    setFilters(prev => ({
      ...prev,
      month: 'custom',
      [field]: value
    }));
  };

  const clearFilters = () => {
    // Reset to most recent month if available, else empty
    const defaultMonth = availableMonths.length > 0 ? availableMonths[0] : 'custom';
    const { start, end } = getMonthRange(defaultMonth);

    setFilters({
      month: defaultMonth,
      startDate: start,
      endDate: end,
      route: 'all',
      search: ''
    });
    if (onClose) onClose();
  };

  return (
    <div className="space-y-4">
      {/* Month Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted">Mês de Referência</label>
        <Select value={filters.month} onChange={handleMonthChange}>
          {availableMonths.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
          <option value="custom">Personalizado</option>
        </Select>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted">Início</label>
          <Input 
            type="date" 
            value={filters.startDate} 
            onChange={(e) => handleDateChange('startDate', e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted">Fim</label>
          <Input 
            type="date" 
            value={filters.endDate} 
            onChange={(e) => handleDateChange('endDate', e.target.value)} 
          />
        </div>
      </div>

      {/* Route */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted">Rota</label>
        <Select 
          value={filters.route} 
          onChange={(e) => setFilters(prev => ({ ...prev, route: e.target.value as any }))}
        >
          <option value="all">Todas as rotas</option>
          <option value="1-300->1-700">1-300 → 1-700</option>
          <option value="1-700->1-300">1-700 → 1-300</option>
        </Select>
      </div>

      {/* Search */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted">Busca (Produto/Desc)</label>
        <Input 
          placeholder="Ex: Soja, Trigo..." 
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
        />
      </div>

      <div className="pt-4 flex justify-end">
        <Button variant="outline" onClick={clearFilters} className="w-full sm:w-auto">
          <FilterX className="mr-2 h-4 w-4" />
          Limpar Filtros
        </Button>
      </div>
    </div>
  );
};

export default FilterPanel;