import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { formatPrice } from '../utils/validators';

const ProductCard = ({ product, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.cardContainer}>
      <Card style={styles.card}>
        <Card.Content>
          <Title numberOfLines={1} style={styles.title}>{product.name}</Title>
          <Paragraph style={styles.price}>{formatPrice(product.price)}</Paragraph>
          <Paragraph numberOfLines={2} style={styles.description}>{product.description}</Paragraph>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 16,
  },
  card: {
    elevation: 4,
  },
  title: {
    fontSize: 18,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    marginTop: 4,
    marginBottom: 8,
  },
  description: {
    color: '#757575',
  },
});

export default ProductCard;