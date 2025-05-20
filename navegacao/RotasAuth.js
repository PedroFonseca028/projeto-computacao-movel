import { createStackNavigator } from '@react-navigation/stack';
import Login from '../telas/autenticacao/Login';
import Cadastro from '../telas/autenticacao/Cadastro';

const Stack = createStackNavigator();

export default function RotasAuth() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Cadastro" component={Cadastro} />
    </Stack.Navigator>
  );
}