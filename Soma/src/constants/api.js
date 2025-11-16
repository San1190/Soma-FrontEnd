import axios from 'axios';
import { getUserSession } from '../services/session';

const API_BASE_URL = 'http://localhost:8080/api';

export const apiClient = axios.create({ baseURL: API_BASE_URL });

apiClient.interceptors.request.use(async (config) => {
  try {
    const user = await getUserSession();
    if (user && user.token) {
      config.headers = { ...(config.headers || {}), Authorization: `Bearer ${user.token}` };
    }
  } catch {}
  return config;
});

export default API_BASE_URL;
