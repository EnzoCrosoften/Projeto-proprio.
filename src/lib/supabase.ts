
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Configuração do Supabase ausente!')
  console.error('📋 Para configurar:')
  console.error('1. Copie o arquivo .env.example para .env')
  console.error('2. Configure as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY')
  console.error('3. Ou conecte o projeto ao Supabase usando o botão verde no topo da interface')
  
  throw new Error(`
🔧 Configuração do Supabase necessária!

Para usar este projeto, você precisa:

1. Conectar ao Supabase clicando no botão verde "Supabase" no topo da interface
   OU
2. Configurar manualmente:
   - Copie .env.example para .env
   - Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY

Variáveis ausentes: ${!supabaseUrl ? 'VITE_SUPABASE_URL ' : ''}${!supabaseAnonKey ? 'VITE_SUPABASE_ANON_KEY' : ''}
  `)
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
