import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';

export default function App() {
  const [users, setUsers] = useState([]);

  const getAllUsers = async () => {
    try {
      // Para emulador Android usa: 'http://10.0.2.2:8080/api/users'
      // Para PC/Web usa: 'http://localhost:8080/api/users'
      const res = await fetch('http://localhost:8080/api/users');

      if (!res.ok) {
        throw new Error('Error al obtener usuarios: ' + res.status);
      }

      const data = await res.json();
      console.log('Usuarios:', data);
      setUsers(data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Cargar Usuarios" onPress={getAllUsers} />
      <FlatList
        data={users}
        keyExtractor={(item) => item.user_id.toString()} // Usa el campo correcto
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.first_name} {item.last_name}</Text>
            <Text>{item.email}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 50, padding: 10 },
  item: { borderBottomWidth: 1, borderColor: '#ccc', padding: 10 },
});
