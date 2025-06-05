
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signUp } = useSupabaseAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await onLogin(email, password);
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao AdvertoLinks",
        });
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          throw new Error(error.message);
        }
        toast({
          title: "Conta criada com sucesso!",
          description: "Verifique seu email para confirmar a conta",
        });
        setIsLogin(true);
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro no processo de autenticação",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-adverto-dark via-gray-900 to-adverto-dark p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-adverto-green rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">AL</span>
          </div>
          <CardTitle className="text-2xl font-bold text-adverto-dark">AdvertoLinks</CardTitle>
          <CardDescription className="text-gray-600">
            Redirecionador Inteligente de WhatsApp
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="focus:ring-adverto-green focus:border-adverto-green"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="focus:ring-adverto-green focus:border-adverto-green"
              />
            </div>
            
            {!isLogin && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                  <strong>Ainda não comprou?</strong> Adquira seu acesso em:
                  <br />
                  <a 
                    href="https://pay.kiwify.com.br/A1lrtUo" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-adverto-blue hover:underline font-medium"
                  >
                    pay.kiwify.com.br/A1lrtUo
                  </a>
                </p>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-adverto-green hover:bg-adverto-green/90 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Processando..." : (isLogin ? "Entrar" : "Criar Conta")}
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Não tem conta? Criar nova" : "Já tem conta? Fazer login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
