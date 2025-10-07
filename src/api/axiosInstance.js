
import axios from 'axios';
import { getUserFromCookies } from '../utils/Cookie-utils';

//const API_BASE_URL = 'http://192.168.159.88:8086/api/v1';
const API_BASE_URL = 'http://localhost:8086/api/v1';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage (this is where it's stored during login)
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
