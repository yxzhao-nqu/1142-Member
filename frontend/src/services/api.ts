import axios from 'axios';
import type { AxiosInstance } from 'axios';

const API_BASE_URL = 'https://one142-member.onrender.com/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // 允許跨域請求時發送 cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// 認證服務
export const authService = {
  login: (name: string, password: string) =>
    apiClient.post('/auth/login', { name, password }),
  
  logout: () =>
    apiClient.post('/auth/logout'),
  
  checkAuth: () =>
    apiClient.get('/auth/check'),
};

// 會員服務
export const memberService = {
  getAll: () =>
    apiClient.get('/members'),
  
  getById: (id: number) =>
    apiClient.get(`/members/${id}`),
  
  create: (data: { name: string; password: string; phone: string; age?: number; address?: string }) =>
    apiClient.post('/members', data),
  
  update: (id: number, data: { name: string; phone: string; age?: number; address?: string }) =>
    apiClient.put(`/members/${id}`, data),
  
  delete: (id: number) =>
    apiClient.delete(`/members/${id}`),
};

export default apiClient;
