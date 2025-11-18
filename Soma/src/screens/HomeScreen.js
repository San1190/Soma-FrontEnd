import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import API_BASE_URL from '../constants/api';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
  const { currentTheme } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('boton');
  const [colorOn, setColorOn] = useState(true);
  const [waterCount, setWaterCount] = useState(0);
  const [waterGoal, setWaterGoal] = useState(8);
  const [activeMode, setActiveMode] = useState('stress');
  const [stressBars, setStressBars] = useState([20,40,60,80,100]);
  const [sleepBars, setSleepBars] = useState([30,45,55,70,60]);
  const [stressLevelText, setStressLevelText] = useState('Elevado');
  const [sleepDeltaText, setSleepDeltaText] = useState('16% mejor');
  const name = user?.first_name || 'Ana';
  const dateStr = new Date().toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });

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
      const start48 = new Date(end.getTime() - 48*60*60*1000);
      try {
        const fmt = (d) => d.toISOString();
        const res = await axios.get(`${API_BASE_URL}/data/range/${uid}?start=${fmt(start48)}&end=${fmt(end)}`);
        const list = Array.isArray(res.data) ? res.data : [];
        const last24Cut = new Date(end.getTime() - 24*60*60*1000);
        const last24 = list.filter(x => new Date(x.timestamp) >= last24Cut);
        const prev24 = list.filter(x => new Date(x.timestamp) < last24Cut);
        const stressVals = last24.map(x => x.stress_level).filter(v => v != null);
        const hrvValsLast = last24.map(x => x.hrv_ms).filter(v => v != null);
        const hrvValsPrev = prev24.map(x => x.hrv_ms).filter(v => v != null);
        const avg = (arr) => arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : 0;
        const sAvg = avg(stressVals);
        setStressLevelText(sAvg >= 7 ? 'Elevado' : (sAvg >= 4 ? 'Moderado' : 'Bajo'));
        const pickBars = (vals, n=5) => {
          if (!vals.length) return [20,35,50,65,80];
          const step = Math.max(1, Math.floor(vals.length / n));
          const sel = [];
          for (let i=0;i<n;i++) sel.push(vals[Math.min(vals.length-1, i*step)]);
          const min = Math.min(...sel);
          const max = Math.max(...sel);
          return sel.map(v => {
            const norm = max===min ? 0.6 : (v-min)/(max-min);
            return Math.round(24 + norm*46);
          });
        };
        setStressBars(pickBars(stressVals.length ? stressVals : [2,4,6,7,8]));
        setSleepBars(pickBars(hrvValsLast.length ? hrvValsLast : [30,40,50,60,55]));
        const lastAvg = avg(hrvValsLast);
        const prevAvg = avg(hrvValsPrev);
        if (prevAvg > 0) {
          const delta = Math.round(((lastAvg - prevAvg) / prevAvg) * 100);
          setSleepDeltaText(`${Math.abs(delta)}% ${delta>=0 ? 'mejor' : 'peor'}`);
        } else {
          setSleepDeltaText('—');
        }
      } catch {}
    };
    loadActivity();
  }, [activeTab, user?.id]);
  
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: appBg }]}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        
        {/* --- Inicio del Contenido --- */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.avatar}><Ionicons name="person" size={20} color={currentTheme.textPrimary} /></TouchableOpacity>
        <View style={{ flexDirection:'row', alignItems:'center', gap:8 }}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={{ width:32, height:32, borderRadius:16, alignItems:'center', justifyContent:'center', backgroundColor:'rgba(0,0,0,0.08)' }}>
            <Ionicons name="settings-outline" size={18} color={currentTheme.textPrimary} />
          </TouchableOpacity>
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
            { key: 'boton', label: 'Botón soma' },
            { key: 'espejo', label: 'Espejo somático' },
            { key: 'hidratacion', label: 'Hidratación' },
            { key: 'actividad', label: 'Actividad' },
          ].map(p => (
            <TouchableOpacity key={p.key} style={[styles.pill, activeTab === p.key && [styles.pillActive, { backgroundColor: '#000' }]]} onPress={() => setActiveTab(p.key)}>
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
          <View style={[styles.cardElevated, { backgroundColor: colorOn ? (activeMode==='insomnio' ? '#DDEAF1' : activeMode==='fatigue' ? '#CFF3C9' : '#CFC4E9') : '#EFEFEF', borderColor: colorOn ? (activeMode==='insomnio' ? '#DDEAF1' : activeMode==='fatigue' ? '#CFF3C9' : '#CFC4E9') : '#EFEFEF' }]}>
            <Text style={[styles.hydraTitle, { color: colorOn ? (activeMode==='insomnio' ? '#2f3f47' : activeMode==='fatigue' ? '#2f4f40' : '#3a2a32') : '#5b5b5b' }]}>¿Has llegado a tu objetivo de hoy? :)</Text>
            <View style={styles.hydraRingWrap}>
              <View style={styles.hydraRingBase} />
              <View style={styles.hydraRingInner} />
              <View style={styles.hydraDotSmall1} />
              <View style={styles.hydraDotSmall2} />
              <View style={styles.hydraDotSmall3} />
              <View style={styles.hydraBubble1} />
              <View style={styles.hydraBubble2} />
              <View style={styles.hydraBubble3} />
            </View>
            <View style={styles.counterRow}
            >
              <TouchableOpacity style={styles.hydraBtnCircle} onPress={() => setWaterCount(c => c + 1)}><Text style={styles.counterSymbol}>+</Text></TouchableOpacity>
              <Text style={[styles.hydraLabel, { color: colorOn ? (activeMode==='insomnio' ? '#2f3f47' : activeMode==='fatigue' ? '#2f4f40' : '#3a2a32') : '#5b5b5b' }]}>vaso de agua (250 ml)</Text>
              <TouchableOpacity style={styles.hydraBtnCircle} onPress={() => setWaterCount(c => Math.max(0, c - 1))}><Text style={styles.counterSymbol}>-</Text></TouchableOpacity>
            </View>
            <TouchableOpacity style={[styles.hydraCTA, { backgroundColor: colorOn ? (activeMode==='insomnio' ? '#5f7f92' : activeMode==='fatigue' ? '#3f6f52' : '#6b5a66') : '#7a7a7a' }]}><Text style={styles.hydraCTAText}>personaliza tu objetivo</Text></TouchableOpacity>
         </View>
        )}

        {/* --- Contenido Tab: Actividad --- */}
      {activeTab === 'actividad' && (
        <View style={[styles.cardElevated, styles.cardWide, { backgroundColor: currentTheme.cardBackground, borderColor: currentTheme.borderColor }]}>
          <View style={styles.statsRow}>
            <View style={[styles.miniCard, { backgroundColor: colorOn ? (activeMode==='insomnio' ? '#DDEAF1' : activeMode==='fatigue' ? '#CFF3C9' : '#CFC4E9') : '#EFEFEF' }]}>
              <Text style={[styles.miniTitle, { color: colorOn ? (activeMode==='insomnio' ? '#2f3f47' : activeMode==='fatigue' ? '#2f4f40' : '#3a2a32') : '#5b5b5b' }]}>Indicador del estrés</Text>
              <View style={styles.barRow}>
                {stressBars.map((h, i) => (
                  <View key={`sbar-${i}`} style={[styles.bar, { height: h, backgroundColor: colorOn ? (activeMode==='insomnio' ? '#5f7f92' : activeMode==='fatigue' ? '#3f6f52' : '#4b3340') : '#B0B0B0' }]} />
                ))}
              </View>
              <Text style={[styles.miniValue, { color: colorOn ? (activeMode==='insomnio' ? '#2f3f47' : activeMode==='fatigue' ? '#2f4f40' : '#3a2a32') : '#5b5b5b' }]}>{stressLevelText}</Text>
              <Text style={{ color: colorOn ? '#5a4e55' : '#7a7a7a' }}>pulsa para leer</Text>
            </View>
            <View style={[styles.miniCard, { backgroundColor: colorOn ? (activeMode==='insomnio' ? '#DDEAF1' : activeMode==='fatigue' ? '#CFF3C9' : '#C9D8D3') : '#EFEFEF' }]}>
              <Text style={[styles.miniTitle, { color: colorOn ? (activeMode==='insomnio' ? '#2f3f47' : activeMode==='fatigue' ? '#2f4f40' : '#2f3f47') : '#5b5b5b' }]}>Calidad del sueño</Text>
              <View style={styles.barRow}>
                {sleepBars.map((h, i) => (
                  <View key={`slbar-${i}`} style={[styles.bar, { height: h, backgroundColor: colorOn ? (activeMode==='insomnio' ? '#5f7f92' : activeMode==='fatigue' ? '#3f6f52' : '#5f7f92') : '#B0B0B0' }]} />
                ))}
              </View>
              <Text style={[styles.miniValue, { color: colorOn ? (activeMode==='insomnio' ? '#2f3f47' : activeMode==='fatigue' ? '#2f4f40' : '#2f3f47') : '#5b5b5b' }]}>{sleepDeltaText}</Text>
              <Text style={{ color: colorOn ? '#617a86' : '#7a7a7a' }}>pulsa para leer</Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.btnLarge, { backgroundColor: '#000' }]}><Text style={styles.btnLargeText}>más información para ti</Text></TouchableOpacity>
        </View>
      )}

      </ScrollView> 
      {/* --- FIN DEL SCROLLVIEW --- */}
      
      {/* --- INICIO DEL FOOTER (FIJO) --- */}
      <View style={styles.footerPlaceholder}>
        <View style={styles.footerIcons}>
          <TouchableOpacity onPress={() => setActiveTab('boton')}><Ionicons name="home" size={22} color="#fff" /></TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('hidratacion')}><Ionicons name="time" size={22} color="#fff" /></TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('actividad')}><Ionicons name="heart" size={22} color="#fff" /></TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('boton')}><Ionicons name="moon" size={22} color="#fff" /></TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('espejo')}><Ionicons name="eye" size={22} color="#fff" /></TouchableOpacity>
        </View>
      </View>
      
      {/* --- GATO (FIJO) --- */}
      <View style={styles.catArea}>
        <Text style={styles.zz}>Z Z</Text>
        <Image source={catImgSource} style={styles.catImg} resizeMode='contain' />
      </View>
      
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
  hydraBubble1: { position: 'absolute', left: 26, top: 100, width: 42, height: 42, borderRadius: 21, backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  hydraBubble2: { position: 'absolute', right: 24, top: 56, width: 34, height: 34, borderRadius: 17, backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  hydraBubble3: { position: 'absolute', right: 52, bottom: 22, width: 26, height: 26, borderRadius: 13, backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  hydraDotSmall1: { position: 'absolute', left: 90, top: 20, width: 10, height: 10, borderRadius: 5, backgroundColor: '#EAE5FF' },
  hydraDotSmall2: { position: 'absolute', left: 118, top: 18, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EAE5FF' },
  hydraDotSmall3: { position: 'absolute', left: 76, top: 28, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EAE5FF' },
  counterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  hydraBtnCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E2D9F6', alignItems: 'center', justifyContent: 'center' },
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
  
  // Estilos del Footer Fijo
  footerPlaceholder: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, backgroundColor: '#000', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingTop: 12, zIndex: 100 },
  footerIcons: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '86%', alignSelf: 'center', paddingBottom: Platform.OS === 'ios' ? 12 : 6 },

  // --- 👇 CAMBIOS EN LOS ESTILOS DEL GATO ---
  catArea: { position: 'absolute', bottom: 88, left: 0, right: 0, alignItems: 'center', pointerEvents: 'none', zIndex: 101 },
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

  badgeMuted: { opacity: 0.5 }, // Este estilo no se usa ahora, pero lo dejo por si acaso
});