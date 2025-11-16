import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../constants/api';

const NotificationTester = () => {
  const { currentTheme } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const scheduleLocal = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: { title: 'Prueba local', body: 'Notificación local programada', data: { type: 'TEST_LOCAL' } },
        trigger: { seconds: 2 }
      });
      Alert.alert('OK', 'Notificación local en 2 segundos');
    } catch (e) {
      Alert.alert('Error', 'No se pudo programar la notificación');
    }
  };

  const simulateIntake = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const payload = { userId: user.id, appName: 'Mail', contact: 'demo@example.com', title: 'Mensaje de prueba', body: 'Contenido', category: 'EMAIL', urgency: 'MEDIUM' };
      const res = await apiClient.post(`/notifications/intake`, payload);
      Alert.alert('Intake', `Decisión: ${res.data?.decision || '—'}`);
    } catch (e) {
      Alert.alert('Error', 'No se pudo simular intake');
    } finally {
      setLoading(false);
    }
  };

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.card, { backgroundColor: currentTheme.cardBackground, borderColor: currentTheme.borderColor }]}>
        <Text style={[styles.title, { color: currentTheme.textPrimary }]}>Prueba de Notificaciones</Text>
        <Text style={{ color: currentTheme.textSecondary }}>Disponible en dispositivo móvil</Text>
      </View>
    );
  }

  return (
    <View style={[styles.card, { backgroundColor: currentTheme.cardBackground, borderColor: currentTheme.borderColor }] }>
      <Text style={[styles.title, { color: currentTheme.textPrimary }]}>Prueba de Notificaciones</Text>
      <View style={styles.row}>
        <TouchableOpacity style={[styles.btn, { backgroundColor: currentTheme.primary }]} onPress={scheduleLocal}>
          <Text style={styles.btnText}>Local (2s)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, { backgroundColor: currentTheme.primary, opacity: loading ? 0.6 : 1 }]} onPress={simulateIntake} disabled={loading}>
          <Text style={styles.btnText}>Simular intake</Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.help, { color: currentTheme.textSecondary }]}>Push remoto requiere development build, en Expo Go usa Local.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: 14, padding: 14, borderWidth: 1, marginTop: 12 },
  title: { fontSize: 16, marginBottom: 8 },
  row: { flexDirection: 'row', gap: 10 },
  btn: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 },
  btnText: { color: '#071220', fontWeight: '600' },
  help: { marginTop: 8, fontSize: 12 },
});

export default NotificationTester;
