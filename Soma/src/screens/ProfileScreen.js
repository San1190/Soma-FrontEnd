import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getUserById } from '../services/users';
import { updateUser } from '../services/users.js';

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pantalla de Perfil</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;