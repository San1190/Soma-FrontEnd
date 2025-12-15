import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Animated, PanResponder, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FooterNav from '../components/FooterNav';
import TopBar from '../components/TopBar';
import MiniStatCard from '../components/MiniStatCard';
import HabitUnlockedModal from '../components/HabitUnlockedModal';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import API_BASE_URL from '../constants/api';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

// --- Swipeable Component ---
const SwipeableHabitRow = ({ habit, onComplete, onDelete }) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const scaleDelete = useRef(new Animated.Value(0)).current;

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
        return gestureState.dx > 10 && Math.abs(gestureState.dy) < 10;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx > 0) {
          Animated.event([null, { dx: pan.x }], { useNativeDriver: false })(evt, gestureState);
          if (gestureState.dx > 50) {
            Animated.spring(scaleDelete, { toValue: 1, useNativeDriver: false }).start();
          } else {
            Animated.spring(scaleDelete, { toValue: 0, useNativeDriver: false }).start();
          }
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 100) {
          Animated.spring(pan, { toValue: { x: 80, y: 0 }, useNativeDriver: false }).start();
          Animated.spring(scaleDelete, { toValue: 1, useNativeDriver: false }).start();
        } else {
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

const FatigueScreen = () => {
  const { currentTheme } = useTheme();
  const navigation = useNavigation();
  const { user } = useAuth();
  const [barsEyes, setBarsEyes] = useState([24, 52, 38, 18, 44, 30]);
  const [barsPosture, setBarsPosture] = useState([18, 26, 22, 30, 28, 24]);
  const [migraineRisk, setMigraineRisk] = useState(4.5);
  const [locked, setLocked] = useState(false);

  // Habits State
  const [activeHabits, setActiveHabits] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newHabit, setNewHabit] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const jitter = (arr, factor = 6, min = 8, max = 64) => arr.map(v => {
        const j = Math.round(v + (Math.random() * factor - factor / 2));
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

  useEffect(() => {
    if (user?.id) fetchHabits();
  }, [user]);

  const fetchHabits = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/habits/${user.id}`);
      const fatigueHabits = (res.data || []).filter(h => h.type === 'FATIGUE');
      setActiveHabits(fatigueHabits);
    } catch (e) { console.error("Error fetching habits", e); }
  };

  const handleCreateHabit = async (habitTemplate) => {
    try {
      const payload = {
        userId: user.id,
        title: habitTemplate.title,
        description: habitTemplate.desc,
        type: 'FATIGUE'
      };
      const res = await axios.post(`${API_BASE_URL}/habits`, payload);
      setNewHabit(res.data);
      setModalVisible(true);
      fetchHabits();
    } catch (e) { console.error("Error creating habit", e); }
  };

  const handleCompleteHabit = async (habitId) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/habits/${habitId}/complete`);
      setActiveHabits(prev => prev.map(h => h.id === habitId ? res.data : h));
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
    } catch (e) { console.error(e); }
  };

  const habitCards = [
    { key: 'blink', title: 'Ejercicios de parpadeo', subtitle: 'Diario', desc: 'Rutina breve para lubricar tus ojos.' },
    { key: 'posture', title: 'Chequeo de postura', subtitle: 'Cada hora', desc: 'Pequeñas correcciones posturales.' },
    { key: 'lighting', title: 'Iluminación adecuada', subtitle: 'Semanal', desc: 'Ajustes de entorno para reducir fatiga.' },
  ];

  const availableHabits = habitCards.filter(c => !activeHabits.some(h => h.title === c.title));

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentTheme.background }]}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <TopBar onAvatarPress={() => navigation.navigate('Profile')} variant="lock" active={locked} onToggle={() => setLocked(v => !v)} />
        <Text style={[styles.title, { color: currentTheme.textPrimary }]}>¿Qué tal tu fatiga?</Text>

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

        {/* --- ACTIVE HABITS SECTION --- */}
        {activeHabits.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: '#2f4f40' }]}>Mis Hábitos Activos 🔥</Text>
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
            <Text style={[styles.sectionTitle, { color: '#2f4f40' }]}>Nuevos hábitos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.habitsRow}>
              {availableHabits.map((c) => (
                <View key={c.key} style={styles.habitCard}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.habitTitle}>{c.title}</Text>
                    <Text style={{ color: '#2f4f40' }}>pulsa para leer</Text>
                  </View>
                  <Text style={styles.habitSub}>{c.subtitle}</Text>
                  <Text style={styles.habitDesc}>{c.desc}</Text>
                  <View style={styles.habitActions}>
                    <TouchableOpacity style={styles.circleBtn} onPress={() => handleCreateHabit(c)}><Text style={styles.circleText}>+</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.circleBtn}><Text style={styles.circleText}>{'>'}</Text></TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          </>
        )}
      </ScrollView>
      <FooterNav />
      <HabitUnlockedModal visible={modalVisible} onClose={() => setModalVisible(false)} habit={newHabit} />
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
  sectionBody: { color: '#6b7280', marginTop: 8 },
  statsRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  habitsRow: { paddingVertical: 8 },
  habitCard: { width: 240, marginRight: 12, borderRadius: 16, padding: 16, backgroundColor: '#CFF3C9' },
  habitTitle: { fontSize: 16, fontWeight: '700', color: '#2f4f40' },
  habitSub: { marginTop: 4, color: '#2f4f40' },
  habitDesc: { marginTop: 8, color: '#2f4f40' },
  habitActions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  circleBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  circleText: { fontSize: 18, fontWeight: '700', color: '#2f4f40' },

  // Habits Styles
  swipeContainer: { position: 'relative', marginBottom: 8, justifyContent: 'center' },
  deleteActionContainer: { position: 'absolute', left: 10, width: 50, height: 50, justifyContent: 'center', zIndex: 0 },
  deleteBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#D32F2F', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  activeHabitRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2, zIndex: 1 },
  activeHabitTitle: { fontSize: 16, fontWeight: '700', color: '#2f4f40' },
  activeHabitStreak: { fontSize: 14, color: '#6b7280', marginTop: 2 },
  checkBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#3f6f52', alignItems: 'center', justifyContent: 'center' },
  checkBtnCompleted: { backgroundColor: '#8BC34A', opacity: 0.8 }
});

export default FatigueScreen;
