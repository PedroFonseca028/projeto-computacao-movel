import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AutenticacaoContext } from '../../contexto/AuthContext';
import bancoLocal from '../../config/bancoLocal';

export default function Excluir() {
  const navigation = useNavigation();
  const route = useRoute();
  const { postId } = route.params;
  const [carregando, setCarregando] = useState(true);
  const { usuarioLogado } = useContext(AutenticacaoContext);

  useEffect(() => {
    const confirmarExclusao = async () => {
      try {
        const posts = await bancoLocal.posts.buscarTodos();
        const post = posts.find(p => p.id === postId);
        
        if (!post) {
          Alert.alert('Erro', 'Post não encontrado');
          navigation.goBack();
          return;
        }

        if (post.autor.email !== usuarioLogado?.email) {
          Alert.alert('Erro', 'Você não tem permissão para excluir este post');
          navigation.goBack();
          return;
        }

        Alert.alert(
          'Confirmar Exclusão',
          'Tem certeza que deseja excluir este post permanentemente?',
          [
            {
              text: 'Cancelar',
              onPress: () => navigation.goBack(),
              style: 'cancel'
            },
            {
              text: 'Excluir',
              onPress: async () => {
                await bancoLocal.posts.excluir(postId);
                navigation.navigate('Feed');
              }
            }
          ]
        );
      } catch (error) {
        Alert.alert('Erro', 'Ocorreu um erro ao processar a exclusão');
        navigation.goBack();
      } finally {
        setCarregando(false);
      }
    };

    confirmarExclusao();
  }, [navigation, postId, usuarioLogado?.email]); 

  if (carregando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#8B4513" />
      </View>
    );
  }

  return null;
}