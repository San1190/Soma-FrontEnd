import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { FontSizes, FontFamilies, ComponentSpacing } from '../constants/typography';

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
    paddingVertical: ComponentSpacing.buttonPaddingVertical,
    paddingHorizontal: ComponentSpacing.buttonPaddingHorizontal,
    borderRadius: ComponentSpacing.buttonBorderRadius,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    minHeight: ComponentSpacing.buttonMinHeight, // Asegurar touch target de 44px
  },
  text: {
    fontSize: FontSizes.button, // 14px - optimizado para botones móviles
    fontFamily: FontFamilies.semiBold, // Afacad_600SemiBold
  },
});

export default CustomButton;
