import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const API_BASE_URL = 'http://localhost:8080/api/data'; // Asegúrate de que esta URL sea correcta
const TEST_USER_ID = 1; // ID del usuario de prueba

const HeartRate = () => {
  const [heartRate, setHeartRate] = useState('--');
  const [lastUpdate, setLastUpdate] = useState('--');

  useEffect(() => {
    const fetchHeartRate = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/latest/${TEST_USER_ID}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setHeartRate(data.heart_rate_bpm);
        setLastUpdate(new Date(data.timestamp).toLocaleString());
      } catch (error) {
        console.error("Error fetching heart rate data:", error);
        setHeartRate('--');
        setLastUpdate('--');
      }
    };

    // Fetch initial data
    fetchHeartRate();

    // Fetch data every 10 seconds (or match your backend simulation rate)
    const intervalId = setInterval(fetchHeartRate, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Frecuencia Cardíaca</Text>
      <Text style={styles.value}>{heartRate} bpm</Text>
      <Text style={styles.subtitle}>Última actualización: {lastUpdate}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e74c3c', // Red color for heart rate
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#7f8c8d',
  },
});

export default HeartRate;