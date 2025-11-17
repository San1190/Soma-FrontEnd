import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
  const { currentTheme } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('boton');
  const [isPrivate, setIsPrivate] = useState(true);
  const [waterCount, setWaterCount] = useState(0);
  const [waterGoal, setWaterGoal] = useState(8);
  const name = user?.first_name || 'Ana';
  const dateStr = new Date().toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentTheme.background }] }>
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topBar}>
        <View style={styles.avatar}><Ionicons name="person" size={20} color={currentTheme.textPrimary} /></View>
        <TouchableOpacity style={[styles.lock, isPrivate ? styles.lockOn : styles.lockOff]} onPress={() => setIsPrivate(v => !v)}>
          <Ionicons name="lock-closed" size={16} color={isPrivate ? '#fff' : currentTheme.textPrimary} />
        </TouchableOpacity>
      </View>
      <Text style={[styles.date, { color: currentTheme.textSecondary }]}>{dateStr}</Text>
      <Text style={[styles.title, { color: currentTheme.textPrimary }]}>¡Hola {name}! Veamos cómo va tu día</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsRow}>
        {[
          { key: 'boton', label: 'Botón soma' },
          { key: 'espejo', label: 'Espejo somático' },
          { key: 'hidratacion', label: 'Hidratación' },
          { key: 'actividad', label: 'Actividad' },
        ].map(p => (
          <TouchableOpacity key={p.key} style={[styles.pill, activeTab === p.key && [styles.pillActive, { backgroundColor: currentTheme.primary }]]} onPress={() => setActiveTab(p.key)}>
            <Text style={[styles.pillText, { color: activeTab === p.key ? '#071220' : currentTheme.textPrimary }]}>{p.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {activeTab === 'boton' && (
        <View style={[styles.cardElevated, { backgroundColor: currentTheme.cardBackground, borderColor: currentTheme.borderColor }]}>
          <Text style={[styles.cardTitle, { color: currentTheme.textPrimary }]}>Todo listo para iniciar la transmisión</Text>
          <Text style={[styles.bigNumber, { color: currentTheme.textPrimary }]}>100%</Text>
          <Text style={{ color: currentTheme.textSecondary }}>Somatiza tu dispositivo en un click y descubre todos los datos relevantes sobre tu salud</Text>
          <TouchableOpacity style={[styles.btnLarge, { backgroundColor: '#000' }]}><Text style={styles.btnLargeText}>Activar conexión con wearable</Text></TouchableOpacity>
        </View>
      )}

      {activeTab === 'espejo' && (
        <View style={[styles.cardElevated, { backgroundColor: currentTheme.cardBackground, borderColor: currentTheme.borderColor }]}>
          <Text style={[styles.cardTitle, { color: currentTheme.textPrimary }]}>Activa el botón de arriba a la derecha</Text>
          <View style={styles.badgesRow}>
            <View style={[styles.badge, { backgroundColor: '#CFC4E9' }]}><Text style={styles.badgeText}>Estrés</Text></View>
            <View style={[styles.badge, { backgroundColor: '#CFF3C9' }]}><Text style={styles.badgeText}>Fatiga</Text></View>
            <View style={[styles.badge, { backgroundColor: '#708A99' }]}><Text style={[styles.badgeText, { color: '#fff' }]}>Insomnio</Text></View>
          </View>
          <Text style={{ color: currentTheme.textSecondary }}>Los colores de la interfaz de Soma cambian en función de los parámetros que tienes más alterados si utilizas el Espejo Somático</Text>
        </View>
      )}

      {activeTab === 'hidratacion' && (
        <View style={[styles.cardElevated, { backgroundColor: currentTheme.cardBackground, borderColor: currentTheme.borderColor }]}>
          <Text style={[styles.cardTitle, { color: currentTheme.textPrimary }]}>¿Has llegado a tu objetivo de hoy?</Text>
          <View style={styles.ringContainer}>
            <View style={styles.ringOuter}><View style={[styles.ringFill, { width: `${Math.min(100, Math.round((waterCount / waterGoal) * 100))}%` }]} /></View>
          </View>
          <View style={styles.counterRow}>
            <TouchableOpacity style={styles.counterBtn} onPress={() => setWaterCount(c => c + 1)}><Text style={styles.counterSymbol}>+</Text></TouchableOpacity>
            <Text style={[styles.counterLabel, { color: currentTheme.textPrimary }]}>vaso de agua (250 ml)</Text>
            <TouchableOpacity style={styles.counterBtn} onPress={() => setWaterCount(c => Math.max(0, c - 1))}><Text style={styles.counterSymbol}>-</Text></TouchableOpacity>
          </View>
          <TouchableOpacity style={[styles.btnLarge, { backgroundColor: '#000' }]}><Text style={styles.btnLargeText}>personaliza tu objetivo</Text></TouchableOpacity>
        </View>
      )}

      {activeTab === 'actividad' && (
        <View style={[styles.cardElevated, { backgroundColor: currentTheme.cardBackground, borderColor: currentTheme.borderColor }]}>
          <View style={styles.statsRow}>
            <View style={[styles.miniCard, { backgroundColor: '#EAE5FF' }]}>
              <Text style={[styles.miniTitle, { color: currentTheme.textPrimary }]}>Indicador del estrés</Text>
              <Text style={[styles.miniValue, { color: currentTheme.textPrimary }]}>Elevado</Text>
              <Text style={{ color: currentTheme.textSecondary }}>pulsa para leer</Text>
            </View>
            <View style={[styles.miniCard, { backgroundColor: '#DDEAF1' }]}>
              <Text style={[styles.miniTitle, { color: currentTheme.textPrimary }]}>Calidad del sueño</Text>
              <Text style={[styles.miniValue, { color: currentTheme.textPrimary }]}>16% mejor</Text>
              <Text style={{ color: currentTheme.textSecondary }}>pulsa para leer</Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.btnLarge, { backgroundColor: '#000' }]}><Text style={styles.btnLargeText}>más información para ti</Text></TouchableOpacity>
        </View>
      )}

      
    </ScrollView>
    <View style={styles.footerPlaceholder}>
        <View style={styles.footerIcons}>
          <TouchableOpacity onPress={() => setActiveTab('boton')}><Ionicons name="home" size={22} color="#fff" /></TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('hidratacion')}><Ionicons name="time" size={22} color="#fff" /></TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('actividad')}><Ionicons name="heart" size={22} color="#fff" /></TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('boton')}><Ionicons name="moon" size={22} color="#fff" /></TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('espejo')}><Ionicons name="eye" size={22} color="#fff" /></TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, ...(Platform.OS === 'web' ? { minHeight: '100vh' } : {}) },
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 160, paddingTop: Platform.OS === 'ios' ? 8 : 0 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  avatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.06)' },
  lock: { width: 48, height: 24, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  lockOn: { backgroundColor: '#000' },
  lockOff: { backgroundColor: 'rgba(0,0,0,0.08)' },
  date: { marginTop: 8, fontSize: 12 },
  title: { marginTop: 6, fontSize: 24, fontWeight: '700' },
  pillsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  pill: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 16, marginRight: 8, backgroundColor: 'rgba(0,0,0,0.06)' },
  pillActive: {},
  pillText: { fontSize: 12, fontWeight: '600' },
  cardElevated: { borderRadius: 16, padding: 16, marginTop: 12, borderWidth: 1, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 3, maxWidth: 380, alignSelf: 'center' },
  cardTitle: { fontSize: 16, marginBottom: 8 },
  bigNumber: { fontSize: 48, fontWeight: '800', marginVertical: 8 },
  btnLarge: { marginTop: 12, paddingVertical: 12, borderRadius: 24, alignItems: 'center' },
  btnLargeText: { color: '#fff', fontWeight: '700' },
  badgesRow: { flexDirection: 'row', gap: 8, marginVertical: 8 },
  badge: { borderRadius: 16, paddingVertical: 8, paddingHorizontal: 12 },
  badgeText: { color: '#071220', fontWeight: '600' },
  ringContainer: { alignItems: 'center', marginVertical: 8 },
  ringOuter: { width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(0,0,0,0.06)', overflow: 'hidden', alignItems: 'flex-start', justifyContent: 'center' },
  ringFill: { height: 180, backgroundColor: '#000' },
  counterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  counterBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.08)', alignItems: 'center', justifyContent: 'center' },
  counterSymbol: { fontSize: 18, fontWeight: '700' },
  counterLabel: { fontSize: 14 },
  statsRow: { flexDirection: 'row', gap: 12 },
  miniCard: { flex: 1, borderRadius: 16, padding: 12 },
  miniTitle: { fontSize: 14, fontWeight: '600' },
  miniValue: { fontSize: 18, fontWeight: '700', marginVertical: 6 },
  footerPlaceholder: { position: Platform.OS === 'web' ? 'fixed' : 'absolute', bottom: 0, left: 0, right: 0, height: 100, backgroundColor: '#000', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingTop: 12, zIndex: 100, width: Platform.OS === 'web' ? '100%' : undefined },
  footerIcons: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '86%', alignSelf: 'center', paddingBottom: Platform.OS === 'ios' ? 12 : 6 },
});
