import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  ProvedorAutenticacao,
  AutenticacaoContext,
} from './contexto/AuthContext';
import Login from './telas/autenticacao/Login';
import Cadastro from './telas/autenticacao/Cadastro';
import Feed from './telas/app/feed';
import Postar from './telas/app/postar';

const Stack = createStackNavigator();

function NavegacaoAuth() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Cadastro" component={Cadastro} />
    </Stack.Navigator>
  );
}

function NavegacaoApp() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Feed" component={Feed} />
      <Stack.Screen name="Postar" component={Postar} />
    </Stack.Navigator>
  );
}

function NavegacaoPrincipal() {
  const { usuarioLogado } = useContext(AutenticacaoContext);
  return usuarioLogado ? <NavegacaoApp /> : <NavegacaoAuth />;
}

export default function App() {
  return (
    <ProvedorAutenticacao>
      <NavigationContainer>
        <NavegacaoPrincipal />
      </NavigationContainer>
    </ProvedorAutenticacao>
  );
}
