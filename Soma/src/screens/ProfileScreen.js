import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';
import InfoModal from '../components/InfoModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { getUserById } from '../services/users';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addHabitModalVisible, setAddHabitModalVisible] = useState(false);
  const [habitDetailsModalVisible, setHabitDetailsModalVisible] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !user.id) {
        setLoading(false);
        return;
      }
      try {
        const data = await getUserById(user.id);
        setUserData(data);
      } catch (err) {
        setError('No se pudo cargar la información del usuario.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres salir?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Salir",
          style: "destructive",
          onPress: async () => {
            await logout();
          }
        }
      ]
    );
  };

  const fullName = `${userData?.first_name || user?.first_name || 'Usuario'} ${userData?.last_name || user?.last_name || ''}`.trim();
  const dob = userData?.date_of_birth || '';
  const age = dob ? Math.floor((new Date() - new Date(dob).getTime()) / 3.15576e+10) + ' años' : 'Edad sin definir';
  const gender = userData?.gender || 'Género sin definir';

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6c63ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        {...(Platform.OS === 'web' ? { style: { height: '100vh', overflowY: 'auto' } } : {})}
      >
        {/* --- ENCABEZADO DEL PERFIL --- */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.getParent()?.navigate('Home')}>
            <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <View style={styles.avatarBox}>
            <Ionicons name="person" size={30} color="#6c63ff" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.name}>{fullName}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>{gender}</Text>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.metaText}>{age}</Text>
            </View>
          </View>
          <View style={styles.lockTrack}>
            <View style={styles.lockKnob} />
            <Ionicons name="lock-closed" size={14} color="#fff" />
          </View>
        </View>

        {/* --- SECCIÓN HÁBITOS --- */}
        <Text style={styles.sectionTitle}>Tus hábitos</Text>
        <View style={styles.habitsStack}>
          <View style={[styles.habitCard, styles.habitCardBg2]} />
          <View style={[styles.habitCard, styles.habitCardBg1]} />
          <View style={[styles.habitCard, styles.habitCardMain]}>
            <View style={styles.habitHeader}>
              <Text style={styles.habitTitle}>Revisión digital consciente</Text>
              <Text style={styles.habitSubtitle}>Racha: 5 días</Text>
            </View>
            <Text style={styles.habitBody}>
              Revisa tus mensajes y redes de forma consciente para reducir el estrés digital.
            </Text>
            <View style={styles.habitActions}>
              <TouchableOpacity style={styles.iconButton} onPress={() => setAddHabitModalVisible(true)}>
                <Ionicons name="add" size={20} color="#2f4f40" />
              </TouchableOpacity>
              <View style={{ flex: 1 }} />
              <TouchableOpacity style={styles.iconButton} onPress={() => setHabitDetailsModalVisible(true)}>
                <Ionicons name="arrow-forward" size={20} color="#2f4f40" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* --- SECCIÓN DATOS PERSONALES --- */}
        <Text style={styles.sectionTitle}>Datos personales</Text>
        <View style={styles.listGroup}>
          <ListItem icon="calendar" text="Resumen diario" onPress={() => navigation.navigate('DailySummary')} />
          <ListItem icon="stats-chart" text="Estadísticas generales" onPress={() => navigation.navigate('Stats')} />
          <ListItem icon="trending-up" text="Evolución total" onPress={() => navigation.navigate('Evolution')} />
          <ListItem icon="checkmark-done" text="Historial de hábitos" onPress={() => navigation.navigate('HabitsHistory')} />
          <ListItem icon="finger-print" text="Características personales" onPress={() => navigation.navigate('PersonalTraits')} />
          <ListItem icon="document-text" text="Documentos médicos" onPress={() => navigation.navigate('MedicalDocuments')} />
        </View>

        {/* --- SECCIÓN AJUSTES --- */}
        <Text style={styles.sectionTitle}>Ajustes</Text>
        <View style={styles.listGroup}>
          <ListItem icon="globe" text="Idioma y región" onPress={() => navigation.navigate('LocaleRegion')} />
          <ListItem icon="star" text="Suscripción Premium" onPress={() => navigation.navigate('PremiumSubscription')} />
          <ListItem icon="card" text="Métodos de pago" onPress={() => navigation.navigate('PaymentMethods')} />
          <ListItem icon="help-circle" text="Ayuda y contacto" onPress={() => navigation.navigate('HelpContact')} />
        </View>

        {/* --- BOTONES DE ACCIÓN --- */}
        <TouchableOpacity style={styles.premiumButton} onPress={() => navigation.navigate('PremiumSubscription')}>
          <Text style={styles.premiumButtonText}>Pasar a Premium</Text>
          <Ionicons name="diamond-outline" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
          <Ionicons name="log-out-outline" size={20} color="#ff4444" style={{ marginLeft: 8 }} />
        </TouchableOpacity>

        <Text style={styles.versionText}>Versión 1.0.2 - SOMA</Text>

      </ScrollView>

      <InfoModal
        visible={addHabitModalVisible}
        onClose={() => setAddHabitModalVisible(false)}
        icon="add-circle"
        title="Añadir Hábito"
        description="Puedes añadir más hábitos personalizados desde la sección de hábitos en la pantalla principal. Selecciona entre nuestras recomendaciones o crea tus propios hábitos."
      />

      <InfoModal
        visible={habitDetailsModalVisible}
        onClose={() => setHabitDetailsModalVisible(false)}
        icon="checkmark-done"
        title="Historial de Hábitos"
        description="Accede a tu historial completo de hábitos para ver tu progreso, rachas y estadísticas detalladas. Mantén tu motivación alta revisando tus logros."
        buttonText="Ver Historial"
      />
    </SafeAreaView>
  );
};

