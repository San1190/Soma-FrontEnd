import axios from 'axios';
import API_BASE_URL from '../constants/api';

export async function getDailySummary(userId) {
  const res = await axios.get(`${API_BASE_URL}/summary/daily/${userId}`);
  return res.data;
}

