import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export type RSVP = {
  id: string
  name: string
  phone: string
  side: string
  relationship: string
  attending: boolean
  guests_count: number
  message: string | null
  created_at: string
}
