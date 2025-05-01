import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';

const Input = ({ 
  label, 
  value, 
  onChangeText, 
  error, 
  secureTextEntry, 
  keyboardType, 
  multiline, 
  numberOfLines,
  maxLength,
  right,
  ...props 
}) => {
  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      style={styles.input}
      mode="outlined"
      error={error}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      multiline={multiline}
      numberOfLines={numberOfLines}
      maxLength={maxLength}
      right={right}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 8,
  },
});

export default Input;