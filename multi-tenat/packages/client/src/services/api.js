import axios from 'axios';

const extractTenantFromDomain = () => {
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return null;
  }
  
  const parts = hostname.split('.');
  
  if (parts.length >= 2 && parts[parts.length - 1] === 'localhost') {
    return parts[0];
  }
  
  if (parts.length >= 3) {
    return parts[0];
  }
  
  return null;
};

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  const tenant = extractTenantFromDomain();

  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (tenant) config.headers['X-Tenant-ID'] = tenant;

  return config;
});

export default api;
