import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from 'react-native-gifted-charts';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import API_BASE_URL from '../constants/api';

export default function DailySummaryScreen({ route }) {
  const { currentTheme } = useTheme();
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [activeView, setActiveView] = useState(route?.params?.view || 'correlacion');
  const stressSeries = [12, 22, 18, 30, 28, 20, 14, 10];
  const sleepSeries = [80, 78, 82, 70, 75, 83, 85, 88];
  const labels = ['00', '03', '06', '09', '12', '15', '18', '21'];

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        if (!user?.user_id && !user?.id) return;
        const uid = user?.user_id || user?.id;
        const res = await axios.get(`${API_BASE_URL}/summary/daily/${uid}`);
        setSummary(res.data);
      } catch {}
    };
    fetchSummary();
  }, [user?.user_id, user?.id]);

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={["#e7f0f4", "#ffffff"]} style={styles.header}>
        <View style={styles.headerRow}>
          <Ionicons name="stats-chart" size={22} color="#1a1a1a" />
          <Text style={styles.title}>Resumen diario</Text>
        </View>
        <Text style={styles.subtitle}>Tu día en una vista: sueño, estrés, actividad y pantalla</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.kpisRow}>
          <View style={[styles.kpiCard, { backgroundColor:'#f0f7ff' }]}>
            <Text style={styles.kpiLabel}>Calidad del sueño</Text>
            <Text style={styles.kpiValue}>{summary?.sleepQualityAvg ?? '—'}</Text>
          </View>
          <View style={[styles.kpiCard, { backgroundColor:'#f3eaff' }]}>
            <Text style={styles.kpiLabel}>Picos de estrés</Text>
            <Text style={styles.kpiValue}>{summary?.stressPeaksCount ?? '—'}</Text>
          </View>
        </View>
        <View style={styles.kpisRow}>
          <View style={[styles.kpiCard, { backgroundColor:'#eaf9ef' }]}>
            <Text style={styles.kpiLabel}>Horas de actividad</Text>
            <Text style={styles.kpiValue}>{summary?.activityHours != null ? `${summary.activityHours.toFixed(1)}h` : '—'}</Text>
          </View>
          <View style={[styles.kpiCard, { backgroundColor:'#fff6ea' }]}>
            <Text style={styles.kpiLabel}>Tiempo de pantalla</Text>
            <Text style={styles.kpiValue}>{summary?.screenTimeMinutes != null ? `${Math.floor(summary.screenTimeMinutes/60)}h ${summary.screenTimeMinutes%60}m` : '—'}</Text>
          </View>
        </View>
        <View style={styles.pillsRow}>
          {[
            { key: 'correlacion', label: 'Estrés vs Sueño' },
            { key: 'actividad', label: 'Actividad' },
            { key: 'pantalla', label: 'Pantalla' },
            { key: 'sueno', label: 'Sueño' },
          ].map(p => (
            <TouchableOpacity key={p.key} style={[styles.pill, activeView === p.key && [styles.pillActive, { backgroundColor: '#000' }]]} onPress={() => setActiveView(p.key)}>
              <Text style={[styles.pillText, { color: activeView === p.key ? '#fff' : currentTheme.textPrimary }]}>{p.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeView === 'correlacion' && (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Estrés vs. sueño</Text>
            <LineChart
              data={stressSeries.map((v,i)=>({value:v,label:labels[i]}))}
              data2={sleepSeries.map((v,i)=>({value:v,label:labels[i]}))}
              curved
              spacing={30}
              thickness={3}
              color="#8b5cf6"
              color2="#10b981"
              yAxisTextStyle={{ color:'#6b7280' }}
              xAxisLabelTextStyle={{ color:'#6b7280' }}
              hideRule
              areaChart
              startFillColor1="#ede9fe"
              startFillColor2="#dcfce7"
            />
            <Text style={styles.chartDesc}>Correlación estimada: {summary?.correlationStressSleep != null ? summary.correlationStressSleep.toFixed(2) : '—'}</Text>
          </View>
        )}

        {activeView === 'actividad' && (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Actividad estimada</Text>
            <View style={{ flexDirection:'row', alignItems:'flex-end', gap:10, height:140 }}>
              {[4,6,3,5,2,7].map((h,i)=>(
                <View key={`act-${i}`} style={{ width:18, height:h*16, borderRadius:8, backgroundColor:'#3f6f52' }} />
              ))}
            </View>
            <Text style={styles.chartDesc}>{summary?.activityHours != null ? `${summary.activityHours.toFixed(1)}h activas estimadas` : '—'}</Text>
          </View>
        )}

        {activeView === 'pantalla' && (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Tiempo de pantalla</Text>
            <Text style={[styles.chartDesc, { marginTop:4 }]}>{summary?.screenTimeMinutes != null ? `${Math.floor(summary.screenTimeMinutes/60)}h ${summary.screenTimeMinutes%60}m` : '—'}</Text>
          </View>
        )}

        {activeView === 'sueno' && (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Calidad del sueño</Text>
            <LineChart
              data={sleepSeries.map((v,i)=>({value:v,label:labels[i]}))}
              curved
              spacing={30}
              thickness={3}
              color="#5f7f92"
              yAxisTextStyle={{ color:'#6b7280' }}
              xAxisLabelTextStyle={{ color:'#6b7280' }}
              hideRule
              areaChart
              startFillColor1="#DDEAF1"
            />
            <Text style={styles.chartDesc}>Promedio: {summary?.sleepQualityAvg ?? '—'}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex:1, backgroundColor:'#f8fafb', ...(Platform.OS === 'web' ? { minHeight: '100vh' } : {}) },
  header: { paddingHorizontal:16, paddingTop:12, paddingBottom:18 },
  headerRow: { flexDirection:'row', alignItems:'center', gap:8 },
  title: { fontSize:22, fontWeight:'800', color:'#111' },
  subtitle: { fontSize:13, color:'#4b5563', marginTop:6 },
  content: { padding:16 },
  pillsRow: { flexDirection:'row', alignItems:'center', marginBottom:12 },
  pill: { paddingHorizontal:12, paddingVertical:8, borderRadius:16, backgroundColor:'#E6E6E6', marginRight:8 },
  pillActive: { backgroundColor:'#000' },
  pillText: { fontSize:12 },
  kpisRow: { flexDirection:'row', gap:12, marginBottom:12 },
  kpiCard: { flex:1, borderRadius:16, padding:16, shadowColor:'#000', shadowOpacity:0.06, shadowRadius:8, shadowOffset:{ width:0, height:4 }, elevation:2 },
  kpiLabel: { fontSize:12, color:'#374151' },
  kpiValue: { fontSize:20, fontWeight:'800', color:'#111827', marginTop:6 },
  chartCard: { backgroundColor:'#fff', borderRadius:18, padding:16, shadowColor:'#000', shadowOpacity:0.06, shadowRadius:8, shadowOffset:{ width:0, height:4 }, elevation:2 },
  chartTitle: { fontSize:16, fontWeight:'800', color:'#111827', marginBottom:8 },
  chartDesc: { fontSize:12, color:'#6b7280', marginTop:8 },
});
