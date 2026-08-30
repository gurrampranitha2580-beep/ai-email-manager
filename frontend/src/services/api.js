import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 30000,
});

export function toApiError(error) {
  const apiError = error?.response?.data?.error;

  if (apiError) {
    return {
      code: apiError.code || 'INTERNAL_SERVER_ERROR',
      message: apiError.message || 'Something went wrong. Please try again.',
    };
  }

  return {
    code: 'NETWORK_ERROR',
    message:
      'Could not reach the server. Check that the backend is running and try again.',
  };
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(Object.assign(error, { apiError: toApiError(error) }))
);

const unwrap = (response) => response.data.data;

export const healthApi = {
  check: async () => unwrap(await apiClient.get('/health')),
};

export const authApi = {
  googleLoginUrl: () => `${baseURL}/auth/google`,
  me: async () => unwrap(await apiClient.get('/auth/me')),
  status: async () => unwrap(await apiClient.get('/auth/status')),
  logout: async () => unwrap(await apiClient.post('/auth/logout')),
  disconnect: async () => unwrap(await apiClient.post('/auth/disconnect')),
};

export const emailsApi = {
  list: async (params) => unwrap(await apiClient.get('/emails', { params })),
  search: async (params) =>
    unwrap(await apiClient.get('/emails/search', { params })),
  get: async (id) => unwrap(await apiClient.get(`/emails/${id}`)),
  unreadCount: async () => unwrap(await apiClient.get('/emails/unread-count')),
};

export const threadsApi = {
  get: async (threadId) => unwrap(await apiClient.get(`/threads/${threadId}`)),
};

export const activityApi = {
  list: async (params) => unwrap(await apiClient.get('/activity', { params })),
};
