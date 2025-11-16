import axios from 'axios';
import { getUserSession } from '../services/session';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const resolveHostIp = () => {
  const hostUri = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost || '';
  const ip = hostUri.split(':')[0];
  return ip || 'localhost';
};

const API_BASE_URL = Platform.OS === 'web'
  ? 'http://localhost:8080/api'
  : `http://${resolveHostIp()}:8080/api`;

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
