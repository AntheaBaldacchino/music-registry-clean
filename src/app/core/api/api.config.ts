export const API_CONFIG = {
  baseUrl: 'http://localhost:3000/api',
  endpoints: {
    login: '/login',
    records: '/records',
    formats: '/formats',
    genres: '/genres',
  },
} as const;

export const apiUrl = (path: string) => `${API_CONFIG.baseUrl}${path}`;
