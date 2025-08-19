import { HttpClientConfig } from './HttpClient';
import { Config } from 'react-native-config';

// Single API Base URL - configure this externally
export const API_BASE_URL = Config.API_BASE_URL;

// HTTP Client Configuration - simple and straightforward
export const HTTP_CLIENT_CONFIG: HttpClientConfig = {
  baseURL: API_BASE_URL,
  timeout: parseInt(process.env.HTTP_TIMEOUT || '30000', 10),
};
