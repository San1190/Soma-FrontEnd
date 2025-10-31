import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Calories from '../components/Calories';
import HeartRate from '../components/HeartRate';
import SomaticMirror from '../components/SomaticMirror'; // Importar SomaticMirror

const DashboardScreen = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Tarjeta del primer gráfico */}
      <Calories
        // props opcionales; puedes eliminarlas si usas los defaults
        title="Calorías (semana)"
        style={{ marginTop: 8 }}
        chartProps={{}}
      />

      <HeartRate />
      <SomaticMirror />

      {/* Aquí irán los demás componentes del dashboard */}
      {/* <ChartCard /> */}
      {/* <RecommendationBox /> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16, paddingBottom: 32 },
});

export default DashboardScreen;