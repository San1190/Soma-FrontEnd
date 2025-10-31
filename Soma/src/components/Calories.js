import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

const defaultLabels = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];

// Datos de ejemplo: cada punto necesita { value, label }
const defaultA = [900, 980, 1050, 1120, 1200, 1250, 1180].map((v, i) => ({
  value: v,            // valor del día
  label: defaultLabels[i], // etiqueta del eje X
}));
const defaultB = [650, 720, 760, 800, 820, 860, 900].map((v, i) => ({
  value: v,
  label: defaultLabels[i],
}));

const HealthStackedArea = (props) => {
  const {
    title = 'Calorías (semana)',
    seriesA = defaultA,     //calorias quemadas
    seriesB = defaultB,     //calorias consumidas
    colorA = '#6cbf6c',   // verde 1
    colorB = '#a6d88a',   // verde 2
    height = 220,           //alto del lienzo
    style,
    chartProps = {},
  } = props;

  // xAxisLabelTexts: toma etiquetas de la primera serie para el eje X
  const xLabels = seriesA.map(p => p.label ?? '');

  return (
    <View style={[styles.card, style]}>
      <Text style={styles.title}>{title}</Text>

      {/* Leyenda simple con puntos de color */}
      <View style={styles.legend}>
        <View style={[styles.dot, { backgroundColor: colorA }]} />
        <Text style={styles.legendText}>Calorías Quemadas</Text>
        <View style={[styles.dot, { backgroundColor: colorB, marginLeft: 12 }]} />
        <Text style={styles.legendText}>Calorías Consumidas</Text>
      </View>

      <LineChart
        areaChart              // relleno bajo la línea
        curved                 // curva las líneas
        data={seriesA}         
        data2={seriesB}       
        height={height}
        thickness={2}          // grosor de las líneas
        color={colorA}         
        color2={colorB}        
        startFillColor={colorA}    
        startFillColor2={colorB}  
        startOpacity={0.35}        // opacidad superior del relleno
        startOpacity2={0.35}
        endOpacity={0.05}          // opacidad inferior
        endOpacity2={0.05}
        xAxisLabelTexts={xLabels}  // etiquetas eje X
        hideDataPoints             // oculta puntos 
        hideRules                  // oculta líneas guía horizontales
        yAxisTextStyle={{ color: '#94a3b8' }}   
        xAxisLabelTextStyle={{ color: '#94a3b8' }} 
        initialSpacing={16}        // margen antes del 1er punto
        spacing={28}               // separación entre puntos
        adjustToWidth              // ajusta al ancho disponible
        backgroundColor="transparent"
        intersectionAreaColor="#ffffff" // limpia solape en tema claro
        intersectionOpacity={1}
        {...chartProps}            // props extra opcionales
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
