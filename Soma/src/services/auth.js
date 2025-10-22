import axios from 'axios';

// Para emulador Android cambia 'localhost' por '10.0.2.2'
const API_URL = 'http://localhost:8080/api/users';

export async function login(email, password) {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password_hash: password,
  });
  return response.data;
}

export async function register({ first_name, last_name, email, password }) {
  const response = await axios.post(`${API_URL}/register`, {
    first_name,
    last_name,
    email,
    password_hash: password,
  });
  return response.data;
}
