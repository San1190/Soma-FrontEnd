import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import API_BASE_URL from '../constants/api';
import { useAuth } from '../context/AuthContext';
import { useAntiStress } from '../context/AntiStressContext';
import { useTheme } from '../context/ThemeContext';
import Calories from '../components/Calories';
import HeartRate from '../components/HeartRate';
import SomaticMirror from '../components/SomaticMirror'; // Importar SomaticMirror

const DashboardScreen = () => {
  const { user } = useAuth();
  const { isAntiStressModeActive, activateMode, deactivateMode } = useAntiStress();
  const [heartRate, setHeartRate] = useState('-');
  const [hrv, setHrv] = useState('-');
  const { currentTheme, stressCategory } = useTheme();

  const loadStatus = async () => {
    if (!user?.id) return;
    try {
      const activeRes = await axios.get(`${API_BASE_URL}/anti-stress/active/${user.id}`);
      // El estado visual usa el contexto, pero también reflejamos backend
    } catch {}
    try {
      const latest = await axios.get(`${API_BASE_URL}/data/latest/${user.id}`);
      setHeartRate(latest.data?.heart_rate_bpm ?? '-');
      setHrv(latest.data?.hrv_ms ?? '-');
    } catch {}
  };

  useEffect(() => { loadStatus(); }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    const interval = setInterval(async () => {
      try {
        const latest = await axios.get(`${API_BASE_URL}/data/latest/${user.id}`);
        setHeartRate(latest.data?.heart_rate_bpm ?? '-');
        setHrv(latest.data?.hrv_ms ?? '-');
      } catch {}
    }, 5000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const checkStress = async () => {
    if (!user?.id) return;
    try { await axios.get(`${API_BASE_URL}/stress/check/${user.id}`); await loadStatus(); }
    catch (e) { Alert.alert('Error', 'No se pudo chequear el estrés'); }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: currentTheme.background }]} contentContainerStyle={styles.content}>
      {/* Tarjeta del primer gráfico */}
      <Calories
        // props opcionales; puedes eliminarlas si usas los defaults
        title="Calorías (semana)"
        style={{ marginTop: 8 }}
        chartProps={{}}
      />

      <HeartRate />
      <SomaticMirror />

      <View style={[styles.card, { backgroundColor: currentTheme.cardBackground, borderColor: currentTheme.borderColor }] }>
        <Text style={styles.cardTitle}>Estado Antiestrés</Text>
        <View style={styles.row2}>
          <View className={undefined} style={styles.metric}><Text style={[styles.label,{color: currentTheme.textSecondary}]}>Modo</Text><Text style={[styles.value,{color: currentTheme.textPrimary}]}>{!isAntiStressModeActive ? 'Activo' : 'Inactivo'}</Text></View>
          <View style={styles.metric}><Text style={[styles.label,{color: currentTheme.textSecondary}]}>Estrés</Text><Text style={[styles.value,{color: currentTheme.textPrimary}]}>{stressCategory}</Text></View>
        </View>
        <View style={styles.row2}>
          <View style={styles.metric}><Text style={[styles.label,{color: currentTheme.textSecondary}]}>FC (bpm)</Text><Text style={[styles.value,{color: currentTheme.textPrimary}]}>{heartRate}</Text></View>
          <View style={styles.metric}><Text style={[styles.label,{color: currentTheme.textSecondary}]}>HRV (ms)</Text><Text style={[styles.value,{color: currentTheme.textPrimary}]}>{hrv}</Text></View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.btnPrimary, { backgroundColor: currentTheme.primary }]} onPress={checkStress}><Text style={styles.btnTextDark}>Chequear estrés</Text></TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: isAntiStressModeActive ? currentTheme.accent1 : currentTheme.accent2 }]}
            onPress={() => (isAntiStressModeActive ? activateMode('MANUAL_START') : deactivateMode())}
          ><Text style={styles.btnText}>{isAntiStressModeActive ? 'Activar' : 'Finalizar'}</Text></TouchableOpacity>
        </View>
      </View>

      {/* Aquí irán los demás componentes del dashboard */}
      {/* <ChartCard /> */}
      {/* <RecommendationBox /> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  card: { borderRadius: 14, padding: 14, marginTop: 12, borderWidth: 1 },
  cardTitle: { fontSize: 16, marginBottom: 8 },
  row2: { flexDirection: 'row', justifyContent: 'space-between' },
  metric: { flex: 1, marginRight: 8 },
  label: { fontSize: 12 },
  value: { fontSize: 18, marginTop: 4 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  btn: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12 },
  btnPrimary: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12 },
  btnText: { color: '#1E2A35' },
  btnTextDark: { color: '#071220' },
});

export default DashboardScreen;
