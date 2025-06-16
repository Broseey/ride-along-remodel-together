
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://udyrcalbusqyjaqmybcg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkeXJjYWxidXNxeWphcW15YmNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMzM5NTMsImV4cCI6MjA2NTYwOTk1M30.Cm8TGGvA3eWnTpT_7_4JprJ-ZSAkxKEoXqDKkF0BwHA'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  }
})
