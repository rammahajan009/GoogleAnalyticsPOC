import AsyncStorage from '@react-native-async-storage/async-storage';

const CLIENT_ID_KEY = 'ga_client_id';

export class ClientIdManager {
  /**
   * Generate a unique client ID
   */
  static generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get or create a persistent client ID using AsyncStorage
   */
  static async getOrCreateClientId(): Promise<string> {
    try {
      // Try to get existing client ID from AsyncStorage
      const existingClientId = await AsyncStorage.getItem(CLIENT_ID_KEY);
      
      if (existingClientId) {
        return existingClientId;
      }
      
      // Generate new client ID
      const newClientId = this.generateClientId();
      
      // Store for future use
      await AsyncStorage.setItem(CLIENT_ID_KEY, newClientId);
      
      return newClientId;
    } catch (error) {
      console.error('Error managing client ID:', error);
      // Fallback to generated client ID
      return this.generateClientId();
    }
  }

  /**
   * Clear the stored client ID (useful for logout scenarios)
   */
  static async clearClientId(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CLIENT_ID_KEY);
    } catch (error) {
      console.error('Error clearing client ID:', error);
    }
  }

  /**
   * Get the current client ID without creating a new one
   */
  static async getCurrentClientId(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(CLIENT_ID_KEY);
    } catch (error) {
      console.error('Error getting current client ID:', error);
      return null;
    }
  }
} 