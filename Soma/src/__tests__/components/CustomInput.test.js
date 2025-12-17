import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomInput from '../../components/CustomInput';
import { ThemeProvider } from '../../context/ThemeContext';
import { AuthProvider } from '../../context/AuthContext';
import { AntiStressProvider } from '../../context/AntiStressContext';

// Wrapper para proveer los contextos necesarios
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

describe('CustomInput Component', () => {
  describe('Renderizado básico', () => {
    it('debería renderizar el input correctamente', () => {
      const { getByPlaceholderText } = renderWithProviders(
        <CustomInput placeholder="Test Input" />
      );
      
      expect(getByPlaceholderText('Test Input')).toBeTruthy();
    });

    it('debería mostrar el placeholder correcto', () => {
      const { getByPlaceholderText } = renderWithProviders(
        <CustomInput placeholder="Ingresa tu email" />
      );
      
      expect(getByPlaceholderText('Ingresa tu email')).toBeTruthy();
    });
  });

  describe('Entrada de texto', () => {
    it('debería aceptar entrada de texto', () => {
      const mockOnChangeText = jest.fn();
      const { getByPlaceholderText } = renderWithProviders(
        <CustomInput 
          placeholder="Email" 
          onChangeText={mockOnChangeText}
        />
      );
      
      fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
      
      expect(mockOnChangeText).toHaveBeenCalledWith('test@example.com');
    });

    it('debería mostrar el valor actual', () => {
      const { getByDisplayValue } = renderWithProviders(
        <CustomInput 
          placeholder="Email" 
          value="usuario@test.com"
        />
      );
      
      expect(getByDisplayValue('usuario@test.com')).toBeTruthy();
    });
  });

  describe('Propiedades del input', () => {
    it('debería soportar secureTextEntry para contraseñas', () => {
      const { getByPlaceholderText } = renderWithProviders(
        <CustomInput 
          placeholder="Contraseña" 
          secureTextEntry={true}
        />
      );
      
      const input = getByPlaceholderText('Contraseña');
      expect(input.props.secureTextEntry).toBe(true);
    });

    it('debería soportar autoCapitalize', () => {
      const { getByPlaceholderText } = renderWithProviders(
        <CustomInput 
          placeholder="Email" 
          autoCapitalize="none"
        />
      );
      
      const input = getByPlaceholderText('Email');
      expect(input.props.autoCapitalize).toBe('none');
    });

    it('debería soportar keyboardType', () => {
      const { getByPlaceholderText } = renderWithProviders(
        <CustomInput 
          placeholder="Email" 
          keyboardType="email-address"
        />
      );
      
      const input = getByPlaceholderText('Email');
      expect(input.props.keyboardType).toBe('email-address');
    });
  });

  describe('Pruebas de regresión', () => {
    it('debería manejar valores vacíos', () => {
      const { getByPlaceholderText } = renderWithProviders(
        <CustomInput 
          placeholder="Test" 
          value=""
        />
      );
      
      expect(getByPlaceholderText('Test')).toBeTruthy();
    });

    it('debería manejar textos largos', () => {
      const longText = 'Este es un texto muy largo que podría causar problemas de renderizado si no se maneja correctamente';
      const { getByDisplayValue } = renderWithProviders(
        <CustomInput 
          placeholder="Test" 
          value={longText}
        />
      );
      
      expect(getByDisplayValue(longText)).toBeTruthy();
    });

    it('debería manejar caracteres especiales', () => {
      const specialChars = 'test@#$%^&*()_+{}[]|:;<>?,./~`';
      const { getByDisplayValue } = renderWithProviders(
        <CustomInput 
          placeholder="Test" 
          value={specialChars}
        />
      );
      
      expect(getByDisplayValue(specialChars)).toBeTruthy();
    });

    it('debería manejar emojis', () => {
      const emojiText = '😀🎉🚀';
      const { getByDisplayValue } = renderWithProviders(
        <CustomInput 
          placeholder="Test" 
          value={emojiText}
        />
      );
      
      expect(getByDisplayValue(emojiText)).toBeTruthy();
    });

    it('debería llamar onChangeText múltiples veces', () => {
      const mockOnChangeText = jest.fn();
      const { getByPlaceholderText } = renderWithProviders(
        <CustomInput 
          placeholder="Test" 
          onChangeText={mockOnChangeText}
        />
      );
      
      const input = getByPlaceholderText('Test');
      fireEvent.changeText(input, 'a');
      fireEvent.changeText(input, 'ab');
      fireEvent.changeText(input, 'abc');
      
      expect(mockOnChangeText).toHaveBeenCalledTimes(3);
      expect(mockOnChangeText).toHaveBeenLastCalledWith('abc');
    });
  });
});

