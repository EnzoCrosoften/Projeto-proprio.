
import { useSupabaseAuth } from './useSupabaseAuth'

export const useAuth = () => {
  const { user, loading, signIn, signOut } = useSupabaseAuth()

  const login = async (email: string, password: string) => {
    const { error } = await signIn(email, password)
    if (error) {
      throw new Error(error.message)
    }
  }

  const logout = async () => {
    const { error } = await signOut()
    if (error) {
      throw new Error(error.message)
    }
  }

  return {
    user: user?.email || null,
    isLoading: loading,
    login,
    logout,
    isAuthenticated: !!user
  }
}
