import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator, Text } from 'react-native';
import AuthNavigator from './src/navigation/AuthNavigator';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';

const Stack = createStackNavigator();

function AppContent() {
  const { user, isLoading, login } = useAuth();

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
