import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Request interceptor: attach proper token
api.interceptors.request.use((config) => {
  const isAdminRoute = config.url?.startsWith('/admin');
  const adminToken = localStorage.getItem('adminToken');
  const userToken = localStorage.getItem('token');

  const tokenToUse = isAdminRoute ? adminToken : userToken;
  if (tokenToUse) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${tokenToUse}`;
  }
  return config;
});

// Optional: Response interceptor for 401
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      // If unauthorized, do not loop. Just let caller handle and maybe redirect.
    }
    return Promise.reject(error);
  }
);

export default api;