import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { getProductsByCurrentUser, deleteProduct } from '../services/products';
import { useNavigation } from '@react-navigation/native';
import { Card } from 'react-native-paper';

const UserProductsScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const userProducts = await getProductsByCurrentUser();
        setProducts(userProducts);
      } catch (error) {
        console.error(error);
        Alert.alert('Erro', 'Não foi possível carregar seus produtos.');
      } finally {
        setLoading(false);
      }
    };

    if (isFocused) fetchProducts();
  }, [isFocused]);

  const handleEditProduct = (productId) => {
    navigation.navigate('EditProduct', { productId });
  };

  const handleDeleteProduct = (productId) => {
    Alert.alert('Deletar Produto', 'Tem certeza que deseja deletar este produto?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Deletar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteProduct(productId);
            setProducts(prev => prev.filter(p => p.id !== productId));
            Alert.alert('Sucesso', 'Produto deletado com sucesso!');
          } catch (error) {
            Alert.alert('Erro', 'Não foi possível deletar o produto.');
          }
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Produtos</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <Card.Cover source={{ uri: item.image }} />
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productDesc}>{item.description}</Text>
              <Text style={styles.productPrice}>R$ {item.price}</Text>

              {/* Container de Ações */}
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditProduct(item.id)} // Navegar para a tela de edição
                >
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteProduct(item.id)} // Deletar o produto
                >
                  <Text style={styles.buttonText}>Deletar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text>Nenhum produto encontrado.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  productCard: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f1f1f1',
    borderRadius: 8
  },
  productName: { fontSize: 18, fontWeight: 'bold' },
  productDesc: { fontSize: 14, color: '#555' },
  productPrice: { fontSize: 16, color: '#333', marginTop: 5 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  editButton: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 5
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});

export default UserProductsScreen;
