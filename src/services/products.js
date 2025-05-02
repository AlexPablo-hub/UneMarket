import { supabase, getCurrentUser } from './supabase';

// Buscar todos os produtos
export const getProducts = async () => {
  try {
    // Busca produtos com informações do usuário vendedor
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        users:user_id (
          name,
          phone
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Formata os dados para corresponder à estrutura que o app espera
    const formattedProducts = data.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      userId: product.user_id,
      userPhone: product.users?.phone,
      sellerName: product.users?.name,
      createdAt: product.created_at
    }));

    return formattedProducts;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw error;
  }
};

// Buscar um produto específico por ID
export const getProductById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        users:user_id (
          name,
          phone
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      price: data.price,
      description: data.description,
      userId: data.user_id,
      userPhone: data.users?.phone,
      sellerName: data.users?.name,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error('Erro ao buscar produto por ID:', error);
    throw error;
  }
};

export const getProductsByCurrentUser = async () => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Usuário não autenticado.');

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      users:user_id (
        name,
        phone
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map(product => ({
    id: product.id,
    name: product.name,
    price: product.price,
    description: product.description,
    createdAt: product.created_at
  }));
};


// Adicionar um novo produto
export const saveProduct = async (productData) => {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return { success: false, message: 'Usuário não autenticado' };
    }

    const { data, error } = await supabase
      .from('products')
      .insert({
        name: productData.name,
        price: productData.price,
        description: productData.description,
        user_id: user.id
      })
      .select();

    if (error) throw error;

    return { 
      success: true, 
      product: data[0] 
    };
  } catch (error) {
    console.error('Erro ao salvar produto:', error);
    return { 
      success: false, 
      message: error.message || 'Erro ao salvar produto' 
    };
  }
};

// Atualizar um produto existente
export const updateProduct = async (id, productData) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({
        name: productData.name,
        price: productData.price,
        description: productData.description
      })
      .eq('id', id)
      .select();

    if (error) throw error;

    return { 
      success: true, 
      product: data[0] 
    };
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return { 
      success: false, 
      message: error.message || 'Erro ao atualizar produto' 
    };
  }
};

// Excluir um produto
export const deleteProduct = async (id) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    return { 
      success: false, 
      message: error.message || 'Erro ao excluir produto' 
    };
  }
};

// Buscar produtos por pesquisa
export const searchProducts = async (query) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        users:user_id (
          name,
          phone
        )
      `)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Formata os dados
    const formattedProducts = data.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      userId: product.user_id,
      userPhone: product.users?.phone,
      sellerName: product.users?.name,
      createdAt: product.created_at
    }));

    return formattedProducts;
  } catch (error) {
    console.error('Erro na busca de produtos:', error);
    throw error;
  }
};