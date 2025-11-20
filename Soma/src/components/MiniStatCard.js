import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const MiniStatCard = ({ title, subtitle, mode = 'bars', value, bars = [], color = '#4b3340' }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {mode === 'bars' ? (
        <View style={styles.barRow}>{bars.map((h, i) => (<View key={`${title}-${i}`} style={[styles.bar, { height: h, backgroundColor: color }]} />))}</View>
      ) : (
        <Text style={styles.value}>{value}</Text>
      )}
      <Text style={styles.subtitle}>{subtitle}</Text>
      <Text style={styles.pulse}>pulsa para leer</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { flex: 1, borderRadius: 18, padding: 18, backgroundColor: '#EFEFEF' },
  title: { fontSize: 14, fontWeight: '600' },
  barRow: { flexDirection: 'row', alignItems: 'flex-end', height: 90, gap: 8, marginVertical: 10 },
  bar: { width: 16, borderRadius: 10 },
  value: { fontSize: 28, fontWeight: '700', marginVertical: 10 },
  subtitle: { fontSize: 14, fontWeight: '700', marginVertical: 4 },
  pulse: { color: '#6b7280' },
});

export default MiniStatCard;