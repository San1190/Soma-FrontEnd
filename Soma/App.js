import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator, Text } from 'react-native';
import AuthNavigator from './src/navigation/AuthNavigator';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

const Stack = createStackNavigator();

import { registerForPushNotificationsAsync } from './src/utils/notifications';
import axios from 'axios';
import * as Notifications from 'expo-notifications';
import { useRef } from 'react';

const API_BASE_URL = 'http://192.168.1.10:8080/api'; // Replace with your backend API base URL

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function AppContent() {
  const { user, isLoading, login } = useAuth();
  const { theme } = useTheme();
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      console.log('Expo Push Token:', token);
      if (user && token) {
        axios.post(`${API_BASE_URL}/users/${user.user_id}/register-push-token`, token, {
          headers: {
            'Content-Type': 'text/plain',
          },
        })
        .then(response => {
          console.log('Push token registered successfully:', response.data);
        })
        .catch(error => {
          console.error('Error registering push token:', error);
        });
      }
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log("Notification received:", notification);
      // Handle notification when app is in foreground
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("Notification response received:", response);
      // Handle notification when user interacts with it (taps on it)
    });

    return () => {
      notificationListener.current.remove();
      responseListener.current.remove();
    };
  }, [user]);

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
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}
