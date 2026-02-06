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

// 4. File URL Utility - Returns Absolute URLs
export const getFileUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;

  // Determine Base URL purely for storage access
  // Priority: 
  // 1. Env Var (VITE_API_URL) - logic strips /v1 if present
  // 2. Default Localhost
  let apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/v1';

  // If apiBase is relative (e.g. '/v1'), construct absolute URL using current origin
  if (apiBase.startsWith('/')) {
    apiBase = `${window.location.origin}${apiBase}`;
  }

  // Remove the API suffix (/v1) to get the root server URL
  // This assumes storage is at {SERVER_ROOT}/storage
  const serverRoot = apiBase.replace('/v1', '');

  // Clean the path to ensure no double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  return `${serverRoot}/storage/${cleanPath}`;
};

export default apiClient;