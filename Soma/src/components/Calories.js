import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

const defaultLabels = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];

// Datos reales (sin el punto sintético)
const baseA = [900, 980, 1050, 1120, 1200, 1250, 1180];
const baseB = [650, 720, 760, 800, 820, 860, 900];

const STATIC_POINT_A = 850;
const STATIC_POINT_B = 700;

const addStaticHeadPoint = (arr, staticValue) => [
  { value: staticValue, label: '' },      // punto fijo
  ...arr.map((v, i) => ({ value: v, label: defaultLabels[i] })), // resto
];

const defaultA = addStaticHeadPoint(baseA, STATIC_POINT_A);
const defaultB = addStaticHeadPoint(baseB, STATIC_POINT_B);

const HealthStackedArea = (props) => {
  const {
    title = 'Calorías (semana)',
    seriesA = defaultA,
    seriesB = defaultB,
    colorA = '#6cbf6c',
    colorB = '#a6d88a',
    height = 220,
    style,
    chartProps = {},
  } = props;

  const xLabels = seriesA.map(p => p.label ?? '');

  return (
    <View style={[styles.card, style]}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.legend}>
        <View style={[styles.dot, { backgroundColor: colorA }]} />
        <Text style={styles.legendText}>Calorías Quemadas</Text>
        <View style={[styles.dot, { backgroundColor: colorB, marginLeft: 12 }]} />
        <Text style={styles.legendText}>Calorías Consumidas</Text>
      </View>

      <LineChart
        areaChart
        curved
        data={seriesA}
        data2={seriesB}
        height={height}
        thickness={2}
        color={colorA}
        color2={colorB}
        startFillColor={colorA}
        startFillColor2={colorB}
        startOpacity={0.35}
        startOpacity2={0.35}
        endOpacity={0.05}
        endOpacity2={0.05}
        xAxisLabelTexts={xLabels}
        hideRules
        yAxisTextStyle={{ color: '#94a3b8' }}
        xAxisLabelTextStyle={{ color: '#94a3b8', fontSize: 11 }}
        showDataPoints              
        showDataPoints2             
        dataPointsColor="#1f2937"   
        dataPointsColor2="#2563eb"  
        dataPointsRadius={2.5}      
        xAxisLabelWidth={34}
        initialSpacing={0}          
        endSpacing={0}  

        spacing={28}
        adjustToWidth
        backgroundColor="transparent"
        intersectionAreaColor="#ffffff"
        intersectionOpacity={1}
        {...chartProps}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    marginBottom: 15,
  },
  title: { fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 8 },
  legend: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  legendText: { color: '#64748b', fontSize: 12 },
});

export default HealthStackedArea;
