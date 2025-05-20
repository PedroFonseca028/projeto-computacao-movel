import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Feed from '../telas/app/Feed';
import Postar from '../telas/app/Postar';

const Tab = createBottomTabNavigator();

export default function RotasApp() {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Feed" 
        component={Feed}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="car" color={color} size={size} />
          )
        }}
      />
      <Tab.Screen 
        name="Postar" 
        component={Postar}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="plus" color={color} size={size} />
          )
        }}
      />
    </Tab.Navigator>
  );
}