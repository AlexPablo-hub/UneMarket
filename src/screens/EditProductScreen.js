import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Button,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { getProductById, updateProduct } from '../services/products';
import { Card } from 'react-native-paper';
import * as ImagePicker from 'react-native-image-picker';

const EditProductScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductById(productId);
        setProduct({
          name: data.name,
          price: String(data.price),
          description: data.description,
          image: data.image,
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
        image: product.image,
      });
      Alert.alert('Sucesso', 'Produto atualizado!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    }
  };

  const handleChangeImage = () => {
    openGallery();
  };

  const openGallery = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        Alert.alert('Cancelado', 'Nenhuma imagem foi selecionada.');
      } else if (response.errorMessage) {
        Alert.alert('Erro', response.errorMessage);
      } else {
        const uri = response.assets[0].uri;
        setProduct({ ...product, image: uri });
      }
    });
  };

  if (loading) return <Text>Carregando...</Text>;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleChangeImage}>
        <Card.Cover source={{ uri: product.image }} style={styles.image} />
      </TouchableOpacity>
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
  image: {
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
  },
  label: { fontWeight: 'bold', marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
  },
});

export default EditProductScreen;
