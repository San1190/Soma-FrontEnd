import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FooterNav from '../components/FooterNav';
import TopBar from '../components/TopBar';
import MiniStatCard from '../components/MiniStatCard';
import { useNavigation } from '@react-navigation/native';

export default function InsomniaScreen() {
  const navigation = useNavigation();
  const [barsPhase, setBarsPhase] = useState([20, 28, 36, 22, 30, 26]);
  const [barsDepth, setBarsDepth] = useState([18, 25, 22, 32, 28, 24]);
  const [microAwake, setMicroAwake] = useState(0.15);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const jitter = (arr, factor = 6, min = 8, max = 64) => arr.map(v => {
        const j = Math.round(v + (Math.random() * factor - factor / 2));
        return Math.min(max, Math.max(min, j));
      });
      setBarsPhase(prev => jitter(prev, 6));
      setBarsDepth(prev => jitter(prev, 6));
      setMicroAwake(prev => {
        const next = prev + (Math.random() * 0.06 - 0.03);
        return Math.max(0, Math.min(1, Math.round(next * 100) / 100));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#FFFFFF' }]}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <TopBar onAvatarPress={() => navigation.navigate('Profile')} variant="lock" active={locked} onToggle={() => setLocked(v => !v)} />
        <Text style={styles.title}>¿Qué tal tu insomnio?</Text>

        <View style={styles.suggestionCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.suggestTitle}>Evita pantallas antes de dormir</Text>
            <Text style={styles.suggestBody}>Consejo del día para Ana</Text>
          </View>
          <Image source={require('../../assets/gatos/GatoAzul.png')} style={styles.cat} />
        </View>

        <TouchableOpacity style={styles.askButton}><Text style={styles.askText}>Pregunta lo que quieras a Somat</Text></TouchableOpacity>

        <Text style={styles.sectionTitle}>Todo sobre ti</Text>
        <View style={styles.statsRow}>
          <MiniStatCard title="fase" subtitle="ratio" mode="bars" bars={barsPhase} color="#5f7f92" />
          <MiniStatCard title="profundidad" subtitle="variación/horas" mode="bars" bars={barsDepth} color="#5f7f92" />
          <MiniStatCard title="microsueño" subtitle="ratio" mode="number" value={microAwake} />
        </View>

        <View style={styles.alarmCard}>
          <Text style={styles.alarmTitle}>Alarma inteligente actual</Text>
          <Text style={styles.alarmBody}>Accede a la sección de alarmas y observa cómo mejora la precisión de tu sueño</Text>
        </View>

        <TouchableOpacity style={styles.primaryButton}><Text style={styles.primaryText}>Modifica tu alarma</Text></TouchableOpacity>

        <Text style={styles.sectionTitle}>Nuevos hábitos</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.habitsRow}>
          {[
            { key: 'noScreens', title: 'Sin pantallas 2h antes', subtitle: '2h antes de dormir', desc: 'Evita luz azul y notificaciones.' },
            { key: 'routine', title: 'Rutina de sueño', subtitle: 'Diario', desc: 'Crea rituales suaves antes de dormir.' },
            { key: 'breath', title: 'Respira 4-7-8', subtitle: 'Nocturno', desc: 'Ejercicio para conciliar el sueño.' },
          ].map((c) => (
            <View key={c.key} style={styles.habitCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.habitTitle}>{c.title}</Text>
                <Text style={{ color: '#2f3f47' }}>pulsa para leer</Text>
              </View>
              <Text style={styles.habitSub}>{c.subtitle}</Text>
              <Text style={styles.habitDesc}>{c.desc}</Text>
              <View style={styles.habitActions}>
                <TouchableOpacity style={styles.circleBtn}><Text style={styles.circleText}>+</Text></TouchableOpacity>
                <TouchableOpacity style={styles.circleBtn}><Text style={styles.circleText}>{'>'}</Text></TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </ScrollView>
      <FooterNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 220 },
  title: { marginTop: 10, fontSize: 24, fontWeight: '700', color: '#2f3f47' },
  suggestionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 16, marginTop: 12 },
  suggestTitle: { fontSize: 18, fontWeight: '700' },
  suggestBody: { color: '#6b7280', marginTop: 6 },
  cat: { width: 72, height: 72, marginLeft: 12, resizeMode: 'contain' },
  askButton: { marginTop: 10, paddingVertical: 12, borderRadius: 22, alignItems: 'center', backgroundColor: '#000' },
  askText: { color: '#fff', fontWeight: '700' },
  sectionTitle: { marginTop: 18, fontSize: 18, fontWeight: '700', color: '#2f3f47' },
  statsRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  habitsRow: { paddingVertical: 8 },
  alarmCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginTop: 12 },
  alarmTitle: { fontSize: 16, fontWeight: '700', color: '#2f3f47' },
  alarmBody: { marginTop: 6, color: '#617a86' },
  habitCard: { width: 240, marginRight: 12, borderRadius: 16, padding: 16, backgroundColor: '#DDEAF1' },
  habitTitle: { fontSize: 16, fontWeight: '700', color: '#2f3f47' },
  habitSub: { marginTop: 4, color: '#2f3f47' },
  habitDesc: { marginTop: 8, color: '#2f3f47' },
  habitActions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  circleBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  circleText: { fontSize: 18, fontWeight: '700', color: '#2f3f47' },
  primaryButton: { marginTop: 14, paddingVertical: 12, borderRadius: 24, alignItems: 'center', backgroundColor: '#000' },
  primaryText: { color: '#fff', fontWeight: '700' },
});
