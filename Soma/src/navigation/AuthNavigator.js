import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import PersonalizationScreen from '../screens/PersonalizationScreen'; // <-- ¡IMPORTACIÓN AÑADIDA!

const Stack = createStackNavigator();

const AuthNavigator = ({ onAuthSuccess }) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login">
      {(props) => <LoginScreen {...props} onAuthSuccess={onAuthSuccess} />}
    </Stack.Screen>
    <Stack.Screen name="Register" component={RegisterScreen} />
    
    {/* ¡PANTALLA AÑADIDA! La clave 'Personalization' coincide con la llamada de navigation.navigate() */}
    <Stack.Screen name="Personalization" component={PersonalizationScreen} />
  </Stack.Navigator>
);

export default AuthNavigator;
