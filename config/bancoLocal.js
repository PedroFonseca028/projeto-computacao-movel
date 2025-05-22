import AsyncStorage from '@react-native-async-storage/async-storage';

const bancoLocal = {
  posts: {
    salvarTodos: async (posts) => {
      try {
        await AsyncStorage.setItem('posts', JSON.stringify(posts));
        return true;
      } catch (error) {
        console.error('Erro ao salvar posts:', error);
        return false;
      }
    },

    buscarTodos: async () => {
      try {
        const dados = await AsyncStorage.getItem('posts');
        return dados ? JSON.parse(dados) : [];
      } catch (error) {
        console.error('Erro ao buscar posts:', error);
        return [];
      }
    },

    adicionar: async (novoPost) => {
      try {
        const postsAtuais = await bancoLocal.posts.buscarTodos();
        const novosPosts = [novoPost, ...postsAtuais];
        await bancoLocal.posts.salvarTodos(novosPosts);
        return novosPosts;
      } catch (error) {
        console.error('Erro ao adicionar post:', error);
        throw error;
      }
    },

excluir: async (postId) => {
      try {
        const postsAtuais = await bancoLocal.posts.buscarTodos();
        const postIndex = postsAtuais.findIndex(post => post.id === postId);
        
        if (postIndex === -1) {
          console.log('Post não encontrado para exclusão');
          return false;
        }

        const postsAtualizados = postsAtuais.filter(post => post.id !== postId);
        const sucesso = await bancoLocal.posts.salvarTodos(postsAtualizados);
        
        if (!sucesso) {
          throw new Error('Falha ao salvar posts após exclusão');
        }
        
        return true;
      } catch (error) {
        console.error('Erro detalhado na exclusão:', error);
        return false;
      }
    }
  }
};

export default bancoLocal;
