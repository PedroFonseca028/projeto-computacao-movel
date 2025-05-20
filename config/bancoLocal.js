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
    }
  }
};

export default bancoLocal;