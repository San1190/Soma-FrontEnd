// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { ActivityIndicator, View } from 'react-native';

import AuthNavigator from './src/navigation/AuthNavigator';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  // Estado para saber si estamos comprobando el token (para mostrar una pantalla de carga)
  const [isLoading, setIsLoading] = useState(true);
  // Estado para guardar el token del usuario
  const [userToken, setUserToken] = useState(null);

  // Este useEffect se ejecuta UNA SOLA VEZ cuando la app arranca
  useEffect(() => {
    const bootstrapAsync = async () => {
      let token;
      try {
        // 1. El "portero" intenta coger la "pulsera" (token) del bolsillo (SecureStore)
        token = await SecureStore.getItemAsync('userToken');
      } catch (e) {
        console.error('Error al restaurar el token', e);
      }
      // 2. Actualizamos nuestro estado con el resultado. Si no había token, será null.
      setUserToken(token);
      setIsLoading(false); // Dejamos de cargar
    };

    bootstrapAsync();
  }, []);

  // Mientras estamos comprobando, mostramos una pantalla de carga para evitar parpadeos
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {/* 3. El "portero" toma la decisión */}
      {userToken == null ? (
        // No hay pulsera -> A la taquilla (AuthNavigator)
        <AuthNavigator />
      ) : (
        // Sí hay pulsera -> A la discoteca (AppNavigator)
        <AppNavigator />
      )}
    </NavigationContainer>
  );
}