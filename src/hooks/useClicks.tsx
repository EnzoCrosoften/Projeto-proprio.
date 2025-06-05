
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Click } from '@/lib/supabase'

export const useClicks = (userId?: string) => {
  const [clicks, setClicks] = useState<Click[]>([])
  const [loading, setLoading] = useState(true)

  const fetchClicks = async () => {
    if (!userId) return

    try {
      const { data, error } = await supabase
        .from('clicks')
        .select('*')
        .eq('user_id', userId)
        .order('clicked_at', { ascending: false })
        .limit(100)

      if (error) throw error
      setClicks(data || [])
    } catch (error) {
      console.error('Error fetching clicks:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClicks()
  }, [userId])

  const getClickStats = () => {
    const totalClicks = clicks.length
    const uniqueStates = [...new Set(clicks.map(c => c.state).filter(Boolean))]
    const topStates = uniqueStates.slice(0, 3)
    
    const stateStats = clicks.reduce((acc, click) => {
      if (click.state) {
        acc[click.state] = (acc[click.state] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    return {
      totalClicks,
      topStates,
      stateStats,
    }
  }

  return {
    clicks,
    loading,
    getClickStats,
    refreshClicks: fetchClicks,
  }
}
