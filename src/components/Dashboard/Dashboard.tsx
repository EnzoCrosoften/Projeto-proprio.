
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { StatsCards } from './StatsCards';
import { ClicksTable } from './ClicksTable';
import { LocationChart } from './LocationChart';
import { PhoneNumberManager } from './PhoneNumberManager';

interface DashboardProps {
  userEmail: string;
  onLogout: () => void;
}

export interface ClickData {
  id: string;
  timestamp: Date;
  ip: string;
  city: string;
  state: string;
  phoneNumber: string;
}

export interface PhoneNumber {
  id: string;
  number: string;
  isActive: boolean;
  clicks: number;
}

export const Dashboard = ({ userEmail, onLogout }: DashboardProps) => {
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([
    { id: '1', number: '+5511999999999', isActive: true, clicks: 15 },
    { id: '2', number: '+5511888888888', isActive: true, clicks: 12 },
    { id: '3', number: '+5511777777777', isActive: false, clicks: 8 },
  ]);
  
  const [clicks, setClicks] = useState<ClickData[]>([
    {
      id: '1',
      timestamp: new Date('2024-05-31T10:30:00'),
      ip: '192.168.1.100',
      city: 'São Paulo',
      state: 'SP',
      phoneNumber: '+5511999999999'
    },
    {
      id: '2',
      timestamp: new Date('2024-05-31T11:15:00'),
      ip: '192.168.1.101',
      city: 'Rio de Janeiro',
      state: 'RJ',
      phoneNumber: '+5511888888888'
    },
    {
      id: '3',
      timestamp: new Date('2024-05-31T12:00:00'),
      ip: '192.168.1.102',
      city: 'Belo Horizonte',
      state: 'MG',
      phoneNumber: '+5511999999999'
    },
  ]);

  const { toast } = useToast();
  const fixedLink = `adverto.link/${userEmail.split('@')[0]}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`https://${fixedLink}`);
      toast({
        title: "Link copiado!",
        description: "O link foi copiado para a área de transferência",
      });
    } catch (err) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o link",
        variant: "destructive",
      });
    }
  };

  const totalClicks = clicks.length;
  const activeNumbers = phoneNumbers.filter(p => p.isActive).length;
  const topStates = [...new Set(clicks.map(c => c.state))].slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-adverto-green rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">AL</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-adverto-dark">AdvertoLinks</h1>
              <p className="text-sm text-gray-600">{userEmail}</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={onLogout}
            className="border-gray-300 hover:bg-gray-50"
          >
            Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* Link Fixo */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-adverto-green to-adverto-blue text-white">
          <CardHeader>
            <CardTitle className="text-white">Seu Link Fixo</CardTitle>
            <CardDescription className="text-white/90">
              Este é o link que você deve divulgar. Cada clique será redirecionado automaticamente.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur">
              <code className="text-lg font-mono break-all">{fixedLink}</code>
            </div>
            <Button 
              onClick={copyLink}
              className="bg-white text-adverto-green hover:bg-white/90"
            >
              📋 Copiar Link
            </Button>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <StatsCards 
          totalClicks={totalClicks}
          activeNumbers={activeNumbers}
          topStates={topStates}
        />

        {/* Phone Numbers Management */}
        <PhoneNumberManager 
          phoneNumbers={phoneNumbers}
          setPhoneNumbers={setPhoneNumbers}
        />

        {/* Analytics Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          <LocationChart clicks={clicks} />
          <ClicksTable clicks={clicks} />
        </div>

      </main>
    </div>
  );
};
