import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

// Use environment variables or fallback to hardcoded values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://agmatjypwmmzgxutlgxa.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnbWF0anlwd21temd4dXRsZ3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5NDQ4NzMsImV4cCI6MjA3MTUyMDg3M30.6m9iFo5H4I5e5bv0uGl3_DqT_CyS7MfALuWtVjxBcTI'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
