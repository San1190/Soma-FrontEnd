// src/services/users.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export async function getAllUsers() {
  const res = await axios.get(`${API_BASE_URL}/users`);
  if (!res.ok) throw new Error('Error al obtener usuarios');
  return res.data;
}

export async function getUserById(id) {
  const res = await axios.get(`${API_BASE_URL}/users/${id}`);
  if (!res.ok) throw new Error('Error al obtener usuario');
  return res.data;
}

export async function updateUser(id, userData) {
  try {
    const response = await axios.put(`${API_BASE_URL}/users/${id}`, userData);
    return response.data;
  } catch (error) {
      console.error('Error actualizando los datos del usuario:', error);
      throw error;
  }
}
