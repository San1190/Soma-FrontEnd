import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { FontSizes, FontFamilies, LineHeights, ComponentSpacing } from '../constants/typography';

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
    paddingHorizontal: ComponentSpacing.inputPaddingHorizontal,
    paddingVertical: ComponentSpacing.inputPaddingVertical,
    borderRadius: ComponentSpacing.inputBorderRadius,
    fontSize: FontSizes.regular, // 16px - mantener para inputs
    fontFamily: FontFamilies.regular, // Afacad_400Regular
    lineHeight: FontSizes.regular * LineHeights.relaxed, // Mejor legibilidad
    marginBottom: ComponentSpacing.inputMarginBottom,
    borderWidth: 1,
  },
});

export default CustomInput;
