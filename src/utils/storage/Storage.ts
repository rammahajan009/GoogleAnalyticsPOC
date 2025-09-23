import * as Keychain from 'react-native-keychain';
import { NativeModules } from 'react-native';

/**
 * Storage - A secure storage wrapper that mimics AsyncStorage API
 * but uses react-native-keychain for enhanced security
 */
export class Storage {
  private static instance: Storage;
  private readonly servicePrefix: string;
  private isInitialized: boolean = false;
  
  // Simple caching for performance
  private readonly cache: Map<string, { value: string; timestamp: number }> = new Map();
  private cacheTimeout: number = 5 * 60 * 1000; // 5 minutes

  private constructor(servicePrefix: string = 'Storage') {
    this.servicePrefix = servicePrefix;
  }

  /**
   * Get singleton instance
   */
  public static getInstance(servicePrefix?: string): Storage {
    if (!Storage.instance) {
      Storage.instance = new Storage(servicePrefix);
    }
    return Storage.instance;
  }

  /**
   * Get singleton instance and ensure it's initialized
   */
  public static async getInitializedInstance(servicePrefix?: string): Promise<Storage> {
    const instance = Storage.getInstance(servicePrefix);
    await instance.initialize();
    return instance;
  }

  /**
   * Initialize the storage instance (call this after getting the instance)
   */
  public async initialize(): Promise<void> {
    if (!this.isInitialized) {
      // Check for fresh install and clear keychain data if needed
      await this.handleFreshInstallDetection();
      await this.initializeKeychain();
    }
  }

  /**
   * Handle fresh install detection using UserDefaults
   * If this is a fresh install, clear any existing keychain data
   */
  private async handleFreshInstallDetection(): Promise<void> {
    try {
      // Check if app was previously installed using UserDefaults
      const hasRunBefore = await NativeModules.UserDefaults?.getBool?.('hasRunBefore');
      
      if (!hasRunBefore) {
        // This is a fresh install, clear any existing keychain data
        try {
          await Keychain.resetGenericPassword();
        } catch (clearError) {
          // Silent fail - continue with initialization
        }
        
        // Set flag to indicate app has run before
        try {
          await NativeModules.UserDefaults?.setBool?.('hasRunBefore', true);
        } catch (flagError) {
          // Silent fail - continue with initialization
        }
      }
    } catch (error) {
      // Continue with initialization even if detection fails
    }
  }

  /**
   * Initialize keychain and check availability
   */
  private async initializeKeychain(): Promise<void> {
    try {
      // Test if keychain is available by making a simple call
      await Keychain.setGenericPassword('__test__', '__test__', { service: '__test__' });
      await Keychain.resetGenericPassword({ service: '__test__' });
      this.isInitialized = true;
    } catch (error) {
      console.warn('Storage: Keychain initialization failed:', error);
      this.isInitialized = false;
    }
  }

  /**
   * Validate input parameters
   */
  private validateInput(key: string, value?: string): boolean {
    if (!key || typeof key !== 'string' || key.trim().length === 0) {
      console.error('Storage: Invalid key provided:', key);
      return false;
    }

    if (value !== undefined && (typeof value !== 'string' || value === null)) {
      console.error('Storage: Invalid value provided:', value);
      return false;
    }

    // Check key length (keychain has limitations)
    if (key.length > 255) {
      console.error('Storage: Key too long (max 255 characters):', key.length);
      return false;
    }

    return true;
  }

