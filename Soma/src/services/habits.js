import axios from 'axios';
import API_BASE_URL from '../constants/api';

const HABITS_API_URL = `${API_BASE_URL}/habits`;

export async function getCompletedHabits(userId) {
  try {
    const res = await axios.get(`${HABITS_API_URL}/completed/${userId}`);
    return res.data;
  } catch (e) {
    console.error('Error al obtener hábitos completados:', e);
    throw e;
  }
}

export async function completeHabit(userId, habitId) {
  try {
    const res = await axios.post(`${HABITS_API_URL}/${habitId}/complete`, { userId });
    return res.data;
  } catch (e) {
    console.error('Error al completar hábito:', e);
    throw e;
  }
}

export async function answerAssessment(userId, habitId, questionKey, answer) {
  try {
    const res = await axios.post(`${HABITS_API_URL}/${habitId}/assessment`, { userId, questionKey, answer });
    return res.data;
  } catch (e) {
    console.error('Error al registrar respuesta de hábito:', e);
    throw e;
  }
}

