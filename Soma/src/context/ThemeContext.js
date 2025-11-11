import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import themes from '../constants/colors';
import { useAntiStress } from './AntiStressContext'; // 1. Importar

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme(); // 'light' or 'dark'
  const [theme, setTheme] = useState(colorScheme || 'light');
  
  // 2. Obtener el estado de anti-estrés
  const { isAntiStressModeActive } = useAntiStress();

  useEffect(() => {
    setTheme(colorScheme || 'light');
  }, [colorScheme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // 3. Si el modo antiestrés está activo, ignora light/dark y usa el tema "calm"
  const currentTheme = isAntiStressModeActive ? themes.calm : themes[theme];

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);