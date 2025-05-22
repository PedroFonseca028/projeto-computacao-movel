import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { AutenticacaoContext } from '../../contexto/AuthContext';

export default function Cadastro({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  
  const { cadastrar } = useContext(AutenticacaoContext);

  const validarEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleCadastro = async () => {
    setErro('');
    
    if (!nome.trim() || !email.trim() || !senha || !confirmarSenha) {
      setErro('Preencha todos os campos');
      return;
    }
    
    if (!validarEmail(email)) {
      setErro('Digite um email válido');
      return;
    }
    
    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem');
      return;
    }
    
    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    try {
      setCarregando(true);
      await cadastrar({ nome, email, senha });
      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>
      
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
      
      <View style={styles.formContainer}>
        <TextInput
          placeholder="Nome completo"
          placeholderTextColor="#999"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
          autoCapitalize="words"
        />
        
        <TextInput
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        
        <TextInput
          placeholder="Senha (mínimo 6 caracteres)"
          placeholderTextColor="#999"
          value={senha}
          onChangeText={setSenha}
          style={styles.input}
          secureTextEntry
        />
        
        <TextInput
          placeholder="Confirmar senha"
          placeholderTextColor="#999"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          style={styles.input}
          secureTextEntry
        />
        
        <TouchableOpacity 
          style={[styles.button, (!nome || !email || !senha || !confirmarSenha) && styles.buttonDisabled]} 
          onPress={handleCadastro}
          disabled={carregando || !nome || !email || !senha || !confirmarSenha}
        >
          {carregando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>CADASTRAR</Text>
          )}
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Já tem uma conta? <Text style={styles.linkHighlight}>Faça login</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#D2B48C',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 30,
    letterSpacing: 1,
  },
  formContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    borderRadius: 10,
    elevation: 3,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#8B4513',
    borderRadius: 5,
    padding: 15,
    marginBottom: 20,
    backgroundColor: '#FFF',
    color: '#333',
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 5,
    backgroundColor: '#8B4513',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: '#aaaaaa',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  link: {
    marginTop: 20,
    color: '#8B4513',
    textAlign: 'center',
    fontSize: 16,
  },
  linkHighlight: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  erro: {
    color: '#8B0000',
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: '#f8d7da',
    padding: 10,
    borderRadius: 5,
    width: '100%',
  },
});