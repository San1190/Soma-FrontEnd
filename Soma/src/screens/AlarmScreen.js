import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Platform, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; // Asumiendo que esta librería está instalada
import SmartClock from '../components/Clock'; 
import { Ionicons } from '@expo/vector-icons'; // Asumiendo que expo/vector-icons está instalado

const AlarmScreen = () => {
  // Estado para la alarma actual que se está editando
  const [alarmStartTime, setAlarmStartTime] = useState(new Date());
  const [alarmEndTime, setAlarmEndTime] = useState(new Date());
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isVibrationEnabled, setIsVibrationEnabled] = useState(true);
  const [isAlarmActive, setIsAlarmActive] = useState(true);
  
  // Estado para los días seleccionados
  const [selectedDays, setSelectedDays] = useState([false, false, false, false, false, false, false]); // [L,M,X,J,V,S,D]
  
  // Estado para la lista de alarmas guardadas
  const [alarms, setAlarms] = useState([]);
  
  // Estado para indicar si estamos editando una alarma existente
  const [editingAlarmIndex, setEditingAlarmIndex] = useState(-1);
  
  // Cargar alarmas existentes al iniciar
  useEffect(() => {
    fetchAlarms();
  }, []);
  
  // Función para obtener las alarmas del usuario desde el backend
  const fetchAlarms = async () => {
    try {
      const userId = 1; // Reemplazar con el ID real del usuario logueado
      const response = await fetch(`http://localhost:8080/api/alarm-config/user/${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        setAlarms(data);
      } else {
        console.error('Error al obtener alarmas');
      }
    } catch (error) {
      console.error('Error al obtener alarmas:', error);
    }
  };

  const onChangeStartTime = (event, selectedDate) => {
    setShowStartTimePicker(false); // Ocultar el selector después de la interacción
    if (event.type === 'set' && selectedDate) { // Solo actualizar si se seleccionó una fecha
      const now = new Date();
      // Verificar que la hora seleccionada no sea anterior a la hora actual
      if (selectedDate.getHours() < now.getHours() || 
          (selectedDate.getHours() === now.getHours() && selectedDate.getMinutes() < now.getMinutes())) {
        // Si es anterior, establecer la hora actual + 5 minutos
        const adjustedTime = new Date();
        adjustedTime.setMinutes(adjustedTime.getMinutes() + 5);
        setAlarmStartTime(adjustedTime);
        Alert.alert('Aviso', 'No se puede seleccionar una hora anterior a la actual. Se ha ajustado automáticamente.');
      } else {
        setAlarmStartTime(selectedDate);
      }
    }
  };

  const onChangeEndTime = (event, selectedDate) => {
    setShowEndTimePicker(false); // Ocultar el selector después de la interacción
    if (event.type === 'set' && selectedDate) { // Solo actualizar si se seleccionó una fecha
      // Verificar que la hora de fin sea posterior a la hora de inicio
      if (selectedDate.getHours() < alarmStartTime.getHours() || 
          (selectedDate.getHours() === alarmStartTime.getHours() && 
           selectedDate.getMinutes() <= alarmStartTime.getMinutes())) {
        // Si es anterior o igual, establecer la hora de inicio + 30 minutos
        const adjustedTime = new Date(alarmStartTime);
        adjustedTime.setMinutes(adjustedTime.getMinutes() + 30);
        setAlarmEndTime(adjustedTime);
        Alert.alert('Aviso', 'La hora de fin debe ser posterior a la hora de inicio. Se ha ajustado automáticamente.');
      } else {
        setAlarmEndTime(selectedDate);
      }
    }
  };
  
  // Función para alternar la selección de un día
  const toggleDay = (index) => {
    const newSelectedDays = [...selectedDays];
    newSelectedDays[index] = !newSelectedDays[index];
    setSelectedDays(newSelectedDays);
  };
  
  // Función para convertir el array de días seleccionados a string para el backend
  const getDaysOfWeekString = () => {
    const selectedIndices = selectedDays
      .map((selected, index) => selected ? index + 1 : null)
      .filter(day => day !== null);
    
    return selectedIndices.length > 0 ? selectedIndices.join(',') : "1,2,3,4,5"; // Por defecto días laborables si no hay selección
  };
  
  // Función para convertir el string de días del backend a array para la UI
  const parseDaysOfWeekString = (daysString) => {
    const daysArray = [false, false, false, false, false, false, false];
    if (daysString) {
      const days = daysString.split(',').map(day => parseInt(day.trim()));
      days.forEach(day => {
        if (day >= 1 && day <= 7) {
          daysArray[day - 1] = true;
        }
      });
    }
    return daysArray;
  };
  
  // Función para editar una alarma existente
  const editAlarm = (index) => {
    const alarm = alarms[index];
    
    // Convertir strings de tiempo a objetos Date
    const today = new Date();
    
    const startTimeParts = alarm.windowStartTime.split(':');
    const startTime = new Date(today);
    startTime.setHours(parseInt(startTimeParts[0]), parseInt(startTimeParts[1]), 0);
    
    const endTimeParts = alarm.windowEndTime.split(':');
    const endTime = new Date(today);
    endTime.setHours(parseInt(endTimeParts[0]), parseInt(endTimeParts[1]), 0);
    
    // Actualizar el estado con los valores de la alarma seleccionada
    setAlarmStartTime(startTime);
    setAlarmEndTime(endTime);
    setIsAlarmActive(alarm.enabled);
    setSelectedDays(parseDaysOfWeekString(alarm.daysOfWeek));
    setEditingAlarmIndex(index);
  };
  
  // Función para eliminar una alarma
  const deleteAlarm = async (alarmId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/alarm-config/${alarmId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Actualizar la lista de alarmas
        fetchAlarms();
        Alert.alert('Éxito', 'Alarma eliminada correctamente');
      } else {
        Alert.alert('Error', 'No se pudo eliminar la alarma');
      }
    } catch (error) {
      console.error('Error al eliminar alarma:', error);
      Alert.alert('Error', 'Error al eliminar la alarma: ' + error.message);
    }
  };
  
  // Función para confirmar eliminación
  const confirmDeleteAlarm = (alarmId) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar esta alarma?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => deleteAlarm(alarmId) }
      ]
    );
  };

  const saveAlarmSettings = async () => {
    try {
      // Verificar que al menos un día esté seleccionado
      if (!selectedDays.some(day => day)) {
        Alert.alert('Error', 'Debes seleccionar al menos un día de la semana');
        return;
      }
      
      // Obtener el userId del almacenamiento local o estado global
      const userId = 1; // Reemplazar con el ID real del usuario logueado
      
      // Formatear los datos para enviar al backend
      const alarmConfigData = {
        user: { user_id: userId },
        enabled: isAlarmActive,
        targetTime: alarmEndTime.toISOString().substr(11, 8), // HH:MM:SS
        windowStartTime: alarmStartTime.toISOString().substr(11, 8), // HH:MM:SS
        windowEndTime: alarmEndTime.toISOString().substr(11, 8), // HH:MM:SS
        daysOfWeek: getDaysOfWeekString()
      };
      
      // Si estamos editando, incluir el ID
      if (editingAlarmIndex >= 0 && alarms[editingAlarmIndex]) {
        alarmConfigData.alarmConfigId = alarms[editingAlarmIndex].alarmConfigId;
      }
      
      console.log('Enviando configuración de alarma:', alarmConfigData);
      
      // Enviar datos al backend
      const response = await fetch('http://localhost:8080/api/alarm-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alarmConfigData),
      });
      
      if (!response.ok) {
        throw new Error('Error al guardar la configuración de alarma');
      }
      
      const savedConfig = await response.json();
      console.log('Configuración guardada exitosamente:', savedConfig);
      
      // Actualizar la lista de alarmas
      fetchAlarms();
      
      // Resetear el formulario
      resetForm();
      
      Alert.alert('Éxito', 'Configuración de alarma guardada!');
    } catch (error) {
      console.error('Error al guardar la configuración de alarma:', error);
      Alert.alert('Error', 'Error al guardar la configuración: ' + error.message);
    }
  };
  
  // Función para resetear el formulario
  const resetForm = () => {
    setEditingAlarmIndex(-1);
    setSelectedDays([false, false, false, false, false, false, false]);
    setIsAlarmActive(true);
    // Mantener las horas actuales
  };

  const toggleAlarmActive = () => {
    setIsAlarmActive(!isAlarmActive);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Reloj</Text>
        <SmartClock size={200} style={{ marginBottom: 16 }} />

        <Text style={styles.title}>Configurar Alarma Inteligente</Text>
        
        {/* Panel de días de la semana */}
        <View style={styles.daysContainer}>
          {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.dayCircle, 
                selectedDays[index] && styles.dayCircleSelected
              ]}
              onPress={() => toggleDay(index)}
            >
              <Text style={[
                styles.dayText, 
                selectedDays[index] && styles.dayTextSelected
              ]}>
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Formulario de configuración de alarma */}
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Ventana de Despertar:</Text>
          <View style={styles.timePickerContainer}>
            <Button onPress={() => setShowStartTimePicker(true)} title={alarmStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
            {showStartTimePicker && (
              <DateTimePicker
                testID="startTimePicker"
                value={alarmStartTime}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onChangeStartTime}
            />
          )}
          <Text style={styles.timeSeparator}> - </Text>
          <Button onPress={() => setShowEndTimePicker(true)} title={alarmEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
          {showEndTimePicker && (
            <DateTimePicker
              testID="endTimePicker"
              value={alarmEndTime}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onChangeEndTime}
            />
          )}
        </View>
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Sonido:</Text>
        <Switch
          value={isSoundEnabled}
          onValueChange={setIsSoundEnabled}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Vibración:</Text>
        <Switch
          value={isVibrationEnabled}
          onValueChange={setIsVibrationEnabled}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Activar Alarma:</Text>
        <Switch
          value={isAlarmActive}
          onValueChange={toggleAlarmActive}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title={editingAlarmIndex >= 0 ? "Actualizar Alarma" : "Guardar Alarma"}
          onPress={saveAlarmSettings}
          color="#4CAF50"
        />
        
        {editingAlarmIndex >= 0 && (
          <Button
            title="Cancelar Edición"
            onPress={resetForm}
            color="#FF9800"
          />
        )}
      </View>

      {/* Panel de alarmas guardadas */}
      <View style={styles.alarmsPanel}>
        <Text style={styles.subtitle}>Mis Alarmas</Text>
        
        {alarms.length === 0 ? (
          <Text style={styles.noAlarmsText}>No hay alarmas configuradas</Text>
        ) : (
          alarms.map((alarm, index) => (
            <View key={index} style={styles.alarmItem}>
              <View style={styles.alarmInfo}>
                <Text style={styles.alarmTime}>
                  {alarm.windowStartTime.substring(0, 5)} - {alarm.windowEndTime.substring(0, 5)}
                </Text>
                <Text style={styles.alarmDays}>
                  Días: {parseDaysOfWeekString(alarm.daysOfWeek)
                    .map((selected, i) => selected ? ['L', 'M', 'X', 'J', 'V', 'S', 'D'][i] : null)
                    .filter(day => day !== null)
                    .join(', ')}
                </Text>
                <Text style={[styles.alarmStatus, alarm.enabled ? styles.alarmEnabled : styles.alarmDisabled]}>
                  {alarm.enabled ? 'Activa' : 'Inactiva'}
                </Text>
              </View>
              
              <View style={styles.alarmActions}>
                <TouchableOpacity onPress={() => editAlarm(index)} style={styles.actionButton}>
                  <Ionicons name="pencil" size={24} color="#2196F3" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => confirmDeleteAlarm(alarm.alarmConfigId)} style={styles.actionButton}>
                  <Ionicons name="trash" size={24} color="#F44336" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
      </ScrollView>

      <Text style={styles.infoText}>
        La alarma se activará en la fase de sueño ligero dentro de la ventana de tiempo definida.
        Si no se detecta sueño ligero, sonará a la hora final.
      </Text>

      {/* Placeholder para futuras visualizaciones de datos de sueño */}
      <View style={styles.sleepDataPlaceholder}>
        <Text style={styles.sleepDataText}>Aquí se mostrarán los datos de sueño en tiempo real y las fases.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 24,
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  timePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeSeparator: {
    fontSize: 18,
    marginHorizontal: 10,
    color: '#777',
  },
  alarmStatusText: {
    fontSize: 16,
    color: '#4CAF50',
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  // Estilos para los círculos de días
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    borderWidth: 1,
    borderColor: '#BDBDBD',
  },
  dayCircleSelected: {
    backgroundColor: '#2196F3',
    borderColor: '#1976D2',
  },
  dayText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#757575',
  },
  dayTextSelected: {
    color: 'white',
  },
  // Estilos para el panel de alarmas
  alarmsPanel: {
    marginTop: 16,
  },
  alarmItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  alarmInfo: {
    flex: 1,
  },
  alarmTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  alarmDays: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  alarmStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  alarmEnabled: {
    color: '#4CAF50',
  },
  alarmDisabled: {
    color: '#F44336',
  },
  alarmActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  noAlarmsText: {
    textAlign: 'center',
    color: '#757575',
    fontSize: 16,
    marginTop: 16,
    fontStyle: 'italic',
  },
  sleepDataPlaceholder: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#e9ecef',
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  sleepDataText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
  },
});

export default AlarmScreen;
