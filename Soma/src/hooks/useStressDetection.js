import { useState, useEffect } from 'react';

const useStressDetection = (data) => {
  const [fixedStressThreshold, setFixedStressThreshold] = useState(3); // Umbral fijo de estrés (ej. 1-5)
  const [adaptiveStressThreshold, setAdaptiveStressThreshold] = useState(3.5); // Umbral adaptativo de estrés
  const [preventiveAlertThreshold, setPreventiveAlertThreshold] = useState(0.15); // Umbral para alerta preventiva (ej. 15% de aumento)
  const [showStressNotification, setShowStressNotification] = useState('none'); // Controla el tipo de notificación de estrés: 'none', 'alert', 'cooldown', 'preventive_alert'
  const [lastInterventionTime, setLastInterventionTime] = useState(null); // Registra el tiempo de la última intervención

  const recordIntervention = () => {
    setLastInterventionTime(Date.now());
  };

  const declineBreathingSuggestion = () => {
    console.log("Sugerencia de respiración rechazada.");
    // Aquí podrías añadir lógica para registrar el rechazo en el backend o en el estado.
  };

  useEffect(() => {
    const now = Date.now();
    const interventionCooldown = 5 * 60 * 1000; // 5 minutos de enfriamiento después de una intervención
    const historyWindow = 10; // Número de puntos de datos para analizar el historial

    if (data.length > 0) {
      const latestStressLevel = data[data.length - 1].stressLevel;
      let effectiveStressThreshold = fixedStressThreshold;

      // Si hubo una intervención reciente, ajusta el umbral o suprime la notificación
      if (lastInterventionTime && (now - lastInterventionTime < interventionCooldown)) {
        console.log("Intervención reciente detectada. Suprimiendo notificaciones de estrés temporalmente.");
        setShowStressNotification('cooldown'); // Indicar que estamos en enfriamiento
        return; // Salir del efecto para no mostrar notificación de estrés
      }

      // Detección de patrones históricos para alertas preventivas
      if (data.length >= 2 * historyWindow) {
        const recentData = data.slice(-historyWindow);
        const previousData = data.slice(-2 * historyWindow, -historyWindow);

        const recentAverage = recentData.reduce((sum, d) => sum + d.stressLevel, 0) / historyWindow;
        const previousAverage = previousData.reduce((sum, d) => sum + d.stressLevel, 0) / historyWindow;

        if (recentAverage > previousAverage * (1 + preventiveAlertThreshold)) {
          console.log(`Alerta preventiva: Aumento de estrés detectado. Promedio reciente: ${recentAverage.toFixed(2)}, Promedio anterior: ${previousAverage.toFixed(2)}`);
          setShowStressNotification('preventive_alert');
          return;
        }
      }

      if (latestStressLevel > effectiveStressThreshold) {
        console.log(`¡Alerta! Nivel de estrés (${latestStressLevel}) ha superado el umbral fijo (${effectiveStressThreshold}).`);
        setShowStressNotification('alert'); // Activar la notificación de alerta
      } else {
        setShowStressNotification('none'); // Desactivar la notificación si el estrés baja
      }
    }
  }, [data, fixedStressThreshold, lastInterventionTime, preventiveAlertThreshold]);

  return { fixedStressThreshold, adaptiveStressThreshold, showStressNotification, recordIntervention, declineBreathingSuggestion };
};

export default useStressDetection;