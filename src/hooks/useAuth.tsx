
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há um usuário logado no localStorage
    const savedUser = localStorage.getItem('advertolinks_user');
    if (savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = (email: string) => {
    setUser(email);
    localStorage.setItem('advertolinks_user', email);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('advertolinks_user');
  };

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user
  };
};
