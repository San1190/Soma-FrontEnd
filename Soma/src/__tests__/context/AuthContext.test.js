import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import { Text, TouchableOpacity } from 'react-native';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import * as authService from '../../services/auth';
import * as sessionService from '../../services/session';

// Mock de servicios
jest.mock('../../services/auth', () => ({
  login: jest.fn(),
  registerUser: jest.fn(),
}));

jest.mock('../../services/session', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  deleteItem: jest.fn(),
}));

// Componente de prueba para acceder al contexto
const TestConsumer = ({ onReady }) => {
  const auth = useAuth();
  
  React.useEffect(() => {
    if (!auth.isLoading && onReady) {
      onReady(auth);
    }
  }, [auth.isLoading]);
  
  return (
    <>
      <Text testID="user">{auth.user ? JSON.stringify(auth.user) : 'null'}</Text>
      <Text testID="loading">{auth.isLoading ? 'loading' : 'ready'}</Text>
      <TouchableOpacity testID="login-btn" onPress={() => auth.login('test@test.com', 'password123')} />
      <TouchableOpacity testID="logout-btn" onPress={() => auth.logout()} />
      <TouchableOpacity testID="register-btn" onPress={() => auth.register('Test', 'test@test.com', 'password123')} />
    </>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionService.getItem.mockResolvedValue(null);
    sessionService.setItem.mockResolvedValue(undefined);
    sessionService.deleteItem.mockResolvedValue(undefined);
  });

  describe('Estado inicial', () => {
    it('debería iniciar con user null y loading true', async () => {
      const { getByTestId } = render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );
      
      // Inicialmente está cargando
      await waitFor(() => {
        expect(getByTestId('loading').props.children).toBe('ready');
      });
      
      expect(getByTestId('user').props.children).toBe('null');
    });

    it('debería cargar usuario desde storage si existe', async () => {
      const storedUser = { id: 1, email: 'stored@test.com', first_name: 'Stored' };
      sessionService.getItem.mockResolvedValue(JSON.stringify(storedUser));
      
      const { getByTestId } = render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );
      
      await waitFor(() => {
        expect(getByTestId('loading').props.children).toBe('ready');
      });
      
      expect(getByTestId('user').props.children).toContain('stored@test.com');
    });
  });

  describe('Login', () => {
    it('debería hacer login correctamente', async () => {
      const mockResponse = {
        user_id: 1,
        email: 'test@test.com',
        first_name: 'Test',
        last_name: 'User',
      };
      authService.login.mockResolvedValue(mockResponse);
      
      let authRef;
      const { getByTestId } = render(
        <AuthProvider>
          <TestConsumer onReady={(auth) => { authRef = auth; }} />
        </AuthProvider>
      );
      
      await waitFor(() => {
        expect(getByTestId('loading').props.children).toBe('ready');
      });
      
      await act(async () => {
        const result = await authRef.login('test@test.com', 'password123');
        expect(result).toBe(true);
      });
      
      expect(authService.login).toHaveBeenCalledWith('test@test.com', 'password123');
      expect(sessionService.setItem).toHaveBeenCalled();
    });

    it('debería retornar false si login falla', async () => {
      authService.login.mockRejectedValue(new Error('Invalid credentials'));
      
      let authRef;
      const { getByTestId } = render(
        <AuthProvider>
          <TestConsumer onReady={(auth) => { authRef = auth; }} />
        </AuthProvider>
      );
      
      await waitFor(() => {
        expect(getByTestId('loading').props.children).toBe('ready');
      });
      
      await act(async () => {
        const result = await authRef.login('wrong@test.com', 'wrongpass');
        expect(result).toBe(false);
      });
    });
  });

  describe('Logout', () => {
    it('debería hacer logout correctamente', async () => {
      const storedUser = { id: 1, email: 'test@test.com' };
      sessionService.getItem.mockResolvedValue(JSON.stringify(storedUser));
      
      let authRef;
      const { getByTestId } = render(
        <AuthProvider>
          <TestConsumer onReady={(auth) => { authRef = auth; }} />
        </AuthProvider>
      );
      
      await waitFor(() => {
        expect(getByTestId('loading').props.children).toBe('ready');
      });
      
      await act(async () => {
        await authRef.logout();
      });
      
      expect(sessionService.deleteItem).toHaveBeenCalledWith('user');
      
      await waitFor(() => {
        expect(getByTestId('user').props.children).toBe('null');
      });
    });
  });

  describe('Register', () => {
    it('debería registrar usuario correctamente', async () => {
      authService.registerUser.mockResolvedValue({ user_id: 2, email: 'new@test.com' });
      
      let authRef;
      const { getByTestId } = render(
        <AuthProvider>
          <TestConsumer onReady={(auth) => { authRef = auth; }} />
        </AuthProvider>
      );
      
      await waitFor(() => {
        expect(getByTestId('loading').props.children).toBe('ready');
      });
      
      await act(async () => {
        const result = await authRef.register('New User', 'new@test.com', 'password123');
        expect(result).toBe(true);
      });
    });

    it('debería retornar false si registro falla', async () => {
      authService.registerUser.mockRejectedValue(new Error('Email already exists'));
      
      let authRef;
      const { getByTestId } = render(
        <AuthProvider>
          <TestConsumer onReady={(auth) => { authRef = auth; }} />
        </AuthProvider>
      );
      
      await waitFor(() => {
        expect(getByTestId('loading').props.children).toBe('ready');
      });
      
      await act(async () => {
        const result = await authRef.register('Existing', 'existing@test.com', 'password123');
        expect(result).toBe(false);
      });
    });
  });

  describe('Pruebas de regresión', () => {
    it('debería manejar múltiples logins/logouts', async () => {
      authService.login.mockResolvedValue({
        user_id: 1,
        email: 'test@test.com',
        first_name: 'Test',
      });
      
      let authRef;
      const { getByTestId } = render(
        <AuthProvider>
          <TestConsumer onReady={(auth) => { authRef = auth; }} />
        </AuthProvider>
      );
      
      await waitFor(() => {
        expect(getByTestId('loading').props.children).toBe('ready');
      });
      
      // Login -> Logout -> Login
      await act(async () => {
        await authRef.login('test@test.com', 'pass');
      });
      
      await act(async () => {
        await authRef.logout();
      });
      
      await act(async () => {
        await authRef.login('test@test.com', 'pass');
      });
      
      expect(authService.login).toHaveBeenCalledTimes(2);
      expect(sessionService.deleteItem).toHaveBeenCalledTimes(1);
    });

    it('debería manejar errores de storage gracefully', async () => {
      sessionService.getItem.mockRejectedValue(new Error('Storage error'));
      
      const { getByTestId } = render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );
      
      // Debería manejar el error y continuar
      await waitFor(() => {
        expect(getByTestId('loading').props.children).toBe('ready');
      });
      
      expect(getByTestId('user').props.children).toBe('null');
    });
  });
});

