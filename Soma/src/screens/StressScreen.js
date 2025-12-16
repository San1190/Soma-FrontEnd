import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Animated, PanResponder, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import FooterNav from '../components/FooterNav';
import TopBar from '../components/TopBar';
import MiniStatCard from '../components/MiniStatCard';
import RecommendationBox from '../components/RecommendationBox';
import HabitUnlockedModal from '../components/HabitUnlockedModal';
import BreathingExerciseCard from '../components/BreathingExerciseCard';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import API_BASE_URL from '../constants/api';
import { Ionicons } from '@expo/vector-icons';
import { getSuggestions } from '../services/music';

// --- Swipeable Component ---
const SwipeableHabitRow = ({ habit, onComplete, onDelete }) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const scaleDelete = useRef(new Animated.Value(0)).current;

  // Check if completed today using ISO string parsing
  const isCompletedToday = () => {
    if (!habit.lastCompleted) return false;
    const today = new Date().toDateString();
    const last = new Date(habit.lastCompleted).toDateString();
    return today === last;
  };

  const completed = isCompletedToday();

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only allow horizontal swipe if moving right (positive dx) > 10
        return gestureState.dx > 10 && Math.abs(gestureState.dy) < 10;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx > 0) {
          Animated.event([null, { dx: pan.x }], { useNativeDriver: false })(evt, gestureState);
          // Animate delete button appearance
          if (gestureState.dx > 50) {
            Animated.spring(scaleDelete, { toValue: 1, useNativeDriver: false }).start();
          } else {
            Animated.spring(scaleDelete, { toValue: 0, useNativeDriver: false }).start();
          }
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 100) {
          // Keep open slightly to show icon, or just bounce back?
          // User: "aparezca un boton circular con una papelera y se pueda borrar dandole"
          // Let's keep it open at 80px so the button is clickable
          Animated.spring(pan, { toValue: { x: 80, y: 0 }, useNativeDriver: false }).start();
          Animated.spring(scaleDelete, { toValue: 1, useNativeDriver: false }).start();
        } else {
          // Snap back
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
          Animated.spring(scaleDelete, { toValue: 0, useNativeDriver: false }).start();
        }
      },
    })
  ).current;

  const resetSwipe = () => {
    Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
    Animated.spring(scaleDelete, { toValue: 0, useNativeDriver: false }).start();
  };

  return (
    <View style={styles.swipeContainer}>
      {/* Delete Action Background (Left Side for Right Swipe) */}
      <View style={styles.deleteActionContainer}>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => {
            resetSwipe();
            onDelete(habit.id);
          }}
        >
          <Animated.View style={{ transform: [{ scale: scaleDelete }] }}>
            <Ionicons name="trash" size={20} color="#fff" />
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Foreground Content */}
      <Animated.View
        style={[styles.activeHabitRow, { transform: [{ translateX: pan.x }] }]}
        {...panResponder.panHandlers}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.activeHabitTitle}>{habit.title}</Text>
          <Text style={styles.activeHabitStreak}>
            🔥 {habit.streak} días {completed ? '(Completado hoy)' : ''}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => !completed && onComplete(habit.id)}
          activeOpacity={completed ? 1 : 0.7}
          style={[styles.checkBtn, completed && styles.checkBtnCompleted]}
        >
          <Ionicons name="checkmark" size={20} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};


