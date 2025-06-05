
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import type { PhoneNumber } from '@/lib/supabase';

interface PhoneNumberManagerProps {
  phoneNumbers: PhoneNumber[];
  onAddNumber: (number: string) => Promise<boolean>;
  onUpdateNumber: (id: string, updates: Partial<PhoneNumber>) => Promise<boolean>;
  onRemoveNumber: (id: string) => Promise<boolean>;
  loading: boolean;
}

export const PhoneNumberManager = ({ 
  phoneNumbers, 
  onAddNumber, 
  onUpdateNumber, 
  onRemoveNumber, 
  loading 
}: PhoneNumberManagerProps) => {
  const [newNumber, setNewNumber] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const addPhoneNumber = async () => {
    if (!newNumber.trim()) {
      toast({
        title: "Erro",
        description: "Digite um número válido",
        variant: "destructive",
      });
      return;
    }

    if (phoneNumbers.length >= 5) {
      toast({
        title: "Limite atingido",
        description: "Você pode cadastrar até 5 números no plano atual",
        variant: "destructive",
      });
      return;
    }

    setIsAdding(true);
    const success = await onAddNumber(newNumber);
    if (success) {
      setNewNumber('');
    }
    setIsAdding(false);
  };

  const toggleActive = async (id: string, currentActive: boolean) => {
    await onUpdateNumber(id, { is_active: !currentActive });
  };

  const removeNumber = async (id: string) => {
    await onRemoveNumber(id);
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Gerenciar Números</CardTitle>
          <CardDescription>Carregando números...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Gerenciar Números</CardTitle>
        <CardDescription>
          Adicione até 5 números para rotação automática. A ordem define a sequência de redirecionamento.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Add New Number */}
        <div className="flex gap-3">
          <Input
            placeholder="+5511999999999"
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
            className="flex-1"
            disabled={isAdding}
          />
          <Button 
            onClick={addPhoneNumber}
            className="bg-adverto-green hover:bg-adverto-green/90"
            disabled={isAdding || phoneNumbers.length >= 5}
          >
            {isAdding ? "Adicionando..." : "Adicionar"}
          </Button>
        </div>

        {/* Phone Numbers List */}
        <div className="space-y-3">
          {phoneNumbers.map((phone, index) => (
            <div 
              key={phone.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
            >
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-adverto-blue text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium">{phone.number}</div>
                  <div className="text-sm text-gray-500">{phone.clicks_count} cliques</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Badge variant={phone.is_active ? "default" : "secondary"}>
                  {phone.is_active ? "Ativo" : "Inativo"}
                </Badge>
                
                <Switch
                  checked={phone.is_active}
                  onCheckedChange={() => toggleActive(phone.id, phone.is_active)}
                />
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeNumber(phone.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Remover
                </Button>
              </div>
            </div>
          ))}
        </div>

        {phoneNumbers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhum número cadastrado. Adicione seu primeiro número acima.
          </div>
        )}
        
      </CardContent>
    </Card>
  );
};
