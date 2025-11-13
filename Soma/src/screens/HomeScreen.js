import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { getAllUsers } from '../services/users';
import { clearUserSession } from '../services/session'; // Importa para cerrar sesión
import { useNavigation } from '@react-navigation/native'; // Para redirigir
import { useTheme } from '../context/ThemeContext';

export default function HomeScreen() {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();
  const { currentTheme } = useTheme();

  const handleGetUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  const handleLogout = async () => {
  try {
    await clearUserSession();
    Alert.alert('Sesión cerrada', 'Has cerrado sesión correctamente.');

    // Obtener el navegador padre (nivel raíz)
    const rootNavigation = navigation.getParent();

    // Resetear navegación a AuthNavigator
    rootNavigation.reset({
      index: 0,
      routes: [{ name: 'Auth' }],
    });
  } catch (error) {
    console.error('Error cerrando sesión:', error);
  }
};


  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <Text style={[styles.title, { color: currentTheme.textPrimary }]}>Pantalla de Inicio (Home)</Text>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Button title="Cargar Usuarios" onPress={handleGetUsers} />
        <Button title="Cerrar Sesión" color="red" onPress={handleLogout} />
      </View>

      <FlatList
        data={users}
        keyExtractor={item => item.user_id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.item, { borderColor: currentTheme.borderColor }] }>
            <Text style={{ color: currentTheme.textPrimary }}>{item.first_name} {item.last_name}</Text>
            <Text style={{ color: currentTheme.textSecondary }}>{item.email}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 50, padding: 10, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  item: { borderBottomWidth: 1, padding: 10 },
});
