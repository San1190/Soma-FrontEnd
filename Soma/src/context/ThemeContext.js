import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { useColorScheme } from 'react-native';
import themes from '../constants/colors';
import stressThemes from '../constants/stressThemes';
import { useAntiStress } from './AntiStressContext';
import { useAuth } from './AuthContext';
import axios from 'axios';
import API_BASE_URL from '../constants/api';

const ThemeContext = createContext();
/**
 * Deriva el tema visual (colores, fondo, acentos) según esquema (light/dark),
 * categoría de estrés y estado de modos (antiestrés/sueño).
 */

export const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme(); // 'light' or 'dark'
  const [theme, setTheme] = useState(colorScheme || 'light');
  const [stressCategory, setStressCategory] = useState(null);
  const [displayTheme, setDisplayTheme] = useState(themes[colorScheme || 'light']);
  const rafRef = useRef(null);
  const prevThemeRef = useRef(null);
  
  // 2. Obtener el estado de anti-estrés
  const { isAntiStressModeActive, isSleepModeActive } = useAntiStress();
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
  let selectedTheme = themes[theme];
  if (isSleepModeActive) {
    selectedTheme = stressThemes.sleep;
  } else if (isAntiStressModeActive) {
    selectedTheme = stressThemes.calm;
  } else if (stressCategory) {
    const key = stressCategory === 'Bajo' ? 'low' : (stressCategory === 'Moderado' ? 'moderate' : 'high');
    selectedTheme = stressThemes[key];
  }

  useEffect(() => {
    const parseHex = (hex) => {
      const h = hex.replace('#', '');
      const r = parseInt(h.substring(0, 2), 16);
      const g = parseInt(h.substring(2, 4), 16);
      const b = parseInt(h.substring(4, 6), 16);
      return [r, g, b];
    };
    const toHex = (r, g, b) => {
      const c = (n) => {
        const v = Math.max(0, Math.min(255, Math.round(n)));
        const s = v.toString(16).padStart(2, '0');
        return s;
      };
      return `#${c(r)}${c(g)}${c(b)}`;
    };
    const blend = (a, b, t) => {
      const [ar, ag, ab] = parseHex(a);
      const [br, bg, bb] = parseHex(b);
      return toHex(ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t);
    };
    const from = prevThemeRef.current || selectedTheme;
    const to = selectedTheme;
    prevThemeRef.current = to;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    const keys = Object.keys(to);
    const start = Date.now();
    const duration = 400;
    const step = () => {
      const t = Math.min(1, (Date.now() - start) / duration);
      const blended = {};
      for (const k of keys) {
        blended[k] = blend(from[k], to[k], t);
      }
      setDisplayTheme(blended);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
      }
    };
    step();
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [selectedTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, currentTheme: displayTheme, stressCategory }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
