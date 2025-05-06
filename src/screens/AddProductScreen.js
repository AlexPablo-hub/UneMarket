import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, Title } from 'react-native-paper';
import { saveProduct } from '../services/products';
import { validatePrice } from '../utils/validators';
import * as ImagePicker from 'expo-image-picker';

const AddProductScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    
    if (!name) newErrors.name = 'Nome do produto é obrigatório';
    if (!price || price === 'R$ 0,00') newErrors.price = 'Preço é obrigatório';
    if (!description) newErrors.description = 'Descrição é obrigatória';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePriceChange = (text) => {
    const digits = text.replace(/\D/g, '');
    const cents = parseInt(digits, 10) || 0;
    const reais = (cents / 100).toFixed(2);
    const [intPart, decPart] = reais.split('.');
    const intWithThousand = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    setPrice(`R$ ${intWithThousand},${decPart}`);
  };

  const [image, setImage] = useState(null);

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permissão necessária', 'É necessário permitir o acesso à galeria para selecionar uma imagem.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAddProduct = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const numericPrice = parseFloat(
        price
          .replace(/[R$\s]/g, '')
          .replace(/\./g, '')
          .replace(',', '.')
      );

      const productData = {
        name,
        price: numericPrice,
        description,
        image,
      };
      
      const result = await saveProduct(productData);
      if (result.success) {
        Alert.alert('Sucesso', 'Produto adicionado com sucesso!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Erro', result.message || 'Erro ao adicionar produto');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao adicionar o produto');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Title style={styles.title}>Adicionar Produto</Title>
        
        <TextInput
          label="Nome do produto"
          value={name}
          onChangeText={setName}
          style={styles.input}
          mode="outlined"
          error={!!errors.name}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        
        <TextInput
          label="Preço"
          value={price}
          onChangeText={handlePriceChange}
          style={styles.input}
          mode="outlined"
          keyboardType="numeric"
          error={!!errors.price}
        />
        {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
        
        <TextInput
          label="Descrição"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          mode="outlined"
          multiline
          numberOfLines={5}
          error={!!errors.description}
        />
        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

        <Button 
          mode="outlined" 
          onPress={handlePickImage} 
          style={styles.button}
        >
          Selecionar Imagem
        </Button>
        {image && <Text style={{ textAlign: 'center', marginVertical: 8 }}>Imagem selecionada</Text>}
        
        <Button 
          mode="contained" 
          onPress={handleAddProduct} 
          style={styles.button}
          loading={loading}
          disabled={loading}
        >
          Adicionar Produto
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
  },
  errorText: {
    color: '#B00020',
    marginBottom: 8,
    fontSize: 12,
  },
});

export default AddProductScreen;