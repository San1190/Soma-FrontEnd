import React, { useState, useEffect } from 'react';
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

  return (
    <div style={{ width: '100%', maxWidth: 900, margin: '0 auto', height: 'auto' }}>
      <h2>Espejo Somático - Datos Biomédicos</h2>
      <button onClick={toggleChartType}>
        Cambiar a Gráfica de {chartType === 'line' ? 'Barras' : 'Líneas'}
      </button>

      {showStressNotification && (
        <div style={{ color: 'red', fontWeight: 'bold', marginTop: '10px', fontSize: '1.2em' }}>
          ¡Nivel de estrés alto! Se recomienda un ejercicio de respiración.
        </div>
      )}

      <h3>Frecuencia Cardíaca (BPM)</h3>
      <ResponsiveContainer width="100%" height={300}>
        {chartType === 'line' ? (
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="index" type="category" tickFormatter={(tick) => tick} label={{ value: 'Tiempo (Punto de Dato)', position: 'insideBottom', offset: 0 }} />
            <YAxis label={{ value: 'Frecuencia Cardíaca (BPM)', angle: -90, position: 'insideLeft' }} domain={[40, 180]} />
            <Tooltip formatter={(value, name, props) => [`${value} BPM`, name]} />
            <Legend />
            <Line type="monotone" dataKey="heartRate" stroke="#8884d8" activeDot={{ r: 8 }} name="Frecuencia Cardíaca" />
          </LineChart>
        ) : (
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="index" type="category" tickFormatter={(tick) => tick} label={{ value: 'Tiempo (Punto de Dato)', position: 'insideBottom', offset: 0 }} />
            <YAxis label={{ value: 'Frecuencia Cardíaca (BPM)', angle: -90, position: 'insideLeft' }} domain={[40, 180]} />
            <Tooltip formatter={(value, name, props) => [`${value} BPM`, name]} />
            <Legend />
            <Bar dataKey="heartRate" fill="#8884d8" name="Frecuencia Cardíaca" />
          </BarChart>
        )}
      </ResponsiveContainer>

      <h3 style={{ marginTop: '20px' }}>Nivel de Estrés</h3>
      <ResponsiveContainer width="100%" height={300}>
        {chartType === 'line' ? (
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="index" type="category" tickFormatter={(tick) => tick} label={{ value: 'Tiempo (Punto de Dato)', position: 'insideBottom', offset: 0 }} />
            <YAxis label={{ value: 'Nivel de Estrés (1-5)', angle: -90, position: 'insideLeft' }} domain={[1, 5]} />
            <Tooltip formatter={(value, name, props) => [`${value} Nivel`, name]} />
            <Legend />
            <Line type="monotone" dataKey="stressLevel" stroke="#82ca9d" activeDot={{ r: 8 }} name="Nivel de Estrés" />
          </LineChart>
        ) : (
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="index" type="category" tickFormatter={(tick) => tick} label={{ value: 'Tiempo (Punto de Dato)', position: 'insideBottom', offset: 0 }} />
            <YAxis label={{ value: 'Nivel de Estrés (1-5)', angle: -90, position: 'insideLeft' }} domain={[1, 5]} />
            <Tooltip formatter={(value, name, props) => [`${value} Nivel`, name]} />
            <Legend />
            <Bar dataKey="stressLevel" fill="#82ca9d" name="Nivel de Estrés" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default SomaticMirror;
