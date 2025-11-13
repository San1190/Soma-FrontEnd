import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import themes from '../constants/colors';
import stressThemes from '../constants/stressThemes';
import { useAntiStress } from './AntiStressContext';
import { useAuth } from './AuthContext';
import axios from 'axios';
import API_BASE_URL from '../constants/api';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme(); // 'light' or 'dark'
  const [theme, setTheme] = useState(colorScheme || 'light');
  const [stressCategory, setStressCategory] = useState(null);
  
  // 2. Obtener el estado de anti-estrés
  const { isAntiStressModeActive } = useAntiStress();
  const { user } = useAuth();

  useEffect(() => {
    setTheme(colorScheme || 'light');
  }, [colorScheme]);

  useEffect(() => {
    let interval;
    const fetchStress = async () => {
      if (!user?.id) return;
      try {
        const res = await axios.get(`${API_BASE_URL}/stress/users/${user.id}`);
        setStressCategory(res.data?.stressLevel || null);
      } catch {}
    };
    fetchStress();
    interval = setInterval(fetchStress, 5000);
    return () => interval && clearInterval(interval);
  }, [user?.id]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Selección del tema
  let currentTheme = themes[theme];
  if (isAntiStressModeActive) {
    currentTheme = stressThemes.calm;
  } else if (stressCategory) {
    const key = stressCategory === 'Bajo' ? 'low' : (stressCategory === 'Moderado' ? 'moderate' : 'high');
    currentTheme = stressThemes[key];
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, currentTheme, stressCategory }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
