// src/screens/EditProductScreen.js
import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, StyleSheet, Button, Alert } from 'react-native';
import { getProductById, updateProduct } from '../services/products';

const EditProductScreen = ({ route, navigation }) => {
  const { productId } = route.params; // Obtém o ID do produto passado pela navegação
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductById(productId); // Buscando o produto por ID
        setProduct({
          name: data.name,
          price: String(data.price),
          description: data.description,
        });
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar o produto.');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [productId]);

  const handleSave = async () => {
    try {
      await updateProduct(productId, {
        name: product.name,
        price: parseFloat(product.price),
        description: product.description,
      });
      Alert.alert('Sucesso', 'Produto atualizado!');
      navigation.goBack(); // Retorna para a tela anterior
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    }
  };

  if (loading) return <Text>Carregando...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={product.name}
        onChangeText={(text) => setProduct({ ...product, name: text })}
      />
      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={styles.input}
        value={product.description}
        onChangeText={(text) => setProduct({ ...product, description: text })}
      />
      <Text style={styles.label}>Preço</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={product.price}
        onChangeText={(text) => setProduct({ ...product, price: text })}
      />
      <Button title="Salvar" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontWeight: 'bold', marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginTop: 5 },
});

export default EditProductScreen;
