import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Vibration } from 'react-native';
import { Audio } from 'expo-av'; // Importa Audio para la reproducción de sonido
import useStressDetection from '../hooks/useStressDetection';

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
            const response = await fetch(`http://192.168.0.227:8080/api/stress/users/${user.userId}`);
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

  const [breathingState, setBreathingState] = useState('idle'); // Estado actual del ciclo de respiración ('idle', 'inhale', 'exhale', 'hold')
  const [countdown, setCountdown] = useState(0); // Contador regresivo (no utilizado actualmente, pero puede ser útil para futuras implementaciones)
  const animation = useState(new Animated.Value(0))[0]; // Valor animado para controlar la escala del círculo de respiración
  const [sessionStartTime, setSessionStartTime] = useState(null); // Marca de tiempo cuando la sesión de respiración comienza
  const [cycleCount, setCycleCount] = useState(0); // Número de ciclos de respiración completados en la sesión actual
  const [sound, setSound] = useState(); // Objeto de sonido para la guía auditiva durante la respiración
  const [initialHeartRate, setInitialHeartRate] = useState(null); // Frecuencia cardíaca registrada al inicio de la sesión
  const [initialStressLevel, setInitialStressLevel] = useState(null); // Nivel de estrés registrado al inicio de la sesión

  const inhaleDuration = 4000; // Duración de la fase de inhalación en milisegundos (4 segundos)
  const holdDuration = 2000; // Duración de la fase de retención en milisegundos (2 segundos)
  const exhaleDuration = 6000; // Duración de la fase de exhalación en milisegundos (6 segundos)

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
    if (breathingState === 'inhale') {
      Animated.timing(animation, {
        toValue: 1,
        duration: inhaleDuration,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        setBreathingState('hold');
      });
    } else if (breathingState === 'exhale') {
      Animated.timing(animation, {
        toValue: 0,
        duration: exhaleDuration,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        setBreathingState('inhale');
        setCycleCount(prevCount => prevCount + 1); // Incrementar el contador de ciclos al finalizar la exhalación
      });
    } else if (breathingState === 'hold') {
      const timer = setTimeout(() => {
        setBreathingState('exhale');
      }, holdDuration);
      return () => clearTimeout(timer);
    }
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
    outputRange: [0.5, 1.2],
  });

  // Interpolación para la opacidad del círculo de respiración
  const circleOpacity = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.6, 1, 0.6],
  });

  // Explicación sobre cómo cargar datos reales:
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
        <Animated.View
          style={[
            styles.breathingCircle,
            {
              transform: [{ scale: circleScale }],
              opacity: circleOpacity,
            },
          ]}
        />
        <Text style={styles.instructionText}>
          {breathingState === 'inhale' && 'Inhala'}
          {breathingState === 'exhale' && 'Exhala'}
          {breathingState === 'hold' && 'Sostén'}
          {breathingState === 'idle' && 'Presiona Iniciar'}
        </Text>
      </View>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  stressNotification: {
    backgroundColor: '#ff6347',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  stressNotificationText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  userDataContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  userDataText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  breathingContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#a0d9e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  breathingCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
    backgroundColor: '#66b3ba',
    position: 'absolute',
  },
  instructionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  controls: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  suggestionButtonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  acceptButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  declineButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 5,
  },
});

export default GuidedBreathingScreen;