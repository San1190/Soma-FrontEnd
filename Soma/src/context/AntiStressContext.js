import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import API_BASE_URL from '../constants/api';
import { useAuth } from './AuthContext';

const AntiStressContext = createContext();
/**
 * Gestiona el modo antiestrés y el modo sueño: activación, fin de sesión,
 * y sincronización con el backend para estados activos.
 */

export const AntiStressProvider = ({ children }) => {
  const [isAntiStressModeActive, setIsAntiStressModeActive] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [isSleepModeActive, setIsSleepModeActive] = useState(false);
  const { user } = useAuth();

  const api = axios.create({ baseURL: API_BASE_URL });

  // Función para activar el modo
  const activateMode = useCallback(async (reason = "TRIGGER_APP") => {
    if (!user || !user.id || isAntiStressModeActive) return;

    console.log('Activando Modo Antiestrés...');
    try {
      const response = await api.post('/anti-stress/start', {
        userId: user.id,
        reason: reason,
      });
      setCurrentSessionId(response.data.sessionId);
      setIsAntiStressModeActive(true);
      console.log('Modo Antiestrés ACTIVADO. Sesión:', response.data.sessionId);
    } catch (error) {
      console.error('Error al activar modo antiestrés:', error.response ? error.response.data : error.message);
    }
  }, [user, isAntiStressModeActive, api]);

  // Función para desactivar el modo
  const deactivateMode = useCallback(async () => {
    if (!user || !user.id || !isAntiStressModeActive) return;

    console.log('Desactivando Modo Antiestrés...');
    try {
      await api.post(`/anti-stress/end/${user.id}`);
      console.log('Modo Antiestrés DESACTIVADO. Sesión:', currentSessionId);
    } catch (error) {
      console.error('Error al desactivar modo antiestrés:', error.response ? error.response.data : error.message);
    } finally {
      // Siempre desactivar en el frontend, incluso si la llamada falla
      setIsAntiStressModeActive(false);
      setCurrentSessionId(null);
    }
  }, [user, isAntiStressModeActive, currentSessionId, api]);

  useEffect(() => {
    let interval;
    const pollSleepActive = async () => {
      if (!user || !user.id) return;
      try {
        const res = await api.get(`/anti-stress/sleep/active/${user.id}`);
        setIsSleepModeActive(Boolean(res.data?.active));
      } catch {}
    };
    pollSleepActive();
    interval = setInterval(pollSleepActive, 30000);
    return () => interval && clearInterval(interval);
  }, [user?.id]);

  return (
    <AntiStressContext.Provider value={{ isAntiStressModeActive, activateMode, deactivateMode, isSleepModeActive }}>
      {children}
    </AntiStressContext.Provider>
  );
};

export const useAntiStress = () => {
  const context = useContext(AntiStressContext);
  if (context === undefined) {
    throw new Error('useAntiStress must be used within an AntiStressProvider');
  }
  return context;
};
