import { httpClient } from './HttpClient';

// API Service Layer for Redux Saga
export class ApiService {
  // Generic GET request
  static async get<T = any>(url: string, config?: any): Promise<T> {
    try {
      const response = await httpClient.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Generic POST request
  static async post<T = any>(url: string, data?: any, config?: any): Promise<T> {
    try {
      const response = await httpClient.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Generic PUT request
  static async put<T = any>(url: string, data?: any, config?: any): Promise<T> {
    try {
      const response = await httpClient.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Generic PATCH request
  static async patch<T = any>(url: string, data?: any, config?: any): Promise<T> {
    try {
      const response = await httpClient.patch<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Generic DELETE request
  static async delete<T = any>(url: string, config?: any): Promise<T> {
    try {
      const response = await httpClient.delete<T>(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Set auth token for all requests
  static setAuthToken(token: string | null): void {
    httpClient.setAuthToken(token);
  }

  // Get current auth token
  static getAuthToken(): string | null {
    return httpClient.getAuthToken();
  }

  // Check if an error is retryable
  static isErrorRetryable(error: any): boolean {
    return httpClient.isErrorRetryable(error);
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default ApiService;
