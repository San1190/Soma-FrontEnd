import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import InfoModal from '../components/InfoModal';

export default function PersonalTraitsScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [traits, setTraits] = useState({
    morningPerson: true,
    exerciseLover: false,
    stressManagement: true,
    socialBattery: false,
  });

  const toggleTrait = (key) => {
    setTraits(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <View style={styles.header}>
            <Ionicons name="finger-print" size={22} color="#3a2a32" />
            <Text style={styles.title}>Características personales</Text>
          </View>
          <TouchableOpacity style={styles.infoBtn} onPress={() => setModalVisible(true)}>
            <Ionicons name="information-circle-outline" size={24} color="#6c63ff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.desc}>Configura tus preferencias y rasgos para una experiencia más personalizada.</Text>

        {/* Personality Traits */}
        <Text style={styles.sectionTitle}>Personalidad</Text>
        <View style={styles.traitCard}>
          <View style={styles.traitIcon}>
            <Ionicons name="sunny" size={24} color="#ffd43b" />
          </View>
          <View style={styles.traitInfo}>
            <Text style={styles.traitTitle}>Persona de mañana</Text>
            <Text style={styles.traitDesc}>Más activo en horas tempranas</Text>
          </View>
          <Switch
            value={traits.morningPerson}
            onValueChange={() => toggleTrait('morningPerson')}
            trackColor={{ false: '#ccc', true: '#6c63ff' }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.traitCard}>
          <View style={styles.traitIcon}>
            <Ionicons name="fitness" size={24} color="#51cf66" />
          </View>
          <View style={styles.traitInfo}>
            <Text style={styles.traitTitle}>Amante del ejercicio</Text>
            <Text style={styles.traitDesc}>Disfruta de actividad física regular</Text>
          </View>
          <Switch
            value={traits.exerciseLover}
            onValueChange={() => toggleTrait('exerciseLover')}
            trackColor={{ false: '#ccc', true: '#6c63ff' }}
            thumbColor="#fff"
          />
        </View>

        {/* Wellness Preferences */}
        <Text style={styles.sectionTitle}>Bienestar</Text>
        <View style={styles.traitCard}>
          <View style={styles.traitIcon}>
            <Ionicons name="leaf" size={24} color="#4dabf7" />
          </View>
          <View style={styles.traitInfo}>
            <Text style={styles.traitTitle}>Gestión del estrés</Text>
            <Text style={styles.traitDesc}>Prioridad en manejo del estrés</Text>
          </View>
          <Switch
            value={traits.stressManagement}
            onValueChange={() => toggleTrait('stressManagement')}
            trackColor={{ false: '#ccc', true: '#6c63ff' }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.traitCard}>
          <View style={styles.traitIcon}>
            <Ionicons name="people" size={24} color="#ff6b6b" />
          </View>
          <View style={styles.traitInfo}>
            <Text style={styles.traitTitle}>Batería social alta</Text>
            <Text style={styles.traitDesc}>Disfruta de interacción social frecuente</Text>
          </View>
          <Switch
            value={traits.socialBattery}
            onValueChange={() => toggleTrait('socialBattery')}
            trackColor={{ false: '#ccc', true: '#6c63ff' }}
            thumbColor="#fff"
          />
        </View>

        {/* Preferences */}
        <Text style={styles.sectionTitle}>Preferencias</Text>
        <TouchableOpacity style={styles.prefCard}>
          <Ionicons name="notifications-outline" size={24} color="#6c63ff" />
          <View style={styles.prefInfo}>
            <Text style={styles.prefTitle}>Notificaciones</Text>
            <Text style={styles.prefDesc}>Horarios preferidos</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.prefCard}>
          <Ionicons name="color-palette-outline" size={24} color="#ff6b6b" />
          <View style={styles.prefInfo}>
            <Text style={styles.prefTitle}>Tema visual</Text>
            <Text style={styles.prefDesc}>Estilo de interfaz</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.prefCard}>
          <Ionicons name="language-outline" size={24} color="#51cf66" />
          <View style={styles.prefInfo}>
            <Text style={styles.prefTitle}>Idioma de contenido</Text>
            <Text style={styles.prefDesc}>Español</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </ScrollView>

      <InfoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        icon="finger-print"
        title="Características Personales"
        description="Configura tus rasgos de personalidad y preferencias para que Soma adapte la experiencia a tu estilo de vida. Ajusta horarios, notificaciones y preferencias visuales. Esta función estará disponible próximamente."
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8f9fa' },
  container: { flex: 1, padding: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, justifyContent: 'space-between' },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  infoBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', flex: 1, marginLeft: 12 },
  title: { fontSize: 18, fontWeight: '700', marginLeft: 8, color: '#1a1a1a' },
  desc: { fontSize: 14, color: '#555', marginBottom: 20, lineHeight: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a', marginBottom: 12, marginTop: 8 },
  traitCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  traitIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  traitInfo: { flex: 1, marginLeft: 12 },
  traitTitle: { fontSize: 15, fontWeight: '600', color: '#1a1a1a', marginBottom: 2 },
  traitDesc: { fontSize: 13, color: '#666' },
  prefCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  prefInfo: { flex: 1, marginLeft: 12 },
  prefTitle: { fontSize: 15, fontWeight: '600', color: '#1a1a1a', marginBottom: 2 },
  prefDesc: { fontSize: 13, color: '#666' },
});
