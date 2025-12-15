import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import InfoModal from '../components/InfoModal';

export default function MedicalDocumentsScreen({ navigation }) {
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
            <Ionicons name="document-text" size={22} color="#3a2a32" />
            <Text style={styles.title}>Documentos médicos</Text>
          </View>
          <TouchableOpacity style={styles.infoBtn} onPress={() => setModalVisible(true)}>
            <Ionicons name="information-circle-outline" size={24} color="#6c63ff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.desc}>Sube y consulta tus documentos médicos de forma segura y cifrada.</Text>

        {/* Upload Section */}
        <View style={styles.uploadCard}>
          <Ionicons name="cloud-upload-outline" size={48} color="#6c63ff" />
          <Text style={styles.uploadTitle}>Subir nuevo documento</Text>
          <Text style={styles.uploadDesc}>Arrastra archivos aquí o haz clic para seleccionar</Text>
          <TouchableOpacity style={styles.uploadBtn}>
            <Ionicons name="add-circle-outline" size={20} color="#fff" />
            <Text style={styles.uploadBtnText}>Seleccionar archivo</Text>
          </TouchableOpacity>
        </View>

        {/* Document Types */}
        <Text style={styles.sectionTitle}>Tipos de documentos</Text>
        <View style={styles.docTypeCard}>
          <Ionicons name="medical-outline" size={24} color="#ff6b6b" />
          <View style={styles.docTypeInfo}>
            <Text style={styles.docTypeTitle}>Informes médicos</Text>
            <Text style={styles.docTypeDesc}>Análisis, diagnósticos y reportes</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </View>

        <View style={styles.docTypeCard}>
          <Ionicons name="document-outline" size={24} color="#4dabf7" />
          <View style={styles.docTypeInfo}>
            <Text style={styles.docTypeTitle}>Recetas</Text>
            <Text style={styles.docTypeDesc}>Prescripciones y tratamientos</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </View>

        <View style={styles.docTypeCard}>
          <Ionicons name="clipboard-outline" size={24} color="#51cf66" />
          <View style={styles.docTypeInfo}>
            <Text style={styles.docTypeTitle}>Historial clínico</Text>
            <Text style={styles.docTypeDesc}>Registros médicos anteriores</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </View>

        <View style={styles.docTypeCard}>
          <Ionicons name="fitness-outline" size={24} color="#ffd43b" />
          <View style={styles.docTypeInfo}>
            <Text style={styles.docTypeTitle}>Resultados de laboratorio</Text>
            <Text style={styles.docTypeDesc}>Análisis y pruebas médicas</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </View>

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <Ionicons name="shield-checkmark" size={20} color="#51cf66" />
          <Text style={styles.securityText}>Tus documentos están protegidos con cifrado de extremo a extremo</Text>
        </View>
      </ScrollView>

      <InfoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        icon="document-text"
        title="Documentos Médicos"
        description="Almacena de forma segura todos tus documentos médicos importantes: informes, recetas, historial clínico y resultados de laboratorio. Protección con cifrado de extremo a extremo. Esta función estará disponible próximamente."
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
  uploadCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  uploadTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a', marginTop: 12, marginBottom: 4 },
  uploadDesc: { fontSize: 13, color: '#666', marginBottom: 16, textAlign: 'center' },
  uploadBtn: {
    backgroundColor: '#6c63ff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  uploadBtnText: { color: '#fff', fontWeight: '600', fontSize: 14, marginLeft: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a', marginBottom: 12 },
  docTypeCard: {
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
  docTypeInfo: { flex: 1, marginLeft: 12 },
  docTypeTitle: { fontSize: 15, fontWeight: '600', color: '#1a1a1a', marginBottom: 2 },
  docTypeDesc: { fontSize: 13, color: '#666' },
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
