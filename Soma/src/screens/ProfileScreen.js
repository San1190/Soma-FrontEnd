import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, SafeAreaView } from 'react-native'; // 1. Importar SafeAreaView
import { useAuth } from '../context/AuthContext';
import { getUserById } from '../services/users';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !user.id) {
        // (Tu lógica original aquí...)
        setLoading(false);
        return;
      }
      try {
        const data = await getUserById(user.id);
        setUserData(data);
      } catch (err) {
        setError('Failed to fetch user data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user]);

  const fullName = `${userData?.first_name || user?.first_name || 'Ana'} ${userData?.last_name || user?.last_name || 'Martín'}`.trim();
  const dob = userData?.date_of_birth || '';
  const age = dob ? Math.max(0, Math.floor((Date.now() - new Date(dob).getTime()) / (365.25*24*60*60*1000))) : '—';
  const gender = userData?.gender || '—';

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    // 2. Usar SafeAreaView como contenedor principal para asegurar límites de pantalla
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent} // Aquí aplicaremos el padding interno
        showsVerticalScrollIndicator={true} // Para ver que hay scroll
      >
        
        {/* El Header y el contenido */}
        <View style={styles.headerRow}>
          <View style={styles.avatarBox}>
            <Ionicons name="person" size={30} color="#6c63ff" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.name}>{fullName}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>{gender}</Text>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.metaText}>{age} edad</Text>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.metaText}>{dob || '—'}</Text>
            </View>
          </View>
          <View style={styles.lockTrack}><View style={styles.lockKnob} /><Ionicons name="lock-closed" size={16} color="#fff" /></View>
        </View>

        <Text style={styles.sectionTitle}>Tus hábitos</Text>
        <View style={styles.habitsStack}>
          <View style={[styles.habitCard, styles.habitCardMuted]} />
          <View style={[styles.habitCard, styles.habitCardMuted2]} />
          <View style={[styles.habitCard, styles.habitCardMain]}>
            <Text style={styles.habitTitle}>Revisión digital consciente</Text>
            <Text style={styles.habitSubtitle}>60 días</Text>
            <Text style={styles.habitBody}>Revisa tus mensajes y redes dos o tres veces al día, marcando horarios.</Text>
            <View style={styles.habitActions}>
              <TouchableOpacity style={styles.roundBtn}><Ionicons name="add" size={18} color="#2f4f40" /></TouchableOpacity>
              <View style={{ flex: 1 }} />
              <TouchableOpacity style={styles.arrowBtn}><Ionicons name="arrow-forward" size={18} color="#2f4f40" /></TouchableOpacity>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Datos personales</Text>
        <View style={styles.listGroup}>
          {[
            { label: 'Estadísticas generales actuales', icon: 'stats-chart' },
            { label: 'Evolución total', icon: 'trending-up' },
            { label: 'Historial de hábitos superados', icon: 'checkmark-done' },
            { label: 'Características personales', icon: 'finger-print' },
            { label: 'Documentos médicos', icon: 'document-text' },
          ].map((item, i) => (
            <View key={`pi-${i}`} style={styles.listItem}>
              <View style={styles.listIcon}><Ionicons name={item.icon} size={18} color="#3a2a32" /></View>
              <Text style={styles.listText}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color="#3a2a32" />
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Ajustes</Text>
        <View style={styles.listGroup}>
          {[
            { label: 'Idioma y fecha', icon: 'globe' },
            { label: 'Suscripción a premium', icon: 'star' },
            { label: 'Métodos de pago', icon: 'card' },
            { label: 'Ayuda y contacto', icon: 'help-circle' },
          ].map((item, i) => (
            <View key={`ai-${i}`} style={styles.listItem}>
              <View style={styles.listIcon}><Ionicons name={item.icon} size={18} color="#3a2a32" /></View>
              <Text style={styles.listText}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color="#3a2a32" />
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.premiumCTA}>
          <Text style={styles.premiumText}>Suscribirme a premium</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // 3. Estilos ajustados para el scroll correcto
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8', // El color de fondo va aquí ahora
  },
  scrollView: {
    flex: 1, // Importante para que ocupe todo el espacio disponible
  },
  scrollContent: {
    padding: 16, // El padding visual va DENTRO del contenido, no en el contenedor
    paddingBottom: 100, // Espacio extra al final para que no se corte
    flexGrow: 1,
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  
  // ... El resto de tus estilos se mantienen igual ...
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  avatarBox: { width: 64, height: 64, borderRadius: 12, backgroundColor: '#EFEFEF', alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 22, fontWeight: '800', color: '#111' },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  metaText: { fontSize: 12, color: '#666' },
  metaDot: { marginHorizontal: 6, color: '#999' },
  lockTrack: { width: 48, height: 28, borderRadius: 14, backgroundColor: '#000', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, flexDirection: 'row' },
  lockKnob: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#fff' },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#555', marginTop: 20, marginBottom: 10 },
  habitsStack: { position: 'relative', height: 160 },
  habitCard: { position: 'absolute', left: 0, right: 0, borderRadius: 16, padding: 16 },
  habitCardMuted: { top: 20, backgroundColor: '#e6e6e6' },
  habitCardMuted2: { top: 10, backgroundColor: '#ededed' },
  habitCardMain: { top: 0, backgroundColor: '#EAFBE8' },
  habitTitle: { fontSize: 16, fontWeight: '800', color: '#2f4f40' },
  habitSubtitle: { fontSize: 12, color: '#2f4f40', marginTop: 2 },
  habitBody: { fontSize: 13, color: '#2f4f40', marginTop: 8 },
  habitActions: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  roundBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#cfead1', alignItems: 'center', justifyContent: 'center' },
  arrowBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#cfead1', alignItems: 'center', justifyContent: 'center' },
  listGroup: { backgroundColor: '#f0f0f0', borderRadius: 12, padding: 8 },
  listItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 8 },
  listIcon: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EAE5FF', marginRight: 12 },
  listText: { flex: 1, fontSize: 14, color: '#3a2a32', fontWeight: '600' },
  errorText: { color: 'red', fontSize: 16, textAlign: 'center' },
  premiumCTA: { marginTop: 16, paddingVertical: 14, borderRadius: 24, alignItems: 'center', backgroundColor: '#000', flexDirection: 'row', justifyContent: 'center' },
  premiumText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  logoutButton: { marginTop: 28, paddingVertical: 14, borderRadius: 24, alignItems: 'center', backgroundColor: '#000' },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

export default ProfileScreen;