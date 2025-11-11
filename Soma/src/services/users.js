// src/services/users.js
import axios from 'axios';
import API_BASE_URL from '../constants/api'; // Importamos la URL central

const USERS_API_URL = `${API_BASE_URL}/users`; // URL completa: http://192.168.1.31:8080/api/users

export async function getAllUsers() {
  // Corregido: 'res.ok' no existe en axios, axios lanza error si no es 2xx
  try {
    const res = await axios.get(USERS_API_URL);
    return res.data;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw new Error('Error al obtener usuarios');
  }
}

export async function getUserById(id) {
  try {
    const res = await axios.get(`${USERS_API_URL}/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error al obtener usuario por ID:', error);
    throw new Error('Error al obtener usuario');
  }
}

export const updateUser = async (id, userData) => {
  try {
    const response = await axios.put(`${USERS_API_URL}/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};