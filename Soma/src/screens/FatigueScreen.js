import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FooterNav from '../components/FooterNav';
import TopBar from '../components/TopBar';
import MiniStatCard from '../components/MiniStatCard';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';

const FatigueScreen = () => {
  const { currentTheme } = useTheme();
  const navigation = useNavigation();
  const [barsEyes, setBarsEyes] = useState([24, 52, 38, 18, 44, 30]);
  const [barsPosture, setBarsPosture] = useState([18, 26, 22, 30, 28, 24]);
  const [migraineRisk, setMigraineRisk] = useState(4.5);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const jitter = (arr, factor = 6, min = 8, max = 64) => arr.map(v => {
        const j = Math.round(v + (Math.random() * factor - factor/2));
        return Math.min(max, Math.max(min, j));
      });
      setBarsEyes(prev => jitter(prev, 8));
      setBarsPosture(prev => jitter(prev, 5));
      setMigraineRisk(prev => {
        const next = prev + (Math.random() * 0.6 - 0.3);
        return Math.max(0, Math.min(100, Math.round(next * 10) / 10));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#EAFBE8' }]}> 
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <TopBar onAvatarPress={() => navigation.navigate('Profile')} variant="lock" active={locked} onToggle={() => setLocked(v => !v)} />
        <Text style={[styles.title, { color: '#2f4f40' }]}>¿Qué tal tu fatiga?</Text>

        <View style={styles.suggestionCard}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.suggestTitle, { color: '#2f4f40' }]}>Usa lágrimas artificiales</Text>
            <Text style={styles.suggestBody}>Consejo del día para Ana</Text>
          </View>
          <Image source={require('../../assets/gatos/GatoVerde.png')} style={styles.cat} />
        </View>

        <TouchableOpacity style={styles.askButton}><Text style={styles.askText}>Pregunta lo que quieras a Somat</Text></TouchableOpacity>

        <Text style={[styles.sectionTitle, { color: '#2f4f40' }]}>Todo sobre ti</Text>
        <View style={styles.statsRow}>
          <MiniStatCard title="ojos" subtitle="parpadeos / min" mode="bars" bars={barsEyes} color="#3f6f52" />
          <MiniStatCard title="postura" subtitle="cambio postural / h" mode="bars" bars={barsPosture} color="#3f6f52" />
          <MiniStatCard title="cabeza" subtitle="prev. migrañas" mode="number" value={migraineRisk} />
        </View>

        <Text style={[styles.sectionTitle, { color: '#2f4f40' }]}>Nuevos hábitos</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.habitsRow}>
          {[
            { key: 'blink', title: 'Ejercicios de parpadeo', subtitle: 'Diario', desc: 'Rutina breve para lubricar tus ojos.' },
            { key: 'posture', title: 'Chequeo de postura', subtitle: 'Cada hora', desc: 'Pequeñas correcciones posturales.' },
            { key: 'lighting', title: 'Iluminación adecuada', subtitle: 'Semanal', desc: 'Ajustes de entorno para reducir fatiga.' },
          ].map((c) => (
            <View key={c.key} style={styles.habitCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.habitTitle}>{c.title}</Text>
                <Text style={{ color: '#2f4f40' }}>pulsa para leer</Text>
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
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 220 },
  title: { marginTop: 10, fontSize: 24, fontWeight: '700' },
  suggestionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 16, marginTop: 12 },
  suggestTitle: { fontSize: 18, fontWeight: '700' },
  suggestBody: { color: '#6b7280', marginTop: 6 },
  cat: { width: 72, height: 72, marginLeft: 12, resizeMode: 'contain' },
  askButton: { marginTop: 10, paddingVertical: 12, borderRadius: 22, alignItems: 'center', backgroundColor: '#000' },
  askText: { color: '#fff', fontWeight: '700' },
  sectionTitle: { marginTop: 18, fontSize: 18, fontWeight: '700' },
  statsRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  habitsRow: { paddingVertical: 8 },
  habitCard: { width: 240, marginRight: 12, borderRadius: 16, padding: 16, backgroundColor: '#CFF3C9' },
  habitTitle: { fontSize: 16, fontWeight: '700', color: '#2f4f40' },
  habitSub: { marginTop: 4, color: '#2f4f40' },
  habitDesc: { marginTop: 8, color: '#2f4f40' },
  habitActions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  circleBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  circleText: { fontSize: 18, fontWeight: '700', color: '#2f4f40' },
});

export default FatigueScreen;
