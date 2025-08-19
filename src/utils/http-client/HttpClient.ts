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
}

export interface RequestConfig extends AxiosRequestConfig {
  skipAuthToken?: boolean;
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

// Default configurations
const DEFAULT_CONFIG: HttpClientConfig = {
  timeout: 30000,
};

class HttpClient {
  private axiosInstance: AxiosInstance;
  private config: HttpClientConfig;
  private authToken: string | null = null;

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
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - no automatic retry, just format errors
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        // Format and throw the error without automatic retry
        throw this.formatError(error);
      }
    );
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string | null): void {
    this.authToken = token;
  }

  /**
   * Get current authentication token
   */
  getAuthToken(): string | null {
    return this.authToken;
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
