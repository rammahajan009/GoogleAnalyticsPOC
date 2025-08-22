import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosRequestHeaders,
} from 'axios';
import { HTTP_CLIENT_CONFIG } from './HttpConfig';

// Types and Interfaces
export interface HttpClientConfig {
  baseURL?: string;
  timeout?: number;
  refreshTokenEndpoint?: string;
  csrfTokenEndpoint?: string;
  onTokenRefresh?: (newToken: string) => void;
  onTokenRefreshFailed?: () => void;
  onCsrfTokenRefresh?: (newToken: string) => void;
  onCsrfTokenRefreshFailed?: () => void;
}

export interface RequestConfig extends AxiosRequestConfig {
  skipAuthToken?: boolean;
  skipRefreshToken?: boolean;
  skipCsrfToken?: boolean;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  data?: any;
  isRetryable: boolean;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
}

export interface CsrfTokenResponse {
  csrf_token: string;
  expires_in?: number;
}

// Default configurations
const DEFAULT_CONFIG: HttpClientConfig = {
  timeout: 30000,
};

class HttpClient {
  private axiosInstance: AxiosInstance;
  private config: HttpClientConfig;
  private authToken: string | null = null;
  private refreshToken: string | null = null;
  private csrfToken: string | null = null;
  private isRefreshing = false;
  private isRefreshingCsrf = false;
  private failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];
  private csrfFailedQueue: Array<{
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];

  constructor(config: HttpClientConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    this.axiosInstance = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Set up request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add auth token if available and not explicitly skipped
        if (this.authToken && !(config as any).skipAuthToken) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }

        // Add CSRF token if available and not explicitly skipped
        if (this.csrfToken && !(config as any).skipCsrfToken) {
          // Only add CSRF token for state-changing methods
          const method = config.method?.toUpperCase();
          if (method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
            config.headers = config.headers || {};
            config.headers['X-CSRF-Token'] = this.csrfToken;
          }
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for refresh token handling
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Handle CSRF token expiration (403 Forbidden or 419 Token Mismatch)
        if ((error.response?.status === 403 || error.response?.status === 419) && 
            !originalRequest._retryCsrf && 
            !originalRequest.skipCsrfToken &&
            this.config.csrfTokenEndpoint) {
          
          if (this.isRefreshingCsrf) {
            // If already refreshing CSRF, queue this request
            return new Promise((resolve, reject) => {
              this.csrfFailedQueue.push({ resolve, reject });
            }).then(() => {
              return this.axiosInstance.request(originalRequest);
            });
          }

          originalRequest._retryCsrf = true;
          this.isRefreshingCsrf = true;

          try {
            const newCsrfToken = await this.refreshCsrfToken();
            if (newCsrfToken) {
              // Update CSRF token and retry original request
              this.csrfToken = newCsrfToken;
              if (this.config.onCsrfTokenRefresh) {
                this.config.onCsrfTokenRefresh(newCsrfToken);
              }
              
              // Retry all queued CSRF requests
              this.processCsrfQueue(null, newCsrfToken);
              
              // Retry original request
              return this.axiosInstance.request(originalRequest);
            }
          } catch (refreshError) {
            // CSRF refresh failed, clear token and notify
            this.csrfToken = null;
            if (this.config.onCsrfTokenRefreshFailed) {
              this.config.onCsrfTokenRefreshFailed();
            }
            
            // Reject all queued CSRF requests
            this.processCsrfQueue(refreshError, null);
            
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshingCsrf = false;
          }
        }

        // Handle 401 errors and refresh token if available
        if (error.response?.status === 401 && 
            !originalRequest._retry && 
            !originalRequest.skipRefreshToken &&
            this.refreshToken) {
          
          if (this.isRefreshing) {
            // If already refreshing, queue this request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then(() => {
              return this.axiosInstance.request(originalRequest);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const newToken = await this.refreshAuthToken();
            if (newToken) {
              // Update token and retry original request
              this.authToken = newToken;
              if (this.config.onTokenRefresh) {
                this.config.onTokenRefresh(newToken);
              }
              
              // Retry all queued requests
              this.processQueue(null, newToken);
              
              // Retry original request
              return this.axiosInstance.request(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, clear tokens and notify
            this.clearTokens();
            if (this.config.onTokenRefreshFailed) {
              this.config.onTokenRefreshFailed();
            }
            
            // Reject all queued requests
            this.processQueue(refreshError, null);
            
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Process the queue of failed requests
   */
  private processQueue(error: any, token: string | null): void {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
    
    this.failedQueue = [];
  }

  /**
   * Process the queue of failed CSRF requests
   */
  private processCsrfQueue(error: any, token: string | null): void {
    this.csrfFailedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
    
    this.csrfFailedQueue = [];
  }

  /**
   * Refresh authentication token
   */
  private async refreshAuthToken(): Promise<string | null> {
    if (!this.refreshToken || !this.config.refreshTokenEndpoint) {
      return null;
    }

    try {
      const response = await axios.post<RefreshTokenResponse>(
        this.config.refreshTokenEndpoint,
        {
          refresh_token: this.refreshToken,
        },
        {
          baseURL: this.config.baseURL,
          timeout: this.config.timeout,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const { access_token, refresh_token } = response.data;
      
      // Update refresh token if new one provided
      if (refresh_token) {
        this.refreshToken = refresh_token;
      }

      return access_token;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return null;
    }
  }

  /**
   * Refresh CSRF token
   */
  private async refreshCsrfToken(): Promise<string | null> {
    if (!this.config.csrfTokenEndpoint) {
      return null;
    }

    try {
      const response = await axios.post<CsrfTokenResponse>(
        this.config.csrfTokenEndpoint,
        {}, // No data needed for CSRF token refresh
        {
          baseURL: this.config.baseURL,
          timeout: this.config.timeout,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const { csrf_token } = response.data;
      
      return csrf_token;
    } catch (error) {
      console.error('Failed to refresh CSRF token:', error);
      return null;
    }
  }

  /**
   * Set authentication tokens
   */
  setAuthTokens(accessToken: string | null, refreshToken?: string | null): void {
    this.authToken = accessToken;
    if (refreshToken !== undefined) {
      this.refreshToken = refreshToken;
    }
  }

  /**
   * Set authentication token (backward compatibility)
   */
  setAuthToken(token: string | null): void {
    this.authToken = token;
  }

  /**
   * Set refresh token
   */
  setRefreshToken(token: string | null): void {
    this.refreshToken = token;
  }

  /**
   * Get current authentication token
   */
  getAuthToken(): string | null {
    return this.authToken;
  }

  /**
   * Get current refresh token
   */
  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  /**
   * Clear all authentication tokens
   */
  clearTokens(): void {
    this.authToken = null;
    this.refreshToken = null;
  }

  /**
   * Set CSRF token
   */
  setCsrfToken(token: string | null): void {
    this.csrfToken = token;
  }

  /**
   * Get current CSRF token
   */
  getCsrfToken(): string | null {
    return this.csrfToken;
  }

  /**
   * Clear all tokens including CSRF
   */
  clearAllTokens(): void {
    this.authToken = null;
    this.refreshToken = null;
    this.csrfToken = null;
  }

  /**
   * Make a GET request
   */
  async get<T = any>(
    url: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  /**
   * Make a POST request
   */
  async post<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  /**
   * Make a PUT request
   */
  async put<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  /**
   * Make a PATCH request
   */
  async patch<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  /**
   * Make a DELETE request
   */
  async delete<T = any>(
    url: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  /**
   * Generic request method
   */
  private async request<T = any>(config: RequestConfig): Promise<ApiResponse<T>> {
    try {
      // Add request timeout configuration
      const requestConfig = {
        ...config,
        timeout: config.timeout || this.config.timeout,
      };

      const response: AxiosResponse<T> = await this.axiosInstance.request(requestConfig);
      
      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        success: true,
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      throw this.formatError(axiosError);
    }
  }

  /**
   * Format error for consistent error handling
   */
  private formatError(error: AxiosError): ApiError {
    const status = error.response?.status;
    const data = error.response?.data;
    
    let message = 'An unexpected error occurred';

    // Handle network errors specifically
    if (!error.response) {
      if (error.message && error.message.includes('Network Error')) {
        message = 'Network error. Please check your internet connection and try again.';
      } else if (error.code === 'ERR_NETWORK') {
        message = 'Network connection failed. Please check your internet connection.';
      } else if (error.code === 'ECONNABORTED') {
        message = 'Request timeout. Please try again.';
      } else {
        message = 'Network error. Please try again.';
      }
    } else if (error.message) {
      message = error.message;
    } else if ((data as any)?.message) {
      message = (data as any).message;
    } else if ((data as any)?.error) {
      message = (data as any).error;
    }

    // Determine if error is retryable based on type
    let isRetryable = false;
    if (!error.response) {
      // Network errors are generally retryable
      isRetryable = true;
    } else if (status && [408, 429, 500, 502, 503, 504].includes(status)) {
      // Specific HTTP status codes are retryable
      isRetryable = true;
    }

    // Override retryable status for certain error types
    if (status === 401 || status === 403) {
      isRetryable = false; // Don't retry auth errors
    }

    return {
      message,
      status,
      code: error.code,
      data,
      isRetryable,
    };
  }

  /**
   * Update base configuration
   */
  updateConfig(newConfig: Partial<HttpClientConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Update axios instance if baseURL or timeout changed
    if (newConfig.baseURL) {
      this.axiosInstance.defaults.baseURL = newConfig.baseURL;
    }
    if (newConfig.timeout) {
      this.axiosInstance.defaults.timeout = newConfig.timeout;
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): HttpClientConfig {
    return { ...this.config };
  }

  /**
   * Get axios instance (for advanced usage)
   */
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  /**
   * Check if an error is retryable
   */
  isErrorRetryable(error: any): boolean {
    if (error instanceof AxiosError) {
      // Use the same logic as formatError to determine retryability
      if (!error.response) {
        return true; // Network errors are retryable
      }
      const status = error.response.status;
      if (status && [408, 429, 500, 502, 503, 504].includes(status)) {
        return true; // Specific HTTP status codes are retryable
      }
      if (status === 401 || status === 403) {
        return false; // Don't retry auth errors
      }
    }
    return false;
  }
}

// Export singleton instance and class
export const httpClient = new HttpClient(HTTP_CLIENT_CONFIG);
export default HttpClient;
