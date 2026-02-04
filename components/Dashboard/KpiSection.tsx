import React from 'react';
import { KPIData } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Layout';
import { ArrowRightLeft, Package, Boxes, TrendingUp } from 'lucide-react';

interface KpiSectionProps {
  data: KPIData;
}

const KpiCard = ({ title, value, sub, icon: Icon }: { title: string, value: string | number, sub?: string, icon: React.ElementType }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted">{title}</CardTitle>
      <Icon className="h-4 w-4 text-primary" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {sub && <p className="text-xs text-muted mt-1">{sub}</p>}
    </CardContent>
  </Card>
);

const KpiSection: React.FC<KpiSectionProps> = ({ data }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KpiCard 
        title="Total Transferido" 
        value={data.totalQty.toLocaleString('pt-BR')} 
        sub="Unidades"
        icon={Boxes}
      />
      <KpiCard 
        title="Nº Transferências" 
        value={data.transferCount} 
        sub="Registros filtrados"
        icon={ArrowRightLeft}
      />
      <KpiCard 
        title="Produtos Distintos" 
        value={data.distinctProducts} 
        icon={Package}
      />
      <KpiCard 
        title="Rota Predominante" 
        value={data.predominantRoute} 
        icon={TrendingUp}
      />
    </div>
  );
};

export default KpiSection;