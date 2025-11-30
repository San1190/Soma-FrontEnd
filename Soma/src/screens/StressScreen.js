import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
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
  const [selectedCard, setSelectedCard] = useState(null);

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
    {
      key: 'disconnect',
      icon: 'B',
      title: 'Bloques de desconexión',
      subtitle: '30 días',
      desc: 'Elige momentos fijos al día para descansar',
      gradientColors: ['#B8E6D5', '#A8D5E2'],
      iconBg: '#7BC4A8'
    },
    {
      key: 'breath2',
      icon: 'R',
      title: 'Respira 2 minutos',
      subtitle: 'Diario',
      desc: 'Pausas de respiración para reducir estrés',
      gradientColors: ['#F5C6D5', '#E6D5F5'],
      iconBg: '#D89BB8'
    },
    {
      key: 'lightRoutine',
      icon: 'R',
      title: 'Rutina ligera',
      subtitle: 'Semanal',
      desc: 'Actividad suave para equilibrar',
      gradientColors: ['#FFD5B8', '#FFB8D5'],
      iconBg: '#FFB894'
    },
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
          <MiniStatCard title="calor" subtitle="variación/hora" mode="bars" bars={bars.map(h => Math.round(h * 0.8))} color="#6b5a66" />
          <MiniStatCard title="respiración" subtitle="resp/min" mode="number" value={summary.metrics.respiration} />
        </View>

        <Text style={[styles.sectionTitle, { color: currentTheme.textPrimary }]}>Ejercicios de respiración guiada</Text>
        <Text style={styles.sectionBody}>Te recomendamos realizar ejercicios de respiración a diario e introducirlos en tu rutina.</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={onStartBreathing}><Text style={styles.primaryText}>Iniciar mis ejercicios de respiración</Text></TouchableOpacity>

        <Text style={[styles.sectionTitle, { color: currentTheme.textPrimary }]}>Nuevos hábitos</Text>
        <Text style={styles.sectionDescription}>
          Añade uno de estos hábitos a tu rutina diaria como meta y verás una gran mejora en muy pequeño tiempo
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={130}
          decelerationRate="fast"
          contentContainerStyle={styles.habitsRow}
          pagingEnabled={false}
        >
          {habitCards.map((c, index) => (
            <TouchableOpacity
              key={c.key}
              activeOpacity={0.95}
              onPress={() => setSelectedCard(selectedCard === c.key ? null : c.key)}
              style={[
                { zIndex: selectedCard === c.key ? 100 : index },
                index > 0 && { marginLeft: -50 }
              ]}
            >
              <LinearGradient
                colors={c.gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.habitCard,
                  selectedCard === c.key && styles.habitCardExpanded
                ]}
              >
                <View style={styles.habitHeader}>
                  <View style={[styles.habitIcon, { backgroundColor: c.iconBg }]}>
                    <Text style={styles.habitIconText}>{c.icon}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.habitTitle}>{c.title}</Text>
                    <Text style={styles.habitSub}>{c.subtitle}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#2f3f47" />
                </View>
                <Text style={styles.habitDesc}>{c.desc}</Text>
                <View style={styles.habitActions}>
                  <TouchableOpacity style={styles.circleBtn} onPress={(e) => e.stopPropagation()}>
                    <Ionicons name="add" size={18} color="#2f3f47" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.circleBtn} onPress={(e) => e.stopPropagation()}>
                    <Ionicons name="play" size={16} color="#2f3f47" />
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 18 }}>
          <Text style={[styles.sectionTitle, { color: currentTheme.textPrimary, marginTop: 0 }]}>Sugerencias musicales</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MusicRecommendation', { mood: 'calma' })}>
            <Text style={{ color: currentTheme.primary, fontWeight: '600' }}>Ver todo</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.habitsRow}>
          {music.slice(0, 5).map(p => (
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
  content: { padding: 16, paddingBottom: 150, flexGrow: 1 },
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
  sectionDescription: {
    color: '#6b7280',
    marginTop: 6,
    marginBottom: 4,
    fontSize: 14,
    lineHeight: 20,
  },
  statsRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  miniCard: { flex: 1, borderRadius: 18, padding: 18, backgroundColor: '#EFEFEF' },
  miniTitle: { fontSize: 14, fontWeight: '600' },
  barRow: { flexDirection: 'row', alignItems: 'flex-end', height: 90, gap: 8, marginVertical: 10 },
  bar: { width: 16, borderRadius: 10 },
  miniValue: { fontSize: 16, fontWeight: '700', marginVertical: 4 },
  pulse: { color: '#6b7280' },
  primaryButton: { marginTop: 14, paddingVertical: 12, borderRadius: 24, alignItems: 'center', backgroundColor: '#000' },
  primaryText: { color: '#fff', fontWeight: '700' },
  habitsRow: { paddingVertical: 12, paddingRight: 16 },
  habitCard: {
    width: 180,
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  habitCardExpanded: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
    transform: [{ scale: 1.05 }],
  },
  habitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  habitIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitIconText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  habitTitle: { fontSize: 14, fontWeight: '700', color: '#2f3f47' },
  habitSub: { marginTop: 1, color: '#4a5568', fontSize: 12 },
  habitDesc: {
    marginTop: 6,
    marginBottom: 10,
    color: '#2f3f47',
    fontSize: 12,
    lineHeight: 16,
  },
  habitActions: { flexDirection: 'row', gap: 8, marginTop: 'auto' },
  circleBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.85)', alignItems: 'center', justifyContent: 'center' },
  circleText: { fontSize: 18, fontWeight: '700', color: '#2f3f47' },
});

export default StressScreen;
