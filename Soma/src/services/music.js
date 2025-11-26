import axios from 'axios';
import API_BASE_URL from '../constants/api';

export async function getSuggestions(mood) {
  const res = await axios.get(`${API_BASE_URL}/music/suggestions`, { params: { mood } });
  return res.data || [];
}