  /**
   * Get cached value if available and not expired
   */
  private getCachedValue(key: string): string | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.value;
    }
    if (cached) {
      this.cache.delete(key); // Remove expired cache
    }
    return null;
  }

  /**
   * Set cached value with timestamp
   */
  private setCachedValue(key: string, value: string): void {
    this.cache.set(key, { value, timestamp: Date.now() });
    
    // Clean up old cache entries if cache gets too large
    if (this.cache.size > 100) {
      const now = Date.now();
      for (const [cacheKey, cacheValue] of this.cache.entries()) {
        if (now - cacheValue.timestamp > this.cacheTimeout) {
          this.cache.delete(cacheKey);
        }
      }
    }
  }

  /**
   * Remove cached value
   */
  private removeCachedValue(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Safe keychain operation wrapper
   */
  private async safeKeychainOperation<T>(
    operation: () => Promise<T>,
    fallback: T,
    operationName: string
  ): Promise<T> {
    if (!this.isInitialized) {
      console.warn(`Storage: Keychain not initialized, attempting to initialize for ${operationName}`);
      await this.initializeKeychain();
    }

    try {
      return await operation();
    } catch (error) {
      console.error(`Storage ${operationName} error:`, error);
      
      // If it's a keychain initialization error, try to reinitialize
      if (error instanceof Error && (
        error.message.includes('keychain') || 
        error.message.includes('native') ||
        error.message.includes('module')
      )) {
        console.log('Storage: Attempting to reinitialize keychain...');
        this.isInitialized = false;
        await this.initializeKeychain();
        
        try {
          return await operation();
        } catch (retryError) {
          console.error(`Storage ${operationName} retry failed:`, retryError);
        }
      }
      
      // If all else fails, return fallback and log the error
      console.warn(`Storage: ${operationName} failed, returning fallback value`);
      return fallback;
    }
  }

  /**
   * Store a key-value pair
   * @param key - The key to store
   * @param value - The value to store
   * @returns Promise<boolean> - Success status
   */
  async setItem(key: string, value: string): Promise<boolean> {
    if (!this.validateInput(key, value)) {
      return false;
    }

    return this.safeKeychainOperation(
      async () => {
        const service = `${this.servicePrefix}_${key.trim()}`;
        const result = await Keychain.setGenericPassword(key.trim(), value.trim(), {
          service,
        });
        
        // Update cache
        this.setCachedValue(key, value);
        
        return Boolean(result);
      },
      false,
      'setItem'
    );
  }

  /**
   * Retrieve a value by key
   * @param key - The key to retrieve
   * @returns Promise<string | null> - The stored value or null if not found
   */
  async getItem(key: string): Promise<string | null> {
    if (!this.validateInput(key)) {
      return null;
    }

    // Check cache first for performance
    const cachedValue = this.getCachedValue(key);
    if (cachedValue !== null) {
      return cachedValue;
    }

    return this.safeKeychainOperation(
      async () => {
        const service = `${this.servicePrefix}_${key.trim()}`;
        
        // Add additional safety checks
        if (!service || service.length === 0) {
          console.error('Storage: Invalid service generated for key:', key);
          return null;
        }

        const credentials = await Keychain.getGenericPassword({ service });
        
        // Validate credentials object
        if (credentials && typeof credentials === 'object') {
          if (credentials.password && typeof credentials.password === 'string') {
            // Update cache for future fast access
            this.setCachedValue(key, credentials.password);
            return credentials.password;
          }
        }
        
        return null;
      },
      null,
      'getItem'
    );
  }

  /**
   * Remove a key-value pair
   * @param key - The key to remove
   * @returns Promise<boolean> - Success status
   */
  async removeItem(key: string): Promise<boolean> {
    if (!this.validateInput(key)) {
      return false;
    }

    return this.safeKeychainOperation(
      async () => {
        const service = `${this.servicePrefix}_${key.trim()}`;
        const result = await Keychain.resetGenericPassword({ service });
        
        // Remove from cache
        this.removeCachedValue(key);
        
        return Boolean(result);
      },
      false,
      'removeItem'
    );
  }

  /**
   * Get all keys
   * @returns Promise<string[]> - Array of stored keys
   */
  async getAllKeys(): Promise<string[]> {
    try {
      // Note: react-native-keychain doesn't provide a direct way to get all keys
      // This is a limitation compared to AsyncStorage
      // You might need to maintain a separate index if you need this functionality
      console.warn('Storage: getAllKeys is not supported by react-native-keychain');
      return [];
    } catch (error) {
      console.error('Storage getAllKeys error:', error);
      return [];
    }
  }

  /**
   * Clear all stored data
   * @returns Promise<boolean> - Success status
   */
  async clear(): Promise<boolean> {
    try {
      // Clear cache
      this.cache.clear();
      
      // Note: This will clear ALL keychain data, not just our service
      // Use with caution
      const result = await Keychain.resetGenericPassword();
      return result;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  }

  /**
   * Get multiple items by keys
   * @param keys - Array of keys to retrieve
   * @returns Promise<[string, string | null][]> - Array of key-value pairs
   */
  async multiGet(keys: string[]): Promise<[string, string | null][]> {
    if (!Array.isArray(keys) || keys.length === 0) {
      console.warn('Storage: multiGet called with invalid keys array');
      return [];
    }

    try {
      const promises = keys.map(async (key) => {
        try {
          const value = await this.getItem(key);
          return [key, value] as [string, string | null];
        } catch (error) {
          console.error(`Storage: Error retrieving key "${key}":`, error);
          return [key, null] as [string, string | null];
        }
      });
      
      return await Promise.all(promises);
    } catch (error) {
      console.error('Storage multiGet error:', error);
      return keys.map(key => [key, null] as [string, string | null]);
    }
  }

  /**
   * Store multiple key-value pairs
   * @param keyValuePairs - Array of key-value pairs to store
   * @returns Promise<boolean> - Success status
   */
  async multiSet(keyValuePairs: [string, string][]): Promise<boolean> {
    if (!Array.isArray(keyValuePairs) || keyValuePairs.length === 0) {
      console.warn('Storage: multiSet called with invalid keyValuePairs array');
      return false;
    }

    try {
      const promises = keyValuePairs.map(async ([key, value]) => {
        try {
          return await this.setItem(key, value);
        } catch (error) {
          console.error(`Storage: Error storing key "${key}":`, error);
          return false;
        }
      });
      
      const results = await Promise.all(promises);
      return results.every(result => result === true);
    } catch (error) {
      console.error('Storage multiSet error:', error);
      return false;
    }
  }

  /**
   * Remove multiple keys
   * @param keys - Array of keys to remove
   * @returns Promise<boolean> - Success status
   */
  async multiRemove(keys: string[]): Promise<boolean> {
    if (!Array.isArray(keys) || keys.length === 0) {
      console.warn('Storage: multiRemove called with invalid keys array');
      return false;
    }

    try {
      const promises = keys.map(async (key) => {
        try {
          return await this.removeItem(key);
        } catch (error) {
          console.error(`Storage: Error removing key "${key}":`, error);
          return false;
        }
      });
      
      const results = await Promise.all(promises);
      return results.every(result => result === true);
    } catch (error) {
      console.error('Storage multiRemove error:', error);
      return false;
    }
  }

  /**
   * Check if storage is ready
   * @returns boolean - Whether the storage is initialized and ready
   */
  isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Force reinitialization of keychain
   * @returns Promise<void>
   */
  async reinitialize(): Promise<void> {
    this.isInitialized = false;
    await this.initializeKeychain();
  }

  /**
   * Clear cache manually
   * @returns void
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   * @returns object - Cache statistics
   */
  getCacheStats(): { size: number; hitRate: number } {
    return {
      size: this.cache.size,
      hitRate: 0, // Could be implemented with hit/miss counters
    };
  }

  /**
   * Set cache timeout
   * @param timeout - Cache timeout in milliseconds
   * @returns void
   */
  setCacheTimeout(timeout: number): void {
    this.cacheTimeout = timeout;
  }
}

// Export a default instance
export const storage = Storage.getInstance();

// Export the class for custom instances
export default Storage;
