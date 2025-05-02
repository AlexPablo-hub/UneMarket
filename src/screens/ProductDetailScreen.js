import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Linking, Platform } from 'react-native';
import { Button, Text, Title, Card, Paragraph, ActivityIndicator } from 'react-native-paper';
import { getProductById } from '../services/products';
import { formatPrice, formatPhone } from '../utils/validators';

const ProductDetailScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const productData = await getProductById(productId);
      if (productData) {
        setProduct(productData);
      } else {
        Alert.alert('Erro', 'Produto não encontrado', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      console.error('Erro ao carregar produto:', error);
      Alert.alert('Erro', 'Não foi possível carregar os detalhes do produto', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleNegotiate = () => {
    if (!product || !product.userPhone) {
      Alert.alert('Erro', 'Informações de contato não disponíveis');
      return;
    }

    const phoneNumber = product.userPhone.replace(/\D/g, '');
    const message = `Olá! Vi seu anúncio do produto "${product.name}" por ${formatPrice(product.price)} no app e tenho interesse.`;
    
    let url;
    if (Platform.OS === 'android') {
      url = `whatsapp://send?phone=55${phoneNumber}&text=${encodeURIComponent(message)}`;
    } else {
      url = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(message)}`;
    }

    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert(
            'Erro',
            'WhatsApp não está instalado ou não pode ser aberto'
          );
        }
      })
      .catch(error => {
        console.error('Erro ao abrir WhatsApp:', error);
        Alert.alert('Erro', 'Não foi possível abrir o WhatsApp');
      });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text>Produto não encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Card style={styles.card}>
        <Card.Content>
          <Card.Cover source={{ uri: product.image }} />
          <Title style={styles.title}>{product.name}</Title>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          
          <View style={styles.section}>
            <Title style={styles.sectionTitle}>Descrição</Title>
            <Paragraph style={styles.description}>{product.description}</Paragraph>
          </View>
          
          <View style={styles.section}>
            <Title style={styles.sectionTitle}>Contato</Title>
            <Paragraph>
              {product.userPhone && formatPhone(product.userPhone)}
            </Paragraph>
          </View>
        </Card.Content>
      </Card>
      
      <Button
        mode="contained"
        icon="whatsapp"
        style={styles.whatsappButton}
        labelStyle={styles.whatsappButtonLabel}
        onPress={handleNegotiate}
      >
        Negociar pelo WhatsApp
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2196F3',
    marginTop: 8,
    marginBottom: 16,
  },
  section: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
    paddingVertical: 8,
    marginVertical: 16,
  },
  whatsappButtonLabel: {
    fontSize: 16,
    color: '#fff',
  },
});

export default ProductDetailScreen;