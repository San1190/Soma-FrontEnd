import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { AntiStressProvider } from '../../context/AntiStressContext';
import * as authService from '../../services/auth';
import * as sessionService from '../../services/session';
import { Text, TouchableOpacity, View } from 'react-native';

// Mocks
jest.mock('../../services/auth', () => ({
  login: jest.fn(),
  registerUser: jest.fn(),
}));

jest.mock('../../services/session', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  deleteItem: jest.fn(),
}));

// Componente de prueba que simula un flujo de usuario
const TestApp = () => {
  const auth = useAuth();

  if (auth.isLoading) {
    return <Text testID="loading">Cargando...</Text>;
  }

  if (!auth.user) {
    return (
      <View>
        <Text testID="login-screen">Pantalla de Login</Text>
        <TouchableOpacity
          testID="login-btn"
          onPress={async () => {
            await auth.login('test@test.com', 'password123');
          }}
        >
          <Text>Iniciar Sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="register-btn"
          onPress={async () => {
            await auth.register('Test User', 'test@test.com', 'password123');
          }}
        >
          <Text>Registrarse</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View>
      <Text testID="home-screen">Pantalla Principal</Text>
      <Text testID="user-name">{auth.user.first_name}</Text>
      <Text testID="user-email">{auth.user.email}</Text>
      <TouchableOpacity testID="logout-btn" onPress={() => auth.logout()}>
        <Text>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const TestWrapper = ({ children }) => (
  <AuthProvider>
    <AntiStressProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </AntiStressProvider>
  </AuthProvider>
);

describe('User Flow Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionService.getItem.mockResolvedValue(null);
    sessionService.setItem.mockResolvedValue(undefined);
    sessionService.deleteItem.mockResolvedValue(undefined);
  });

  describe('Flujo de autenticación completo', () => {
    it('debería mostrar pantalla de login inicialmente', async () => {
      const { getByTestId } = render(
        <TestWrapper>
          <TestApp />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(getByTestId('login-screen')).toBeTruthy();
      });
    });

    it('debería navegar a home después de login exitoso', async () => {
      authService.login.mockResolvedValue({
        user_id: 1,
        email: 'test@test.com',
        first_name: 'Test',
        last_name: 'User',
      });

      const { getByTestId } = render(
        <TestWrapper>
          <TestApp />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(getByTestId('login-screen')).toBeTruthy();
      });

      fireEvent.press(getByTestId('login-btn'));

      await waitFor(() => {
        expect(getByTestId('home-screen')).toBeTruthy();
        expect(getByTestId('user-name').props.children).toBe('Test');
        expect(getByTestId('user-email').props.children).toBe('test@test.com');
      });
    });

    it('debería mantener sesión después de logout y nuevo login', async () => {
      authService.login.mockResolvedValue({
        user_id: 1,
        email: 'test@test.com',
        first_name: 'Test',
        last_name: 'User',
      });

      const { getByTestId } = render(
        <TestWrapper>
          <TestApp />
        </TestWrapper>
      );

      // Esperar pantalla de login
      await waitFor(() => {
        expect(getByTestId('login-screen')).toBeTruthy();
      });

      // Login
      fireEvent.press(getByTestId('login-btn'));

      await waitFor(() => {
        expect(getByTestId('home-screen')).toBeTruthy();
      });

      // Logout
      fireEvent.press(getByTestId('logout-btn'));

      await waitFor(() => {
        expect(getByTestId('login-screen')).toBeTruthy();
      });

      // Login de nuevo
      fireEvent.press(getByTestId('login-btn'));

      await waitFor(() => {
        expect(getByTestId('home-screen')).toBeTruthy();
      });
    });

    it('debería permanecer en login si las credenciales son incorrectas', async () => {
      authService.login.mockRejectedValue(new Error('Invalid credentials'));

      const { getByTestId } = render(
        <TestWrapper>
          <TestApp />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(getByTestId('login-screen')).toBeTruthy();
      });

      fireEvent.press(getByTestId('login-btn'));

      // Debería seguir en la pantalla de login
      await waitFor(() => {
        expect(getByTestId('login-screen')).toBeTruthy();
      });
    });
  });

  describe('Persistencia de sesión', () => {
    it('debería restaurar sesión desde storage', async () => {
      const storedUser = {
        id: 1,
        email: 'stored@test.com',
        first_name: 'Stored',
        last_name: 'User',
      };
      sessionService.getItem.mockResolvedValue(JSON.stringify(storedUser));

      const { getByTestId } = render(
        <TestWrapper>
          <TestApp />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(getByTestId('home-screen')).toBeTruthy();
        expect(getByTestId('user-name').props.children).toBe('Stored');
      });
    });

    it('debería guardar sesión después de login exitoso', async () => {
      authService.login.mockResolvedValue({
        user_id: 1,
        email: 'test@test.com',
        first_name: 'Test',
        last_name: 'User',
      });

      const { getByTestId } = render(
        <TestWrapper>
          <TestApp />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(getByTestId('login-screen')).toBeTruthy();
      });

      fireEvent.press(getByTestId('login-btn'));

      await waitFor(() => {
        expect(sessionService.setItem).toHaveBeenCalledWith(
          'user',
          expect.stringContaining('test@test.com')
        );
      });
    });

    it('debería eliminar sesión después de logout', async () => {
      const storedUser = { id: 1, email: 'test@test.com', first_name: 'Test' };
      sessionService.getItem.mockResolvedValue(JSON.stringify(storedUser));

      const { getByTestId } = render(
        <TestWrapper>
          <TestApp />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(getByTestId('home-screen')).toBeTruthy();
      });

      fireEvent.press(getByTestId('logout-btn'));

      await waitFor(() => {
        expect(sessionService.deleteItem).toHaveBeenCalledWith('user');
      });
    });
  });

  describe('Pruebas de regresión', () => {
    it('debería manejar errores de storage gracefully', async () => {
      sessionService.getItem.mockRejectedValue(new Error('Storage error'));

      const { getByTestId } = render(
        <TestWrapper>
          <TestApp />
        </TestWrapper>
      );

      // Debería continuar y mostrar login
      await waitFor(() => {
        expect(getByTestId('login-screen')).toBeTruthy();
      });
    });

    it('debería manejar datos de usuario corruptos en storage', async () => {
      sessionService.getItem.mockResolvedValue('invalid json');

      const { getByTestId } = render(
        <TestWrapper>
          <TestApp />
        </TestWrapper>
      );

      // Debería continuar y mostrar login
      await waitFor(() => {
        expect(getByTestId('login-screen')).toBeTruthy();
      });
    });

    it('debería manejar respuestas del servidor incompletas', async () => {
      authService.login.mockResolvedValue({
        user_id: 1,
        // Sin email ni nombre
      });

      const { getByTestId } = render(
        <TestWrapper>
          <TestApp />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(getByTestId('login-screen')).toBeTruthy();
      });

      fireEvent.press(getByTestId('login-btn'));

      await waitFor(() => {
        expect(getByTestId('home-screen')).toBeTruthy();
      });
    });
  });
});

