import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import InfoModal from '../components/InfoModal';

export default function LocaleRegionScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const [selectedRegion, setSelectedRegion] = useState('ES');

  const languages = [
    { code: 'es', name: 'Español', icon: '🇪🇸' },
    { code: 'en', name: 'English', icon: '🇬🇧' },
    { code: 'fr', name: 'Français', icon: '🇫🇷' },
    { code: 'de', name: 'Deutsch', icon: '🇩🇪' },
  ];

  const regions = [
    { code: 'ES', name: 'España', format: 'dd/mm/yyyy' },
    { code: 'MX', name: 'México', format: 'dd/mm/yyyy' },
    { code: 'US', name: 'Estados Unidos', format: 'mm/dd/yyyy' },
    { code: 'AR', name: 'Argentina', format: 'dd/mm/yyyy' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <View style={styles.header}>
            <Ionicons name="globe" size={22} color="#3a2a32" />
            <Text style={styles.title}>Idioma y región</Text>
          </View>
          <TouchableOpacity style={styles.infoBtn} onPress={() => setModalVisible(true)}>
            <Ionicons name="information-circle-outline" size={24} color="#6c63ff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.desc}>Selecciona tu idioma preferido y formato regional.</Text>

        {/* Language Selection */}
        <Text style={styles.sectionTitle}>Idioma</Text>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.optionCard,
              selectedLanguage === lang.code && styles.optionCardSelected
            ]}
            onPress={() => setSelectedLanguage(lang.code)}
          >
            <Text style={styles.flagIcon}>{lang.icon}</Text>
            <Text style={[
              styles.optionText,
              selectedLanguage === lang.code && styles.optionTextSelected
            ]}>
              {lang.name}
            </Text>
            {selectedLanguage === lang.code && (
              <Ionicons name="checkmark-circle" size={24} color="#6c63ff" />
            )}
          </TouchableOpacity>
        ))}

        {/* Region Selection */}
        <Text style={styles.sectionTitle}>Región y formato</Text>
        {regions.map((region) => (
          <TouchableOpacity
            key={region.code}
            style={[
              styles.optionCard,
              selectedRegion === region.code && styles.optionCardSelected
            ]}
            onPress={() => setSelectedRegion(region.code)}
          >
            <View style={styles.regionInfo}>
              <Text style={[
                styles.optionText,
                selectedRegion === region.code && styles.optionTextSelected
              ]}>
                {region.name}
              </Text>
              <Text style={styles.formatText}>Formato: {region.format}</Text>
            </View>
            {selectedRegion === region.code && (
              <Ionicons name="checkmark-circle" size={24} color="#6c63ff" />
            )}
          </TouchableOpacity>
        ))}

        {/* Format Preview */}
        <View style={styles.previewCard}>
          <Text style={styles.previewTitle}>Vista previa</Text>
          <View style={styles.previewRow}>
            <Text style={styles.previewLabel}>Fecha:</Text>
            <Text style={styles.previewValue}>15/12/2025</Text>
          </View>
          <View style={styles.previewRow}>
            <Text style={styles.previewLabel}>Hora:</Text>
            <Text style={styles.previewValue}>14:30</Text>
          </View>
          <View style={styles.previewRow}>
            <Text style={styles.previewLabel}>Números:</Text>
            <Text style={styles.previewValue}>1.234,56</Text>
          </View>
        </View>
      </ScrollView>

      <InfoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        icon="globe"
        title="Idioma y Región"
        description="Personaliza el idioma de la interfaz y selecciona tu formato regional preferido para fechas, horas y números. Los cambios se aplicarán en toda la aplicación. Esta función estará disponible próximamente."
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
  optionCard: {
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
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    borderColor: '#6c63ff',
    backgroundColor: '#f9f8ff',
  },
  flagIcon: { fontSize: 28, marginRight: 12 },
  optionText: { flex: 1, fontSize: 15, fontWeight: '600', color: '#333' },
  optionTextSelected: { color: '#6c63ff' },
  regionInfo: { flex: 1 },
  formatText: { fontSize: 12, color: '#666', marginTop: 2 },
  previewCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  previewTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a1a', marginBottom: 12 },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  previewLabel: { fontSize: 14, color: '#666' },
  previewValue: { fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
});
