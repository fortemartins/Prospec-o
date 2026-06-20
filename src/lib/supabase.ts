import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _supabase: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!url && !!key && url !== 'sua-url-aqui' && key !== 'sua-anon-key-aqui';
}

export function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase;
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase não configurado');
  }
  _supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  return _supabase;
}
