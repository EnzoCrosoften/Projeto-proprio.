
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Click } from '@/lib/supabase';

interface LocationChartProps {
  clicks: Click[];
  loading: boolean;
}

export const LocationChart = ({ clicks, loading }: LocationChartProps) => {
  // Agrupar cliques por estado
  const stateStats = clicks.reduce((acc, click) => {
    const state = click.state || 'Desconhecido';
    acc[state] = (acc[state] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(stateStats)
    .map(([state, count]) => ({ state, cliques: count }))
    .sort((a, b) => b.cliques - a.cliques)
    .slice(0, 8);

  if (loading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Cliques por Estado</CardTitle>
          <CardDescription>Carregando dados...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse h-64 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Cliques por Estado</CardTitle>
        <CardDescription>
          Distribuição geográfica dos seus visitantes
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-500">
            Nenhum dado para exibir
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="state" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
                <Bar 
                  dataKey="cliques" 
                  fill="hsl(159, 100%, 38%)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {chartData.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            {chartData.slice(0, 4).map((item, index) => (
              <div key={item.state} className="flex justify-between text-sm">
                <span className="text-gray-600">#{index + 1} {item.state}</span>
                <span className="font-medium">{item.cliques}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
