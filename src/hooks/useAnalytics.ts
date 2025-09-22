import { useCallback, useState } from 'react';
import { analyticsService } from '../services/AnalyticsService';

// Type aliases for better readability and maintainability
type AnalyticsParameters = Record<string, string | number | boolean>;
type PurchaseItem = {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
};

export const useAnalytics = () => {
  const [currentProject, setCurrentProject] = useState<string>('default');

  // Set current project for analytics
  const setCurrentProjectState = useCallback((projectId: string) => {
    analyticsService.setCurrentProject(projectId);
    setCurrentProject(projectId);
  }, []);

  // Get current project
  const getCurrentProject = useCallback(() => {
    return analyticsService.getCurrentProject();
  }, []);

  // Initialize analytics for a specific project
  const initializeProject = useCallback(async (projectId: string, config: any) => {
    return await analyticsService.initializeProject(projectId, config);
  }, []);

  // Initialize analytics for current project
  const initializeCurrentProject = useCallback(async (config: any) => {
    return await analyticsService.initializeCurrentProject(config);
  }, []);

  // Log event to current project
  const logEvent = useCallback(async (
    eventName: string,
    projectId?: string,
    parameters: AnalyticsParameters = {}
  ) => {
    return await analyticsService.logCustomEvent(eventName, parameters, projectId);
  }, []);

  // Log event to multiple projects
  const logEventToMultipleProjects = useCallback(async (
    eventName: string,
    projectIds: string[],
    parameters: AnalyticsParameters = {}
  ) => {
    return await analyticsService.logEventToMultipleProjects({
      name: eventName,
      parameters,
    }, projectIds);
  }, []);

  // Log page view
  const logPageView = useCallback(async (
    pageTitle: string,
    pageLocation: string,
    projectId?: string
  ) => {
    return await analyticsService.logPageView(pageTitle, pageLocation, projectId);
  }, []);

  // Log button click
  const logButtonClick = useCallback(async (
    buttonName: string,
    projectId?: string,
    additionalParams: AnalyticsParameters = {}
  ) => {
    return await analyticsService.logButtonClick(buttonName, additionalParams, projectId);
  }, []);

  // Log user action
  const logUserAction = useCallback(async (
    action: string,
    category: string,
    label?: string,
    value?: number,
    projectId?: string
  ) => {
    return await analyticsService.logUserAction(action, category, label, value, projectId);
  }, []);

  // Log error
  const logError = useCallback(async (
    errorMessage: string,
    errorCode?: string,
    projectId?: string,
    additionalParams: AnalyticsParameters = {}
  ) => {
    return await analyticsService.logError(errorMessage, errorCode, additionalParams, projectId);
  }, []);

  // Log purchase
  const logPurchase = useCallback(async (
    transactionId: string,
    value: number,
    projectId?: string,
    currency: string = 'USD',
    items: PurchaseItem[] = []
  ) => {
    return await analyticsService.logPurchase(transactionId, value, currency, items, projectId);
  }, []);

  // Get initialized projects
  const getInitializedProjects = useCallback(() => {
    return analyticsService.getInitializedProjects();
  }, []);

  // Clear all instances
  const clearAllInstances = useCallback(() => {
    analyticsService.clearAllInstances();
  }, []);

  return {
    // Project management
    currentProject,
    setCurrentProject: setCurrentProjectState,
    getCurrentProject,
    initializeProject,
    initializeCurrentProject,
    
    // Event logging
    logEvent,
    logEventToMultipleProjects,
    logPageView,
    logButtonClick,
    logUserAction,
    logError,
    logPurchase,
    
    // Utility functions
    getInitializedProjects,
    clearAllInstances,
  };
}; 