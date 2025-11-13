import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const CustomButton = ({ title, onPress, disabled, style, textStyle }) => {
  const { currentTheme } = useTheme();
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: currentTheme.primary, opacity: disabled ? 0.6 : 1 }, style]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, { color: '#071220' }, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CustomButton;