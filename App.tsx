import React, { useState, useEffect, useMemo } from 'react';
import { Transfer, FilterState, SortState } from './types';
import { fetchTransfers } from './services/dataService';
import { 
  getUniqueMonths, 
  getMonthRange, 
  filterTransfers, 
  sortTransfers, 
  calculateKPIs, 
  prepareLineChartData, 
  prepareBarChartData 
} from './utils/transfers';

import { Button, Modal } from './components/ui/Layout';
import FilterPanel from './components/Dashboard/FilterPanel';
import KpiSection from './components/Dashboard/KpiSection';
import ChartsSection from './components/Dashboard/ChartsSection';
import TransferList from './components/Dashboard/TransferList';
import { SlidersHorizontal, RefreshCw } from 'lucide-react';

function App() {
  // --- State ---
  const [rawData, setRawData] = useState<Transfer[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  
  // Controls
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    month: '',
    startDate: '',
    endDate: '',
    route: 'all',
    search: ''
  });

  // Table State
  const [sort, setSort] = useState<SortState>({ key: 'data', direction: 'desc' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // --- Effects ---

  // Handle Resize for Modal vs Sheet Logic
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initial Load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const dataset = await fetchTransfers();
      setRawData(dataset.transfers);
      setLastUpdated(dataset.updatedAt);
      
      // Setup Initial Filters based on data
      const months = getUniqueMonths(dataset.transfers);
      setAvailableMonths(months);
      
      if (months.length > 0) {
        const latest = months[0];
        const { start, end } = getMonthRange(latest);
        setFilters(prev => ({ ...prev, month: latest, startDate: start, endDate: end }));
      }

      setLoading(false);
    };
    loadData();
  }, []);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  // --- Pipeline ---

  // 1. Filter
  const filteredData = useMemo(() => {
    return filterTransfers(rawData, filters);
  }, [rawData, filters]);

  // 2. Sort
  const sortedData = useMemo(() => {
    return sortTransfers(filteredData, sort);
  }, [filteredData, sort]);

  // 3. Paginate
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  // 4. Aggregations (KPIs & Charts from Filtered Data)
  const kpis = useMemo(() => calculateKPIs(filteredData), [filteredData]);
  const lineData = useMemo(() => prepareLineChartData(filteredData), [filteredData]);
  const barData = useMemo(() => prepareBarChartData(filteredData), [filteredData]);

  // --- Handlers ---
  const handleSortChange = (key: 'data' | 'quantidade') => {
    setSort(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-primary">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text p-4 md:p-8 space-y-6">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard de Transbordo</h1>
          <p className="text-sm text-muted">Última atualização: {new Date(lastUpdated).toLocaleString('pt-BR')}</p>
        </div>
        <Button onClick={() => setIsFilterOpen(true)} className="w-full md:w-auto">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filtros
        </Button>
      </header>

      {/* KPI Section */}
      <section>
        <KpiSection data={kpis} />
      </section>

      {/* Charts Section */}
      <section>
        <ChartsSection lineData={lineData} barData={barData} />
      </section>

      {/* List Section */}
      <section>
        <TransferList 
          data={paginatedData}
          currentPage={page}
          pageSize={pageSize}
          totalRecords={filteredData.length}
          sort={sort}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          onSortChange={handleSortChange}
        />
      </section>

      {/* Filters Modal/Sheet */}
      <Modal 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)}
        title="Filtros Avançados"
        type={isMobile ? 'sheet' : 'dialog'}
      >
        <FilterPanel 
          filters={filters} 
          setFilters={setFilters} 
          availableMonths={availableMonths} 
          onClose={() => setIsFilterOpen(false)}
        />
      </Modal>

    </div>
  );
}

export default App;