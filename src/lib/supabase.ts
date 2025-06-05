
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface User {
  id: string
  email: string
  username: string
  created_at: string
  updated_at: string
}

export interface PhoneNumber {
  id: string
  user_id: string
  number: string
  is_active: boolean
  clicks_count: number
  order_position: number
  created_at: string
  updated_at: string
}

export interface Click {
  id: string
  user_id: string
  phone_number_id: string
  phone_number: string
  ip_address?: string
  user_agent?: string
  country?: string
  city?: string
  state?: string
  clicked_at: string
}
