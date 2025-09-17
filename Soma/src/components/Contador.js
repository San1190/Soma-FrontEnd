// src/components/Contador.js

import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const Contador = () => {
  // 1. Creamos el state: una variable 'contador' y una función 'setContador' para cambiarla.
  const [contador, setContador] = useState(0);

  return (
    <View style={styles.container}>
      {/* 2. Mostramos el valor actual del state */}
      <Text style={styles.text}>Has pulsado el botón: {contador} veces</Text>

      {/* 3. Al pulsar, llamamos a la función que actualiza el state */}
      <Button
        title="Púlsame"
        onPress={() => setContador(contador + 1)}
      />
    </View>
  );
};

// Añadimos unos estilos básicos para que se vea mejor
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  }
});

// ¡¡LA LÍNEA MÁS IMPORTANTE!!
// Esto hace que nuestro componente "Contador" pueda ser importado y usado en otros archivos.
// Es como decir: "¡Mi juguete está listo para ser usado!".
export default Contador;