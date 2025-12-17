import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import LoginScreen from '../../screens/LoginScreen';
import { ThemeProvider } from '../../context/ThemeContext';
import { AuthProvider } from '../../context/AuthContext';
import { AntiStressProvider } from '../../context/AntiStressContext';

// Mock Alert
jest.spyOn(Alert, 'alert');

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

// Wrapper para proveer contextos
const TestWrapper = ({ children }) => (
  <AuthProvider>
    <AntiStressProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </AntiStressProvider>
  </AuthProvider>
);

const renderWithProviders = (component) => {
  return render(<TestWrapper>{component}</TestWrapper>);
};

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderizado', () => {
    it('debería renderizar la pantalla de login', () => {
      const mockOnAuthSuccess = jest.fn();
      const { getByPlaceholderText, getByText } = renderWithProviders(
        <LoginScreen navigation={mockNavigation} onAuthSuccess={mockOnAuthSuccess} />
      );

      expect(getByPlaceholderText('Correo electrónico')).toBeTruthy();
      expect(getByPlaceholderText('Contraseña')).toBeTruthy();
      expect(getByText('Entrar con correo')).toBeTruthy();
    });

    it('debería mostrar opciones de login social', () => {
      const mockOnAuthSuccess = jest.fn();
      const { getByText } = renderWithProviders(
        <LoginScreen navigation={mockNavigation} onAuthSuccess={mockOnAuthSuccess} />
      );

      expect(getByText('Entrar con Google')).toBeTruthy();
      expect(getByText('Entrar con Apple')).toBeTruthy();
    });

    it('debería mostrar enlace de registro', () => {
      const mockOnAuthSuccess = jest.fn();
      const { getByText } = renderWithProviders(
        <LoginScreen navigation={mockNavigation} onAuthSuccess={mockOnAuthSuccess} />
      );

      expect(getByText('Regístrate aquí')).toBeTruthy();
    });
  });

  describe('Entrada de datos', () => {
    it('debería actualizar el email cuando se escribe', () => {
      const mockOnAuthSuccess = jest.fn();
      const { getByPlaceholderText } = renderWithProviders(
        <LoginScreen navigation={mockNavigation} onAuthSuccess={mockOnAuthSuccess} />
      );

      const emailInput = getByPlaceholderText('Correo electrónico');
      fireEvent.changeText(emailInput, 'test@example.com');

      expect(emailInput.props.value).toBe('test@example.com');
    });

    it('debería actualizar la contraseña cuando se escribe', () => {
      const mockOnAuthSuccess = jest.fn();
      const { getByPlaceholderText } = renderWithProviders(
        <LoginScreen navigation={mockNavigation} onAuthSuccess={mockOnAuthSuccess} />
      );

      const passwordInput = getByPlaceholderText('Contraseña');
      fireEvent.changeText(passwordInput, 'password123');

      expect(passwordInput.props.value).toBe('password123');
    });
  });

  describe('Validación', () => {
    it('debería mostrar alerta si email está vacío', async () => {
      const mockOnAuthSuccess = jest.fn();
      const { getByText, getByPlaceholderText } = renderWithProviders(
        <LoginScreen navigation={mockNavigation} onAuthSuccess={mockOnAuthSuccess} />
      );

      // Solo escribir contraseña, dejar email vacío
      fireEvent.changeText(getByPlaceholderText('Contraseña'), 'password123');
      fireEvent.press(getByText('Entrar con correo'));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Campos requeridos',
          'Introduce tu correo y contraseña.'
        );
      });
    });

    it('debería mostrar alerta si contraseña está vacía', async () => {
      const mockOnAuthSuccess = jest.fn();
      const { getByText, getByPlaceholderText } = renderWithProviders(
        <LoginScreen navigation={mockNavigation} onAuthSuccess={mockOnAuthSuccess} />
      );

      // Solo escribir email, dejar contraseña vacía
      fireEvent.changeText(getByPlaceholderText('Correo electrónico'), 'test@test.com');
      fireEvent.press(getByText('Entrar con correo'));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Campos requeridos',
          'Introduce tu correo y contraseña.'
        );
      });
    });
  });

  describe('Proceso de login', () => {
    it('debería llamar a onAuthSuccess con credenciales correctas', async () => {
      const mockOnAuthSuccess = jest.fn().mockResolvedValue(true);
      const { getByText, getByPlaceholderText } = renderWithProviders(
        <LoginScreen navigation={mockNavigation} onAuthSuccess={mockOnAuthSuccess} />
      );

      fireEvent.changeText(getByPlaceholderText('Correo electrónico'), 'test@test.com');
      fireEvent.changeText(getByPlaceholderText('Contraseña'), 'password123');
      fireEvent.press(getByText('Entrar con correo'));

      await waitFor(() => {
        expect(mockOnAuthSuccess).toHaveBeenCalledWith('test@test.com', 'password123');
      });
    });

    it('debería mostrar error si login falla', async () => {
      const mockOnAuthSuccess = jest.fn().mockResolvedValue(false);
      const { getByText, getByPlaceholderText } = renderWithProviders(
        <LoginScreen navigation={mockNavigation} onAuthSuccess={mockOnAuthSuccess} />
      );

      fireEvent.changeText(getByPlaceholderText('Correo electrónico'), 'wrong@test.com');
      fireEvent.changeText(getByPlaceholderText('Contraseña'), 'wrongpass');
      fireEvent.press(getByText('Entrar con correo'));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Error de acceso',
          'Correo o contraseña incorrectos.'
        );
      });
    });

    it('debería mostrar texto de carga durante el submit', async () => {
      const mockOnAuthSuccess = jest.fn().mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(true), 100))
      );
      const { getByText, getByPlaceholderText } = renderWithProviders(
        <LoginScreen navigation={mockNavigation} onAuthSuccess={mockOnAuthSuccess} />
      );

      fireEvent.changeText(getByPlaceholderText('Correo electrónico'), 'test@test.com');
      fireEvent.changeText(getByPlaceholderText('Contraseña'), 'password123');
      fireEvent.press(getByText('Entrar con correo'));

      // Debería mostrar "Entrando..." durante la carga
      expect(getByText('Entrando…')).toBeTruthy();
    });
  });

  describe('Navegación', () => {
    it('debería navegar a registro al presionar enlace', () => {
      const mockOnAuthSuccess = jest.fn();
      const { getByText } = renderWithProviders(
        <LoginScreen navigation={mockNavigation} onAuthSuccess={mockOnAuthSuccess} />
      );

      fireEvent.press(getByText('Regístrate aquí'));

      expect(mockNavigation.navigate).toHaveBeenCalledWith('Register');
    });
  });

  describe('Pruebas de regresión', () => {
    it('debería limpiar espacios en blanco del email', async () => {
      const mockOnAuthSuccess = jest.fn().mockResolvedValue(true);
      const { getByText, getByPlaceholderText } = renderWithProviders(
        <LoginScreen navigation={mockNavigation} onAuthSuccess={mockOnAuthSuccess} />
      );

      fireEvent.changeText(getByPlaceholderText('Correo electrónico'), '  test@test.com  ');
      fireEvent.changeText(getByPlaceholderText('Contraseña'), 'password123');
      fireEvent.press(getByText('Entrar con correo'));

      await waitFor(() => {
        expect(mockOnAuthSuccess).toHaveBeenCalledWith('test@test.com', 'password123');
      });
    });

    it('debería manejar errores de red', async () => {
      const mockOnAuthSuccess = jest.fn().mockRejectedValue(new Error('Network Error'));
      const { getByText, getByPlaceholderText } = renderWithProviders(
        <LoginScreen navigation={mockNavigation} onAuthSuccess={mockOnAuthSuccess} />
      );

      fireEvent.changeText(getByPlaceholderText('Correo electrónico'), 'test@test.com');
      fireEvent.changeText(getByPlaceholderText('Contraseña'), 'password123');
      fireEvent.press(getByText('Entrar con correo'));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'No se pudo iniciar sesión.');
      });
    });

    it('no debería permitir submit múltiple mientras está en proceso', async () => {
      let resolvePromise;
      const mockOnAuthSuccess = jest.fn().mockImplementation(() => 
        new Promise(resolve => { resolvePromise = resolve; })
      );
      const { getByText, getByPlaceholderText } = renderWithProviders(
        <LoginScreen navigation={mockNavigation} onAuthSuccess={mockOnAuthSuccess} />
      );

      fireEvent.changeText(getByPlaceholderText('Correo electrónico'), 'test@test.com');
      fireEvent.changeText(getByPlaceholderText('Contraseña'), 'password123');
      
      // Primer press
      fireEvent.press(getByText('Entrar con correo'));
      
      // Segundo press mientras está cargando
      fireEvent.press(getByText('Entrando…'));
      
      // Resolver la promesa
      resolvePromise(true);

      await waitFor(() => {
        // Solo debería haberse llamado una vez debido al disabled
        expect(mockOnAuthSuccess).toHaveBeenCalledTimes(1);
      });
    });
  });
});

