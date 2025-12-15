import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import InfoModal from '../components/InfoModal';

export default function PremiumSubscriptionScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('yearly');

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <View style={styles.header}>
            <Ionicons name="star" size={22} color="#ffd43b" />
            <Text style={styles.title}>Suscripción Premium</Text>
          </View>
          <TouchableOpacity style={styles.infoBtn} onPress={() => setModalVisible(true)}>
            <Ionicons name="information-circle-outline" size={24} color="#6c63ff" />
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons name="diamond" size={48} color="#ffd43b" />
          </View>
          <Text style={styles.heroTitle}>Desbloquea todo el potencial de Soma</Text>
          <Text style={styles.heroDesc}>Acceso ilimitado a todas las funcionalidades premium</Text>
        </View>

        {/* Benefits */}
        <Text style={styles.sectionTitle}>Beneficios Premium</Text>
        <View style={styles.benefitCard}>
          <Ionicons name="analytics" size={24} color="#6c63ff" />
          <Text style={styles.benefitText}>Análisis avanzados y estadísticas detalladas</Text>
        </View>

        <View style={styles.benefitCard}>
          <Ionicons name="fitness" size={24} color="#51cf66" />
          <Text style={styles.benefitText}>Planes personalizados de bienestar</Text>
        </View>

        <View style={styles.benefitCard}>
          <Ionicons name="chatbubbles" size={24} color="#4dabf7" />
          <Text style={styles.benefitText}>Soporte prioritario 24/7</Text>
        </View>

        <View style={styles.benefitCard}>
          <Ionicons name="download" size={24} color="#ff6b6b" />
          <Text style={styles.benefitText}>Exportación de datos sin límites</Text>
        </View>

        <View style={styles.benefitCard}>
          <Ionicons name="notifications-off" size={24} color="#9775fa" />
          <Text style={styles.benefitText}>Experiencia sin anuncios</Text>
        </View>

        {/* Pricing Plans */}
        <Text style={styles.sectionTitle}>Elige tu plan</Text>

        {/* Yearly Plan */}
        <TouchableOpacity
          style={[styles.planCard, selectedPlan === 'yearly' && styles.planCardSelected]}
          onPress={() => setSelectedPlan('yearly')}
        >
          <View style={styles.planBadge}>
            <Text style={styles.planBadgeText}>Ahorra 40%</Text>
          </View>
          <View style={styles.planHeader}>
            <Text style={styles.planTitle}>Anual</Text>
            {selectedPlan === 'yearly' && (
              <Ionicons name="checkmark-circle" size={24} color="#6c63ff" />
            )}
          </View>
          <View style={styles.planPricing}>
            <Text style={styles.planPrice}>€39.99</Text>
            <Text style={styles.planPeriod}>/año</Text>
          </View>
          <Text style={styles.planSavings}>Solo €3.33/mes</Text>
        </TouchableOpacity>

        {/* Monthly Plan */}
        <TouchableOpacity
          style={[styles.planCard, selectedPlan === 'monthly' && styles.planCardSelected]}
          onPress={() => setSelectedPlan('monthly')}
        >
          <View style={styles.planHeader}>
            <Text style={styles.planTitle}>Mensual</Text>
            {selectedPlan === 'monthly' && (
              <Ionicons name="checkmark-circle" size={24} color="#6c63ff" />
            )}
          </View>
          <View style={styles.planPricing}>
            <Text style={styles.planPrice}>€5.99</Text>
            <Text style={styles.planPeriod}>/mes</Text>
          </View>
          <Text style={styles.planSavings}>Facturado mensualmente</Text>
        </TouchableOpacity>

        {/* CTA Button */}
        <TouchableOpacity style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>Comenzar prueba gratuita de 7 días</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Puedes cancelar en cualquier momento. Sin compromisos a largo plazo.
        </Text>
      </ScrollView>

      <InfoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        icon="star"
        title="Suscripción Premium"
        description="Accede a todas las funcionalidades avanzadas de Soma: análisis detallados, planes personalizados, soporte prioritario y mucho más. Prueba gratis durante 7 días. Esta función estará disponible próximamente."
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
  hero: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff9e6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a1a', marginBottom: 8, textAlign: 'center' },
  heroDesc: { fontSize: 14, color: '#666', textAlign: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a', marginBottom: 12, marginTop: 8 },
  benefitCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  benefitText: { flex: 1, fontSize: 14, fontWeight: '500', color: '#333', marginLeft: 12 },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  planCardSelected: {
    borderColor: '#6c63ff',
    backgroundColor: '#f9f8ff',
  },
  planBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  planBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a1a' },
  planPricing: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 4 },
  planPrice: { fontSize: 32, fontWeight: '700', color: '#1a1a1a' },
  planPeriod: { fontSize: 16, color: '#666', marginLeft: 4 },
  planSavings: { fontSize: 13, color: '#666' },
  ctaButton: {
    backgroundColor: '#000',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  ctaButtonText: { color: '#fff', fontSize: 16, fontWeight: '700', marginRight: 8 },
  disclaimer: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
});
