import { supabase } from './supabase';

// Registro de usuário
export const registerUser = async ({ name, email, password, cpf, phone }) => {
    const { data: authData, error: authError } = 
      await supabase.auth.signUp({ email, password });
  
    if (authError) throw authError;
  
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id:    authData.user.id,
        name,
        email,
        cpf,
        phone
      });
  
    if (userError) throw userError;
  
    return { success: true, user: authData.user };
  };

export const loginUser = async (email, password) => {
    // 1) Autentica no Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
  
    // 2) Busca perfil completo (opcional)
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();
    if (profileError) throw profileError;
  
    return { success: true, user: { ...data.user, ...profile } };
  };
  

// Sair
export const logoutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Erro no logout:', error);
    return { 
      success: false, 
      message: error.message || 'Erro ao fazer logout'
    };
  }
};

// Verificar se o email já existe
export const checkEmailExists = async (email) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return { exists: !!data };
  } catch (error) {
    console.error('Erro ao verificar email:', error);
    return { exists: false, error: error.message };
  }
};