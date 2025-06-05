
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { PhoneNumber } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export const usePhoneNumbers = (userId?: string) => {
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchPhoneNumbers = async () => {
    if (!userId) return

    try {
      const { data, error } = await supabase
        .from('phone_numbers')
        .select('*')
        .eq('user_id', userId)
        .order('order_position', { ascending: true })

      if (error) throw error
      setPhoneNumbers(data || [])
    } catch (error) {
      console.error('Error fetching phone numbers:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os números",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPhoneNumbers()
  }, [userId])

  const addPhoneNumber = async (number: string) => {
    if (!userId) return false

    try {
      const nextPosition = phoneNumbers.length + 1
      
      const { data, error } = await supabase
        .from('phone_numbers')
        .insert({
          user_id: userId,
          number: number.startsWith('+') ? number : `+55${number}`,
          order_position: nextPosition,
        })
        .select()
        .single()

      if (error) throw error

      setPhoneNumbers(prev => [...prev, data])
      toast({
        title: "Sucesso",
        description: "Número adicionado com sucesso",
      })
      return true
    } catch (error) {
      console.error('Error adding phone number:', error)
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o número",
        variant: "destructive",
      })
      return false
    }
  }

  const updatePhoneNumber = async (id: string, updates: Partial<PhoneNumber>) => {
    try {
      const { data, error } = await supabase
        .from('phone_numbers')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setPhoneNumbers(prev => 
        prev.map(phone => phone.id === id ? data : phone)
      )
      return true
    } catch (error) {
      console.error('Error updating phone number:', error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o número",
        variant: "destructive",
      })
      return false
    }
  }

  const removePhoneNumber = async (id: string) => {
    try {
      const { error } = await supabase
        .from('phone_numbers')
        .delete()
        .eq('id', id)

      if (error) throw error

      setPhoneNumbers(prev => prev.filter(phone => phone.id !== id))
      toast({
        title: "Sucesso",
        description: "Número removido com sucesso",
      })
      return true
    } catch (error) {
      console.error('Error removing phone number:', error)
      toast({
        title: "Erro",
        description: "Não foi possível remover o número",
        variant: "destructive",
      })
      return false
    }
  }

  return {
    phoneNumbers,
    loading,
    addPhoneNumber,
    updatePhoneNumber,
    removePhoneNumber,
    refreshPhoneNumbers: fetchPhoneNumbers,
  }
}
