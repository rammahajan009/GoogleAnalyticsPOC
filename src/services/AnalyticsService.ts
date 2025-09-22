import { ClientIdManager } from '../utils/ClientIdManager';

// Type aliases for better readability and maintainability
type AnalyticsParameters = Record<string, string | number | boolean>;
type PurchaseItem = {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
};

export interface AnalyticsConfig {
  measurementId: string;
  apiSecret: string;
  projectName?: string;
  clientId?: string;
}

export interface AnalyticsEvent {
  name: string;
  parameters?: AnalyticsParameters;
  timestamp?: string;
  projectId?: string; // Optional: if not provided, uses current project
}

export interface ProjectConfig {
  defaultProject: string;
  projects: Record<string, AnalyticsConfig>;
}

class AnalyticsService {
  private readonly analyticsInstances: Map<string, any> = new Map();
  private currentProject: string = 'default';
  private readonly baseUrl = 'https://www.google-analytics.com/mp/collect';

  /**
   * Set the current project for analytics
   */
  setCurrentProject(projectId: string): void {
    this.currentProject = projectId;
    console.log(`📊 Analytics project set to: ${projectId}`);
  }

  /**
   * Get the current project
   */
  getCurrentProject(): string {
    return this.currentProject;
  }

  /**
   * Initialize analytics for a specific project
   */
  async initializeProject(projectId: string, config: AnalyticsConfig): Promise<boolean> {
    try {
      const deviceClientId = config.clientId || await ClientIdManager.getOrCreateClientId();
      
      // Store the config for this project
      this.analyticsInstances.set(projectId, {
        config: {
          ...config,
          clientId: deviceClientId,
        },
        initialized: true,
      });

      console.log(`✅ Analytics initialized for project: ${projectId}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to initialize analytics for ${projectId}:`, error);
      return false;
    }
  }

  /**
   * Initialize analytics for current project
   */
  async initializeCurrentProject(config: AnalyticsConfig): Promise<boolean> {
    return this.initializeProject(this.currentProject, config);
  }

  /**
   * Log event to current project's analytics
   */
  async logEvent(event: AnalyticsEvent): Promise<boolean> {
    const projectId = event.projectId || this.currentProject;
    const instance = this.analyticsInstances.get(projectId);

    if (!instance) {
      console.error(`Analytics not initialized for project: ${projectId}`);
      return false;
    }

    try {
      const payload = {
        client_id: instance.config.clientId,
        events: [
          {
            name: event.name,
            params: event.parameters || {},
            timestamp_micros: event.timestamp 
              ? new Date(event.timestamp).getTime() * 1000 
              : Date.now() * 1000
          }
        ]
      };

      const url = `${this.baseUrl}?measurement_id=${instance.config.measurementId}&api_secret=${instance.config.apiSecret}`;

      console.log('🌐 Sending Analytics Event:');
      console.log('📊 Event Name:', event.name);
      console.log('📁 Project ID:', projectId);
      console.log('🔗 URL:', url);
      console.log('📦 Payload:', JSON.stringify(payload, null, 2));

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('📡 Response Status:', response.status);
      console.log('📡 Response OK:', response.ok);
      
      if (response.ok) {
        console.log('✅ Event logged successfully:', event.name);
        return true;
      } else {
        console.error('❌ Failed to log event:', response.status, response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Error logging event to analytics:', error);
      return false;
    }
  }

  /**
   * Log event to multiple projects simultaneously
   */
  async logEventToMultipleProjects(
    event: AnalyticsEvent, 
    projectIds: string[]
  ): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};

    for (const projectId of projectIds) {
      try {
        const success = await this.logEvent({
          ...event,
          projectId,
        });
        results[projectId] = success;
      } catch (error) {
        console.error(`Failed to log event to ${projectId}:`, error);
        results[projectId] = false;
      }
    }

    return results;
  }

  /**
   * Log a custom event with parameters
   */
  async logCustomEvent(
    eventName: string, 
    parameters: AnalyticsParameters = {},
    projectId?: string
  ): Promise<boolean> {
    return this.logEvent({
      name: eventName,
      parameters,
      projectId,
    });
  }

  /**
   * Log a page view event
   */
  async logPageView(
    pageTitle: string, 
    pageLocation: string, 
    projectId?: string
  ): Promise<boolean> {
    return this.logEvent({
      name: 'page_view',
      parameters: {
        page_title: pageTitle,
        page_location: pageLocation,
      },
      projectId,
    });
  }

  /**
   * Log a button click event
   */
  async logButtonClick(
    buttonName: string, 
    additionalParams: AnalyticsParameters = {},
    projectId?: string
  ): Promise<boolean> {
    return this.logEvent({
      name: 'button_click',
      parameters: {
        button_name: buttonName,
        ...additionalParams,
      },
      projectId,
    });
  }

  /**
   * Log a user action event
   */
  async logUserAction(
    action: string,
    category: string,
    label?: string,
    value?: number,
    projectId?: string
  ): Promise<boolean> {
    const parameters: AnalyticsParameters = {
      action,
      category,
    };

    if (label) parameters.label = label;
    if (value !== undefined) parameters.value = value;

    return this.logEvent({
      name: 'user_action',
      parameters,
      projectId,
    });
  }

  /**
   * Log an error event
   */
  async logError(
    errorMessage: string,
    errorCode?: string,
    additionalParams: AnalyticsParameters = {},
    projectId?: string
  ): Promise<boolean> {
    return this.logEvent({
      name: 'error',
      parameters: {
        error_message: errorMessage,
        ...(errorCode && { error_code: errorCode }),
        ...additionalParams,
      },
      projectId,
    });
  }

  /**
   * Log a purchase event
   */
  async logPurchase(
    transactionId: string,
    value: number,
    currency: string = 'USD',
    items: PurchaseItem[] = [],
    projectId?: string
  ): Promise<boolean> {
    const parameters: AnalyticsParameters = {
      transaction_id: transactionId,
      value,
      currency,
    };

    if (items.length > 0) {
      parameters.items = JSON.stringify(items);
    }

    return this.logEvent({
      name: 'purchase',
      parameters,
      projectId,
    });
  }

  /**
   * Get analytics instance for a specific project
   */
  getAnalyticsInstance(projectId: string): any {
    return this.analyticsInstances.get(projectId);
  }

  /**
   * Get all initialized projects
   */
  getInitializedProjects(): string[] {
    return Array.from(this.analyticsInstances.keys());
  }

  /**
   * Clear all analytics instances
   */
  clearAllInstances(): void {
    this.analyticsInstances.clear();
    console.log('🧹 All analytics instances cleared');
  }
}

// Export a singleton instance
export const analyticsService = new AnalyticsService();
export default AnalyticsService; 