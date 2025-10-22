// src/services/users.js
export async function getAllUsers() {
  const res = await fetch('http://localhost:8080/api/users');
  if (!res.ok) throw new Error('Error al obtener usuarios');
  return await res.json();
}
