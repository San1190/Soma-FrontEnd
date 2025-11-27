import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FooterNav from '../components/FooterNav';
import TopBar from '../components/TopBar';
import MiniStatCard from '../components/MiniStatCard';
import RecommendationBox from '../components/RecommendationBox';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import API_BASE_URL from '../constants/api';
import { Ionicons } from '@expo/vector-icons';
import { getSuggestions } from '../services/music';

const StressScreen = () => {
  const { currentTheme } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({ suggestion: 'Prueba el mix en tendencia: Barre', metrics: { hrv: 52, heatVar: 1.2, respiration: 25 }, adviceFor: 'Ana' });
  const [bars, setBars] = useState([24, 52, 38, 18, 44, 30]);
  const [locked, setLocked] = useState(false);
  const [music, setMusic] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user && user.id) {
          const res = await axios.get(`${API_BASE_URL}/stress/users/${user.id}`);
          const s = res.data || {};
          const suggestion = s.suggestion || summary.suggestion;
          const metrics = s.metrics || summary.metrics;
          setSummary({ suggestion, metrics, adviceFor: s.adviceFor || summary.adviceFor });
          if (Array.isArray(s.indicatorBars)) setBars(s.indicatorBars);
          const mood = 'calma';
          const m = await getSuggestions(mood);
          setMusic(Array.isArray(m) ? m : []);
        }
      } catch (e) {
        setError('No se pudo cargar los datos');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const habitCards = [
    { key: 'disconnect', title: 'Bloques de desconexión', subtitle: '30 días', desc: 'Elige momentos fijos al día para descansar de las pantallas.' },
    { key: 'breath2', title: 'Respira 2 minutos', subtitle: 'Diario', desc: 'Pequeñas pausas de respiración para reducir el estrés digital.' },
    { key: 'lightRoutine', title: 'Rutina ligera', subtitle: 'Semanal', desc: 'Actividad suave para equilibrar tu estado.' },
  ];

  const onStartBreathing = () => navigation.navigate('GuidedBreathing');

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: '#EAE5FF' }]}> 
        <View style={styles.center}><ActivityIndicator size="large" color="#6b5a66" /></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#EAE5FF' }]}> 
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <TopBar onAvatarPress={() => navigation.navigate('Profile')} variant="lock" active={locked} onToggle={() => setLocked(v => !v)} />
        <Text style={[styles.title, { color: currentTheme.textPrimary }]}>¿Qué tal tu estrés?</Text>

        <View style={styles.suggestionCard}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.suggestTitle, { color: currentTheme.textPrimary }]}>{summary.suggestion}</Text>
            <Text style={styles.suggestBody}>Nuevo deporte, perfecto para ti</Text>
            <Text style={styles.advice}>Consejo del día para {summary.adviceFor}</Text>
          </View>
          <Image source={require('../../assets/gatos/gatoEstres.png')} style={styles.cat} />
        </View>

        <TouchableOpacity style={styles.askButton}><Text style={styles.askText}>Pregunta lo que quieras a Somat</Text></TouchableOpacity>

        <Text style={[styles.sectionTitle, { color: currentTheme.textPrimary }]}>Todo sobre ti</Text>
        <View style={styles.statsRow}>
          <MiniStatCard title="corazón" subtitle="HRV/min" mode="bars" bars={bars} color="#4b3340" />
          <MiniStatCard title="calor" subtitle="variación/hora" mode="bars" bars={bars.map(h=>Math.round(h*0.8))} color="#6b5a66" />
          <MiniStatCard title="respiración" subtitle="resp/min" mode="number" value={summary.metrics.respiration} />
        </View>

        <Text style={[styles.sectionTitle, { color: currentTheme.textPrimary }]}>Ejercicios de respiración guiada</Text>
        <Text style={styles.sectionBody}>Te recomendamos realizar ejercicios de respiración a diario e introducirlos en tu rutina.</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={onStartBreathing}><Text style={styles.primaryText}>Iniciar mis ejercicios de respiración</Text></TouchableOpacity>

        <Text style={[styles.sectionTitle, { color: currentTheme.textPrimary }]}>Nuevos hábitos</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.habitsRow}>
          {habitCards.map((c) => (
            <View key={c.key} style={styles.habitCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.habitTitle}>{c.title}</Text>
                <Ionicons name="chevron-forward" size={18} color="#2f3f47" />
              </View>
              <Text style={styles.habitSub}>{c.subtitle}</Text>
              <Text style={styles.habitDesc}>{c.desc}</Text>
              <View style={styles.habitActions}>
                <TouchableOpacity style={styles.circleBtn}><Text style={styles.circleText}>+</Text></TouchableOpacity>
                <TouchableOpacity style={styles.circleBtn}><Ionicons name="play" size={16} color="#2f3f47" /></TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        <Text style={[styles.sectionTitle, { color: currentTheme.textPrimary }]}>Sugerencias musicales</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.habitsRow}>
          {music.map(p => (
            <RecommendationBox key={p.id} title={p.name} imageUrl={p.imageUrl} owner={p.owner} url={p.url} />
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  avatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.06)' },
  lock: { width: 32, height: 24, borderRadius: 16, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  title: { marginTop: 10, fontSize: 24, fontWeight: '700' },
  suggestionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 16, marginTop: 12 },
  suggestTitle: { fontSize: 18, fontWeight: '700' },
  suggestBody: { color: '#6b7280', marginTop: 6 },
  advice: { marginTop: 8, color: '#6b7280' },
  cat: { width: 72, height: 72, marginLeft: 12, resizeMode: 'contain' },
  askButton: { marginTop: 10, paddingVertical: 12, borderRadius: 22, alignItems: 'center', backgroundColor: '#000' },
  askText: { color: '#fff', fontWeight: '700' },
  sectionTitle: { marginTop: 18, fontSize: 18, fontWeight: '700' },
  sectionBody: { color: '#6b7280', marginTop: 8 },
  statsRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  miniCard: { flex: 1, borderRadius: 18, padding: 18, backgroundColor: '#EFEFEF' },
  miniTitle: { fontSize: 14, fontWeight: '600' },
  barRow: { flexDirection: 'row', alignItems: 'flex-end', height: 90, gap: 8, marginVertical: 10 },
  bar: { width: 16, borderRadius: 10 },
  miniValue: { fontSize: 16, fontWeight: '700', marginVertical: 4 },
  pulse: { color: '#6b7280' },
  primaryButton: { marginTop: 14, paddingVertical: 12, borderRadius: 24, alignItems: 'center', backgroundColor: '#000' },
  primaryText: { color: '#fff', fontWeight: '700' },
  habitsRow: { paddingVertical: 8 },
  habitCard: { width: 240, marginRight: 12, borderRadius: 16, padding: 16, backgroundColor: '#DDEAF1' },
  habitTitle: { fontSize: 16, fontWeight: '700', color: '#2f3f47' },
  habitSub: { marginTop: 4, color: '#2f3f47' },
  habitDesc: { marginTop: 8, color: '#2f3f47' },
  habitActions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  circleBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  circleText: { fontSize: 18, fontWeight: '700', color: '#2f3f47' },
});

export default StressScreen;
