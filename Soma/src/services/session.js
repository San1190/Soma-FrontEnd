import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export async function setItem(key, value) {
  if (Platform.OS === 'web') {
    await AsyncStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

export async function getItem(key) {
  if (Platform.OS === 'web') {
    return await AsyncStorage.getItem(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
}

export async function deleteItem(key) {
  if (Platform.OS === 'web') {
    await AsyncStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
}

// Guardar usuario
export async function saveUserSession(user) {
  try {
    await setItem('user', JSON.stringify(user));
    console.log('Usuario guardado:', user.email);
  } catch (error) {
    console.error('Error guardando usuario:', error);
  }
}

// Obtener usuario
export async function getUserSession() {
  try {
    const data = await getItem('user');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error recuperando sesión:', error);
    return null;
  }
}

// Eliminar sesión
export async function clearUserSession() {
  try {
    await deleteItem('user');
    console.log('Sesión eliminada');
  } catch (error) {
    console.error('Error eliminando sesión:', error);
  }
}
