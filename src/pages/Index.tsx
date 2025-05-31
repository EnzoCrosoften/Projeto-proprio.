
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/Auth/LoginForm';
import { Dashboard } from '@/components/Dashboard/Dashboard';

const Index = () => {
  const { user, isLoading, login, logout, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-adverto-green rounded-full flex items-center justify-center mx-auto animate-pulse">
            <span className="text-white font-bold text-xl">AL</span>
          </div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }

  return <Dashboard userEmail={user!} onLogout={logout} />;
};

export default Index;
