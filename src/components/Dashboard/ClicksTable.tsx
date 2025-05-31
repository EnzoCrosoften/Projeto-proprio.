
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ClickData } from './Dashboard';

interface ClicksTableProps {
  clicks: ClickData[];
}

export const ClicksTable = ({ clicks }: ClicksTableProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Registros de Cliques</CardTitle>
        <CardDescription>
          Histórico detalhado de todos os redirecionamentos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {clicks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum clique registrado ainda
            </div>
          ) : (
            <div className="space-y-3">
              {clicks.slice(0, 10).map((click) => (
                <div 
                  key={click.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="font-medium text-sm">
                      {click.city}, {click.state}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(click.timestamp)} • IP: {click.ip}
                    </div>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <Badge variant="outline" className="text-xs">
                      {click.phoneNumber.slice(-4)}
                    </Badge>
                    <div className="text-xs text-gray-500">
                      Redirecionado
                    </div>
                  </div>
                </div>
              ))}
              
              {clicks.length > 10 && (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">
                    Mostrando 10 de {clicks.length} registros
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