const StressScreen = () => {
  const { currentTheme } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({ suggestion: 'Prueba el mix en tendencia: Barre', metrics: { hrv: 52, heatVar: 1.2, respiration: 25 }, adviceFor: user?.first_name || 'ti' });
  const [bars, setBars] = useState([24, 52, 38, 18, 44, 30]);
  const [locked, setLocked] = useState(false);
  const [music, setMusic] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);

  // Habits State
  const [activeHabits, setActiveHabits] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newHabit, setNewHabit] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user && user.id) {
          // 1. Fetch Stress Data
          const res = await axios.get(`${API_BASE_URL}/stress/users/${user.id}`);
          const s = res.data || {};
          const suggestion = s.suggestion || summary.suggestion;
          const metrics = s.metrics || summary.metrics;
          setSummary({ suggestion, metrics, adviceFor: s.adviceFor || summary.adviceFor });
          if (Array.isArray(s.indicatorBars)) setBars(s.indicatorBars);

          // 2. Fetch Music
          const mood = 'calma';
          const m = await getSuggestions(mood);
          setMusic(Array.isArray(m) ? m : []);

          // 3. Fetch Active Habits (NEW)
          fetchHabits();
        }
      } catch (e) {
        setError('No se pudo cargar los datos');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const fetchHabits = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/habits/${user.id}`);
      setActiveHabits(res.data || []);
    } catch (e) { console.error("Error fetching habits", e); }
  };

  const handleCreateHabit = async (habitTemplate) => {
    try {
      const payload = {
        userId: user.id,
        title: habitTemplate.title,
        description: habitTemplate.desc,
        type: 'STRESS'
      };
      const res = await axios.post(`${API_BASE_URL}/habits`, payload);
      const createdHabit = res.data;

      // Show Modal
      setNewHabit(createdHabit);
      setModalVisible(true);

      // Refresh List
      fetchHabits();

    } catch (e) {
      console.error("Error creating habit", e);
    }
  };

  const handleCompleteHabit = async (habitId) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/habits/${habitId}/complete`);
      const updatedHabit = res.data;

      // Use Backend Response to update state properly
      setActiveHabits(prev => prev.map(h =>
        h.id === habitId ? updatedHabit : h
      ));
    } catch (e) { console.error(e); }
  };

  const handleDeleteHabit = async (habitId) => {
    try {
      Alert.alert(
        "Eliminar Hábito",
        "¿Estás seguro de que quieres eliminar este hábito?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Eliminar",
            style: "destructive",
            onPress: async () => {
              await axios.delete(`${API_BASE_URL}/habits/${habitId}`);
              setActiveHabits(prev => prev.filter(h => h.id !== habitId));
            }
          }
        ]
      );
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "No se pudo eliminar el hábito. Revisa tu conexión o intenta reiniciar el servidor.");
    }
  };

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

  // Filter out habits that are already active
  const availableHabits = habitCards.filter(c => !activeHabits.some(h => h.title === c.title));

  const onStartBreathing = () => navigation.navigate('GuidedBreathing');

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: currentTheme.background }]}>
        <View style={styles.center}><ActivityIndicator size="large" color="#6b5a66" /></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentTheme.background }]}>
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

        <TouchableOpacity style={styles.askButton} onPress={() => navigation.navigate('Chat')}>
          <Text style={styles.askText}>Pregunta lo que quieras a Somat</Text>
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { color: currentTheme.textPrimary }]}>Todo sobre ti</Text>
        <View style={styles.statsRow}>
          <MiniStatCard title="corazón" subtitle="HRV/min" mode="bars" bars={bars} color="#4b3340" />
          <MiniStatCard title="calor" subtitle="variación/hora" mode="bars" bars={bars.map(h => Math.round(h * 0.8))} color="#6b5a66" />
          <MiniStatCard title="respiración" subtitle="resp/min" mode="number" value={summary.metrics.respiration} />
        </View>

        <BreathingExerciseCard />

        {/* --- ACTIVE HABITS SECTION (NEW) --- */}
        {activeHabits.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: currentTheme.textPrimary }]}>Mis Hábitos Activos 🔥</Text>
            <Text style={[styles.sectionBody, { fontSize: 12, marginBottom: 10 }]}>Desliza a la derecha para eliminar</Text>
            <View style={{ marginTop: 10 }}>
              {activeHabits.map(habit => (
                <SwipeableHabitRow
                  key={habit.id}
                  habit={habit}
                  onComplete={handleCompleteHabit}
                  onDelete={handleDeleteHabit}
                />
              ))}
            </View>
          </>
        )}

        {/* --- SUGGESTED HABITS SECTION --- */}
        {availableHabits.length > 0 && (
          <>
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
              {availableHabits.map((c, index) => (
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
                      <TouchableOpacity
                        style={styles.circleBtn}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleCreateHabit(c);
                        }}
                      >
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
          </>
        )}

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 18 }}>
          <Text style={[styles.sectionTitle, { color: currentTheme.textPrimary, marginTop: 0 }]}>Sugerencias musicales</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MusicRecommendation', { mood: 'calma' })}>
            <Text style={{ color: currentTheme.primary, fontWeight: '600' }}>Ver todo</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.habitsRow}>
          {music.slice(0, 5).map((p, index) => (
            <RecommendationBox key={(p.id ? `${p.id}-${index}` : `${index}`)} title={p.name} imageUrl={p.imageUrl} owner={p.owner} url={p.url} />
          ))}
        </ScrollView>
      </ScrollView>
      <FooterNav />
      {/* Modal */}
      <HabitUnlockedModal visible={modalVisible} onClose={() => setModalVisible(false)} habit={newHabit} />
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
    height: 180,
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

  // New Styles
  swipeContainer: {
    position: 'relative',
    marginBottom: 8,
    justifyContent: 'center',
  },
  deleteActionContainer: {
    position: 'absolute',
    left: 10,
    width: 50,
    height: 50,
    justifyContent: 'center',
    zIndex: 0,
  },
  deleteBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D32F2F', // Red
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  activeHabitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    zIndex: 1, // On top of delete btn
  },
  activeHabitTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2f3f47'
  },
  activeHabitStreak: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2
  },
  checkBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4b3340',
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkBtnCompleted: {
    backgroundColor: '#8BC34A', // Green
    opacity: 0.8
  }
});

export default StressScreen;
