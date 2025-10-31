import React, { useState, useEffect } from 'react';
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

  const [data, setData] = useState([generateSimulatedData(0)]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(currentData => {
        const newDataPoint = generateSimulatedData(currentData.length);
        // Mantener un número limitado de puntos de datos para no sobrecargar la gráfica
        const updatedData = [...currentData, newDataPoint].slice(-20); 
        return updatedData;
      });
    }, 1000); // Actualizar cada segundo

    return () => clearInterval(interval);
  }, []);
  const [chartType, setChartType] = useState('line'); // 'line' o 'bar'



  const toggleChartType = () => setChartType(t => (t === 'line' ? 'bar' : 'line'));

  return (
    <div style={{ width: '100%', maxWidth: 900, margin: '0 auto', height: 'auto' }}>
      <h2>Espejo Somático - Datos Biomédicos</h2>
      <button onClick={toggleChartType}>
        Cambiar a Gráfica de {chartType === 'line' ? 'Barras' : 'Líneas'}
      </button>

      <h3>Frecuencia Cardíaca (BPM)</h3>
      <ResponsiveContainer width="100%" height={300}>
        {chartType === 'line' ? (
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="index" type="category" tickFormatter={(tick) => tick} />
            <YAxis label={{ value: 'BPM', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value, name, props) => [`${value}`, name]} />
            <Legend />
            <Line type="monotone" dataKey="heartRate" stroke="#8884d8" activeDot={{ r: 8 }} name="Frecuencia Cardíaca" />
          </LineChart>
        ) : (
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="index" type="category" tickFormatter={(tick) => tick} />
            <YAxis label={{ value: 'BPM', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value, name, props) => [`${value}`, name]} />
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
            <XAxis dataKey="index" type="category" tickFormatter={(tick) => tick} />
            <YAxis label={{ value: 'Nivel', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value, name, props) => [`${value}`, name]} />
            <Legend />
            <Line type="monotone" dataKey="stressLevel" stroke="#82ca9d" activeDot={{ r: 8 }} name="Nivel de Estrés" />
          </LineChart>
        ) : (
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="index" type="category" tickFormatter={(tick) => tick} />
            <YAxis label={{ value: 'Nivel', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value, name, props) => [`${value}`, name]} />
            <Legend />
            <Bar dataKey="stressLevel" fill="#82ca9d" name="Nivel de Estrés" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default SomaticMirror;
