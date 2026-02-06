import axios from 'axios';

// 1. Create Instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 2. Request Interceptor: Attach JWT Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Response Interceptor: Handle Global Errors (like 401)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto-logout if token is invalid/expired
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 4. File URL Utility
export const getFileUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;

  // Get base URL without the /v1 suffix
  const baseUrl = (import.meta.env.REACT_APP_API_URL || 'http://localhost:5000/v1').replace('/v1', '');

  // Clean the path and prepend /storage/
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${baseUrl}/storage/${cleanPath}`;
};

export default apiClient;