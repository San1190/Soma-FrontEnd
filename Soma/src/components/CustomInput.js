import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const CustomInput = (props) => {
  const { currentTheme } = useTheme();
  return (
    <TextInput
      style={[
        styles.input,
        {
          backgroundColor: currentTheme.cardBackground,
          color: currentTheme.textPrimary,
          borderColor: currentTheme.borderColor,
        },
      ]}
      placeholderTextColor={currentTheme.textSecondary}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
});

export default CustomInput;