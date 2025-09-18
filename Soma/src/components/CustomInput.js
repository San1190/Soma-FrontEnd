import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import colors from '../constants/colors';

const CustomInput = (props) => {
  return (
    <TextInput
      style={styles.input}
      placeholderTextColor="#A9A9A9" // Un color gris claro para el placeholder
      {...props} // Pasa todas las demás props (value, onChangeText, etc.)
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Fondo blanco translúcido
    color: colors.textPrimary,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});

export default CustomInput;