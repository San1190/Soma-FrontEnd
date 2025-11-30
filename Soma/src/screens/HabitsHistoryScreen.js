import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { answerAssessment, completeHabit } from '../services/habits';

export default function HabitsHistoryScreen() {
  const { user } = useAuth();
  const [lockOn, setLockOn] = useState(true);
  const [answers, setAnswers] = useState({});

  const categories = [
    {
      key: 'stress',
      title: 'Hábitos anti estrés digital',
      accent: '#b6a9ff',
      cardBg: '#e9e3ff',
      habits: [
        {
          id: 1,
          name: 'Consumo digital consciente',
          days: 30,
          desc: 'Deja de seguir a cuentas que te generan ruido, angustia o que no te aportan nada',
          tint: '#c9c0ff',
        },
      ],
    },
    {
      key: 'insomnia',
      title: 'Hábitos anti insomnio',
      accent: '#8fd0ff',
      cardBg: '#e7f6ff',
      habits: [
        {
          id: 2,
          name: 'Apaga la mente',
          days: 14,
          desc: 'Pequeños rituales nocturnos para reducir el ruido mental antes de dormir',
          tint: '#cfefff',
        },
      ],
    },
    {
      key: 'fatigue',
      title: 'Hábitos anti fatiga visual',
      accent: '#9ae5b0',
      cardBg: '#eaf9ef',
      habits: [
        {
          id: 3,
          name: 'Ambiente visual',
          days: 28,
          desc: 'Utiliza un ambiente suave, nunca trabajes a oscuras y ten la pantalla limpia y clara',
          tint: '#d5f4dc',
        },
      ],
    },
  ];

  const setAnswer = async (habitId, q, val) => {
    setAnswers((prev) => ({ ...prev, [habitId + ':' + q]: val }));
    try {
      if (user?.id) {
        await answerAssessment(user.id, habitId, q, val);
      }
    } catch {}
  };

  const markCompleted = async (habitId) => {
    try {
      if (user?.id) {
        await completeHabit(user.id, habitId);
      }
    } catch {}
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={["#e7f0f4", "#ffffff"]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.headerBg}>
        <View style={styles.topBar}>
          <View style={styles.avatar}><Ionicons name="person" size={18} color="#1a1a1a" /></View>
          <TouchableOpacity onPress={() => setLockOn(!lockOn)}>
            <View style={[styles.lockTrack, lockOn ? styles.lockOn : styles.lockOff]}>
              <View style={[styles.lockKnob, lockOn ? styles.knobRight : styles.knobLeft]} />
              <Ionicons name={lockOn ? 'lock-closed' : 'lock-open'} size={14} color={lockOn ? '#fff' : '#1a1a1a'} />
            </View>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Hábitos superados</Text>
        <Text style={styles.subtitle}>Revisa los hábitos que has completado con éxito y cuéntanos cuáles has implementado en tu día a día</Text>
        <TouchableOpacity style={styles.btnPrimary}><Text style={styles.btnPrimaryText}>Pide nuevos hábitos a Soma</Text></TouchableOpacity>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        {categories.map((cat) => (
          <View key={cat.key} style={styles.sectionWrap}>
            <View style={[styles.sectionBadge, { backgroundColor: cat.accent }]} />
            <Text style={styles.sectionTitle}>{cat.title}</Text>

            <View style={styles.stackArea}>
              <View style={[styles.stackCard, { transform: [{ scale: 0.92 }], top: 30 }]} />
              <View style={[styles.stackCard, { transform: [{ scale: 0.96 }], top: 15 }]} />
              <LinearGradient colors={[cat.cardBg, '#ffffff']} style={styles.mainCard}>
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.habitTitle}>{cat.habits[0].name}</Text>
                    <View style={styles.chipsRow}>
                      <View style={[styles.chip, { backgroundColor: cat.accent }]}><Text style={styles.chipText}>{cat.habits[0].days} días</Text></View>
                    </View>
                  </View>
                  <View style={styles.actionsRow}>
                    <TouchableOpacity style={styles.circleBtn}><Ionicons name="remove" size={18} color="#2f3f47" /></TouchableOpacity>
                    <TouchableOpacity style={styles.circleBtn}><Ionicons name="add" size={18} color="#2f3f47" /></TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.habitDesc}>{cat.habits[0].desc}</Text>
                <View style={styles.cardFooter}>
                  <TouchableOpacity onPress={() => markCompleted(cat.habits[0].id)} style={styles.circleBtn}><Ionicons name="chevron-forward" size={18} color="#2f3f47" /></TouchableOpacity>
                </View>
              </LinearGradient>
            </View>

            <View style={styles.testBox}>
              <View style={styles.testHeader}>
                <Text style={styles.testTitle}>Test para conocerte mejor</Text>
                <Text style={styles.testProgress}>1/6</Text>
              </View>
              <Text style={styles.testQuestion}>¿Has aplicado este hábito a tu vida diaria?</Text>
              <View style={styles.testActions}>
                <TouchableOpacity onPress={() => setAnswer(cat.habits[0].id, 'q1', true)} style={[styles.btnSmall, answers[cat.habits[0].id+':q1']===true && styles.btnSmallActive]}>
                  <Text style={[styles.btnSmallText, answers[cat.habits[0].id+':q1']===true && styles.btnSmallTextActive]}>Sí</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setAnswer(cat.habits[0].id, 'q1', false)} style={[styles.btnSmall, answers[cat.habits[0].id+':q1']===false && styles.btnSmallActive]}>
                  <Text style={[styles.btnSmallText, answers[cat.habits[0].id+':q1']===false && styles.btnSmallTextActive]}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex:1, backgroundColor:'#f8fafb', ...(Platform.OS === 'web' ? { minHeight: '100vh' } : {}) },
  headerBg: { paddingHorizontal:16, paddingTop: 12, paddingBottom: 20 },
  content: { padding:16, paddingBottom: 120 },
  topBar: { flexDirection: 'row', justifyContent:'space-between', alignItems:'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems:'center', justifyContent:'center', backgroundColor:'#ffffff', shadowColor:'#000', shadowOpacity:0.08, shadowRadius:8, shadowOffset:{ width:0, height:4 }, elevation:2 },
  lockTrack: { width: 84, height: 34, borderRadius:17, justifyContent:'center', paddingHorizontal:5, shadowColor:'#000', shadowOpacity:0.2, shadowRadius:6, shadowOffset:{ width:0, height:3 }, elevation:3 },
  lockOn: { backgroundColor:'#000' },
  lockOff: { backgroundColor:'#E6E6E6' },
  lockKnob: { width:28, height:28, borderRadius:14, backgroundColor:'#fff' },
  knobLeft: { alignSelf:'flex-start' },
  knobRight: { alignSelf:'flex-end' },
  title: { fontSize:26, fontWeight:'800', marginTop:12, color:'#111' },
  subtitle: { fontSize:14, color:'#4b5563', marginTop:6, lineHeight:20 },
  btnPrimary: { marginTop:14, backgroundColor:'#111', borderRadius:16, paddingVertical:12, alignItems:'center', shadowColor:'#000', shadowOpacity:0.18, shadowRadius:8, shadowOffset:{ width:0, height:6 }, elevation:3 },
  btnPrimaryText: { color:'#fff', fontWeight:'700' },
  sectionWrap: { marginTop: 28 },
  sectionBadge: { width: 8, height: 8, borderRadius: 4, marginBottom: 8 },
  sectionTitle: { fontSize:18, fontWeight:'800', color:'#1f2937' },
  stackArea: { height: 190, marginTop: 10 },
  stackCard: { position:'absolute', left:0, right:0, height:140, borderRadius:22, backgroundColor:'#eef1f4' },
  mainCard: { position:'absolute', left:0, right:0, height:170, borderRadius:22, padding:18, shadowColor:'#000', shadowOpacity:0.08, shadowRadius:10, shadowOffset:{ width:0, height:8 }, elevation:4 },
  cardHeader: { flexDirection:'row', alignItems:'center' },
  habitTitle: { fontSize:18, fontWeight:'800', color:'#111827' },
  chipsRow: { flexDirection:'row', gap:8, marginTop:6 },
  chip: { paddingHorizontal:10, paddingVertical:6, borderRadius:12 },
  chipText: { fontSize:12, fontWeight:'700', color:'#1f2937' },
  actionsRow: { flexDirection:'row', gap:10, marginLeft:10 },
  habitDesc: { fontSize:13, marginTop:10, lineHeight:19, color:'#374151' },
  cardFooter: { flexDirection:'row', justifyContent:'flex-end', marginTop:12 },
  circleBtn: { width:36, height:36, borderRadius:18, backgroundColor:'#fff', alignItems:'center', justifyContent:'center', shadowColor:'#000', shadowOpacity:0.12, shadowRadius:8, shadowOffset:{ width:0, height:6 }, elevation:3 },
  testBox: { backgroundColor:'#fff', borderRadius:18, padding:18, borderWidth:1, borderColor:'#e9eef2', marginTop:14, shadowColor:'#000', shadowOpacity:0.06, shadowRadius:8, shadowOffset:{ width:0, height:4 }, elevation:2 },
  testHeader: { flexDirection:'row', justifyContent:'space-between', alignItems:'baseline' },
  testTitle: { fontSize:15, fontWeight:'800', color:'#111827' },
  testProgress: { fontSize:12, color:'#6b7280' },
  testQuestion: { fontSize:14, color:'#111827', marginTop:12 },
  testActions: { flexDirection:'row', gap:12, marginTop:12 },
  btnSmall: { backgroundColor:'#e5e7eb', borderRadius:14, paddingVertical:10, paddingHorizontal:18 },
  btnSmallText: { color:'#111827', fontWeight:'700' },
  btnSmallActive: { backgroundColor:'#111' },
  btnSmallTextActive: { color:'#fff' },
});
