import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Platform, Switch } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; // Asumiendo que esta librería está instalada

const AlarmScreen = () => {
  const [alarmStartTime, setAlarmStartTime] = useState(new Date());
  const [alarmEndTime, setAlarmEndTime] = useState(new Date());
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isVibrationEnabled, setIsVibrationEnabled] = useState(true);
  const [isAlarmActive, setIsAlarmActive] = useState(false); // Nuevo estado para la alarma activa

  const onChangeStartTime = (event, selectedDate) => {
    setShowStartTimePicker(false); // Ocultar el selector después de la interacción
    if (event.type === 'set') { // Solo actualizar si se seleccionó una fecha
      setAlarmStartTime(selectedDate || alarmStartTime);
    }
  };

  const onChangeEndTime = (event, selectedDate) => {
    setShowEndTimePicker(false); // Ocultar el selector después de la interacción
    if (event.type === 'set') { // Solo actualizar si se seleccionó una fecha
      setAlarmEndTime(selectedDate || alarmEndTime);
    }
  };

  const saveAlarmSettings = () => {
    // Aquí se implementaría la lógica para guardar la configuración de la alarma
    // Esto incluiría enviar los datos al backend y configurar la alarma real
    console.log('Configuración de alarma guardada:', {
      alarmStartTime: alarmStartTime.toLocaleTimeString(),
      alarmEndTime: alarmEndTime.toLocaleTimeString(),
      isSoundEnabled,
      isVibrationEnabled,
    });
    alert('Configuración de alarma guardada!');
    // Después de guardar, podríamos activar la alarma automáticamente o esperar a que el usuario lo haga
    // setIsAlarmActive(true);
  };

  const toggleAlarmActive = () => {
    setIsAlarmActive(!isAlarmActive);
    // Aquí se podría añadir la lógica para activar/desactivar la alarma en el backend
    if (!isAlarmActive) {
      alert('Alarma inteligente activada!');
    } else {
      alert('Alarma inteligente desactivada!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurar Alarma Inteligente</Text>

      {isAlarmActive && (
        <Text style={styles.alarmStatusText}>
          Alarma activa de {alarmStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} a {alarmEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      )}

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
          onValueChange={setIsSoundEnabled}
          value={isSoundEnabled}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Vibración:</Text>
        <Switch
          onValueChange={setIsVibrationEnabled}
          value={isVibrationEnabled}
        />
      </View>

      <Button title="Guardar Configuración de Alarma" onPress={saveAlarmSettings} />

      <Button
        title={isAlarmActive ? "Desactivar Alarma" : "Activar Alarma"}
        onPress={toggleAlarmActive}
        color={isAlarmActive ? "#dc3545" : "#28a745"} // Rojo para desactivar, verde para activar
        style={styles.activateButton}
      />

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
    padding: 20,
    backgroundColor: '#f0f2f5',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  alarmStatusText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  settingLabel: {
    fontSize: 18,
    color: '#555',
    fontWeight: '600',
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
  activateButton: {
    marginTop: 20,
    width: '100%',
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
  infoText: {
    marginTop: 30,
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    lineHeight: 20,
  },
});

export default AlarmScreen;
