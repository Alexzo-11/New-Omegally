import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

let accessToken = null;
let refreshToken = localStorage.getItem('refreshToken') || null;

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor to add access token
apiClient.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && refreshToken) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
        const newAccessToken = response.data.data.accessToken;
        accessToken = newAccessToken;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed – logout
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const setAuthTokens = (newAccessToken, newRefreshToken) => {
  accessToken = newAccessToken;
  refreshToken = newRefreshToken;
  if (newRefreshToken) {
    localStorage.setItem('refreshToken', newRefreshToken);
  }
};

export const clearAuthTokens = () => {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem('refreshToken');
};

export default apiClient;