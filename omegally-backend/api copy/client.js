import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Token storage (in memory for access token, localStorage for refresh token)
let accessToken = null;
let refreshToken = localStorage.getItem('refreshToken') || null;

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach access token to every request
apiClient.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 errors (token expired)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry && refreshToken) {
      originalRequest._retry = true;
      try {
        // Call refresh endpoint
        const response = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
        const newAccessToken = response.data.data.accessToken;

        // Update tokens
        accessToken = newAccessToken;
        // Optionally, the backend might also issue a new refresh token; handle if needed

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed – clear tokens and redirect to login
        localStorage.removeItem('refreshToken');
        refreshToken = null;
        accessToken = null;
        // Optionally redirect to login page
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Helper functions to set/clear tokens (used by AuthContext)
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