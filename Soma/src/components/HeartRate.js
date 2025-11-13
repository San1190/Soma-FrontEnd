import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import API_BASE_URL from '../constants/api';

const TEST_USER_ID = 1; // Fallback para demo

const HeartRate = () => {
  const [heartRate, setHeartRate] = useState('--');
  const [lastUpdate, setLastUpdate] = useState('--');
  const { user } = useAuth();
  const { currentTheme } = useTheme();

  useEffect(() => {
    let intervalId;
    const fetchHeartRate = async () => {
      const userId = user?.id || TEST_USER_ID;
      try {
        const res = await fetch(`${API_BASE_URL}/data/latest/${userId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data && data.heart_rate_bpm != null) {
          setHeartRate(data.heart_rate_bpm);
          setLastUpdate(new Date(data.timestamp).toLocaleString());
          return;
        }
        // Fallback a usuario de prueba si no hay datos para el usuario actual
        if (user?.id && user.id !== TEST_USER_ID) {
          const r2 = await fetch(`${API_BASE_URL}/data/latest/${TEST_USER_ID}`);
          if (r2.ok) {
            const d2 = await r2.json();
            setHeartRate(d2.heart_rate_bpm ?? '--');
            setLastUpdate(d2.timestamp ? new Date(d2.timestamp).toLocaleString() : '--');
          }
        }
      } catch (error) {
        console.log('HR fetch error:', error.message);
        setHeartRate('--');
        setLastUpdate('--');
      }
    };

    fetchHeartRate();
    intervalId = setInterval(fetchHeartRate, 10000);
    return () => intervalId && clearInterval(intervalId);
  }, [user?.id]);

  return (
    <View style={[styles.card, { backgroundColor: currentTheme.cardBackground, borderColor: currentTheme.borderColor }]}>
      <Text style={[styles.title,{color: currentTheme.textPrimary}]}>Frecuencia Cardíaca</Text>
      <Text style={styles.value}>{heartRate} bpm</Text>
      <Text style={[styles.subtitle,{color: currentTheme.textSecondary}]}>Última actualización: {lastUpdate}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
  },
});

export default HeartRate;