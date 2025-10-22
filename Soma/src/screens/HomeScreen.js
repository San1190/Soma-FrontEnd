import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { getAllUsers } from '../services/users';

export default function HomeScreen() {
  const [users, setUsers] = useState([]);

  const handleGetUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pantalla de Inicio (Home)</Text>
      <Button title="Cargar Usuarios" onPress={handleGetUsers} />
      <FlatList
        data={users}
        keyExtractor={item => item.user_id.toString()}
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
  container: { flex: 1, marginTop: 50, padding: 10, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  item: { borderBottomWidth: 1, borderColor: '#ccc', padding: 10 },
});
