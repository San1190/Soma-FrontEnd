import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator, Text, Alert } from 'react-native'; // Importar Alert
import AuthNavigator from './src/navigation/AuthNavigator';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AntiStressProvider, useAntiStress } from './src/context/AntiStressContext'; // 1. Importar AntiStress

import { registerForPushNotificationsAsync } from './src/utils/notifications';
import axios from 'axios';
import * as Notifications from 'expo-notifications';
import API_BASE_URL from './src/constants/api'; // Usar la constante central

const Stack = createStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    // Lógica para suprimir notificaciones no críticas si el modo antiestrés está activo
    // Esta lógica es difícil de aplicar aquí globalmente sin acceso al estado del context.
    // La moveremos al listener 'addNotificationReceivedListener'
    
    // Dejamos que Expo muestre la alerta por defecto
    return {
      shouldShowAlert: true,
      shouldPlaySound: true, // Habilitamos sonido para la demo
      shouldSetBadge: false,
    };
  },
});

function AppContent() {
  const { user, isLoading, login } = useAuth();
  const { theme } = useTheme();
  const { isAntiStressModeActive, activateMode, deactivateMode } = useAntiStress(); // 2. Obtener estado y acciones
  
  const notificationListener = useRef();
  const responseListener = useRef();

  // URL del API de estrés
  const STRESS_API_URL = `${API_BASE_URL}/stress/users/${user?.id}`;

  // Efecto para registrar el token de notificación
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (!token) {
        console.log('No se pudo obtener el token de Expo Push.');
        return;
      }
      console.log('Expo Push Token:', token);
      
      if (user && user.id && token) {
        // Registrar el token en el backend
        axios.post(`${API_BASE_URL}/users/${user.id}/register-push-token`, JSON.stringify(token), { // Enviar como JSON
          headers: {
            'Content-Type': 'application/json', // Cambiar a JSON
          },
        })
        .then(response => {
          console.log('Push token registrado exitosamente:', response.data);
        })
        .catch(error => {
          console.error('Error al registrar push token:', error.response ? error.response.data : error.message);
        });
      }
    });

    // Listener para notificaciones recibidas MIENTRAS la app está abierta
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log("Notificación recibida:", notification);
      
      const notificationData = notification.request.content.data;
      
      // 3. Revisar el payload de la notificación
      if (notificationData && notificationData.type === 'ANTI_STRESS_ACTIVATE') {
        if (!isAntiStressModeActive) {
          console.log("Activando modo antiestrés desde notificación...");
          activateMode("AUTOMATIC_NOTIFICATION");
          Alert.alert("Modo Antiestrés Activado", "Hemos detectado un nivel de estrés elevado. Activando modo de calma.");
        }
      }

      // 4. Lógica para suprimir notificaciones no críticas
      if (isAntiStressModeActive && notificationData && notificationData.type !== 'ANTI_STRESS_ACTIVATE') {
        // Opcional: suprimir la notificación si el modo ya está activo
        console.log("Modo antiestrés activo. Suprimiendo notificación no crítica.");
        // (La notificación ya se mostró por el handler global, esto es solo para lógica interna)
      }
    });

    // Listener para cuando el usuario TOCA la notificación
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("Respuesta a notificación recibida:", response);
      const notificationData = response.notification.request.content.data;

      // 5. Activar el modo si el usuario toca la notificación
      if (notificationData && notificationData.type === 'ANTI_STRESS_ACTIVATE') {
        if (!isAntiStressModeActive) {
          activateMode("USER_TAP_NOTIFICATION");
        }
        // Opcional: Navegar a la pantalla de respiración
        // navigation.navigate('Breathing');
      }
    });

    return () => {
      notificationListener.current.remove();
      responseListener.current.remove();
    };
  }, [user, activateMode, isAntiStressModeActive]); // Añadir dependencias

  // 6. Efecto de Sondeo (Polling) para desactivar el modo automáticamente
  useEffect(() => {
    let pollingInterval;

    if (isAntiStressModeActive && user && user.id) {
      console.log("Modo antiestrés activo. Iniciando sondeo de nivel de estrés...");
      
      pollingInterval = setInterval(async () => {
        try {
          const response = await axios.get(STRESS_API_URL);
          // Asumimos que la API devuelve { stressLevel: "Bajo" | "Moderado" | "Alto" }
          const stressCategory = response.data.stressCategory; 
          
          console.log(`Sondeo de estrés: ${stressCategory}`);

          // Nivel de estrés (1-10) del servicio de estrés (opcional)
          // const stressLevel = response.data.stressLevel; 
          // if (stressLevel < 7) { ... }

          if (stressCategory === "Bajo" || stressCategory === "Moderado") {
            console.log("Nivel de estrés ha bajado. Desactivando modo antiestrés automáticamente.");
            Alert.alert("Modo Antiestrés Desactivado", "Tu nivel de estrés se ha reducido. ¡Buen trabajo!");
            deactivateMode();
          }
        } catch (error) {
          console.error('Error durante el sondeo de estrés:', error.message);
          // No desactivar si falla el sondeo, mantener el modo activo
        }
      }, 30000); // Sondear cada 30 segundos
    }

    // Limpiar el intervalo si el modo se desactiva o el componente se desmonta
    return () => {
      if (pollingInterval) {
        console.log("Deteniendo sondeo de estrés.");
        clearInterval(pollingInterval);
      }
    };
  }, [isAntiStressModeActive, user, deactivateMode, STRESS_API_URL]);


  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00BCD4" />
        <Text>Verificando usuario...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Group>
          {user ? (
            <Stack.Screen name="App" component={AppNavigator} />
          ) : (
            <Stack.Screen name="Auth">
              {(props) => <AuthNavigator {...props} onAuthSuccess={login} />}
            </Stack.Screen>
          )}
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AntiStressProvider> 
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </AntiStressProvider>
    </AuthProvider>
  );
}