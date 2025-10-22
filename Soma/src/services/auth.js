import axios from 'axios';

// Cambia 'localhost' a '10.0.2.2' si pruebas en emulador Android
const API_URL = 'http://localhost:8080/api/users';

export async function register(userData) {
  // Enviar todos los campos del usuario (deja undefined los opcionales no completados)
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
}

// Si quieres mantener la función de login aquí también
export async function login(email, password) {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password_hash: password,
  });
  return response.data;
}
