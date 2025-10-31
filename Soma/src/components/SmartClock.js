import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SmartClock = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.timeText}>--:--</Text>
      <Text style={styles.dateText}>--/--/----</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  timeText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  dateText: {
    fontSize: 18,
    color: '#666',
  },
});

export default SmartClock;