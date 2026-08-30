import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15000,
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

export const healthApi = {
  check: async () => {
    const { data } = await apiClient.get('/health');
    return data.data;
  },
};
