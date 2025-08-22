import { HttpClientConfig } from './HttpClient';
import { Config } from 'react-native-config';

// Single API Base URL - configure this externally
export const API_BASE_URL = Config.API_BASE_URL;

// Refresh token endpoint - configure this externally
export const REFRESH_TOKEN_ENDPOINT = Config.REFRESH_TOKEN_ENDPOINT || '/auth/refresh';

// CSRF token endpoint - configure this externally
export const CSRF_TOKEN_ENDPOINT = Config.CSRF_TOKEN_ENDPOINT || '/csrf-token';

// HTTP Client Configuration - simple and straightforward
export const HTTP_CLIENT_CONFIG: HttpClientConfig = {
  baseURL: API_BASE_URL,
  timeout: parseInt(process.env.HTTP_TIMEOUT || '30000', 10),
  refreshTokenEndpoint: REFRESH_TOKEN_ENDPOINT,
  csrfTokenEndpoint: CSRF_TOKEN_ENDPOINT,
};
