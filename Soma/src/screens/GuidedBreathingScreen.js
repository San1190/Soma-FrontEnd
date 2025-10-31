import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';

const GuidedBreathingScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [stressLevel, setStressLevel] = useState('Desconocido');
  const [exerciseHistory, setExerciseHistory] = useState([]);

  // Fetch niveles de estrés del backend
  useEffect(() => {
      const fetchStressLevel = async () => {
        if (user && user.userId) {
          try {
            const response = await fetch(`http://192.168.1.31:8080/api/stress/users/${user.userId}`);
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
      // Cargar historial de ejercicios
      setExerciseHistory(user.breathingExercises || []);
    }
  }, [user]);

  const [breathingState, setBreathingState] = useState('idle'); // 'idle', 'inhale', 'exhale', 'hold'
  const [countdown, setCountdown] = useState(0);
  const animation = useState(new Animated.Value(0))[0];

  const inhaleDuration = 4000; // 4 seconds
  const holdDuration = 2000; // 2 seconds
  const exhaleDuration = 6000; // 6 seconds

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
      });
    } else if (breathingState === 'hold') {
      const timer = setTimeout(() => {
        setBreathingState('exhale');
      }, holdDuration);
      return () => clearTimeout(timer);
    }
  }, [breathingState]);

  const startBreathing = () => {
    setBreathingState('inhale');
  };

  const stopBreathing = () => {
    setBreathingState('idle');
    animation.stop();
    animation.setValue(0);
  };

  const circleScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1.2],
  });

  const circleOpacity = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.6, 1, 0.6],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ejercicio de Respiración Guiada</Text>
      <View style={styles.userDataContainer}>
        <Text style={styles.userDataText}>Usuario: {user?.name || 'Cargando...'}</Text>
        <Text style={styles.userDataText}>Nivel de estrés actual: {stressLevel}</Text>
        <Text style={styles.userDataText}>Ejercicios completados: {exerciseHistory.length}</Text>
      </View>

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
});

export default GuidedBreathingScreen;