import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AutenticacaoContext = createContext();

export function ProvedorAutenticacao({ children }) {
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const usuarioSalvo = await AsyncStorage.getItem('usuarioLogado');
        if (usuarioSalvo) {
          setUsuarioLogado(JSON.parse(usuarioSalvo));
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
      }
    };
    carregarUsuario();
  }, []);

  const login = async (email, senha) => {
    try {
      // Busca lista de usuários
      const usuariosSalvos = await AsyncStorage.getItem('usuarios');
      const usuarios = usuariosSalvos ? JSON.parse(usuariosSalvos) : [];
      
      // Verifica credenciais
      const usuario = usuarios.find(
        u => u.email === email && u.senha === senha
      );

      if (!usuario) {
        throw new Error('Credenciais inválidas');
      }

      // Atualiza estado e storage
      await AsyncStorage.setItem('usuarioLogado', JSON.stringify(usuario));
      setUsuarioLogado(usuario);
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const cadastrar = async ({ nome, email, senha }) => {
    try {
      // Verifica se usuário já existe
      const usuariosSalvos = await AsyncStorage.getItem('usuarios');
      const usuarios = usuariosSalvos ? JSON.parse(usuariosSalvos) : [];
      
      const emailExiste = usuarios.some(u => u.email === email);
      if (emailExiste) {
        throw new Error('Email já cadastrado');
      }

      // Cria novo usuário
      const novoUsuario = {
        id: Date.now().toString(),
        nome,
        email,
        senha, // Em produção, usar biblioteca de criptografia
        dataCadastro: new Date().toISOString()
      };

      // Atualiza lista de usuários
      const novaLista = [...usuarios, novoUsuario];
      await AsyncStorage.setItem('usuarios', JSON.stringify(novaLista));
      
      // Loga automaticamente
      await AsyncStorage.setItem('usuarioLogado', JSON.stringify(novoUsuario));
      setUsuarioLogado(novoUsuario);
      return true;
    } catch (error) {
      console.error('Erro no cadastro:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('usuarioLogado');
      setUsuarioLogado(null);
    } catch (error) {
      console.error('Erro no logout:', error);
      throw error;
    }
  };

  return (
    <AutenticacaoContext.Provider
      value={{ 
        usuarioLogado, 
        login, 
        cadastrar, 
        logout 
      }}
    >
      {children}
    </AutenticacaoContext.Provider>
  );
}