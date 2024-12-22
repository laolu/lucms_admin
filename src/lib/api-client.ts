import axios from 'axios';
import { API_CONFIG } from './api-config';

const client = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers,
  withCredentials: true,
});

// 添加请求拦截器
client.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 access_token
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 清除本地存储的认证信息
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      // 重定向到登录页
      window.location.href = "/auth/login?redirectUrl=" + encodeURIComponent(window.location.pathname);
    }
    return Promise.reject(error);
  }
);

export default client; 