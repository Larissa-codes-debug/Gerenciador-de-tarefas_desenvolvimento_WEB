import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

let refreshEmAndamento = null;

function limparTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  response => response,
  async (error) => {
    const config = error.config;
    const url = config?.url || '';
    const isAuthEndpoint = /\/auth\/(login|register|refresh|forgot-password|reset-password|logout)(\?|$)/.test(url);

    if (error.response?.status !== 401 || !config || config._retry || isAuthEndpoint) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      limparTokens();
      window.dispatchEvent(new Event('auth:expired'));
      return Promise.reject(error);
    }

    config._retry = true;

    try {
      // Uma única renovação atende todas as requisições que falharem ao mesmo tempo.
      if (!refreshEmAndamento) {
        refreshEmAndamento = axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          { refreshToken },
          { timeout: 15000, headers: { 'Content-Type': 'application/json' } }
        ).then(({ data }) => {
          if (!data.token || !data.refreshToken) {
            throw new Error('Resposta de renovação incompleta.');
          }
          localStorage.setItem('accessToken', data.token);
          localStorage.setItem('refreshToken', data.refreshToken);
          return data.token;
        }).finally(() => {
          refreshEmAndamento = null;
        });
      }

      const novoAccessToken = await refreshEmAndamento;
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${novoAccessToken}`;
      return api(config);
    } catch (refreshError) {
      limparTokens();
      window.dispatchEvent(new Event('auth:expired'));
      return Promise.reject(refreshError);
    }
  }
);

export default api;
