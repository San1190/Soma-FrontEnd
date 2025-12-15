import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import InfoModal from '../components/InfoModal';

export default function StatsScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <View style={styles.header}>
            <Ionicons name="stats-chart" size={22} color="#3a2a32" />
            <Text style={styles.title}>Estadísticas generales</Text>
          </View>
          <TouchableOpacity style={styles.infoBtn} onPress={() => setModalVisible(true)}>
            <Ionicons name="information-circle-outline" size={24} color="#6c63ff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.desc}>Visualiza tus métricas diarias, semanales y mensuales de forma detallada.</Text>

        {/* Stats Preview Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="calendar-outline" size={24} color="#6c63ff" />
            </View>
            <Text style={styles.statValue}>--</Text>
            <Text style={styles.statLabel}>Días activos</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="flame-outline" size={24} color="#ff6b6b" />
            </View>
            <Text style={styles.statValue}>--</Text>
            <Text style={styles.statLabel}>Racha actual</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="checkmark-circle-outline" size={24} color="#51cf66" />
            </View>
            <Text style={styles.statValue}>--</Text>
            <Text style={styles.statLabel}>Hábitos completados</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="trophy-outline" size={24} color="#ffd43b" />
            </View>
            <Text style={styles.statValue}>--</Text>
            <Text style={styles.statLabel}>Logros obtenidos</Text>
          </View>
        </View>

        {/* Detailed Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Métricas semanales</Text>
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Ionicons name="water-outline" size={20} color="#4dabf7" />
              <Text style={styles.cardText}>Hidratación promedio</Text>
              <Text style={styles.cardValue}>-- L/día</Text>
            </View>
            <View style={styles.cardRow}>
              <Ionicons name="moon-outline" size={20} color="#9775fa" />
              <Text style={styles.cardText}>Horas de sueño promedio</Text>
              <Text style={styles.cardValue}>-- h</Text>
            </View>
            <View style={styles.cardRow}>
              <Ionicons name="heart-outline" size={20} color="#ff6b6b" />
              <Text style={styles.cardText}>Nivel de estrés promedio</Text>
              <Text style={styles.cardValue}>--/10</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Métricas mensuales</Text>
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Ionicons name="trending-up-outline" size={20} color="#51cf66" />
              <Text style={styles.cardText}>Mejora en bienestar</Text>
              <Text style={styles.cardValue}>--%</Text>
            </View>
            <View style={styles.cardRow}>
              <Ionicons name="time-outline" size={20} color="#ffd43b" />
              <Text style={styles.cardText}>Tiempo invertido</Text>
              <Text style={styles.cardValue}>-- min</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <InfoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        icon="stats-chart"
        title="Estadísticas Generales"
        description="Visualiza todas tus métricas diarias, semanales y mensuales en un solo lugar. Analiza tu progreso con gráficos detallados y compara tus resultados a lo largo del tiempo. Esta función estará disponible próximamente."
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: { fontSize: 24, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#666', textAlign: 'center' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a', marginBottom: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cardText: { flex: 1, fontSize: 14, color: '#555', marginLeft: 12 },
  cardValue: { fontSize: 14, fontWeight: '700', color: '#1a1a1a' },
});
