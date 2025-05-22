import React, { useState, useContext, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  Image,
  Vibration,
  Platform,
  PermissionsAndroid
} from 'react-native';
import { AutenticacaoContext } from '../../contexto/AuthContext';

const logo = require('../../assets/logo.png');

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  
  const { login } = useContext(AutenticacaoContext);

  useEffect(() => {
    const solicitarPermissaoVibracao = async () => {
      if (Platform.OS === 'android') {
        try {
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.VIBRATE
          );
        } catch (err) {
          console.warn('Erro ao solicitar permissão de vibração:', err);
        }
      }
    };
    solicitarPermissaoVibracao();
  }, []);

  const validarEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleLogin = async () => {
    setErro('');
    let mensagemErro = '';

    // Validações sem vibração
    if (!email.trim() || !senha.trim()) {
      mensagemErro = 'Preencha todos os campos';
    } else if (!validarEmail(email)) {
      mensagemErro = 'Digite um email válido';
    }

    // Se encontrar erro, vibra e mostra mensagem
    if (mensagemErro) {
      setErro(mensagemErro);
      Vibration.vibrate(200); // Vibração única de 200ms
      return;
    }

    try {
      setCarregando(true);
      const sucesso = await login(email, senha);

      if (!sucesso) {
        setErro('Credenciais inválidas');
        Vibration.vibrate([200, 100, 200]); // Padrão de vibração para erro de login
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setErro('Erro no login');
      Vibration.vibrate([200, 100, 200, 100, 200]); // Padrão longo para erro grave
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        source={logo} 
        style={styles.logo}
        resizeMode="contain"
      />
      
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
      
      <View style={styles.formContainer}>
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
          placeholder="Senha"
          placeholderTextColor="#999"
          value={senha}
          onChangeText={setSenha}
          style={styles.input}
          secureTextEntry
        />
        
        <TouchableOpacity 
          style={[styles.button, (!email || !senha) && styles.buttonDisabled]} 
          onPress={handleLogin}
          disabled={carregando || !email || !senha}
        >
          {carregando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>ENTRAR</Text>
          )}
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        onPress={() => navigation.navigate('Cadastro')}
        style={styles.registerLink}
      >
        <Text style={styles.linkText}>
          Não tem conta? <Text style={styles.linkHighlight}>Cadastre-se</Text>
        </Text>
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
  logo: {
    width: '100%',
    height: 120,
    marginBottom: 40,
  },
  formContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
    paddingHorizontal: 15,
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
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#A9A9A9',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerLink: {
    marginTop: 25,
    alignSelf: 'center',
  },
  linkText: {
    color: '#8B4513',
    fontSize: 15,
    textAlign: 'center',
  },
  linkHighlight: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  erro: {
    color: '#8B0000',
    backgroundColor: '#F8D7DA',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    textAlign: 'center',
    width: '100%',
  },
});