import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from 'react-native-gifted-charts';

export default function DailySummaryScreen() {
  const stressSeries = [12, 22, 18, 30, 28, 20, 14, 10];
  const sleepSeries = [80, 78, 82, 70, 75, 83, 85, 88];
  const labels = ['00', '03', '06', '09', '12', '15', '18', '21'];

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={["#e7f0f4", "#ffffff"]} style={styles.header}>
        <View style={styles.headerRow}>
          <Ionicons name="stats-chart" size={22} color="#1a1a1a" />
          <Text style={styles.title}>Resumen diario</Text>
        </View>
        <Text style={styles.subtitle}>Tu día en una vista: sueño, estrés, actividad y pantalla</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.kpisRow}>
          <View style={[styles.kpiCard, { backgroundColor:'#f0f7ff' }]}>
            <Text style={styles.kpiLabel}>Calidad del sueño</Text>
            <Text style={styles.kpiValue}>81</Text>
          </View>
          <View style={[styles.kpiCard, { backgroundColor:'#f3eaff' }]}>
            <Text style={styles.kpiLabel}>Picos de estrés</Text>
            <Text style={styles.kpiValue}>3</Text>
          </View>
        </View>
        <View style={styles.kpisRow}>
          <View style={[styles.kpiCard, { backgroundColor:'#eaf9ef' }]}>
            <Text style={styles.kpiLabel}>Horas de actividad</Text>
            <Text style={styles.kpiValue}>2.4h</Text>
          </View>
          <View style={[styles.kpiCard, { backgroundColor:'#fff6ea' }]}>
            <Text style={styles.kpiLabel}>Tiempo de pantalla</Text>
            <Text style={styles.kpiValue}>3h 10m</Text>
          </View>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Estrés vs. sueño (correlación)</Text>
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
          <Text style={styles.chartDesc}>Relación aproximada de cómo variaciones de estrés afectan tu sueño posterior</Text>
        </View>
      </View>
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
  kpisRow: { flexDirection:'row', gap:12, marginBottom:12 },
  kpiCard: { flex:1, borderRadius:16, padding:16, shadowColor:'#000', shadowOpacity:0.06, shadowRadius:8, shadowOffset:{ width:0, height:4 }, elevation:2 },
  kpiLabel: { fontSize:12, color:'#374151' },
  kpiValue: { fontSize:20, fontWeight:'800', color:'#111827', marginTop:6 },
  chartCard: { backgroundColor:'#fff', borderRadius:18, padding:16, shadowColor:'#000', shadowOpacity:0.06, shadowRadius:8, shadowOffset:{ width:0, height:4 }, elevation:2 },
  chartTitle: { fontSize:16, fontWeight:'800', color:'#111827', marginBottom:8 },
  chartDesc: { fontSize:12, color:'#6b7280', marginTop:8 },
});
