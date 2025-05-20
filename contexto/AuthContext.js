import React, { createContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AutenticacaoContext = createContext();

export function ProvedorAutenticacao({ children }) {
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  const login = async (email, senha) => {
    try {
      // Simulação de autenticação
      await AsyncStorage.setItem('usuario', JSON.stringify({ email, nome: email.split('@')[0] }));
      setUsuarioLogado({ email, nome: email.split('@')[0] });
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const cadastrar = async ({ nome, email, senha }) => {
    try {
      // Simulação de cadastro
      await AsyncStorage.setItem('usuario', JSON.stringify({ email, nome }));
      setUsuarioLogado({ email, nome });
      return true;
    } catch (error) {
      console.error('Erro no cadastro:', error);
      throw new Error('Erro ao cadastrar usuário');
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('usuario');
      setUsuarioLogado(null);
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  return (
    <AutenticacaoContext.Provider
      value={{ usuarioLogado, login, cadastrar, logout }}>
      {children}
    </AutenticacaoContext.Provider>
  );
}