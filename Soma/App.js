// App.js

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

// 1. ¡IMPORTAMOS NUESTRO JUGUETE!
// Le decimos a App.js dónde encontrar el componente Contador.
import Contador from './src/components/Contador';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido a mi App de Juguetes!</Text>
      
      {/* 2. ¡USAMOS NUESTRO JUGUETE AQUÍ!
          Lo llamamos como si fuera una etiqueta de HTML. */}
      <Contador />

      {/* Puedes añadir más si quieres, ¡son reutilizables! */}
      <Contador />
      

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  }
});