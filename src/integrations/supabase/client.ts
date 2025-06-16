
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://virprpgkmuylmrvzdvbm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpcnBycGdrbXV5bG1ydnpkdmJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MjM5NzYsImV4cCI6MjA2NDQ5OTk3Nn0.8pQXEQN0rLwPPAosK55LK8VuLsJTT4EwH1lDRirNtv0'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  }
})
