import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { View, Text, TouchableOpacity, Animated, Easing, Vibration } from 'react-native';
import { Audio } from 'expo-av';
import useStressDetection from '../hooks/useStressDetection';
import { styles } from './GuidedBreathingStyles'; // Importar los estilos desde el nuevo archivo
import axios from 'axios';

const API_BASE_URL = 'http://192.168.1.31:8080/api/stress';
const TEST_USER_ID = 1; // Hardcoded for testing, replace with dynamic user ID

// Componente principal de la pantalla de respiración guiada
const GuidedBreathingScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [stressLevel, setStressLevel] = useState('Desconocido'); // Estado para el nivel de estrés actual del usuario
  const [exerciseHistory, setExerciseHistory] = useState([]); // Historial de ejercicios de respiración completados por el usuario

  // Función para generar datos simulados de frecuencia cardíaca y nivel de estrés para demostración
  const generateSimulatedData = (index) => {
    const newHeartRate = Math.floor(Math.random() * (90 - 60 + 1)) + 60; // Frecuencia cardíaca simulada entre 60 y 90 BPM
    const newStressLevel = Math.floor(Math.random() * (5 - 1 + 1)) + 1; // Nivel de estrés simulado entre 1 y 5
    return {
      index: index,
      heartRate: newHeartRate,
      stressLevel: newStressLevel,
      optionalParam: Math.floor(Math.random() * 20) + 5,
    };
  };

  const [data, setData] = useState([generateSimulatedData(0)]); // Datos biométricos simulados para el gráfico y detección de estrés

  // Efecto para simular la actualización de datos biométricos cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setData(currentData => {
        const newDataPoint = generateSimulatedData(currentData.length);
        const updatedData = [...currentData, newDataPoint].slice(-20); // Mantener solo los últimos 20 puntos de datos
        return updatedData;
      });
    }, 1000); // Actualizar cada segundo

    return () => clearInterval(interval);
  }, []);

  // Efecto para obtener el nivel de estrés del backend y cargar el historial de ejercicios del usuario
  useEffect(() => {
      const fetchStressLevel = async () => {
        if (user && user.userId) {
          try {
            const response = await fetch(`192.168.1.141:8080/api/stress/users/${user.userId}`);
            const data = await response.json();
            setStressLevel(data.stressLevel); // Asume que el backend devuelve { stressLevel: "Bajo" }
          } catch (error) {
            console.error('Error al obtener el nivel de estrés:', error);
            setStressLevel('Desconocido');
          }
        }
      };

    if (user) {
      fetchStressLevel();
      // Cargar historial de ejercicios (si existe en el objeto de usuario)
      setExerciseHistory(user.breathingExercises || []);
    }
  }, [user]);

  const [breathingState, setBreathingState] = useState('idle');
  const [countdown, setCountdown] = useState(0);
  const animation = useState(new Animated.Value(0))[0];
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [cycleCount, setCycleCount] = useState(0);
  const [sound, setSound] = useState();
  const [initialHeartRate, setInitialHeartRate] = useState(null);
  const [initialStressLevel, setInitialStressLevel] = useState(null);
  const [timer, setTimer] = useState(0); // Nuevo estado para el temporizador de fase
  const timerRef = useRef(null); // Ref para el temporizador de intervalo

  const inhaleDuration = 4000;
  const holdDuration = 2000;
  const exhaleDuration = 6000;

  // Hook personalizado para la detección de estrés y manejo de intervenciones
  const { stressNotificationType, recordIntervention, declineBreathingSuggestion } = useStressDetection(data);
  const [showSuggestionButtons, setShowSuggestionButtons] = useState(false); // Controla la visibilidad de los botones de sugerencia de respiración
  const [isSimplifiedMode, setIsSimplifiedMode] = useState(false); // Activa el modo simplificado de la interfaz cuando hay una alerta de estrés

  // Efecto para gestionar el modo simplificado y los botones de sugerencia basados en el tipo de notificación de estrés
  useEffect(() => {
    if (stressNotificationType === 'alert' || stressNotificationType === 'preventive_alert') {
      setShowSuggestionButtons(true);
      setIsSimplifiedMode(true); // Activar modo simplificado durante alertas
    } else {
      setShowSuggestionButtons(false);
      setIsSimplifiedMode(false);
    }
  }, [stressNotificationType]);

  // Manejador para aceptar la sugerencia de respiración guiada
  const handleAcceptSuggestion = () => {
    startBreathing();
    setShowSuggestionButtons(false);
    setIsSimplifiedMode(false); // Desactivar modo simplificado al aceptar
  };

  // Manejador para rechazar la sugerencia de respiración guiada
  const handleDeclineSuggestion = () => {
    declineBreathingSuggestion();
    setShowSuggestionButtons(false);
    setIsSimplifiedMode(false); // Desactivar modo simplificado al rechazar
  };

  // Efecto para controlar la animación del círculo de respiración y el estado del ciclo
  useEffect(() => {
    let duration = 0;
    let nextState = '';

    if (timerRef.current) {
      clearInterval(timerRef.current);
      setTimer(0);
    }

    if (breathingState === 'inhale') {
      duration = inhaleDuration;
      nextState = 'hold';
      Animated.timing(animation, {
        toValue: 1,
        duration: inhaleDuration,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        setBreathingState(nextState);
      });
    } else if (breathingState === 'exhale') {
      duration = exhaleDuration;
      nextState = 'inhale';
      Animated.timing(animation, {
        toValue: 0,
        duration: exhaleDuration,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        setBreathingState(nextState);
        setCycleCount(prevCount => prevCount + 1);
      });
    } else if (breathingState === 'hold') {
      duration = holdDuration;
      nextState = 'exhale';
      const timerId = setTimeout(() => {
        setBreathingState(nextState);
      }, holdDuration);
      return () => clearTimeout(timerId);
    }

    if (duration > 0) {
      let startTime = Date.now();
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        setTimer(Math.max(0, Math.ceil((duration - elapsed) / 1000)));
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [breathingState]);

  // Efecto para la guía sensorial de vibración durante las fases de inhalación y exhalación
  useEffect(() => {
    if (breathingState === 'inhale' || breathingState === 'exhale') {
      Vibration.vibrate(100); // Vibrar por 100ms
    }
  }, [breathingState]);

  // Efecto para cargar y descargar el archivo de sonido de respiración
  useEffect(() => {
    async function loadSound() {
      const { sound } = await Audio.Sound.createAsync(require('../../assets/breathing_sound.mp3'));
      setSound(sound);
    }

    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync(); // Descargar el sonido al desmontar el componente
      }
    };
  }, []);

  // Función para iniciar la sesión de respiración guiada
  const startBreathing = async () => {
    setSessionStartTime(Date.now()); // Registrar el tiempo de inicio de la sesión
    setCycleCount(0); // Reiniciar el contador de ciclos
    setInitialHeartRate(data[data.length - 1]?.heartRate || null); // Capturar la frecuencia cardíaca inicial
    setInitialStressLevel(stressLevel); // Capturar el nivel de estrés inicial
    setBreathingState('inhale'); // Iniciar el ciclo con la fase de inhalación
    if (sound) {
      await sound.playAsync(); // Reproducir el sonido
      await sound.setIsLoopingAsync(true); // Configurar el sonido para que se repita
    }
  };

  // Función para detener la sesión de respiración guiada
  const stopBreathing = async () => {
    setBreathingState('idle'); // Establecer el estado en inactivo
    if (sound) {
      await sound.stopAsync(); // Detener el sonido
      await sound.setIsLoopingAsync(false); // Desactivar la repetición del sonido
    }
    animation.stop(); // Detener la animación del círculo
    animation.setValue(0); // Reiniciar el valor de la animación
    recordIntervention(); // Registrar la intervención al detener la respiración

    if (sessionStartTime) {
      const sessionDuration = (Date.now() - sessionStartTime) / 1000; // Calcular la duración de la sesión en segundos
      console.log(`Sesión de respiración: Duración = ${sessionDuration.toFixed(2)} segundos, Ciclos = ${cycleCount}`);

      const finalHeartRate = data[data.length - 1]?.heartRate || null; // Frecuencia cardíaca final
      const finalStressLevel = stressLevel; // Nivel de estrés final

      if (initialHeartRate !== null && finalHeartRate !== null) {
        const heartRateChange = finalHeartRate - initialHeartRate; // Calcular el cambio en la frecuencia cardíaca
        console.log(`Cambio en la frecuencia cardíaca: ${heartRateChange}`);
      }

      if (initialStressLevel !== null && finalStressLevel !== null) {
        // Asumiendo que stressLevel es una cadena como 'Bajo', 'Medio', 'Alto'
        // Necesitaríamos una forma de cuantificar el cambio si queremos un valor numérico
        console.log(`Nivel de estrés inicial: ${initialStressLevel}, Nivel de estrés final: ${finalStressLevel}`);
      }

      // Enviar datos biométricos al backend
      if (user && user.userId && finalHeartRate) {
        try {
          await axios.post(`http://192.168.1.31:8080/api/data/ingest`, {
            userId: user.userId,
            heart_rate_bpm: finalHeartRate,
            // hrv_ms: ... (si tienes datos de HRV reales)
            // stress_level: ... (si quieres enviar el nivel de estrés calculado en el frontend)
          });
          console.log('Datos biométricos enviados con éxito.');
        } catch (error) {
          console.error('Error al enviar datos biométricos:', error);
        }
      }

      // Reiniciar estados de la sesión
      setSessionStartTime(null);
      setCycleCount(0);
      setInitialHeartRate(null);
      setInitialStressLevel(null);
    }
  };

  // Interpolación para la escala del círculo de respiración
  const circleScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  // Interpolación para la opacidad del círculo de respiración
  const circleOpacity = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.7, 1, 0.7],
  });

  const animatedCircleStyle = {
    transform: [{ scale: circleScale }],
    opacity: circleOpacity,
  };


  const [progressBarAnimatedValue] = useState(new Animated.Value(0));

  useEffect(() => {
    let totalDuration = 0;
    if (breathingState === 'inhale') {
      totalDuration = inhaleDuration;
    } else if (breathingState === 'exhale') {
      totalDuration = exhaleDuration;
    } else if (breathingState === 'hold') {
      totalDuration = holdDuration;
    }

    if (totalDuration > 0) {
      progressBarAnimatedValue.setValue(0);
      Animated.timing(progressBarAnimatedValue, {
        toValue: 1,
        duration: totalDuration,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    }
  }, [breathingState]);

  const progressBarWidth = progressBarAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });


  // Actualmente, los datos de frecuencia cardíaca y nivel de estrés se simulan o se obtienen de un hook de ejemplo.
  // Para integrar datos reales, se deben seguir los siguientes pasos:

  // 1. Integración con sensores de dispositivos (si aplica):
  //    - Utilizar librerías como `react-native-sensors` o APIs nativas para acceder a biosensores
  //      (ej. pulsómetros, sensores de estrés si el dispositivo los provee).
  //    - Asegurarse de solicitar los permisos necesarios al usuario para acceder a estos datos.

  // 2. Conexión a APIs de salud/wearables:
  //    - Si los datos provienen de dispositivos externos (ej. smartwatches, bandas de fitness),
  //      se debe integrar con las APIs de salud de iOS (HealthKit) o Android (Google Fit).
  //    - Esto generalmente implica autenticación del usuario con estas plataformas y la sincronización
  //      de datos de frecuencia cardíaca, actividad, sueño, etc.

  // 3. Backend y base de datos:
  //    - Los datos recolectados de sensores o APIs externas deben ser enviados a un backend.
  //    - El backend se encargaría de almacenar estos datos en una base de datos (ej. MongoDB, PostgreSQL).
  //    - Se recomienda implementar una API RESTful o GraphQL para que la aplicación frontend
  //      pueda consultar y enviar estos datos de manera segura.

  // 4. Actualización del hook `useStressDetection` o similar:
  //    - El hook `useStressDetection` (o cualquier hook que maneje la lógica de datos)
  //      debería ser modificado para realizar llamadas a tu backend.
  //    - En lugar de generar datos simulados, el hook haría peticiones HTTP (ej. usando `axios` o `fetch`)
  //      para obtener la frecuencia cardíaca y otros indicadores de estrés en tiempo real o casi real.
  //    - Ejemplo de cómo se podría modificar `useStressDetection` para obtener datos de una API:
  //      ```javascript
  //      import { useState, useEffect } from 'react';
  //      import axios from 'axios'; // Asegúrate de instalar axios: npm install axios

  //      const useRealTimeData = () => {
  //        const [heartRate, setHeartRate] = useState(null);
  //        const [stressLevel, setStressLevel] = useState('Bajo');
  //        const [data, setData] = useState([]); // Historial de datos

  //        useEffect(() => {
  //          const fetchData = async () => {
  //            try {
  //              const response = await axios.get('TU_ENDPOINT_API/datos-salud');
  //              const latestData = response.data; // Asume que la API devuelve los últimos datos
  //              setHeartRate(latestData.heartRate);
  //              setStressLevel(calculateStress(latestData.heartRate, latestData.hrv)); // Función para calcular estrés
  //              setData(prevData => [...prevData, latestData]); // Añadir al historial
  //            } catch (error) {
  //              console.error('Error al obtener datos reales:', error);
  //            }
  //          };

  //          const interval = setInterval(fetchData, 5000); // Actualizar cada 5 segundos
  //          fetchData(); // Obtener datos inmediatamente al montar

  //          return () => clearInterval(interval);
  //        }, []);

  //        return { heartRate, stressLevel, data };
  //      };

  //      // Función de ejemplo para calcular el nivel de estrés (debería ser más sofisticada)
  //      const calculateStress = (hr, hrv) => {
  //        if (hr > 100 && hrv < 50) return 'Alto';
  //        if (hr > 80 && hrv < 80) return 'Medio';
  //        return 'Bajo';
  //      };

  //      export default useRealTimeData;
  //      ```

  // 5. Manejo de errores y estados de carga:
  //    - Es crucial manejar los estados de carga, errores de red y la ausencia de datos
  //      para proporcionar una buena experiencia de usuario.
  //    - Mostrar indicadores de carga y mensajes de error apropiados.

  // Al seguir estos pasos, la aplicación podrá consumir datos de salud reales,
  // lo que permitirá una detección de estrés y una guía de respiración más precisas y personalizadas.


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ejercicio de Respiración Guiada</Text>
      {!isSimplifiedMode && (
        <View style={styles.userDataContainer}>
          <Text style={styles.userDataText}>Usuario: {user?.name || 'Cargando...'}</Text>
          <Text style={styles.userDataText}>Nivel de estrés actual: {stressLevel}</Text>
          <Text style={styles.userDataText}>Ejercicios completados: {exerciseHistory.length}</Text>
        </View>
      )}

      {stressNotificationType !== 'none' && (
        <View style={styles.stressNotification}>
          <Text style={styles.stressNotificationText}>
            {stressNotificationType === 'alert'
              ? '¡Nivel de estrés alto detectado! Tómate un momento para respirar.'
              : stressNotificationType === 'preventive_alert'
              ? 'Se ha detectado un patrón de estrés creciente. Considera tomar un descanso.'
              : 'Intervención reciente registrada. Las notificaciones de estrés están en pausa.'}
          </Text>
          {showSuggestionButtons && (
            <View style={styles.suggestionButtonsContainer}>
              <TouchableOpacity style={styles.acceptButton} onPress={handleAcceptSuggestion}>
                <Text style={styles.buttonText}>Aceptar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.declineButton} onPress={handleDeclineSuggestion}>
                <Text style={styles.buttonText}>Rechazar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      <View style={styles.breathingContainer}>
        <Animated.View style={[styles.breathingCircle, animatedCircleStyle]} />
        <Text style={styles.instructionText}>
          {breathingState === 'inhale' && `Inhala (${timer}s)`}
          {breathingState === 'exhale' && `Exhala (${timer}s)`}
          {breathingState === 'hold' && `Sostén (${timer}s)`}
          {breathingState === 'idle' && 'Presiona Iniciar'}
        </Text>
      </View>

      {breathingState !== 'idle' && (
        <View style={styles.progressBarContainer}>
          <Animated.View style={[styles.progressBar, { width: progressBarWidth }]} />
        </View>
      )}

      <View style={styles.controls}>
        {breathingState === 'idle' ? (
          <TouchableOpacity style={styles.button} onPress={startBreathing}>
            <Text style={styles.buttonText}>Iniciar</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={stopBreathing}>
            <Text style={styles.buttonText}>Detener</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default GuidedBreathingScreen;