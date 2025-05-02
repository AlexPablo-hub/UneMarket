import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { FAB, Searchbar, Text } from 'react-native-paper';
import { getProducts, searchProducts } from '../services/products';
import { getCurrentSession } from '../services/supabase';
import { logoutUser } from '../services/auth';
import ProductCard from '../components/ProductCard';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../services/supabase'
import { Button } from 'react-native';
const HomeScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const checkAuthOnMount = async () => {
      const session = await getCurrentSession()
      if (!session) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      }
    }
    checkAuthOnMount()
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      }
    })
    return () => {
      authListener.unsubscribe()
    }
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      loadProducts();
    }, [])
  );

  const loadProducts = async () => {
    setLoading(true);
    try {
      const allProducts = await getProducts();
      setProducts(allProducts);
      setFilteredProducts(allProducts);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os produtos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredProducts(products);
    } else {
      try {
        // Usa a busca no servidor para resultados mais precisos
        if (query.length >= 3) {
          const results = await searchProducts(query);
          setFilteredProducts(results);
        } else {
          // Busca local para consultas curtas
          const filtered = products.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase())
          );
          setFilteredProducts(filtered);
        }
      } catch (error) {
        console.error('Erro na busca:', error);
      }
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  const handleLogout = async () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim',
          onPress: async () => {
            await logoutUser();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]
    );
  };

  const goToProductDetail = (product) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Buscar produtos"
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>
      <Button
         title="Ver meus produtos"
      onPress={() => navigation.navigate('UserProducts')}
     />

      
      {loading && !refreshing ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
      ) : (
        <>
          {filteredProducts.length > 0 ? (
            <FlatList
              data={filteredProducts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ProductCard product={item} onPress={() => goToProductDetail(item)} />
              )}
              contentContainerStyle={styles.list}
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
            </View>
          )}
        </>
      )}
      
      <FAB
        style={styles.fab}
        icon="plus"
        color="#fff"
        onPress={() => navigation.navigate('AddProduct')}
      />
      
      <FAB
        style={styles.logoutFab}
        icon="logout"
        color="#fff"
        small
        onPress={handleLogout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  searchbar: {
    elevation: 0,
  },
  list: {
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2196F3',
  },
  logoutFab: {
    position: 'absolute',
    margin: 16,
    left: 0,
    bottom: 0,
    backgroundColor: '#F44336',
  },
});

export default HomeScreen;