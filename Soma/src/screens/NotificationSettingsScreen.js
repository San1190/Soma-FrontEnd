import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../constants/api'; // Importamos la URL central

const API_URL = `${API_BASE_URL}/notification-settings`; // Corregido: usa la IP

const NotificationSettingsScreen = () => {
  const { user } = useAuth();
  const [notificationSettings, setNotificationSettings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotificationSettings();
  }, []);

  const fetchNotificationSettings = async () => {
    try {
      setLoading(true);
      // Usamos user.id (asumiendo que viene de AuthContext)
      const response = await axios.get(`${API_URL}/user/${user.id}`);
      setNotificationSettings(response.data);
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      Alert.alert('Error', 'No se pudieron cargar las configuraciones de notificación.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEnabled = async (id, currentValue) => {
    const settingToUpdate = notificationSettings.find(setting => setting.id === id);
    if (!settingToUpdate) return;

    const updatedSetting = { ...settingToUpdate, enabled: !currentValue };
    try {
      await axios.put(`${API_URL}/${id}`, updatedSetting);
      setNotificationSettings(prevSettings =>
        prevSettings.map(setting => (setting.id === id ? updatedSetting : setting))
      );
      Alert.alert('Éxito', 'Configuración de notificación actualizada.');
    } catch (error) {
      console.error('Error updating notification setting:', error);
      Alert.alert('Error', 'No se pudo actualizar la configuración de notificación.');
    }
  };

  const handleFrequencyChange = async (id, newFrequency) => {
    const settingToUpdate = notificationSettings.find(setting => setting.id === id);
    if (!settingToUpdate) return;

    const updatedSetting = { ...settingToUpdate, frequency: newFrequency };
    try {
      await axios.put(`${API_URL}/${id}`, updatedSetting);
      setNotificationSettings(prevSettings =>
        prevSettings.map(setting => (setting.id === id ? updatedSetting : setting))
      );
      Alert.alert('Éxito', 'Frecuencia de notificación actualizada.');
    } catch (error) {
      console.error('Error updating notification frequency:', error);
      Alert.alert('Error', 'No se pudo actualizar la frecuencia de notificación.');
    }
  };

  const handleChannelToggle = async (id, channel, currentValue) => {
    const settingToUpdate = notificationSettings.find(setting => setting.id === id);
    if (!settingToUpdate) return;

    const updatedSetting = { ...settingToUpdate };
    if (channel === 'mobile') {
      updatedSetting.channel_mobile_app_enabled = !currentValue;
    } else if (channel === 'smartwatch') {
      updatedSetting.channel_smartwatch_enabled = !currentValue;
    }

    try {
      await axios.put(`${API_URL}/${id}`, updatedSetting);
      setNotificationSettings(prevSettings =>
        prevSettings.map(setting => (setting.id === id ? updatedSetting : setting))
      );
      Alert.alert('Éxito', 'Canal de notificación actualizado.');
    } catch (error) {
      console.error('Error updating notification channel:', error);
      Alert.alert('Error', 'No se pudo actualizar el canal de notificación.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando configuraciones de notificación...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuración de Notificaciones</Text>
      {
        notificationSettings.length === 0 ? (
          <Text>No hay configuraciones de notificación disponibles.</Text>
        ) : (
          notificationSettings.map(setting => (
            <View key={setting.id} style={styles.settingCard}>
              <Text style={styles.settingName}>{setting.notification_type}</Text>

              <View style={styles.row}>
                <Text>Habilitar:</Text>
                <Switch
                  onValueChange={() => handleToggleEnabled(setting.id, setting.enabled)}
                  value={setting.enabled}
                />
              </View>

              <View style={styles.row}>
                <Text>Frecuencia:</Text>
                <Picker
                  selectedValue={setting.frequency}
                  style={styles.picker}
                  onValueChange={(itemValue) => handleFrequencyChange(setting.id, itemValue)}
                >
                  <Picker.Item label="Diario" value="DAILY" />
                  <Picker.Item label="Semanal" value="WEEKLY" />
                  <Picker.Item label="Mensual" value="MONTHLY" />
                  <Picker.Item label="Nunca" value="NEVER" />
                </Picker>
              </View>

              <View style={styles.row}>
                <Text>Canal Móvil:</Text>
                <Switch
                  onValueChange={() => handleChannelToggle(setting.id, 'mobile', setting.channel_mobile_app_enabled)}
                  value={setting.channel_mobile_app_enabled}
                />
              </View>

              <View style={styles.row}>
                <Text>Canal Smartwatch:</Text>
                <Switch
                  onValueChange={() => handleChannelToggle(setting.id, 'smartwatch', setting.channel_smartwatch_enabled)}
                  value={setting.channel_smartwatch_enabled}
                />
              </View>
            </View>
          ))
        )
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  settingCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: 150,
  },
});

export default NotificationSettingsScreen;