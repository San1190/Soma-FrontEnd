import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HabitsHistoryScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}><Ionicons name="checkmark-done" size={22} color="#3a2a32" /><Text style={styles.title}>Historial de hábitos</Text></View>
      <Text style={styles.desc}>Listado y progreso de hábitos completados y en curso.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex:1, backgroundColor:'#fff', padding:16 },
  header: { flexDirection:'row', alignItems:'center', marginBottom:12 },
  title: { fontSize:18, fontWeight:'700', marginLeft:8, color:'#1a1a1a' },
  desc: { fontSize:14, color:'#555' },
});
