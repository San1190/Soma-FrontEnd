import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Image, PanResponder } from 'react-native';
import { LineChart, PieChart } from 'react-native-gifted-charts';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import FooterNav from '../components/FooterNav';
import axios from 'axios';
import API_BASE_URL from '../constants/api';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ route }) {
  const { currentTheme } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [activeTab, setActiveTab] = useState(route?.params?.tab || 'actividad');
  const selectTab = (tab) => {
    setActiveTab(tab);
    navigation.setParams({ tab });
  };
  const [colorOn, setColorOn] = useState(true);
  const [waterCount, setWaterCount] = useState(0);
  const [waterGoal, setWaterGoal] = useState(8);
  const glassSizeMl = 250;
  const [ringPan, setRingPan] = useState(null);
  const [prevLoggedCount, setPrevLoggedCount] = useState(0);
  const arcStartDeg = -60;
  const arcSweepDeg = 300;
  const [activeMode, setActiveMode] = useState('stress');
  const hydraAccent = '#4b3340';
  const hydraSoft = '#EAE5FF';
  const [stressBars, setStressBars] = useState([20, 40, 60, 80, 100]);
  const [sleepBars, setSleepBars] = useState([30, 45, 55, 70, 60]);
  const [insomniaBars, setInsomniaBars] = useState([26, 34, 28, 40, 32, 24]);
  const [fatiguePts, setFatiguePts] = useState([22, 28, 34, 40, 48, 54]);
  const [stressLevelText, setStressLevelText] = useState('Elevado');
  const [sleepDeltaText, setSleepDeltaText] = useState('16% mejor');
  const [activityStats, setActivityStats] = useState({ energy: 2013, idealPct: 90, distanceKm: 3.0, reps: 450 });
  const dateStr = React.useMemo(() => new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }), []);
  const name = user?.first_name || 'Ana';

  const palette = {
    off: { appBg: '#EFEFEF' },
    stress: { appBg: '#EAE5FF' },
    fatigue: { appBg: '#EAFBE8' },
    insomnio: { appBg: '#DDEAF1' },
  };
  const appBg = !colorOn ? palette.off.appBg : palette[activeMode]?.appBg || palette.stress.appBg;

  const cats = {
    off: require('../../assets/gatos/GatoApagado.png'),
    stress: require('../../assets/gatos/GatoMorado.png'),
    fatigue: require('../../assets/gatos/GatoVerde.png'),
    insomnio: require('../../assets/gatos/GatoAzul.png'),
  };
  const catImgSource = colorOn ? (cats[activeMode] || cats.stress) : cats.off;

  React.useEffect(() => {
    const loadActivity = async () => {
      if (activeTab !== 'actividad') return;
      const uid = user?.id || 1;
      const end = new Date();
      const start48 = new Date(end.getTime() - 48 * 60 * 60 * 1000);
      try {
        const fmt = (d) => d.toISOString();
        const res = await axios.get(`${API_BASE_URL}/data/range/${uid}?start=${fmt(start48)}&end=${fmt(end)}`);
        const list = Array.isArray(res.data) ? res.data : [];
        const last24Cut = new Date(end.getTime() - 24 * 60 * 60 * 1000);
        const last24 = list.filter(x => new Date(x.timestamp) >= last24Cut);
        const prev24 = list.filter(x => new Date(x.timestamp) < last24Cut);
        const stressVals = last24.map(x => x.stress_level).filter(v => v != null);
        const hrvValsLast = last24.map(x => x.hrv_ms).filter(v => v != null);
        const hrvValsPrev = prev24.map(x => x.hrv_ms).filter(v => v != null);
        const avg = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
        const sAvg = avg(stressVals);
        setStressLevelText(sAvg >= 7 ? 'Elevado' : (sAvg >= 4 ? 'Moderado' : 'Bajo'));
        const pickBars = (vals, n = 5) => {
          if (!vals.length) return [20, 35, 50, 65, 80];
          const step = Math.max(1, Math.floor(vals.length / n));
          const sel = [];
          for (let i = 0; i < n; i++) sel.push(vals[Math.min(vals.length - 1, i * step)]);
          const min = Math.min(...sel);
          const max = Math.max(...sel);
          return sel.map(v => {
            const norm = max === min ? 0.6 : (v - min) / (max - min);
            return Math.round(24 + norm * 46);
          });
        };
        setStressBars(pickBars(stressVals.length ? stressVals : [2, 4, 6, 7, 8]));
        setSleepBars(pickBars(hrvValsLast.length ? hrvValsLast : [30, 40, 50, 60, 55]));
        const lastAvg = avg(hrvValsLast);
        const prevAvg = avg(hrvValsPrev);
        if (prevAvg > 0) {
          const delta = Math.round(((lastAvg - prevAvg) / prevAvg) * 100);
          setSleepDeltaText(`${Math.abs(delta)}% ${delta >= 0 ? 'mejor' : 'peor'}`);
        } else {
          setSleepDeltaText('—');
        }
      } catch { }
    };
    loadActivity();
  }, [activeTab, user?.id]);

  React.useEffect(() => {
    if (activeTab !== 'actividad') return;
    const id = setInterval(() => {
      setInsomniaBars(prev => prev.map(v => Math.max(18, Math.min(64, v + Math.round(Math.random() * 6 - 3)))));
      setFatiguePts(prev => prev.map((v, i) => Math.max(16, Math.min(64, v + (i % 2 === 0 ? 1 : -1)))));
      setActivityStats(s => ({
        energy: Math.max(1800, Math.min(2600, s.energy + Math.round(Math.random() * 30 - 15))),
        idealPct: Math.max(60, Math.min(99, s.idealPct + Math.round(Math.random() * 4 - 2))),
        distanceKm: Math.max(1, Math.min(12, Math.round((s.distanceKm + (Math.random() * 0.3 - 0.15)) * 10) / 10)),
        reps: Math.max(200, Math.min(1200, s.reps + Math.round(Math.random() * 20 - 10)))
      }));
    }, 2500);
    return () => clearInterval(id);
  }, [activeTab]);

  React.useEffect(() => {
    const t = route?.params?.tab;
    if (t && t !== activeTab) setActiveTab(t);
  }, [route?.params?.tab]);

  React.useEffect(() => {
    const userId = user?.id;
    const loadHydration = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(`${API_BASE_URL}/hydration/needs`, { params: { userId } });
        const needs = Number(res.data?.dailyNeedsMl || 2000);
        const goal = Math.max(1, Math.round(needs / glassSizeMl));
        setWaterGoal(goal);
      } catch { }
    };
    if (activeTab === 'hidratacion') loadHydration();
  }, [activeTab, user?.id]);

  React.useEffect(() => {
    const stepDeg = 360 / Math.max(1, waterGoal);
    const responder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt) => {
        const x = evt.nativeEvent.locationX - 100; // centro de 200x200
        const y = evt.nativeEvent.locationY - 100;
        const ang = Math.atan2(y, x) * 180 / Math.PI;
        const degAbs = ang < 0 ? ang + 360 : ang;
        let rel = degAbs - arcStartDeg;
        while (rel < 0) rel += 360;
        if (rel > arcSweepDeg) rel = arcSweepDeg;
        const count = Math.min(waterGoal, Math.max(0, Math.round(rel / (arcSweepDeg / Math.max(1, waterGoal)))));
        setWaterCount(count);
      },
      onPanResponderRelease: () => {
        const delta = waterCount - prevLoggedCount;
        if (delta !== 0) {
          const uid = user?.id || 1;
          axios.post(`${API_BASE_URL}/hydration/log`, null, { params: { userId: uid, amountMl: delta * glassSizeMl } }).catch(() => { });
          setPrevLoggedCount(waterCount);
        }
      },
    });
    setRingPan(responder);
  }, [waterGoal, waterCount, prevLoggedCount, user?.id]);
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: appBg }]}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        {/* --- Inicio del Contenido --- */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.avatar}><Ionicons name="person" size={20} color={currentTheme.textPrimary} /></TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity style={[styles.toggleTrack, colorOn ? styles.toggleOn : styles.toggleOff]} onPress={() => setColorOn(v => !v)}>
              <View style={[styles.toggleKnob, colorOn ? styles.knobRight : styles.knobLeft]}>
                <Ionicons name="person" size={16} color={colorOn ? '#000' : '#000'} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={[styles.date, { color: currentTheme.textSecondary }]}>{dateStr}</Text>
        <Text style={[styles.title, { color: currentTheme.textPrimary }]}>¡Hola {name}! Veamos cómo va tu día</Text>

        {/* --- Píldoras de Navegación --- */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsRow}>
          {[
            { key: 'actividad', label: 'Actividad' },
            { key: 'boton', label: 'Botón soma' },
            { key: 'espejo', label: 'Espejo somático' },
            { key: 'hidratacion', label: 'Hidratación' },
          ].map(p => (
            <TouchableOpacity key={p.key} style={[styles.pill, activeTab === p.key && [styles.pillActive, { backgroundColor: '#000' }]]} onPress={() => selectTab(p.key)}>
              <Text style={[styles.pillText, { color: activeTab === p.key ? '#fff' : currentTheme.textPrimary }]}>{p.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* --- Contenido Tab: Botón --- */}
        {activeTab === 'boton' && (
          <View style={[styles.cardElevated, { backgroundColor: currentTheme.cardBackground, borderColor: currentTheme.borderColor }]}>
            <Text style={[styles.cardTitle, { color: currentTheme.textPrimary }]}>Todo listo para iniciar la transmisión</Text>
            <Text style={[styles.bigNumber, { color: currentTheme.textPrimary }]}>100%</Text>
            <Text style={{ color: currentTheme.textSecondary }}>Somatiza tu dispositivo en un click y descubre todos los datos relevantes sobre tu salud</Text>
            <TouchableOpacity style={[styles.btnLarge, { backgroundColor: '#000' }]}><Text style={styles.btnLargeText}>Activar conexión con wearable</Text></TouchableOpacity>
          </View>
        )}

        {/* --- Contenido Tab: Espejo (Como en la imagen) --- */}
        {/* --- 👇 CAMBIO AQUÍ (JSX) --- */}
        {activeTab === 'espejo' && (
          <View style={styles.cardMuted}>
            <Text style={[styles.cardTitleMuted, { color: currentTheme.textPrimary }]}>Activa el botón de arriba a la derecha</Text>
            <Text style={styles.mutedBody}>Los colores de la interfaz de Soma cambian en función de los parámetros que tienes más alterados si utilizas el Espejo Somático</Text>
            <View style={styles.chipsCanvas}>

              {/* Estrés */}
              <TouchableOpacity onPress={() => setActiveMode('stress')} style={[
                styles.badge,
                styles.badgeShadow,
                styles.badgeStress, // Estilo base (posición, color, rotación)
                !colorOn && { backgroundColor: '#DADADA', transform: [{ rotate: '0deg' }] } // Estilo "apagado"
              ]}>
                <Text style={[styles.badgeText, colorOn ? styles.badgeTextLight : styles.badgeTextGray]}>Estrés</Text>
              </TouchableOpacity>

              {/* Fatiga */}
              <TouchableOpacity onPress={() => setActiveMode('fatigue')} style={[
                styles.badge,
                styles.badgeShadow,
                styles.badgeFatigue, // Estilo base
                !colorOn && { backgroundColor: '#DADADA', transform: [{ rotate: '0deg' }] } // Estilo "apagado"
              ]}>
                <Text style={[styles.badgeText, !colorOn && styles.badgeTextGray]}>Fatiga</Text>
              </TouchableOpacity>

              {/* Insomnio */}
              <TouchableOpacity onPress={() => setActiveMode('insomnio')} style={[
                styles.badge,
                styles.badgeShadow,
                styles.badgeInsomnio, // Estilo base
                !colorOn && { backgroundColor: '#DADADA', transform: [{ rotate: '0deg' }] } // Estilo "apagado"
              ]}>
                <Text style={[styles.badgeText, colorOn ? styles.badgeTextLight : styles.badgeTextGray]}>Insomnio</Text>
              </TouchableOpacity>

            </View>
          </View>
        )}
        {/* --- 👆 FIN DEL CAMBIO (JSX) --- */}


        {/* --- Contenido Tab: Hidratación --- */}
        {activeTab === 'hidratacion' && (
          <View style={[styles.cardElevated, { backgroundColor: colorOn ? (activeMode === 'insomnio' ? '#DDEAF1' : activeMode === 'fatigue' ? '#CFF3C9' : '#CFC4E9') : '#EFEFEF', borderColor: colorOn ? (activeMode === 'insomnio' ? '#DDEAF1' : activeMode === 'fatigue' ? '#CFF3C9' : '#CFC4E9') : '#EFEFEF' }]}>
            <Text style={[styles.hydraTitle, { color: colorOn ? (activeMode === 'insomnio' ? '#2f3f47' : activeMode === 'fatigue' ? '#2f4f40' : '#3a2a32') : '#5b5b5b' }]}>Mi hidratación de hoy</Text>
            <View style={styles.hydraRingWrap} {...(ringPan ? ringPan.panHandlers : {})}>
              <View style={styles.hydraRingBase} />
              <View style={styles.hydraRingInner} />
              {(() => {
                const r = 86;
                const total = 96;
                const filledCount = Math.round((waterCount / Math.max(1, waterGoal)) * total);
                const segs = [];
                for (let i = 0; i < total; i++) {
                  const deg = arcStartDeg + (i * (arcSweepDeg / total));
                  const rad = deg * Math.PI / 180;
                  const cx = 100 + r * Math.cos(rad) - 8;
                  const cy = 100 + r * Math.sin(rad) - 2;
                  const filled = i <= filledCount;
                  segs.push(
                    <View key={`halo-${i}`} style={[styles.hydraHaloSeg, { left: cx, top: cy, backgroundColor: filled ? hydraAccent : 'transparent', transform: [{ rotate: `${deg + 90}deg` }] }]} />
                  );
                }
                return segs;
              })()}
              {(() => {
                const r = 86;
                const deg = arcStartDeg + Math.min(arcSweepDeg, waterCount * (arcSweepDeg / Math.max(1, waterGoal)));
                const rad = deg * Math.PI / 180;
                const cx = 100 + r * Math.cos(rad) - 10;
                const cy = 100 + r * Math.sin(rad) - 10;
                return <View style={[styles.hydraHandle, { left: cx, top: cy, backgroundColor: hydraAccent }]}><View style={styles.hydraHandleInner} /></View>;
              })()}
            </View>
            <View style={styles.counterRow}>
              <TouchableOpacity style={[styles.hydraBtnCircle, { backgroundColor: hydraSoft }]} onPress={() => {
                const next = Math.min(waterGoal, waterCount + 1);
                const delta = next - waterCount;
                if (delta !== 0) {
                  const uid = user?.id || 1;
                  axios.post(`${API_BASE_URL}/hydration/log`, null, { params: { userId: uid, amountMl: delta * glassSizeMl } }).catch(() => { });
                  setPrevLoggedCount(next);
                }
                setWaterCount(next);
              }}>
                <Ionicons name="add" size={20} color={hydraAccent} />
              </TouchableOpacity>
              <Text style={[styles.hydraLabel, { color: colorOn ? (activeMode === 'insomnio' ? '#2f3f47' : activeMode === 'fatigue' ? '#2f4f40' : '#3a2a32') : '#5b5b5b' }]}>vaso de agua (250 ml)</Text>
              <TouchableOpacity style={[styles.hydraBtnCircle, { backgroundColor: hydraSoft }]} onPress={() => {
                const next = Math.max(0, waterCount - 1);
                const delta = next - waterCount;
                if (delta !== 0) {
                  const uid = user?.id || 1;
                  axios.post(`${API_BASE_URL}/hydration/log`, null, { params: { userId: uid, amountMl: delta * glassSizeMl } }).catch(() => { });
                  setPrevLoggedCount(next);
                }
                setWaterCount(next);
              }}>
                <Ionicons name="remove" size={20} color={hydraAccent} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={[styles.hydraCTA, { backgroundColor: colorOn ? (activeMode === 'insomnio' ? '#5f7f92' : activeMode === 'fatigue' ? '#3f6f52' : '#6b5a66') : '#7a7a7a' }]}><Text style={styles.hydraCTAText}>personaliza tu objetivo</Text></TouchableOpacity>
          </View>
        )}

        {/* --- Contenido Tab: Actividad --- */}
        {/* --- Contenido Tab: Actividad (NUEVO DISEÑO) --- */}
        {activeTab === 'actividad' && (
          <View style={styles.activityContainer}>
            <View style={styles.chartsRow}>
              {/* Card Estrés */}
              <View style={[styles.chartCard, styles.cardStress]}>
                <Text style={styles.chartTitle}>Indicador del estrés</Text>
                <View style={styles.barChartContainer}>
                  {stressBars.map((h, i) => (
                    <View key={`sbar-${i}`} style={[styles.chartBar, { height: h * 0.6, backgroundColor: '#4b3340' }]} />
                  ))}
                </View>
                <Text style={styles.chartValue}>Elevado</Text>
                <Text style={styles.chartSub}>pulse para leer</Text>
              </View>

              {/* Card Sueño */}
              <View style={[styles.chartCard, styles.cardSleep]}>
                <Text style={styles.chartTitle}>Calidad del sueño</Text>
                <View style={styles.barChartContainer}>
                  {sleepBars.map((h, i) => (
                    <View key={`slbar-${i}`} style={[styles.chartBar, { height: h * 0.6, backgroundColor: '#5f7f92' }]} />
                  ))}
                </View>
                <Text style={styles.chartValue}>{sleepDeltaText}</Text>
                <Text style={styles.chartSub}>pulse para leer</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.moreInfoBtn}>
              <Text style={styles.moreInfoText}>más información para ti</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
      {/* --- FIN DEL SCROLLVIEW --- */}

      {/* --- INICIO DEL FOOTER (FIJO) --- */}
      {isFocused && (
        <FooterNav />
      )}

      {/* --- GATO (FIJO) --- */}
      {isFocused && (
        <View style={styles.catArea}>
          {!colorOn && <Text style={styles.zz}>ZZ</Text>}
          <Image source={catImgSource} style={styles.catImg} resizeMode='contain' />
        </View>
      )}

    </SafeAreaView>
  );
}

// --- HOJA DE ESTILOS COMPLETA ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, ...(Platform.OS === 'web' ? { minHeight: '100vh' } : {}) },
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 420, paddingTop: Platform.OS === 'ios' ? 8 : 0 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  avatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.06)' },
  lock: { width: 48, height: 24, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  lockOn: { backgroundColor: '#000' },
  lockOff: { backgroundColor: 'rgba(0,0,0,0.08)' },
  toggleTrack: { width: 78, height: 32, borderRadius: 16, backgroundColor: '#000', justifyContent: 'center', paddingHorizontal: 4, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 3 },
  toggleOn: { backgroundColor: '#000' },
  toggleOff: { backgroundColor: '#E6E6E6' },
  toggleKnob: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  knobLeft: { alignSelf: 'flex-start' },
  knobRight: { alignSelf: 'flex-end' },
  date: { marginTop: 8, fontSize: 12 },
  title: { marginTop: 6, fontSize: 24, fontWeight: '700' },
  pillsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  pill: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 16, marginRight: 8, backgroundColor: 'rgba(0,0,0,0.06)' },
  pillActive: {},
  pillText: { fontSize: 12, fontWeight: '600' },
  cardElevated: { borderRadius: 16, padding: 16, marginTop: 12, borderWidth: 1, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 3, maxWidth: 380, alignSelf: 'center' },
  cardWide: { maxWidth: undefined, width: '100%', alignSelf: 'stretch', marginHorizontal: -8 },
  cardTitle: { fontSize: 16, marginBottom: 8 },

  // Estilos de la tarjeta "Espejo Somático"
  cardMuted: { borderRadius: 20, padding: 16, marginTop: 12, backgroundColor: '#EFEFEF', maxWidth: 380, alignSelf: 'center', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 6 }, elevation: 4 },
  cardTitleMuted: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
  mutedBody: { color: '#6b7280', fontSize: 15 },
  chipsCanvas: { position: 'relative', height: 120, marginTop: 10 },

  bigNumber: { fontSize: 48, fontWeight: '800', marginVertical: 8 },
  btnLarge: { marginTop: 12, paddingVertical: 12, borderRadius: 24, alignItems: 'center' },
  btnLargeText: { color: '#fff', fontWeight: '700' },

  // Estilos de las "Badges" o "Chips"
  badgesRow: { flexDirection: 'row', gap: 8, marginVertical: 8 },
  badge: { borderRadius: 16, paddingVertical: 8, paddingHorizontal: 14 },
  badgeShadow: { shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  badgeText: { color: '#071220', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 },
  badgeTextLight: { color: '#fff' },
  badgeTextGray: { color: '#404040' }, // Se mantiene este
  badgeStress: { position: 'absolute', left: 12, bottom: 8, backgroundColor: '#4b3340', transform: [{ rotate: '-12deg' }] },
  badgeFatigue: { position: 'absolute', right: 18, top: 4, backgroundColor: '#CFF3C9', transform: [{ rotate: '9deg' }] },
  badgeInsomnio: { position: 'absolute', left: '40%', bottom: 0, backgroundColor: '#5f7f92', transform: [{ rotate: '-6deg' }] },
  // ELIMINADO: badgeGray (era el que causaba el bug de amontonamiento)

  // Estilos de Hidratación
  hydraCard: { backgroundColor: '#CFC4E9', borderColor: '#CFC4E9' },
  hydraTitle: { fontSize: 16, fontWeight: '700', color: '#3a2a32' },
  hydraRingWrap: { alignSelf: 'center', width: 200, height: 200, marginVertical: 10, position: 'relative' },
  hydraRingBase: { width: 200, height: 200, borderRadius: 100, borderWidth: 14, borderColor: '#EAE5FF' },
  hydraRingInner: { position: 'absolute', left: 28, top: 28, width: 144, height: 144, borderRadius: 72, backgroundColor: '#CFC4E9' },
  hydraHaloSeg: { position: 'absolute', width: 16, height: 6, borderRadius: 3 },
  hydraSegDot: { position: 'absolute', width: 14, height: 14, borderRadius: 7 },
  hydraHandle: { position: 'absolute', width: 22, height: 22, borderRadius: 11, backgroundColor: '#4b3340', borderWidth: 2, borderColor: '#fff', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  hydraHandleInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
  hydraOverlayBtn: { position: 'absolute', width: 28, height: 28, borderRadius: 14, backgroundColor: '#EAE5FF', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  hydraBubble1: { position: 'absolute', left: 26, top: 100, width: 42, height: 42, borderRadius: 21, backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  hydraBubble2: { position: 'absolute', right: 24, top: 56, width: 34, height: 34, borderRadius: 17, backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  hydraBubble3: { position: 'absolute', right: 52, bottom: 22, width: 26, height: 26, borderRadius: 13, backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  hydraDotSmall1: { position: 'absolute', left: 90, top: 20, width: 10, height: 10, borderRadius: 5, backgroundColor: '#EAE5FF' },
  hydraDotSmall2: { position: 'absolute', left: 118, top: 18, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EAE5FF' },
  hydraDotSmall3: { position: 'absolute', left: 76, top: 28, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EAE5FF' },
  counterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  hydraBtnCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  counterSymbol: { fontSize: 18, fontWeight: '700' },
  counterLabel: { fontSize: 14 },
  hydraLabel: { fontSize: 14, color: '#3a2a32' },
  hydraCTA: { marginTop: 14, paddingVertical: 12, borderRadius: 22, alignItems: 'center', backgroundColor: '#6b5a66' },
  hydraCTAText: { color: '#fff', fontWeight: '700' },

  // Estilos de Actividad
  statsRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 4 },
  miniCard: { flex: 1, borderRadius: 18, padding: 18, overflow: 'hidden', minHeight: 180 },
  miniTitle: { fontSize: 14, fontWeight: '600' },
  miniValue: { fontSize: 18, fontWeight: '700', marginVertical: 6 },
  barRow: { flexDirection: 'row', alignItems: 'flex-end', height: 100, gap: 10, marginVertical: 10, paddingHorizontal: 8 },
  bar: { width: 18, borderRadius: 10 },
  trendWrap: { height: 100, position: 'relative', marginTop: 8 },
  trendPoint: { position: 'absolute', width: 10, height: 10, borderRadius: 5, backgroundColor: '#3f6f52' },
  trendLine: { position: 'absolute', height: 4, backgroundColor: '#3f6f52', borderRadius: 2 },
  smallStatsRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  smallStatCard: { flex: 1, backgroundColor: '#EFEFEF', borderRadius: 12, padding: 12 },
  smallStatTitle: { fontSize: 12, color: '#2f3f47' },
  smallStatValue: { fontSize: 16, fontWeight: '700', color: '#2f3f47', marginTop: 4 },
  miniBars: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginTop: 8 },
  miniBar: { width: 10, borderRadius: 6, backgroundColor: '#bdbdbd' },
  activityItemRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E5E5E5', borderRadius: 16, padding: 12, marginTop: 8 },
  activityLabel: { fontSize: 14, color: '#4a4a4a' },
  activityValue: { fontSize: 20, fontWeight: '700', color: '#1a1a1a', marginTop: 4 },
  miniBarsGrey: { flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  miniBarGrey: { width: 10, borderRadius: 6, backgroundColor: '#b5b5b5' },
  donutWrap: { width: 60, alignItems: 'center', justifyContent: 'center' },
  circleBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  circleText: { fontSize: 16, fontWeight: '700', color: '#1a1a1a' },

  // Estilos del Footer Fijo
  footerPlaceholder: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, backgroundColor: '#000', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingTop: 12, zIndex: 100 },
  footerIcons: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '86%', alignSelf: 'center', paddingBottom: Platform.OS === 'ios' ? 12 : 6 },

  // --- 👇 CAMBIOS EN LOS ESTILOS DEL GATO ---
  catArea: { position: 'absolute', bottom: 88, left: 0, right: 0, alignItems: 'center', pointerEvents: 'none', zIndex: -1 },
  zz: {
    position: 'absolute',
    right: 80, // Ajustado
    bottom: 140, // Ajustado
    color: '#000',
    opacity: 0.4,
    fontWeight: '700',
    fontSize: 22, // Añadido
    transform: [{ rotate: '15deg' }] // Añadido
  },
  catImg: { width: 360, height: 220 },
  // --- 👆 FIN DE CAMBIOS DEL GATO ---

  badgeMuted: { opacity: 0.5 },

  // New Activity Styles
  activityContainer: {
    backgroundColor: '#CFF3C9', // Light green background
    borderRadius: 24,
    padding: 16,
    marginTop: 12,
  },
  chartsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  chartCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 220,
  },
  cardStress: {
    backgroundColor: '#BFAEE3', // Purple
  },
  cardSleep: {
    backgroundColor: '#DDEAF1', // Light Blue/Teal
  },
  chartTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 10,
  },
  barChartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    height: 80,
    marginBottom: 10,
  },
  chartBar: {
    width: 12,
    borderRadius: 6,
  },
  chartValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  chartSub: {
    fontSize: 10,
    color: '#4a4a4a',
  },
  moreInfoBtn: {
    backgroundColor: '#2F4F40', // Dark green
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  moreInfoText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
