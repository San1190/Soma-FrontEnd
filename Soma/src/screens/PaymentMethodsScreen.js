import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import InfoModal from '../components/InfoModal';

export default function PaymentMethodsScreen({ navigation }) {
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
            <Ionicons name="card" size={22} color="#3a2a32" />
            <Text style={styles.title}>Métodos de pago</Text>
          </View>
          <TouchableOpacity style={styles.infoBtn} onPress={() => setModalVisible(true)}>
            <Ionicons name="information-circle-outline" size={24} color="#6c63ff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.desc}>Añade y gestiona tus métodos de pago de forma segura.</Text>

        {/* Add Payment Method */}
        <TouchableOpacity style={styles.addCard}>
          <View style={styles.addIconContainer}>
            <Ionicons name="add-circle" size={32} color="#6c63ff" />
          </View>
          <View style={styles.addInfo}>
            <Text style={styles.addTitle}>Añadir nuevo método de pago</Text>
            <Text style={styles.addDesc}>Tarjeta de crédito o débito</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        {/* Payment Methods List */}
        <Text style={styles.sectionTitle}>Tus métodos de pago</Text>

        {/* Example Card 1 */}
        <View style={styles.paymentCard}>
          <View style={styles.cardIcon}>
            <Ionicons name="card" size={24} color="#6c63ff" />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>Visa •••• 4532</Text>
            <Text style={styles.cardExpiry}>Expira: 12/2026</Text>
          </View>
          <TouchableOpacity style={styles.cardMenu}>
            <Ionicons name="ellipsis-vertical" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Example Card 2 */}
        <View style={styles.paymentCard}>
          <View style={styles.cardIcon}>
            <Ionicons name="card" size={24} color="#ff6b6b" />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>Mastercard •••• 8901</Text>
            <Text style={styles.cardExpiry}>Expira: 08/2025</Text>
          </View>
          <TouchableOpacity style={styles.cardMenu}>
            <Ionicons name="ellipsis-vertical" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Other Payment Methods */}
        <Text style={styles.sectionTitle}>Otros métodos</Text>

        <TouchableOpacity style={styles.otherMethodCard}>
          <Ionicons name="logo-paypal" size={24} color="#0070ba" />
          <View style={styles.methodInfo}>
            <Text style={styles.methodTitle}>PayPal</Text>
            <Text style={styles.methodDesc}>Conectar cuenta de PayPal</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.otherMethodCard}>
          <Ionicons name="logo-apple" size={24} color="#000" />
          <View style={styles.methodInfo}>
            <Text style={styles.methodTitle}>Apple Pay</Text>
            <Text style={styles.methodDesc}>Pago rápido y seguro</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.otherMethodCard}>
          <Ionicons name="logo-google" size={24} color="#4285F4" />
          <View style={styles.methodInfo}>
            <Text style={styles.methodTitle}>Google Pay</Text>
            <Text style={styles.methodDesc}>Pago con Google</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <Ionicons name="lock-closed" size={20} color="#51cf66" />
          <Text style={styles.securityText}>Tus datos de pago están protegidos con cifrado SSL</Text>
        </View>
      </ScrollView>

      <InfoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        icon="card"
        title="Métodos de Pago"
        description="Gestiona tus tarjetas de crédito y débito de forma segura. Añade múltiples métodos de pago y elige tu favorito. Todos los datos están protegidos con cifrado de nivel bancario. Esta función estará disponible próximamente."
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
  addCard: {
    backgroundColor: '#f9f8ff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0deff',
    borderStyle: 'dashed',
  },
  addIconContainer: { marginRight: 12 },
  addInfo: { flex: 1 },
  addTitle: { fontSize: 15, fontWeight: '600', color: '#6c63ff', marginBottom: 2 },
  addDesc: { fontSize: 13, color: '#9c9aaf' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a', marginBottom: 12, marginTop: 8 },
  paymentCard: {
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
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: { flex: 1, marginLeft: 12 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#1a1a1a', marginBottom: 2 },
  cardExpiry: { fontSize: 13, color: '#666' },
  cardMenu: { padding: 8 },
  otherMethodCard: {
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
  methodInfo: { flex: 1, marginLeft: 12 },
  methodTitle: { fontSize: 15, fontWeight: '600', color: '#1a1a1a', marginBottom: 2 },
  methodDesc: { fontSize: 13, color: '#666' },
  securityNotice: {
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  securityText: { flex: 1, fontSize: 13, color: '#2e7d32', marginLeft: 12, fontWeight: '500' },
});
