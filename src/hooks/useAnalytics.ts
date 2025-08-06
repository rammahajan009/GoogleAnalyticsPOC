import { useCallback, useState } from 'react';
import { analyticsService } from '../services/AnalyticsService';

export const useAnalytics = () => {
  const [currentProject, setCurrentProjectState] = useState<string>('default');

  // Set current project for analytics
  const setCurrentProject = useCallback((projectId: string) => {
    analyticsService.setCurrentProject(projectId);
    setCurrentProjectState(projectId);
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
    parameters: Record<string, string | number | boolean> = {},
    projectId?: string
  ) => {
    return await analyticsService.logCustomEvent(eventName, parameters, projectId);
  }, []);

  // Log event to multiple projects
  const logEventToMultipleProjects = useCallback(async (
    eventName: string,
    parameters: Record<string, string | number | boolean> = {},
    projectIds: string[]
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
    additionalParams: Record<string, string | number | boolean> = {},
    projectId?: string
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
    additionalParams: Record<string, string | number | boolean> = {},
    projectId?: string
  ) => {
    return await analyticsService.logError(errorMessage, errorCode, additionalParams, projectId);
  }, []);

  // Log purchase
  const logPurchase = useCallback(async (
    transactionId: string,
    value: number,
    currency: string = 'USD',
    items: Array<{ item_id: string; item_name: string; price: number; quantity: number }> = [],
    projectId?: string
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
    setCurrentProject,
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