import React from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';

const Button = ({ 
  mode = 'contained', 
  onPress, 
  style, 
  loading, 
  disabled, 
  icon, 
  children, 
  ...props 
}) => {
  return (
    <PaperButton
      mode={mode}
      onPress={onPress}
      style={[styles.button, style]}
      loading={loading}
      disabled={disabled}
      icon={icon}
      {...props}
    >
      {children}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 8,
    paddingVertical: 6,
  },
});

export default Button;