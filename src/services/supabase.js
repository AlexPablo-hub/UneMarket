import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⚠️ Substitua estas variáveis pelos seus dados do Supabase
const SUPABASE_URL = 'https://upwipdeyfaqyicybmenx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwd2lwZGV5ZmFxeWljeWJtZW54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwNDE4NTYsImV4cCI6MjA2MTYxNzg1Nn0.KI-PBqxQlqpsbK1lpWPMFJTI4vOk4hKg_CVxCG3FRLU';

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

// Função para verificar se o usuário está logado
export const getCurrentSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Erro ao verificar sessão:', error);
    return null;
  }
  return data?.session;
};

// Função para pegar usuário atual
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Erro ao buscar usuário:', error);
    return null;
  }
  return user;
};