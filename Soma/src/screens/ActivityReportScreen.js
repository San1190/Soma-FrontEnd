import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getUserById } from '../services/users';

const ActivityReportScreen = () => {
  const { user } = useAuth();
  const [exerciseHistory, setExerciseHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dailyReports, setDailyReports] = useState({});
  const [weeklyReports, setWeeklyReports] = useState({});

  useEffect(() => {
    const fetchExerciseHistory = async () => {
      if (!user || !user.id) {
        setError('User not authenticated or user ID not available.');
        setLoading(false);
        return;
      }
      try {
        const userData = await getUserById(user.id);
        if (userData && userData.breathingExercises) {
          setExerciseHistory(userData.breathingExercises);
          processReports(userData.breathingExercises);
        }
      } catch (err) {
        setError('Failed to fetch exercise history: ' + err.message);
        console.error('Error fetching exercise history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseHistory();
  }, [user]);

  const processReports = (history) => {
    const daily = {};
    const weekly = {};

    history.forEach(exercise => {
      const date = new Date(exercise.timestamp);
      const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay()); // Domingo como inicio de semana
      const weekString = startOfWeek.toISOString().split('T')[0];

      // Reportes diarios
      if (!daily[dateString]) {
        daily[dateString] = { totalDuration: 0, totalCycles: 0, heartRateChanges: [], stressLevelChanges: [] };
      }
      daily[dateString].totalDuration += exercise.duration;
      daily[dateString].totalCycles += exercise.cycles;
      if (exercise.heartRateChange !== undefined) daily[dateString].heartRateChanges.push(exercise.heartRateChange);
      if (exercise.stressLevelChange !== undefined) daily[dateString].stressLevelChanges.push(exercise.stressLevelChange);

      // Reportes semanales
      if (!weekly[weekString]) {
        weekly[weekString] = { totalDuration: 0, totalCycles: 0, heartRateChanges: [], stressLevelChanges: [] };
      }
      weekly[weekString].totalDuration += exercise.duration;
      weekly[weekString].totalCycles += exercise.cycles;
      if (exercise.heartRateChange !== undefined) weekly[weekString].heartRateChanges.push(exercise.heartRateChange);
      if (exercise.stressLevelChange !== undefined) weekly[weekString].stressLevelChanges.push(exercise.stressLevelChange);
    });

    // Calcular promedios para reportes diarios
    Object.keys(daily).forEach(dateString => {
      const report = daily[dateString];
      report.avgHeartRateChange = report.heartRateChanges.length > 0 ? report.heartRateChanges.reduce((a, b) => a + b) / report.heartRateChanges.length : 0;
      // Aquí se podría hacer un procesamiento más sofisticado para stressLevelChanges si fueran numéricos
    });

    // Calcular promedios para reportes semanales
    Object.keys(weekly).forEach(weekString => {
      const report = weekly[weekString];
      report.avgHeartRateChange = report.heartRateChanges.length > 0 ? report.heartRateChanges.reduce((a, b) => a + b) / report.heartRateChanges.length : 0;
      // Aquí se podría hacer un procesamiento más sofisticado para stressLevelChanges si fueran numéricos
    });

    setDailyReports(daily);
    setWeeklyReports(weekly);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.exerciseItem}>
      <Text>Fecha: {new Date(item.timestamp).toLocaleDateString()}</Text>
      <Text>Duración: {item.duration.toFixed(2)} segundos</Text>
      <Text>Ciclos: {item.cycles}</Text>
      {item.heartRateChange !== undefined && (
        <Text>Cambio FC: {item.heartRateChange.toFixed(2)}</Text>
      )}
      {item.stressLevelChange !== undefined && (
        <Text>Cambio Estrés: {item.stressLevelChange}</Text>
      )}
    </View>
  );

  const renderDailyReport = ([date, report]) => (
    <View key={date} style={styles.reportItem}>
      <Text style={styles.reportTitle}>Día: {date}</Text>
      <Text>Duración Total: {report.totalDuration.toFixed(2)} segundos</Text>
      <Text>Ciclos Totales: {report.totalCycles}</Text>
      {report.avgHeartRateChange !== undefined && (
        <Text>Cambio FC Promedio: {report.avgHeartRateChange.toFixed(2)}</Text>
      )}
    </View>
  );

  const renderWeeklyReport = ([week, report]) => (
    <View key={week} style={styles.reportItem}>
      <Text style={styles.reportTitle}>Semana que inicia: {week}</Text>
      <Text>Duración Total: {report.totalDuration.toFixed(2)} segundos</Text>
      <Text>Ciclos Totales: {report.totalCycles}</Text>
      {report.avgHeartRateChange !== undefined && (
        <Text>Cambio FC Promedio: {report.avgHeartRateChange.toFixed(2)}</Text>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Informe de Actividad</Text>

      <Text style={styles.sectionTitle}>Reportes Diarios</Text>
      {Object.keys(dailyReports).length > 0 ? (
        <FlatList
          data={Object.entries(dailyReports).sort(([a], [b]) => b.localeCompare(a))}
          renderItem={renderDailyReport}
          keyExtractor={([date]) => date}
          scrollEnabled={false} // Deshabilitar scroll interno para que ScrollView padre funcione
        />
      ) : (
        <Text>No hay reportes diarios disponibles.</Text>
      )}

      <Text style={styles.sectionTitle}>Reportes Semanales</Text>
      {Object.keys(weeklyReports).length > 0 ? (
        <FlatList
          data={Object.entries(weeklyReports).sort(([a], [b]) => b.localeCompare(a))}
          renderItem={renderWeeklyReport}
          keyExtractor={([week]) => week}
          scrollEnabled={false} // Deshabilitar scroll interno para que ScrollView padre funcione
        />
      ) : (
        <Text>No hay reportes semanales disponibles.</Text>
      )}

      <Text style={styles.sectionTitle}>Historial de Ejercicios Individuales</Text>
      {exerciseHistory.length > 0 ? (
        <FlatList
          data={exerciseHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          scrollEnabled={false} // Deshabilitar scroll interno para que ScrollView padre funcione
        />
      ) : (
        <Text>No hay ejercicios de respiración registrados aún.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#555',
  },
  list: {
    width: '100%',
  },
  exerciseItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  reportItem: {
    backgroundColor: '#e0f7fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ActivityReportScreen;