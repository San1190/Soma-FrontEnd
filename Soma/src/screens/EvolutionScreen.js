import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import InfoModal from '../components/InfoModal';

export default function EvolutionScreen({ navigation }) {
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
            <Ionicons name="trending-up" size={22} color="#3a2a32" />
            <Text style={styles.title}>Evolución total</Text>
          </View>
          <TouchableOpacity style={styles.infoBtn} onPress={() => setModalVisible(true)}>
            <Ionicons name="information-circle-outline" size={24} color="#6c63ff" />
          </TouchableOpacity>
        </View>

        {/* Content Preview */}
        <Text style={styles.desc}>Visualiza tu progreso en el tiempo con gráficos y análisis de tendencias.</Text>

        {/* Preview Cards */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="calendar" size={20} color="#6c63ff" />
            <Text style={styles.cardTitle}>Tendencias semanales</Text>
          </View>
          <Text style={styles.cardDesc}>Compara tu progreso semana a semana</Text>
          <View style={styles.chartPlaceholder}>
            <Ionicons name="bar-chart" size={40} color="#ccc" />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="stats-chart" size={20} color="#6c63ff" />
            <Text style={styles.cardTitle}>Comparativas mensuales</Text>
          </View>
          <Text style={styles.cardDesc}>Análisis de tu evolución mensual</Text>
          <View style={styles.chartPlaceholder}>
            <Ionicons name="trending-up" size={40} color="#ccc" />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="analytics" size={20} color="#6c63ff" />
            <Text style={styles.cardTitle}>Métricas de progreso</Text>
          </View>
          <Text style={styles.cardDesc}>Indicadores clave de tu bienestar</Text>
          <View style={styles.chartPlaceholder}>
            <Ionicons name="pulse" size={40} color="#ccc" />
          </View>
        </View>
      </ScrollView>

      <InfoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        icon="trending-up"
        title="Evolución Total"
        description="Aquí podrás ver tu evolución en el tiempo con gráficos comparativos, análisis de tendencias y métricas detalladas de tu progreso en todos los aspectos del bienestar. Esta función estará disponible próximamente."
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a', marginLeft: 8 },
  cardDesc: { fontSize: 13, color: '#666', marginBottom: 16 },
  chartPlaceholder: {
    height: 120,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f0f0f0',
    borderStyle: 'dashed',
  },
});
