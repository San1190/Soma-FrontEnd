import axios from 'axios';
import API_BASE_URL from '../constants/api'; // Importamos la URL central

// La URL base ahora es http://192.168.1.31:8080/api
const API_URL = `${API_BASE_URL}/users`;

export async function register(userData) {
  // Enviar todos los campos del usuario (deja undefined los opcionales no completados)
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
}

// Alias para compatibilidad con AuthContext
export const registerUser = async (name, email, password) => {
  return register({
    first_name: name,
    email,
    password_hash: password,
  });
};

// Si quieres mantener la función de login aquí también
export async function login(email, password) {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password_hash: password,
  });
  return response.data;
}