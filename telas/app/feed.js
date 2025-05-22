import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Modal,
  TextInput,
  Alert,
  Image
} from 'react-native';
import { AutenticacaoContext } from '../../contexto/AuthContext';
import bancoLocal from '../../config/bancoLocal';

const logo = require('../../assets/logo.png');

export default function Feed({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comentario, setComentario] = useState('');
  const [postSelecionado, setPostSelecionado] = useState(null);
  const [modalVisivel, setModalVisivel] = useState(false);
  const { usuarioLogado, logout } = useContext(AutenticacaoContext);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarPosts();
    });
    
    return unsubscribe;
  }, [navigation]);

  const carregarPosts = async () => {
    try {
      setLoading(true);
      const postsCarregados = await bancoLocal.posts.buscarTodos();
      setPosts(postsCarregados || []);
    } catch (error) {
      console.error('Erro ao carregar anúncios:', error);
      Alert.alert('Erro', 'Não foi possível carregar os anúncios');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigation.replace('Login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      Alert.alert('Erro', 'Não foi possível sair da conta');
    }
  };

  const curtirPost = async (postId) => {
    try {
      const postsAtualizados = posts.map(post => {
        if (post.id === postId) {
          return { 
            ...post, 
            curtidas: (post.curtidas || 0) + 1 
          };
        }
        return post;
      });
      
      await bancoLocal.posts.salvarTodos(postsAtualizados);
      setPosts(postsAtualizados);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível curtir o anúncio');
    }
  };

  const handleExcluirPost = async (postId) => {
    Alert.alert(
      'Excluir Post',
      'Tem certeza que deseja excluir este post permanentemente?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Excluir',
          onPress: async () => {
            try {
              const sucesso = await bancoLocal.posts.excluir(postId);
              if (sucesso) {
                carregarPosts();
                Alert.alert('Sucesso', 'Post excluído com sucesso!');
              }
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o post');
            }
          }
        }
      ]
    );
  };

  const adicionarComentario = async () => {
    if (!comentario.trim()) {
      Alert.alert('Atenção', 'Digite um comentário');
      return;
    }

    try {
      const novoComentario = {
        autor: usuarioLogado ? { 
          email: usuarioLogado.email, 
          nome: usuarioLogado.nome || usuarioLogado.email.split('@')[0] 
        } : 'Anônimo',
        texto: comentario.trim(),
        data: new Date().toISOString()
      };

      const postsAtualizados = posts.map(post => {
        if (post.id === postSelecionado.id) {
          const comentarios = post.comentarios || [];
          return {
            ...post,
            comentarios: [...comentarios, novoComentario]
          };
        }
        return post;
      });

      await bancoLocal.posts.salvarTodos(postsAtualizados);
      setPosts(postsAtualizados);
      setComentario('');
      setModalVisivel(false);
      Alert.alert('Sucesso', 'Comentário adicionado!');
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      Alert.alert('Erro', 'Não foi possível adicionar o comentário');
    }
  };

  const abrirModalComentarios = (post) => {
    setPostSelecionado(post);
    setModalVisivel(true);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <Text>Carregando posts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <View style={styles.headerActions}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Postar')}
            style={styles.postButton}
          >
            <Text style={styles.postButtonText}>+ Novo</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutButton}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <Text style={styles.postTitle}>{item.titulo}</Text>
            
            {(item.modelo || item.ano || item.potencia) && (
              <View style={styles.detailsContainer}>
                {item.modelo && <Text style={styles.detail}><Text style={styles.detailLabel}>Modelo:</Text> {item.modelo}</Text>}
                {item.ano && <Text style={styles.detail}><Text style={styles.detailLabel}>Ano:</Text> {item.ano}</Text>}
                {item.potencia && <Text style={styles.detail}><Text style={styles.detailLabel}>Potência:</Text> {item.potencia}</Text>}
              </View>
            )}
            
            {item.descricao && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Descrição</Text>
                <Text style={styles.sectionContent}>{item.descricao}</Text>
              </View>
            )}
            
            {item.modificacoes && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Modificações</Text>
                <Text style={styles.sectionContent}>{item.modificacoes}</Text>
              </View>
            )}
            
            <Text style={styles.postAutor}>
              Postado por: {typeof item.autor === 'object' ? item.autor.nome || item.autor.email : item.autor || 'Anônimo'}
            </Text>
            
            <View style={styles.postActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => curtirPost(item.id)}
              >
                <Text style={styles.actionText}>👍 Curtir ({item.curtidas || 0})</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => abrirModalComentarios(item)}
              >
                <Text style={styles.actionText}>💬 Comentários ({item.comentarios?.length || 0})</Text>
              </TouchableOpacity>

              {usuarioLogado?.email === item.autor?.email && (
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleExcluirPost(item.id)}
                >
                  <Text style={[styles.actionText, styles.deleteButton]}>🗑️ Excluir</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum anúncio encontrado</Text>
            <TouchableOpacity 
              style={styles.button}
              onPress={() => navigation.navigate('Postar')}
            >
              <Text style={styles.buttonText}>Criar primeiro anúncio</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisivel}
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Comentários</Text>
            
            <FlatList
              data={postSelecionado?.comentarios || []}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.comentario}>
                  <Text style={styles.comentarioAutor}>
                    {typeof item.autor === 'object' ? item.autor.nome || item.autor.email : item.autor || 'Anônimo'}:
                  </Text>
                  <Text style={styles.comentarioTexto}>{item.texto}</Text>
                </View>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyComments}>Nenhum comentário ainda</Text>
              }
            />
            
            <TextInput
              placeholder="Adicione um comentário..."
              value={comentario}
              onChangeText={setComentario}
              style={styles.comentarioInput}
              multiline
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisivel(false)}
              >
                <Text style={styles.buttonText}>Fechar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={adicionarComentario}
              >
                <Text style={styles.buttonText}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D2B48C',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#8B4513',
  },
  logo: {
    width: 100,
    height: 50,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  postButton: {
    backgroundColor: '#8B4513',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    elevation: 2,
  },
  postButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  logoutButton: {
    color: '#8B4513',
    fontWeight: 'bold',
    fontSize: 14,
  },
  post: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: 8,
    margin: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#8B4513',
    elevation: 2,
  },
  postTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
    color: '#8B4513',
    borderLeftWidth: 4,
    borderLeftColor: '#D2B48C',
    paddingLeft: 10,
  },
  detailsContainer: {
    marginBottom: 10,
    backgroundColor: '#f8f1e5',
    padding: 10,
    borderRadius: 5,
  },
  detail: {
    marginBottom: 5,
    color: '#654321',
    fontSize: 14,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#8B4513',
  },
  section: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#D2B48C',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#8B4513',
    fontSize: 16,
  },
  sectionContent: {
    color: '#654321',
    lineHeight: 20,
    fontSize: 14,
  },
  postAutor: {
    fontSize: 12,
    color: '#8B4513',
    marginTop: 10,
    fontStyle: 'italic',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#D2B48C',
    paddingTop: 10,
    marginTop: 10,
  },
  actionButton: {
    padding: 5,
    backgroundColor: '#f8f1e5',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  actionText: {
    color: '#8B4513',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteButton: {
    color: '#FF0000',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#8B4513',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#8B4513',
    padding: 12,
    borderRadius: 6,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
    borderWidth: 2,
    borderColor: '#8B4513',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#8B4513',
  },
  comentario: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#D2B48C',
  },
  comentarioAutor: {
    fontWeight: 'bold',
    color: '#8B4513',
    fontSize: 14,
  },
  comentarioTexto: {
    color: '#654321',
    marginTop: 3,
    fontSize: 14,
  },
  emptyComments: {
    textAlign: 'center',
    color: '#8B4513',
    marginVertical: 15,
  },
  comentarioInput: {
    borderWidth: 1,
    borderColor: '#8B4513',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    minHeight: 60,
    textAlignVertical: 'top',
    color: '#654321',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    gap: 10,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#D2B48C',
  },
  confirmButton: {
    backgroundColor: '#8B4513',
  },
});