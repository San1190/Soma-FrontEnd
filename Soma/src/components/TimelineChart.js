import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../constants/api';
import { useTheme } from '../context/ThemeContext';

const sleepStageToValue = (stage) => {
  if (!stage) return null;
  const s = stage.toLowerCase();
  if (s === 'deep') return 3;
  if (s === 'rem') return 2;
  if (s === 'light') return 1;
  if (s === 'awake') return 0;
  return null;
};

const TimelineChart = () => {
  const { user } = useAuth();
  const { currentTheme } = useTheme();
  const [data, setData] = useState([]);
  const [showHR, setShowHR] = useState(true);
  const [showHRV, setShowHRV] = useState(true);
  const [showSleep, setShowSleep] = useState(true);

  useEffect(() => {
    const load = async () => {
      const userId = user?.id || 1;
      try {
        const res = await fetch(`${API_BASE_URL}/data/range/${userId}`);
        const list = await res.json();
        const mapped = list.slice(0, 100).reverse().map((d, idx) => ({
          ts: d.timestamp,
          hr: d.heart_rate_bpm,
          hrv: d.hrv_ms,
          sleep: sleepStageToValue(d.sleep_stage),
          i: idx,
        }));
        setData(mapped);
      } catch {}
    };
    load();
  }, [user?.id]);

  if (Platform.OS !== 'web') {
    return (
      <View style={[styles.card, { borderColor: currentTheme.borderColor, backgroundColor: currentTheme.cardBackground }] }>
        <Text style={[styles.title, { color: currentTheme.textPrimary }]}>Línea de tiempo</Text>
        <Text style={{ color: currentTheme.textSecondary }}>Disponible solo en Web</Text>
      </View>
    );
  }

  return (
    <View style={[styles.card, { backgroundColor: currentTheme.cardBackground, borderColor: currentTheme.borderColor }] }>
      <Text style={[styles.title, { color: currentTheme.textPrimary }]}>Línea de tiempo</Text>
      <View style={styles.toggles}>
        <TouchableOpacity onPress={() => setShowHR(v => !v)} style={[styles.toggle, showHR ? styles.on : styles.off]}><Text style={styles.toggleText}>FC</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setShowHRV(v => !v)} style={[styles.toggle, showHRV ? styles.on : styles.off]}><Text style={styles.toggleText}>HRV</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setShowSleep(v => !v)} style={[styles.toggle, showSleep ? styles.on : styles.off]}><Text style={styles.toggleText}>Sueño</Text></TouchableOpacity>
      </View>
      <View style={{ height: 240 }}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 10 }} width={600} height={220}>
          <CartesianGrid strokeDasharray="3 3" stroke={currentTheme.borderColor} />
          <XAxis dataKey="i" tick={{ fontSize: 12, fill: currentTheme.textSecondary }} stroke={currentTheme.textSecondary} />
          <YAxis stroke={currentTheme.textSecondary} tick={{ fontSize: 12, fill: currentTheme.textSecondary }} />
          <Tooltip contentStyle={{ backgroundColor: currentTheme.cardBackground, borderColor: currentTheme.borderColor }} labelStyle={{ color: currentTheme.textPrimary }} />
          {showHR && <Line type="monotone" dataKey="hr" stroke="#e74c3c" dot={false} name="FC" />}
          {showHRV && <Line type="monotone" dataKey="hrv" stroke="#2ecc71" dot={false} name="HRV" />}
          {showSleep && <Line type="step" dataKey="sleep" stroke="#f1c40f" dot={false} name="Sueño (0-3)" />}
        </LineChart>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: 14, padding: 14, marginTop: 12, borderWidth: 1 },
  title: { fontSize: 16, marginBottom: 8 },
  toggles: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  toggle: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10 },
  on: { backgroundColor: '#DDEEFF' },
  off: { backgroundColor: '#EEE' },
  toggleText: { color: '#071220' },
});

export default TimelineChart;
