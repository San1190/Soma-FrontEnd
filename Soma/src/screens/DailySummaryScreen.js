import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Dimensions, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BarChart, LineChart, PieChart } from 'react-native-gifted-charts';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

export default function DailySummaryScreen() {
  const navigation = useNavigation();
  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  // Mock Data
  const stressData = [
    { value: 20, label: 'L' },
    { value: 15, label: 'M' },
    { value: 30, label: 'X' },
    { value: 45, label: 'J' },
    { value: 55, label: 'V' },
    { value: 60, label: 'S' },
    { value: 75, label: 'D', frontColor: '#4A3B52' },
  ];

  const sleepData = [
    { value: 60, frontColor: '#5F7F92' },
    { value: 50, frontColor: '#5F7F92' },
    { value: 70, frontColor: '#5F7F92' },
    { value: 40, frontColor: '#5F7F92' },
    { value: 65, frontColor: '#5F7F92' },
    { value: 55, frontColor: '#5F7F92' },
    { value: 80, frontColor: '#5F7F92' }
  ];

  const fatigueData = [
    { value: 20 }, { value: 25 }, { value: 40 }, { value: 50 }, { value: 60 }, { value: 70 }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="person" size={24} color="black" />
          <Switch
            trackColor={{ false: "#767577", true: "#000" }}
            thumbColor={isEnabled ? "#fff" : "#f4f3f4"}
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
        <Text style={styles.mainTitle}>Actividad</Text>
        <Text style={styles.subtitle}>Descubre de un vistazo cómo te encuentras y tu actividad diaria. ¡El movimiento es salud!</Text>

        {/* Stress Section */}
        <Text style={styles.sectionTitle}>Indicador del estrés</Text>
        <View style={[styles.card, styles.stressCard]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardDate}>Semana del 24 de noviembre</Text>
            <View style={styles.iconGroup}>
              <Ionicons name="add-circle-outline" size={20} color="#555" />
              <Ionicons name="chevron-down-circle-outline" size={20} color="#555" />
            </View>
          </View>
          <View style={styles.chartContainer}>
            <BarChart
              data={stressData}
              barWidth={22}
              noOfSections={3}
              barBorderRadius={4}
              frontColor={'#6B5B7B'}
              yAxisThickness={0}
              xAxisThickness={0}
              hideRules
              hideYAxisText
              height={100}
              width={screenWidth - 90}
              isAnimated
            />
          </View>
          <Text style={styles.cardStatusTitle}>Elevado</Text>
          <Text style={styles.cardDescription}>Tus picos de estrés han ido aumentando a lo largo de la semana, siendo el domingo tu peor día y la media es superior a la de la semana pasada.</Text>
        </View>

        {/* Sleep Section */}
        <Text style={styles.sectionTitle}>Indicador de insomnio (sueño)</Text>
        <View style={[styles.card, styles.sleepCard]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardDate}>Semana del 24 de noviembre</Text>
            <View style={styles.iconGroup}>
              <Ionicons name="add-circle-outline" size={20} color="#555" />
              <Ionicons name="chevron-down-circle-outline" size={20} color="#555" />
            </View>
          </View>
          <View style={styles.chartContainer}>
            <BarChart
              data={sleepData}
              barWidth={22}
              noOfSections={3}
              barBorderRadius={4}
              yAxisThickness={0}
              xAxisThickness={0}
              hideRules
              hideYAxisText
              height={100}
              width={screenWidth - 90}
              isAnimated
            />
          </View>
          <Text style={styles.cardStatusTitle}>Calidad de sueño 16% mejor</Text>
          <Text style={styles.cardDescription}>Esta semana has tenido más ciclos de sueño completos y menos sueños interrumpidos en fase REM.</Text>
        </View>

        {/* Visual Fatigue Section */}
        <Text style={styles.sectionTitle}>Indicador de fatiga visual</Text>
        <View style={[styles.card, styles.fatigueCard]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardDate}>Semana del 24 de noviembre</Text>
            <View style={styles.iconGroup}>
              <Ionicons name="add-circle-outline" size={20} color="#555" />
              <Ionicons name="chevron-down-circle-outline" size={20} color="#555" />
            </View>
          </View>
          <View style={styles.chartContainer}>
            <LineChart
              data={fatigueData}
              curved
              thickness={5}
              color="#666"
              hideRules
              hideYAxisText
              hideAxesAndRules
              height={100}
              width={screenWidth - 90}
              dataPointsColor={'white'}
              dataPointsRadius={6}
              isAnimated
            />
          </View>
          <Text style={styles.cardStatusTitle}>Tu fatiga visual 38% mejor</Text>
          <Text style={styles.cardDescription}>Esta semana has logrado mejorar mucho, hemos visto que has completado dos hábitos relacionados con la fatiga. ¡Felicidades!</Text>
        </View>

        {/* Physical Activity Section */}
        <Text style={styles.sectionTitle}>Actividad física</Text>
        <View style={styles.cardHeader}>
          <Text style={styles.cardDate}>Hoy</Text>
          <View style={styles.iconGroup}>
            <Ionicons name="add" size={20} color="#555" />
            <Ionicons name="chevron-down" size={20} color="#555" />
          </View>
        </View>

        {/* Small Cards Row */}
        <View style={styles.smallCardContainer}>
          {/* Energy */}
          <View style={styles.smallCard}>
            <Text style={styles.smallCardLabel}>Energía en reposo</Text>
            <Text style={styles.smallCardValue}>1013 kcal</Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 30, gap: 2 }}>
              {[...Array(10)].map((_, i) => <View key={i} style={{ width: 4, height: Math.random() * 20 + 5, backgroundColor: '#555', borderRadius: 2 }} />)}
            </View>
          </View>

          {/* Movement */}
          <View style={styles.smallCard}>
            <Text style={styles.smallCardLabel}>Movimiento</Text>
            <Text style={styles.smallCardValue}>128 kcal</Text>
            <View style={{ alignItems: 'center' }}>
              <PieChart
                data={[{ value: 70, color: 'black' }, { value: 30, color: 'transparent' }]}
                donut
                radius={25}
                innerRadius={18}
                backgroundColor="transparent"
              />
            </View>
          </View>
        </View>

        {/* Distance */}
        <View style={styles.smallCardContainer}>
          <View style={[styles.smallCard, { width: '100%' }]}>
            <Text style={styles.smallCardLabel}>Distancia andando/corriendo</Text>
            <Text style={styles.smallCardValue}>3 km</Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 30, gap: 4 }}>
              {[...Array(20)].map((_, i) => <View key={i} style={{ width: 4, height: Math.random() * 20 + 5, backgroundColor: '#555', borderRadius: 2 }} />)}
            </View>
          </View>
        </View>

        {/* Steps */}
        <View style={styles.smallCardContainer}>
          <View style={[styles.smallCard, { width: '100%' }]}>
            <Text style={styles.smallCardLabel}>Pasos</Text>
            <Text style={styles.smallCardValue}>430 pasos</Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 30, gap: 4 }}>
              {[...Array(20)].map((_, i) => <View key={i} style={{ width: 4, height: Math.random() * 20 + 5, backgroundColor: '#555', borderRadius: 2 }} />)}
            </View>
          </View>
        </View>

        {/* Advice Button */}
        <TouchableOpacity style={styles.adviceButton} onPress={() => navigation.navigate('Home', { screen: 'Chat' })}>
          <Text style={styles.adviceButtonText}>Dame consejos sobre mi actividad Somat</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F5', // Light gray/blueish background
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
  },
  card: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  stressCard: {
    backgroundColor: '#CDB4DB', // Muted Purple
  },
  sleepCard: {
    backgroundColor: '#C3E0DC', // Muted Teal
  },
  fatigueCard: {
    backgroundColor: '#C9E4CA', // Muted Green
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardDate: {
    fontSize: 12,
    color: '#444',
    fontWeight: '500',
  },
  iconGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 15,
    overflow: 'hidden', // Ensure chart doesn't bleed
  },
  cardStatusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 12,
    color: '#333',
    lineHeight: 18,
  },
  smallCardContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  smallCard: {
    flex: 1,
    backgroundColor: '#E6E6E6',
    borderRadius: 20,
    padding: 15,
    justifyContent: 'space-between',
  },
  smallCardLabel: {
    fontSize: 11,
    color: '#555',
    fontWeight: '600',
  },
  smallCardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 8,
  },
  adviceButton: {
    backgroundColor: '#000',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  adviceButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
