import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import useStressDetection from '../hooks/useStressDetection';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const SomaticMirror = () => {
  const generateSimulatedData = (index) => {
    const newHeartRate = Math.floor(Math.random() * (90 - 60 + 1)) + 60; // BPM entre 60 y 90
    const newStressLevel = Math.floor(Math.random() * (5 - 1 + 1)) + 1; // Nivel de estrés entre 1 y 5
    return {
      index: index,
      heartRate: newHeartRate,
      stressLevel: newStressLevel,
      optionalParam: Math.floor(Math.random() * 20) + 5,
    };
  };

  const [data, setData] = useState(() => {
    const initialData = [];
    for (let i = 0; i < 100; i++) {
      initialData.push(generateSimulatedData(i));
    }
    return initialData;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData(currentData => {
        const newDataPoint = generateSimulatedData(currentData.length);
        // Mantener todos los puntos de datos para mostrar el historial completo
        const updatedData = [...currentData, newDataPoint]; 
        return updatedData;
      });
    }, 10000); // Actualizar cada 10 segundos

    return () => clearInterval(interval);
  }, []);

  const [chartType, setChartType] = useState('line'); // 'line' o 'bar'

  const { showStressNotification } = useStressDetection(data);

  const toggleChartType = () => setChartType(t => (t === 'line' ? 'bar' : 'line'));

  // Obtener solo los últimos 20 puntos de datos para una visualización más clara
  const recentData = data.slice(Math.max(0, data.length - 20));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Espejo Somático - Datos Biomédicos</Text>
      
      <TouchableOpacity 
        style={styles.toggleButton} 
        onPress={toggleChartType}
      >
        <Text style={styles.toggleButtonText}>
          Cambiar a Gráfica de {chartType === 'line' ? 'Barras' : 'Líneas'}
        </Text>
      </TouchableOpacity>

      {showStressNotification && (
        <View style={styles.notificationContainer}>
          <Text style={styles.notificationText}>
            ¡Nivel de estrés alto! Se recomienda un ejercicio de respiración.
          </Text>
        </View>
      )}

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Frecuencia Cardíaca (BPM)</Text>
        <ResponsiveContainer width="100%" height={250}>
          {chartType === 'line' ? (
            <LineChart 
              data={recentData} 
              margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
            >
              <defs>
                <linearGradient id="heartRateGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e74c3c" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#e74c3c" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="index" 
                type="category" 
                tickFormatter={(tick) => tick} 
                stroke="#64748b"
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <YAxis 
                domain={[40, 180]} 
                stroke="#64748b"
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <Tooltip 
                formatter={(value) => [`${value} BPM`, 'Frecuencia Cardíaca']}
                contentStyle={{ backgroundColor: '#fff', borderRadius: 8, borderColor: '#e2e8f0' }}
                labelStyle={{ color: '#1f2937' }}
              />
              <Legend wrapperStyle={{ paddingTop: 10 }} />
              <Line 
                type="monotone" 
                dataKey="heartRate" 
                stroke="#e74c3c" 
                strokeWidth={2}
                activeDot={{ r: 8, fill: '#e74c3c', stroke: '#fff', strokeWidth: 2 }} 
                name="Frecuencia Cardíaca"
                dot={{ r: 3, fill: '#e74c3c', stroke: '#fff', strokeWidth: 1 }}
                fill="url(#heartRateGradient)"
              />
            </LineChart>
          ) : (
            <BarChart 
              data={recentData} 
              margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
            >
              <defs>
                <linearGradient id="heartRateBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e74c3c" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#e74c3c" stopOpacity={0.4}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="index" 
                type="category" 
                tickFormatter={(tick) => tick} 
                stroke="#64748b"
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <YAxis 
                domain={[40, 180]} 
                stroke="#64748b"
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <Tooltip 
                formatter={(value) => [`${value} BPM`, 'Frecuencia Cardíaca']}
                contentStyle={{ backgroundColor: '#fff', borderRadius: 8, borderColor: '#e2e8f0' }}
                labelStyle={{ color: '#1f2937' }}
              />
              <Legend wrapperStyle={{ paddingTop: 10 }} />
              <Bar 
                dataKey="heartRate" 
                fill="url(#heartRateBarGradient)" 
                name="Frecuencia Cardíaca"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Nivel de Estrés</Text>
        <ResponsiveContainer width="100%" height={250}>
          {chartType === 'line' ? (
            <LineChart 
              data={recentData} 
              margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
            >
              <defs>
                <linearGradient id="stressGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6cbf6c" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6cbf6c" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="index" 
                type="category" 
                tickFormatter={(tick) => tick} 
                stroke="#64748b"
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <YAxis 
                domain={[0, 5]} 
                stroke="#64748b"
                tick={{ fontSize: 12, fill: '#64748b' }}
                ticks={[0, 1, 2, 3, 4, 5]}
              />
              <Tooltip 
                formatter={(value) => [`Nivel ${value}`, 'Nivel de Estrés']}
                contentStyle={{ backgroundColor: '#fff', borderRadius: 8, borderColor: '#e2e8f0' }}
                labelStyle={{ color: '#1f2937' }}
              />
              <Legend wrapperStyle={{ paddingTop: 10 }} />
              <Line 
                type="monotone" 
                dataKey="stressLevel" 
                stroke="#6cbf6c" 
                strokeWidth={2}
                activeDot={{ r: 8, fill: '#6cbf6c', stroke: '#fff', strokeWidth: 2 }} 
                name="Nivel de Estrés"
                dot={{ r: 3, fill: '#6cbf6c', stroke: '#fff', strokeWidth: 1 }}
                fill="url(#stressGradient)"
              />
            </LineChart>
          ) : (
            <BarChart 
              data={recentData} 
              margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
            >
              <defs>
                <linearGradient id="stressBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6cbf6c" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6cbf6c" stopOpacity={0.4}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="index" 
                type="category" 
                tickFormatter={(tick) => tick} 
                stroke="#64748b"
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <YAxis 
                domain={[0, 5]} 
                stroke="#64748b"
                tick={{ fontSize: 12, fill: '#64748b' }}
                ticks={[0, 1, 2, 3, 4, 5]}
              />
              <Tooltip 
                formatter={(value) => [`Nivel ${value}`, 'Nivel de Estrés']}
                contentStyle={{ backgroundColor: '#fff', borderRadius: 8, borderColor: '#e2e8f0' }}
                labelStyle={{ color: '#1f2937' }}
              />
              <Legend wrapperStyle={{ paddingTop: 10 }} />
              <Bar 
                dataKey="stressLevel" 
                fill="url(#stressBarGradient)" 
                name="Nivel de Estrés"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  toggleButton: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  toggleButtonText: {
    color: '#1f2937',
    fontWeight: '500',
    fontSize: 14,
  },
  notificationContainer: {
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  notificationText: {
    color: '#b91c1c',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  chartContainer: {
    marginBottom: 24,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
});

export default SomaticMirror;