const ListItem = ({ icon, text, onPress }) => (
  <TouchableOpacity style={styles.listItem} onPress={onPress}>
    <View style={styles.listIconBox}>
      <Ionicons name={icon} size={20} color="#3a2a32" />
    </View>
    <Text style={styles.listText}>{text}</Text>
    <Ionicons name="chevron-forward" size={20} color="#ccc" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    ...(Platform.OS === 'web' ? { minHeight: '100vh' } : {}),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 220,
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  avatarBox: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: '#e0e0ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  userInfo: { flex: 1 },
  name: { fontSize: 20, fontWeight: '800', color: '#1a1a1a', marginBottom: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  metaText: { fontSize: 13, color: '#666', fontWeight: '500' },
  metaDot: { marginHorizontal: 6, color: '#ccc' },
  lockTrack: {
    width: 50,
    height: 28,
    backgroundColor: '#000',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    justifyContent: 'space-between',
  },
  lockKnob: { width: 20, height: 20, backgroundColor: '#fff', borderRadius: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 15, marginTop: 10 },
  habitsStack: { height: 180, marginBottom: 20, position: 'relative' },
  habitCard: { position: 'absolute', width: '100%', borderRadius: 20 },
  habitCardBg2: { height: 140, top: 20, backgroundColor: '#e8e8e8', transform: [{ scale: 0.92 }] },
  habitCardBg1: { height: 140, top: 10, backgroundColor: '#f0f0f0', transform: [{ scale: 0.96 }] },
  habitCardMain: {
    backgroundColor: '#eafbe8',
    padding: 20,
    height: 160,
    top: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    justifyContent: 'space-between',
  },
  habitHeader: { marginBottom: 5 },
  habitTitle: { fontSize: 16, fontWeight: '700', color: '#2f4f40' },
  habitSubtitle: { fontSize: 12, color: '#5a7a6a', marginTop: 2 },
  habitBody: { fontSize: 13, color: '#4a6a5a', lineHeight: 18 },
  habitActions: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { width: 36, height: 36, backgroundColor: '#d0ebd6', borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  listGroup: { backgroundColor: '#fff', borderRadius: 16, padding: 5, marginBottom: 25, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 2 },
  listItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  listIconBox: { width: 32, height: 32, backgroundColor: '#f5f5f5', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  listText: { flex: 1, fontSize: 15, color: '#333', fontWeight: '500' },
  premiumButton: { backgroundColor: '#000', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 16, borderRadius: 25, marginBottom: 15 },
  premiumButtonText: { color: '#fff', fontSize: 16, fontWeight: '600', marginRight: 8 },
  logoutButton: { backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 16, borderRadius: 25, borderWidth: 1, borderColor: '#ffebee' },
  logoutButtonText: { color: '#ff4444', fontSize: 16, fontWeight: '600' },
  versionText: { textAlign: 'center', color: '#ccc', fontSize: 12, marginTop: 20 },
});

export default ProfileScreen;
