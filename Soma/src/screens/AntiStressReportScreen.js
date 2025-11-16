import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import API_BASE_URL from '../constants/api';

const fmtISO = (d) => d.toISOString();

const AntiStressReportScreen = () => {
  const { user } = useAuth();
  const { currentTheme } = useTheme();
  const [stats, setStats] = useState(null);
  const [recs, setRecs] = useState([]);
  const [sleepStats, setSleepStats] = useState(null);

  const load = async () => {
    const uid = user?.id || 1;
    const end = new Date();
    const start = new Date(end.getTime() - 7*24*60*60*1000);
    const qs = `start=${fmtISO(start)}&end=${fmtISO(end)}`;
    try {
      const sRes = await fetch(`${API_BASE_URL}/anti-stress/stats/${uid}?${qs}`);
      const sJson = await sRes.json();
      setStats(sJson);
      const ssRes = await fetch(`${API_BASE_URL}/anti-stress/sleep/stats/${uid}?${qs}`);
      const ssJson = await ssRes.json();
      setSleepStats(ssJson);
      const rRes = await fetch(`${API_BASE_URL}/anti-stress/recommendations/${uid}?${qs}`);
      const rJson = await rRes.json();
      setRecs(rJson.recommendations || []);
    } catch {}
  };

  useEffect(() => { load(); }, [user?.id]);

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }] }>
      <Text style={[styles.title, { color: currentTheme.textPrimary }]}>Reportes de Antiestrés</Text>
      <View style={[styles.card, { backgroundColor: currentTheme.cardBackground, borderColor: currentTheme.borderColor }] }>
        <Text style={[styles.cardTitle, { color: currentTheme.textPrimary }]}>Últimos 7 días</Text>
        <Text style={[styles.row, { color: currentTheme.textSecondary }]}>Activaciones: {stats?.activations ?? '—'}</Text>
        <Text style={[styles.row, { color: currentTheme.textSecondary }]}>Duración total: {stats?.totalDurationMinutes ?? '—'} min</Text>
        <Text style={[styles.row, { color: currentTheme.textSecondary }]}>Duración promedio: {stats?.averageDurationMinutes ?? '—'} min</Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: currentTheme.primary }]} onPress={load}>
          <Text style={styles.btnText}>Actualizar</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, { backgroundColor: currentTheme.cardBackground, borderColor: currentTheme.borderColor }] }>
        <Text style={[styles.cardTitle, { color: currentTheme.textPrimary }]}>Sueño (AUTO_SLEEP) 7 días</Text>
        <Text style={[styles.row, { color: currentTheme.textSecondary }]}>Activaciones: {sleepStats?.activations ?? '—'}</Text>
        <Text style={[styles.row, { color: currentTheme.textSecondary }]}>Duración total: {sleepStats?.totalDurationMinutes ?? '—'} min</Text>
        <Text style={[styles.row, { color: currentTheme.textSecondary }]}>Duración promedio: {sleepStats?.averageDurationMinutes ?? '—'} min</Text>
      </View>

      <View style={[styles.card, { backgroundColor: currentTheme.cardBackground, borderColor: currentTheme.borderColor }]}>
        <Text style={[styles.cardTitle, { color: currentTheme.textPrimary }]}>Recomendaciones</Text>
        {(recs && recs.length > 0) ? recs.map((r, i) => (
          <Text key={i} style={[styles.row, { color: currentTheme.textSecondary }]}>• {r}</Text>
        )) : (
          <Text style={[styles.row, { color: currentTheme.textSecondary }]}>Sin recomendaciones</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  card: { borderRadius: 14, padding: 14, borderWidth: 1, marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  row: { fontSize: 14, marginBottom: 6 },
  button: { marginTop: 10, paddingVertical: 10, borderRadius: 10, alignItems:'center' },
  btnText: { color: '#fff', fontWeight: '600' },
});

export default AntiStressReportScreen;
