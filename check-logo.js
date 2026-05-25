import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('./.env', 'utf8');
const lines = envContent.split(/\r?\n/);
let supabaseUrl = '';
let supabaseAnonKey = '';

for (const line of lines) {
  if (line.startsWith('VITE_SUPABASE_URL=')) {
    supabaseUrl = line.split('=')[1].trim();
  }
  if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) {
    supabaseAnonKey = line.split('=')[1].trim();
  }
}

console.log('Using URL:', supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkLogo() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 'main')
    .single();
    
  if (error) {
    console.error('Error fetching settings:', error);
  } else {
    console.log('Site Settings Row:', JSON.stringify(data, null, 2));
  }
}

checkLogo().catch(console.error);
