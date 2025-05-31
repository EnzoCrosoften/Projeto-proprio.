
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import type { PhoneNumber } from './Dashboard';

interface PhoneNumberManagerProps {
  phoneNumbers: PhoneNumber[];
  setPhoneNumbers: (numbers: PhoneNumber[]) => void;
}

export const PhoneNumberManager = ({ phoneNumbers, setPhoneNumbers }: PhoneNumberManagerProps) => {
  const [newNumber, setNewNumber] = useState('');
  const { toast } = useToast();

  const addPhoneNumber = () => {
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

    const formatted = newNumber.startsWith('+') ? newNumber : `+55${newNumber}`;
    const newPhone: PhoneNumber = {
      id: Date.now().toString(),
      number: formatted,
      isActive: true,
      clicks: 0
    };

    setPhoneNumbers([...phoneNumbers, newPhone]);
    setNewNumber('');
    
    toast({
      title: "Número adicionado!",
      description: "O número foi adicionado à rotação",
    });
  };

  const toggleActive = (id: string) => {
    setPhoneNumbers(phoneNumbers.map(phone => 
      phone.id === id ? { ...phone, isActive: !phone.isActive } : phone
    ));
  };

  const removeNumber = (id: string) => {
    setPhoneNumbers(phoneNumbers.filter(phone => phone.id !== id));
    toast({
      title: "Número removido",
      description: "O número foi removido da rotação",
    });
  };

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
          />
          <Button 
            onClick={addPhoneNumber}
            className="bg-adverto-green hover:bg-adverto-green/90"
          >
            Adicionar
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
                  <div className="text-sm text-gray-500">{phone.clicks} cliques</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Badge variant={phone.isActive ? "default" : "secondary"}>
                  {phone.isActive ? "Ativo" : "Inativo"}
                </Badge>
                
                <Switch
                  checked={phone.isActive}
                  onCheckedChange={() => toggleActive(phone.id)}
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
