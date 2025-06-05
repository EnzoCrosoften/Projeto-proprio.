
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Click } from '@/lib/supabase';

interface ClicksTableProps {
  clicks: Click[];
  loading: boolean;
}

export const ClicksTable = ({ clicks, loading }: ClicksTableProps) => {
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Registros de Cliques</CardTitle>
          <CardDescription>Carregando histórico...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

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
                      {click.city || 'Cidade desconhecida'}, {click.state || 'Estado desconhecido'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(click.clicked_at)} • IP: {click.ip_address || 'Desconhecido'}
                    </div>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <Badge variant="outline" className="text-xs">
                      {click.phone_number.slice(-4)}
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
