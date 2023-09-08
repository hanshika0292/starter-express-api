const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://duadkawsxdmtozpesmyr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1YWRrYXdzeGRtdG96cGVzbXlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM5ODkxNzcsImV4cCI6MjAwOTU2NTE3N30.csGIdFBWJGlRjiXazSWA_kButOU_o1kxEuEwTItENK0'

const supabase = createClient(supabaseUrl, supabaseKey);