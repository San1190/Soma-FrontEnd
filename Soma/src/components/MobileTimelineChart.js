import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../constants/api';
import { useTheme } from '../context/ThemeContext';

const sleepStageToValue = (stage) => {
  if (!stage) return 0;
  const s = stage.toLowerCase();
  if (s === 'deep') return 3;
  if (s === 'rem') return 2;
  if (s === 'light') return 1;
  if (s === 'awake') return 0;
  return 0;
};

const MobileTimelineChart = () => {
  const { user } = useAuth();
  const { currentTheme } = useTheme();
  const [hrData, setHrData] = useState([]);
  const [hrvData, setHrvData] = useState([]);
  const [sleepData, setSleepData] = useState([]);
  const [showHR, setShowHR] = useState(true);
  const [showHRV, setShowHRV] = useState(true);
  const [showSleep, setShowSleep] = useState(true);

  useEffect(() => {
    const load = async () => {
      const userId = user?.id || 1;
      try {
        const res = await fetch(`${API_BASE_URL}/data/range/${userId}`);
        const list = await res.json();
        const last = list.slice(0, 40).reverse();
        const hr = last.map((d) => ({ value: d.heart_rate_bpm ?? 0 }));
        const hrv = last.map((d) => ({ value: d.hrv_ms ?? 0 }));
        const sleep = last.map((d) => ({ value: sleepStageToValue(d.sleep_stage) }));
        setHrData(hr);
        setHrvData(hrv);
        setSleepData(sleep);
      } catch {}
    };
    load();
  }, [user?.id]);

  return (
    <View style={[styles.card, { backgroundColor: currentTheme.cardBackground, borderColor: currentTheme.borderColor }]}>
      <Text style={[styles.title, { color: currentTheme.textPrimary }]}>Línea de tiempo</Text>
      <View style={styles.toggles}>
        <TouchableOpacity onPress={() => setShowHR((v) => !v)} style={[styles.toggle, showHR ? styles.on : styles.off]}><Text style={styles.toggleText}>FC</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setShowHRV((v) => !v)} style={[styles.toggle, showHRV ? styles.on : styles.off]}><Text style={styles.toggleText}>HRV</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setShowSleep((v) => !v)} style={[styles.toggle, showSleep ? styles.on : styles.off]}><Text style={styles.toggleText}>Sueño</Text></TouchableOpacity>
      </View>

      {showHR || showHRV ? (
        <LineChart
          data={showHR ? hrData : []}
          data2={showHRV ? hrvData : []}
          height={220}
          thickness={2}
          color={'#e74c3c'}
          color2={'#2ecc71'}
          startOpacity={0.1}
          endOpacity={0.05}
          yAxisTextStyle={{ color: currentTheme.textSecondary }}
          xAxisColor={currentTheme.borderColor}
          yAxisColor={currentTheme.borderColor}
          backgroundColor={'transparent'}
          hideRules
        />
      ) : null}

      {showSleep ? (
        <View style={{ marginTop: 12 }}>
          <LineChart
            data={sleepData}
            height={160}
            thickness={2}
            color={'#f1c40f'}
            startOpacity={0.1}
            endOpacity={0.05}
            yAxisTextStyle={{ color: currentTheme.textSecondary }}
            xAxisColor={currentTheme.borderColor}
            yAxisColor={currentTheme.borderColor}
            backgroundColor={'transparent'}
            hideRules
          />
        </View>
      ) : null}
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

export default MobileTimelineChart;
