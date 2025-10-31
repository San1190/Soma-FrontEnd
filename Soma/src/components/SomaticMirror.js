import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const simulatedData = [
  { date: '2023-01-01', heartRate: 70, stressLevel: 3, optionalParam: 10 },
  { date: '2023-01-02', heartRate: 72, stressLevel: 4, optionalParam: 12 },
  { date: '2023-01-03', heartRate: 68, stressLevel: 2, optionalParam: 9 },
  { date: '2023-01-04', heartRate: 75, stressLevel: 5, optionalParam: 15 },
  { date: '2023-01-05', heartRate: 71, stressLevel: 3, optionalParam: 11 },
  { date: '2023-01-06', heartRate: 69, stressLevel: 3, optionalParam: 10 },
  { date: '2023-01-07', heartRate: 73, stressLevel: 4, optionalParam: 13 },
];

const formatDate = dateStr => new Date(dateStr).toLocaleDateString();

const SomaticMirror = ({ data = simulatedData }) => {
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
            <XAxis dataKey="date" tickFormatter={formatDate} />
            <YAxis label={{ value: 'BPM', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="heartRate" stroke="#8884d8" activeDot={{ r: 8 }} name="Frecuencia Cardíaca" />
          </LineChart>
        ) : (
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={formatDate} />
            <YAxis label={{ value: 'BPM', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
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
            <XAxis dataKey="date" tickFormatter={formatDate} />
            <YAxis label={{ value: 'Nivel', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="stressLevel" stroke="#82ca9d" activeDot={{ r: 8 }} name="Nivel de Estrés" />
          </LineChart>
        ) : (
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={formatDate} />
            <YAxis label={{ value: 'Nivel', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="stressLevel" fill="#82ca9d" name="Nivel de Estrés" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default SomaticMirror;
