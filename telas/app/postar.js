import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { AutenticacaoContext } from '../../contexto/AuthContext';
import bancoLocal from '../../config/bancoLocal';

export default function Postar({ navigation }) {
  const [titulo, setTitulo] = useState('');
  const [modelo, setModelo] = useState('');
  const [ano, setAno] = useState('');
  const [potencia, setPotencia] = useState('');
  const [descricao, setDescricao] = useState('');
  const [modificacoes, setModificacoes] = useState('');
  const [loading, setLoading] = useState(false);
  const { usuarioLogado } = useContext(AutenticacaoContext);

  const validarPost = () => {
    if (!titulo.trim()) {
      Alert.alert('Campo obrigatório', 'Por favor, insira um título');
      return false;
    }
    return true;
  };

  const handlePostar = async () => {
    if (!validarPost()) return;

    setLoading(true);
    
    const novoPost = {
      id: Date.now().toString(),
      titulo: titulo.trim(),
      modelo: modelo.trim(),
      ano: ano.trim(),
      potencia: potencia.trim(),
      descricao: descricao.trim(),
      modificacoes: modificacoes.trim(),
      autor: usuarioLogado ? { 
        email: usuarioLogado.email, 
        nome: usuarioLogado.nome || usuarioLogado.email.split('@')[0] 
      } : 'Anônimo',
      curtidas: 0,
      comentarios: [],
      data: new Date().toISOString()
    };

    try {
      await bancoLocal.posts.adicionar(novoPost);
      setTitulo('');
      setModelo('');
      setAno('');
      setPotencia('');
      setDescricao('');
      setModificacoes('');
      
      Alert.alert('Sucesso', 'Anúncio criado com sucesso!', [
        { text: 'OK', onPress: () => navigation.navigate('Feed') }
      ]);
    } catch (error) {
      console.error('Erro ao criar anúncio:', error);
      Alert.alert('Erro', 'Não foi possível criar o anúncio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crie um post sobre o seu carro</Text>
      
      <Text style={styles.sectionTitle}>Informações Básicas</Text>
      <TextInput
        placeholder="Título "
        placeholderTextColor="#999"
        value={titulo}
        onChangeText={setTitulo}
        style={styles.input}
        maxLength={100}
      />
      
      <TextInput
        placeholder="Modelo do carro: "
        placeholderTextColor="#999"
        value={modelo}
        onChangeText={setModelo}
        style={styles.input}
      />
      
      <TextInput
        placeholder="Ano:"
        placeholderTextColor="#999"
        value={ano}
        onChangeText={setAno}
        style={styles.input}
        keyboardType="numeric"
      />
      
      <TextInput
        placeholder="Potência(em cv): "
        placeholderTextColor="#999"
        value={potencia}
        onChangeText={setPotencia}
        style={styles.input}
      />

      <Text style={styles.sectionTitle}>Detalhes</Text>
      <TextInput
        placeholder="Descrição:"
        placeholderTextColor="#999"
        value={descricao}
        onChangeText={setDescricao}
        style={[styles.input, styles.textArea]}
        multiline
        textAlignVertical="top"
      />
      
      <TextInput
        placeholder="Modificações realizadas ou desejadas..."
        placeholderTextColor="#999"
        value={modificacoes}
        onChangeText={setModificacoes}
        style={[styles.input, styles.textArea]}
        multiline
        textAlignVertical="top"
      />
      
      <TouchableOpacity
        style={[
          styles.button,
          (!titulo.trim() || loading) && styles.buttonDisabled
        ]}
        onPress={handlePostar}
        disabled={!titulo.trim() || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.buttonText}>POSTAR</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 30,
    backgroundColor: '#D2B48C',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#8B4513',
    borderBottomWidth: 2,
    borderBottomColor: '#8B4513',
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    marginTop: 20,
    color: '#8B4513',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: '#8B4513',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#654321',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#8B4513',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#A0522D',
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
