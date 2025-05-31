
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsCardsProps {
  totalClicks: number;
  activeNumbers: number;
  topStates: string[];
}

export const StatsCards = ({ totalClicks, activeNumbers, topStates }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">Total de Cliques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-adverto-green">{totalClicks}</div>
          <div className="text-sm text-gray-500 mt-1">+12% vs. mês anterior</div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">Números Ativos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-adverto-blue">{activeNumbers}</div>
          <div className="text-sm text-gray-500 mt-1">de 5 disponíveis</div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">Top 3 Estados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {topStates.map((state, index) => (
              <div key={state} className="flex items-center justify-between">
                <span className="text-sm font-medium">#{index + 1} {state}</span>
                <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-adverto-green transition-all"
                    style={{ width: `${100 - (index * 20)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
