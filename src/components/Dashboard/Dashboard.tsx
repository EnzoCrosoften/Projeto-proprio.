
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { StatsCards } from './StatsCards';
import { ClicksTable } from './ClicksTable';
import { LocationChart } from './LocationChart';
import { PhoneNumberManager } from './PhoneNumberManager';
import { usePhoneNumbers } from '@/hooks/usePhoneNumbers';
import { useClicks } from '@/hooks/useClicks';
import { supabase } from '@/lib/supabase';

interface DashboardProps {
  userEmail: string;
  onLogout: () => void;
}

export const Dashboard = ({ userEmail, onLogout }: DashboardProps) => {
  const [userProfile, setUserProfile] = useState<{ id: string; username: string } | null>(null);
  const { toast } = useToast();

  // Get user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('users')
            .select('id, username')
            .eq('id', user.id)
            .single();
          
          if (profile) {
            setUserProfile(profile);
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const { phoneNumbers, loading: phoneLoading, addPhoneNumber, updatePhoneNumber, removePhoneNumber } = usePhoneNumbers(userProfile?.id);
  const { clicks, loading: clicksLoading, getClickStats } = useClicks(userProfile?.id);

  const stats = getClickStats();
  const fixedLink = userProfile ? `adverto.link/${userProfile.username}` : '';

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

  const activeNumbers = phoneNumbers.filter(p => p.is_active).length;

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-adverto-green rounded-full flex items-center justify-center mx-auto animate-pulse">
            <span className="text-white font-bold text-xl">AL</span>
          </div>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

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
              disabled={!fixedLink}
            >
              📋 Copiar Link
            </Button>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <StatsCards 
          totalClicks={stats.totalClicks}
          activeNumbers={activeNumbers}
          topStates={stats.topStates}
        />

        {/* Phone Numbers Management */}
        <PhoneNumberManager 
          phoneNumbers={phoneNumbers}
          onAddNumber={addPhoneNumber}
          onUpdateNumber={updatePhoneNumber}
          onRemoveNumber={removePhoneNumber}
          loading={phoneLoading}
        />

        {/* Analytics Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          <LocationChart clicks={clicks} loading={clicksLoading} />
          <ClicksTable clicks={clicks} loading={clicksLoading} />
        </div>

      </main>
    </div>
  );
};
