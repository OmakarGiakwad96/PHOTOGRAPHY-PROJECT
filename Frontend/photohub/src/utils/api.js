import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

let currentToken = null;

export const setApiToken = (token) => {
  currentToken = token;
};

// Request Interceptor to add Auth Token to all requests
const authInterceptor = (config) => {
  if (currentToken) {
    config.headers.Authorization = `Bearer ${currentToken}`;
  }
  return config;
};

api.interceptors.request.use(authInterceptor);

export { api };
