import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const MiniStatCard = ({ title, subtitle, mode = 'bars', value, bars = [], color = '#4b3340' }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const getDetailText = () => {
    switch (title.toLowerCase()) {
      case 'fase': return "Tu fase REM ha mejorado un 12% esta semana. Sigue así.";
      case 'profundidad': return "Has alcanzado 2h de sueño profundo. Ideal para la recuperación.";
      case 'microsueño': return "Nivel de alerta óptimo. No se detectan microsueños peligrosos.";
      default: return "Más detalles disponibles próximamente.";
    }
  };

  return (
    <TouchableOpacity style={[styles.card, expanded && styles.cardExpanded]} onPress={toggleExpand} activeOpacity={0.8}>
      <Text style={styles.title}>{title}</Text>
      {mode === 'bars' ? (
        <View style={styles.barRow}>{bars.map((h, i) => (<View key={`${title}-${i}`} style={[styles.bar, { height: h, backgroundColor: color }]} />))}</View>
      ) : (
        <Text style={styles.value}>{value}</Text>
      )}
      <Text style={styles.subtitle}>{subtitle}</Text>
      <Text style={styles.pulse}>{expanded ? "menos detalles" : "pulsa para leer"}</Text>

      {expanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.detailText}>{getDetailText()}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { flex: 1, borderRadius: 18, padding: 18, backgroundColor: '#EFEFEF', minWidth: 0, overflow: 'hidden' },
  cardExpanded: { backgroundColor: '#E1E8ED' },
  title: { fontSize: 14, fontWeight: '600' },
  barRow: { flexDirection: 'row', alignItems: 'flex-end', height: 90, gap: 4, marginVertical: 10, paddingHorizontal: 4 },
  bar: { flex: 1, borderRadius: 10, minWidth: 0 },
  value: { fontSize: 28, fontWeight: '700', marginVertical: 10 },
  subtitle: { fontSize: 14, fontWeight: '700', marginVertical: 4 },
  pulse: { color: '#6b7280', marginTop: 4, fontSize: 12 },
  expandedContent: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)' },
  detailText: { fontSize: 13, color: '#4b5563', lineHeight: 18 }
});

export default MiniStatCard;