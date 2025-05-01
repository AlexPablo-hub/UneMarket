import AsyncStorage from '@react-native-async-storage/async-storage';

// Chaves para armazenamento
const USERS_KEY = '@marketplace_users';
const PRODUCTS_KEY = '@marketplace_products';
const CURRENT_USER_KEY = '@marketplace_current_user';

// Funções para usuários
export const saveUser = async (user) => {
  try {
    const existingUsers = await getUsers();
    const userExists = existingUsers.some(u => u.email === user.email);
    
    if (userExists) {
      return { success: false, message: 'Este email já está cadastrado' };
    }
    
    const updatedUsers = [...existingUsers, user];
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    return { success: true };
  } catch (error) {
    console.error('Erro ao salvar usuário:', error);
    return { success: false, message: 'Erro ao salvar usuário' };
  }
};

export const getUsers = async () => {
  try {
    const users = await AsyncStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return [];
  }
};

export const loginUser = async (email, password) => {
  try {
    const users = await getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return { success: true, user };
    }
    
    return { success: false, message: 'Email ou senha incorretos' };
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return { success: false, message: 'Erro ao fazer login' };
  }
};

export const getCurrentUser = async () => {
  try {
    const user = await AsyncStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Erro ao buscar usuário atual:', error);
    return null;
  }
};

export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
    return { success: true };
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    return { success: false, message: 'Erro ao fazer logout' };
  }
};

// Funções para produtos
export const saveProduct = async (product) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, message: 'Usuário não autenticado' };
    }
    
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      userId: currentUser.id,
      userPhone: currentUser.phone,
      createdAt: new Date().toISOString()
    };
    
    const existingProducts = await getProducts();
    const updatedProducts = [...existingProducts, newProduct];
    
    await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedProducts));
    return { success: true, product: newProduct };
  } catch (error) {
    console.error('Erro ao salvar produto:', error);
    return { success: false, message: 'Erro ao salvar produto' };
  }
};

export const getProducts = async () => {
  try {
    const products = await AsyncStorage.getItem(PRODUCTS_KEY);
    return products ? JSON.parse(products) : [];
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return [];
  }
};

export const getProductById = async (id) => {
  try {
    const products = await getProducts();
    return products.find(p => p.id === id);
  } catch (error) {
    console.error('Erro ao buscar produto por ID:', error);
    return null;
  }
};