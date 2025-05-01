import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, Title } from 'react-native-paper';
import { registerUser, checkEmailExists } from '../services/auth';
import { validateEmail, validatePassword, validateCPF, validatePhone, formatCPF, formatPhone } from '../utils/validators';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const handleCPFChange = (text) => {
    const formatted = formatCPF(text);
    setCpf(formatted);
  };

  const handlePhoneChange = (text) => {
    const formatted = formatPhone(text);
    setPhone(formatted);
  };

  const validate = () => {
    const newErrors = {};
    
    if (!name) newErrors.name = 'Nome é obrigatório';
    if (!email) newErrors.email = 'Email é obrigatório';
    else if (!validateEmail(email)) newErrors.email = 'Email inválido';
    
    if (!password) newErrors.password = 'Senha é obrigatória';
    else if (!validatePassword(password)) newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    
    if (password !== confirmPassword) newErrors.confirmPassword = 'As senhas não conferem';
    
    if (!cpf) newErrors.cpf = 'CPF é obrigatório';
    else if (!validateCPF(cpf)) newErrors.cpf = 'CPF inválido';
    
    if (!phone) newErrors.phone = 'Telefone é obrigatório';
    else if (!validatePhone(phone)) newErrors.phone = 'Telefone inválido';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
  
    setLoading(true);
    try {
      // 1) Verifica email duplicado
      const emailCheck = await checkEmailExists(email);
      if (emailCheck.exists) {
        setErrors(prev => ({ ...prev, email: 'Este email já está em uso' }));
        setLoading(false);
        return;
      }
  
      const userData = {
        name,
        email,
        password,
        cpf:   cpf.replace(/\D/g, ''),
        phone: phone.replace(/\D/g, ''),
      };
  
      const result = await registerUser(userData);
  
      if (result.success) {
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      } else {
        Alert.alert('Erro', result.message || 'Erro ao cadastrar');
      }
  
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Ocorreu um erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Title style={styles.title}>Criar Conta</Title>
        
        <TextInput
          label="Nome completo"
          value={name}
          onChangeText={setName}
          style={styles.input}
          mode="outlined"
          error={!!errors.name}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          error={!!errors.email}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        
        <TextInput
          label="Senha"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          mode="outlined"
          secureTextEntry={secureTextEntry}
          right={
            <TextInput.Icon 
              icon={secureTextEntry ? "eye" : "eye-off"} 
              onPress={() => setSecureTextEntry(!secureTextEntry)} 
            />
          }
          error={!!errors.password}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        
        <TextInput
          label="Confirmar senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
          mode="outlined"
          secureTextEntry={secureTextEntry}
          error={!!errors.confirmPassword}
        />
        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
        
        <TextInput
          label="CPF"
          value={cpf}
          onChangeText={handleCPFChange}
          style={styles.input}
          mode="outlined"
          keyboardType="numeric"
          maxLength={14}
          error={!!errors.cpf}
        />
        {errors.cpf && <Text style={styles.errorText}>{errors.cpf}</Text>}
        
        <TextInput
          label="Telefone"
          value={phone}
          onChangeText={handlePhoneChange}
          style={styles.input}
          mode="outlined"
          keyboardType="phone-pad"
          maxLength={15}
          error={!!errors.phone}
        />
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        
        <Button 
          mode="contained" 
          onPress={handleRegister} 
          style={styles.button}
          loading={loading}
          disabled={loading}
        >
          Cadastrar
        </Button>
        
        <Button 
          mode="text" 
          onPress={() => navigation.navigate('Login')}
          style={styles.linkButton}
        >
          Já tem uma conta? Faça login
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
  linkButton: {
    marginTop: 16,
  },
  errorText: {
    color: '#B00020',
    marginBottom: 8,
    fontSize: 12,
  },
});

export default RegisterScreen;