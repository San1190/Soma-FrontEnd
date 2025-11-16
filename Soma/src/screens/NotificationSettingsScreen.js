import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import * as Notifications from 'expo-notifications';
import { scheduleLocal } from '../utils/localNotify';
import { apiClient } from '../constants/api';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../constants/api'; // Importamos la URL central
import { useTheme } from '../context/ThemeContext';

const API_URL = `${API_BASE_URL}/notification-settings`; // Corregido: usa la IP
const PREF_URL = `${API_BASE_URL}/notifications/preferences`;
const LOG_URL = `${API_BASE_URL}/notifications/log/user`;
const INTAKE_URL = `${API_BASE_URL}/notifications/intake`;

const NotificationSettingsScreen = () => {
  const { user } = useAuth();
  const { currentTheme } = useTheme();
  const [notificationSettings, setNotificationSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prefs, setPrefs] = useState([]);
  const [logs, setLogs] = useState([]);
  const [prefForm, setPrefForm] = useState({ appName:'', contact:'', priority:'MEDIUM', allowDuringAntiStress:false, quietStartHour:'', quietEndHour:'', groupable:true });
  const [intakeForm, setIntakeForm] = useState({ appName:'Mail', contact:'contacto@ejemplo.com', title:'Nuevo mensaje', body:'Contenido de ejemplo', category:'EMAIL', urgency:'MEDIUM' });

  useEffect(() => {
    fetchNotificationSettings();
    loadPrefs();
    loadLogs();
  }, []);

  const fetchNotificationSettings = async () => {
    try {
      setLoading(true);
      // Usamos user.id (asumiendo que viene de AuthContext)
      const response = await apiClient.get(`${API_URL}/user/${user.id}`);
      setNotificationSettings(response.data);
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      Alert.alert('Error', 'No se pudieron cargar las configuraciones de notificación.');
    } finally {
      setLoading(false);
    }
  };

  const loadPrefs = async () => {
    try {
      const res = await apiClient.get(`${PREF_URL}/user/${user.id}`);
      setPrefs(res.data);
    } catch (e) { console.log(e); }
  };

  const loadLogs = async () => {
    try {
      const res = await apiClient.get(`${LOG_URL}/${user.id}`);
      setLogs(res.data);
    } catch (e) { console.log(e); }
  };

  const handleToggleEnabled = async (id, currentValue) => {
    const settingToUpdate = notificationSettings.find(setting => setting.id === id);
    if (!settingToUpdate) return;

    const updatedSetting = { ...settingToUpdate, enabled: !currentValue };
    try {
      await apiClient.put(`${API_URL}/${id}`, updatedSetting);
      setNotificationSettings(prevSettings =>
        prevSettings.map(setting => (setting.id === id ? updatedSetting : setting))
      );
      Alert.alert('Éxito', 'Configuración de notificación actualizada.');
    } catch (error) {
      console.error('Error updating notification setting:', error);
      Alert.alert('Error', 'No se pudo actualizar la configuración de notificación.');
    }
  };

  const savePref = async () => {
    try {
      const payload = {
        userId: user.id,
        appName: prefForm.appName,
        contact: prefForm.contact,
        priority: prefForm.priority,
        allowDuringAntiStress: prefForm.allowDuringAntiStress,
        quietStartHour: prefForm.quietStartHour ? Number(prefForm.quietStartHour) : null,
        quietEndHour: prefForm.quietEndHour ? Number(prefForm.quietEndHour) : null,
        groupable: prefForm.groupable,
      };
      await apiClient.post(PREF_URL, payload);
      Alert.alert('Preferencia guardada');
      await loadPrefs();
    } catch (e) { Alert.alert('Error', 'No se pudo guardar la preferencia'); }
  };

  const simulateIntake = async () => {
    try {
      const payload = { userId: user.id, ...intakeForm };
      const res = await apiClient.post(INTAKE_URL, payload);
      Alert.alert('Intake', `Decisión: ${res.data.decision}`);
      if (res.data?.decision === 'IMMEDIATE') {
        scheduleLocal('Notificación inmediata', `${intakeForm.appName}: ${intakeForm.title}`, { type:'IMMEDIATE', appName:intakeForm.appName }, 1);
      }
      await loadLogs();
    } catch (e) { Alert.alert('Error', 'No se pudo simular'); }
  };

  const handleFrequencyChange = async (id, newFrequency) => {
    const settingToUpdate = notificationSettings.find(setting => setting.id === id);
    if (!settingToUpdate) return;

    const updatedSetting = { ...settingToUpdate, frequency: newFrequency };
    try {
      await apiClient.put(`${API_URL}/${id}`, updatedSetting);
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
      await apiClient.put(`${API_URL}/${id}`, updatedSetting);
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
      <View style={[styles.container,{backgroundColor: currentTheme.background}] }>
        <Text>Cargando configuraciones de notificación...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container,{backgroundColor: currentTheme.background}] }>
      <Text style={[styles.title,{color: currentTheme.textPrimary}]}>Configuración de Notificaciones</Text>
      {
        notificationSettings.length === 0 ? (
          <Text>No hay configuraciones de notificación disponibles.</Text>
        ) : (
          notificationSettings.map(setting => (
            <View key={setting.id} style={[styles.settingCard,{backgroundColor: currentTheme.cardBackground, borderColor: currentTheme.borderColor}] }>
              <Text style={[styles.settingName,{color: currentTheme.textPrimary}]}>{setting.notification_type}</Text>

              <View style={styles.row}>
                <Text style={{color: currentTheme.textSecondary}}>Habilitar:</Text>
                <Switch
                  onValueChange={() => handleToggleEnabled(setting.id, setting.enabled)}
                  value={setting.enabled}
                />
              </View>

              <View style={styles.row}>
                <Text style={{color: currentTheme.textSecondary}}>Frecuencia:</Text>
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
                <Text style={{color: currentTheme.textSecondary}}>Canal Móvil:</Text>
                <Switch
                  onValueChange={() => handleChannelToggle(setting.id, 'mobile', setting.channel_mobile_app_enabled)}
                  value={setting.channel_mobile_app_enabled}
                />
              </View>

              <View style={styles.row}>
                <Text style={{color: currentTheme.textSecondary}}>Canal Smartwatch:</Text>
                <Switch
                  onValueChange={() => handleChannelToggle(setting.id, 'smartwatch', setting.channel_smartwatch_enabled)}
                  value={setting.channel_smartwatch_enabled}
                />
              </View>
            </View>
          ))
        )
      }

      <View style={[styles.section,{backgroundColor: currentTheme.cardBackground, borderColor: currentTheme.borderColor}] }>
        <Text style={styles.subtitle}>Preferencias por App/Contacto</Text>
        {prefs.map((p, idx) => (
          <View key={idx} style={styles.prefItem}>
            <Text style={[styles.prefText,{color: currentTheme.textPrimary}]}>{p.appName} · {p.contact}</Text>
            <Text style={[styles.prefMeta,{color: currentTheme.textSecondary}]}>{p.priority} · {p.groupable ? 'Agrupable' : 'No agrupable'} · {p.allowDuringAntiStress ? 'Permitir en antiestrés' : 'Bloquear en antiestrés'}</Text>
          </View>
        ))}
        <View style={styles.formRow}><TextInput style={[styles.input,{color: currentTheme.textPrimary}]} placeholder="App" value={prefForm.appName} onChangeText={(v)=>setPrefForm({...prefForm, appName:v})} /></View>
        <View style={styles.formRow}><TextInput style={[styles.input,{color: currentTheme.textPrimary}]} placeholder="Contacto" value={prefForm.contact} onChangeText={(v)=>setPrefForm({...prefForm, contact:v})} /></View>
        <View style={styles.formRow}>
          <Text style={{marginRight:8}}>Prioridad</Text>
          <Picker selectedValue={prefForm.priority} style={{flex:1}} onValueChange={(v)=>setPrefForm({...prefForm, priority:v})}>
            <Picker.Item label="LOW" value="LOW" />
            <Picker.Item label="MEDIUM" value="MEDIUM" />
            <Picker.Item label="HIGH" value="HIGH" />
          </Picker>
        </View>
        <View style={styles.row}><Text>Permitir en antiestrés</Text><Switch value={prefForm.allowDuringAntiStress} onValueChange={(v)=>setPrefForm({...prefForm, allowDuringAntiStress:v})} /></View>
        <View style={styles.formRow}><TextInput style={[styles.input,{color: currentTheme.textPrimary}]} keyboardType='numeric' placeholder="Hora silencio inicio" value={prefForm.quietStartHour} onChangeText={(v)=>setPrefForm({...prefForm, quietStartHour:v})} /></View>
        <View style={styles.formRow}><TextInput style={[styles.input,{color: currentTheme.textPrimary}]} keyboardType='numeric' placeholder="Hora silencio fin" value={prefForm.quietEndHour} onChangeText={(v)=>setPrefForm({...prefForm, quietEndHour:v})} /></View>
        <View style={styles.row}><Text>Agrupable</Text><Switch value={prefForm.groupable} onValueChange={(v)=>setPrefForm({...prefForm, groupable:v})} /></View>
        <TouchableOpacity style={[styles.saveBtn,{backgroundColor: currentTheme.primary}]} onPress={savePref}><Text style={styles.saveText}>Guardar preferencia</Text></TouchableOpacity>
      </View>

      <View style={[styles.section,{backgroundColor: currentTheme.cardBackground, borderColor: currentTheme.borderColor}] }>
        <Text style={styles.subtitle}>Registro de notificaciones</Text>
        {logs.map((l, idx) => (
          <View key={idx} style={styles.logItem}>
            <Text style={[styles.prefText,{color: currentTheme.textPrimary}]}>{l.title || '(sin título)'}</Text>
            <Text style={[styles.prefMeta,{color: currentTheme.textSecondary}]}>{l.appName} · {l.contact} · {l.decision}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.section,{backgroundColor: currentTheme.cardBackground, borderColor: currentTheme.borderColor}] }>
        <Text style={styles.subtitle}>Simular notificación</Text>
        <View style={styles.formRow}><TextInput style={[styles.input,{color: currentTheme.textPrimary}]} placeholder="App" value={intakeForm.appName} onChangeText={(v)=>setIntakeForm({...intakeForm, appName:v})} /></View>
        <View style={styles.formRow}><TextInput style={[styles.input,{color: currentTheme.textPrimary}]} placeholder="Contacto" value={intakeForm.contact} onChangeText={(v)=>setIntakeForm({...intakeForm, contact:v})} /></View>
        <View style={styles.formRow}><TextInput style={[styles.input,{color: currentTheme.textPrimary}]} placeholder="Título" value={intakeForm.title} onChangeText={(v)=>setIntakeForm({...intakeForm, title:v})} /></View>
        <View style={styles.formRow}><TextInput style={[styles.input,{color: currentTheme.textPrimary}]} placeholder="Contenido" value={intakeForm.body} onChangeText={(v)=>setIntakeForm({...intakeForm, body:v})} /></View>
        <View style={styles.formRow}><TextInput style={[styles.input,{color: currentTheme.textPrimary}]} placeholder="Categoría" value={intakeForm.category} onChangeText={(v)=>setIntakeForm({...intakeForm, category:v})} /></View>
        <View style={styles.formRow}>
          <Text style={{marginRight:8}}>Urgencia</Text>
          <Picker selectedValue={intakeForm.urgency} style={{flex:1}} onValueChange={(v)=>setIntakeForm({...intakeForm, urgency:v})}>
            <Picker.Item label="LOW" value="LOW" />
            <Picker.Item label="MEDIUM" value="MEDIUM" />
            <Picker.Item label="HIGH" value="HIGH" />
            <Picker.Item label="CRITICAL" value="CRITICAL" />
          </Picker>
        </View>
        <TouchableOpacity style={[styles.saveBtn,{backgroundColor: currentTheme.primary}]} onPress={simulateIntake}><Text style={styles.saveText}>Enviar</Text></TouchableOpacity>
      </View>

      <View style={[styles.section,{backgroundColor: currentTheme.cardBackground, borderColor: currentTheme.borderColor}] }>
        <Text style={styles.subtitle}>Prueba local en Expo Go</Text>
        <TouchableOpacity style={[styles.saveBtn,{backgroundColor: currentTheme.primary}]} onPress={async()=>{
          try{
            await Notifications.scheduleNotificationAsync({
              content: { title: 'Prueba local', body: 'Notificación local programada', data: { type:'TEST_LOCAL' } },
              trigger: { seconds: 2 }
            });
            Alert.alert('OK','Notificación local programada en 2s');
          }catch(e){ Alert.alert('Error','No se pudo programar'); }
        }}>
          <Text style={styles.saveText}>Programar notificación local</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#cfe0ff',
  },
  settingCard: {
    backgroundColor: '#121821',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth:1,
    borderColor:'#1b2330'
  },
  settingName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color:'#e7eef9'
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
  section:{ borderWidth:1, borderRadius:14, padding:14, marginTop:12 },
  subtitle:{ fontSize:16, marginBottom:8 },
  prefItem:{ paddingVertical:8, borderBottomWidth:1, borderBottomColor:'#1b2330' },
  prefText:{ color:'#e7eef9', fontSize:14 },
  prefMeta:{ color:'#9fb0c9', fontSize:12 },
  formRow:{ marginBottom:8 },
  input:{ backgroundColor:'#FFFFFF', borderWidth:1, borderColor:'#E6ECF1', borderRadius:10, padding:10 },
  saveBtn:{ backgroundColor:'#4ea3ff', paddingVertical:10, borderRadius:12, marginTop:6 },
  saveText:{ color:'#071220', textAlign:'center', fontWeight:'600' }
});

export default NotificationSettingsScreen;
