import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import InfoModal from '../components/InfoModal';

export default function HelpContactScreen({ navigation }) {
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
            <Ionicons name="help-circle" size={22} color="#3a2a32" />
            <Text style={styles.title}>Ayuda y contacto</Text>
          </View>
          <TouchableOpacity style={styles.infoBtn} onPress={() => setModalVisible(true)}>
            <Ionicons name="information-circle-outline" size={24} color="#6c63ff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.desc}>Centro de ayuda, preguntas frecuentes y soporte directo.</Text>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Acciones rápidas</Text>
        <TouchableOpacity style={styles.actionCard}>
          <View style={styles.actionIcon}>
            <Ionicons name="chatbubbles" size={24} color="#6c63ff" />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Chat en vivo</Text>
            <Text style={styles.actionDesc}>Habla con nuestro equipo</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <View style={styles.actionIcon}>
            <Ionicons name="mail" size={24} color="#4dabf7" />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Enviar email</Text>
            <Text style={styles.actionDesc}>soporte@soma.app</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <View style={styles.actionIcon}>
            <Ionicons name="call" size={24} color="#51cf66" />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Llamar</Text>
            <Text style={styles.actionDesc}>+34 900 123 456</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        {/* FAQ Section */}
        <Text style={styles.sectionTitle}>Preguntas frecuentes</Text>
        <View style={styles.faqCard}>
          <Ionicons name="help-circle-outline" size={20} color="#6c63ff" />
          <Text style={styles.faqQuestion}>¿Cómo funciona Soma?</Text>
        </View>

        <View style={styles.faqCard}>
          <Ionicons name="help-circle-outline" size={20} color="#6c63ff" />
          <Text style={styles.faqQuestion}>¿Cómo cambio mi objetivo de hidratación?</Text>
        </View>

        <View style={styles.faqCard}>
          <Ionicons name="help-circle-outline" size={20} color="#6c63ff" />
          <Text style={styles.faqQuestion}>¿Puedo exportar mis datos?</Text>
        </View>

        <View style={styles.faqCard}>
          <Ionicons name="help-circle-outline" size={20} color="#6c63ff" />
          <Text style={styles.faqQuestion}>¿Cómo cancelo mi suscripción Premium?</Text>
        </View>

        {/* Resources */}
        <Text style={styles.sectionTitle}>Recursos útiles</Text>
        <TouchableOpacity style={styles.resourceCard}>
          <Ionicons name="book-outline" size={24} color="#ffd43b" />
          <View style={styles.resourceInfo}>
            <Text style={styles.resourceTitle}>Guía de inicio</Text>
            <Text style={styles.resourceDesc}>Aprende a usar Soma</Text>
          </View>
          <Ionicons name="arrow-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.resourceCard}>
          <Ionicons name="videocam-outline" size={24} color="#ff6b6b" />
          <View style={styles.resourceInfo}>
            <Text style={styles.resourceTitle}>Video tutoriales</Text>
            <Text style={styles.resourceDesc}>Guías paso a paso</Text>
          </View>
          <Ionicons name="arrow-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </ScrollView>

      <InfoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        icon="help-circle"
        title="Ayuda y Contacto"
        description="Accede a nuestro centro de ayuda con preguntas frecuentes, tutoriales en video, y contacto directo con el equipo de soporte. Estamos aquí para ayudarte. Esta función estará disponible próximamente."
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
  actionCard: {
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
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionInfo: { flex: 1, marginLeft: 12 },
  actionTitle: { fontSize: 15, fontWeight: '600', color: '#1a1a1a', marginBottom: 2 },
  actionDesc: { fontSize: 13, color: '#666' },
  faqCard: {
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
  faqQuestion: { flex: 1, fontSize: 14, color: '#333', marginLeft: 12, fontWeight: '500' },
  resourceCard: {
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
  resourceInfo: { flex: 1, marginLeft: 12 },
  resourceTitle: { fontSize: 15, fontWeight: '600', color: '#1a1a1a', marginBottom: 2 },
  resourceDesc: { fontSize: 13, color: '#666' },
});
