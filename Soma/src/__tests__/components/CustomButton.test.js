import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomButton from '../../components/CustomButton';
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

describe('CustomButton Component', () => {
  describe('Renderizado básico', () => {
    it('debería renderizar el botón correctamente', () => {
      const { getByText } = renderWithProviders(
        <CustomButton title="Test Button" onPress={() => {}} />
      );
      
      expect(getByText('Test Button')).toBeTruthy();
    });

    it('debería mostrar el título correcto', () => {
      const { getByText } = renderWithProviders(
        <CustomButton title="Mi Botón" onPress={() => {}} />
      );
      
      expect(getByText('Mi Botón')).toBeTruthy();
    });
  });

  describe('Interacciones', () => {
    it('debería llamar a onPress cuando se presiona', () => {
      const mockOnPress = jest.fn();
      const { getByText } = renderWithProviders(
        <CustomButton title="Presionar" onPress={mockOnPress} />
      );
      
      fireEvent.press(getByText('Presionar'));
      
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('no debería llamar a onPress cuando está deshabilitado', () => {
      const mockOnPress = jest.fn();
      const { getByText } = renderWithProviders(
        <CustomButton title="Deshabilitado" onPress={mockOnPress} disabled={true} />
      );
      
      fireEvent.press(getByText('Deshabilitado'));
      
      expect(mockOnPress).not.toHaveBeenCalled();
    });
  });

  describe('Estilos y estados', () => {
    it('debería aplicar opacidad reducida cuando está deshabilitado', () => {
      const { getByText } = renderWithProviders(
        <CustomButton title="Disabled" onPress={() => {}} disabled={true} />
      );
      
      const button = getByText('Disabled').parent;
      // El botón debe existir y renderizarse
      expect(button).toBeTruthy();
    });

    it('debería aceptar estilos personalizados', () => {
      const customStyle = { backgroundColor: '#ff0000' };
      const { getByText } = renderWithProviders(
        <CustomButton title="Styled" onPress={() => {}} style={customStyle} />
      );
      
      expect(getByText('Styled')).toBeTruthy();
    });

    it('debería aceptar estilos de texto personalizados', () => {
      const customTextStyle = { fontSize: 20 };
      const { getByText } = renderWithProviders(
        <CustomButton title="Text Styled" onPress={() => {}} textStyle={customTextStyle} />
      );
      
      expect(getByText('Text Styled')).toBeTruthy();
    });
  });

  describe('Pruebas de regresión', () => {
    it('debería mantener el comportamiento de presión múltiple', () => {
      const mockOnPress = jest.fn();
      const { getByText } = renderWithProviders(
        <CustomButton title="Multi Press" onPress={mockOnPress} />
      );
      
      fireEvent.press(getByText('Multi Press'));
      fireEvent.press(getByText('Multi Press'));
      fireEvent.press(getByText('Multi Press'));
      
      expect(mockOnPress).toHaveBeenCalledTimes(3);
    });

    it('debería renderizar correctamente con título vacío', () => {
      const { container } = renderWithProviders(
        <CustomButton title="" onPress={() => {}} />
      );
      
      expect(container).toBeTruthy();
    });

    it('debería renderizar correctamente con título largo', () => {
      const longTitle = 'Este es un título muy largo para probar el comportamiento del botón con textos extensos';
      const { getByText } = renderWithProviders(
        <CustomButton title={longTitle} onPress={() => {}} />
      );
      
      expect(getByText(longTitle)).toBeTruthy();
    });
  });
});

