// Generic Analytics Configuration
// Add your GA4 properties here

export interface ProjectAnalyticsConfig {
  measurementId: string;
  apiSecret: string;
  projectName?: string;
}

// Define your analytics projects
export const ANALYTICS_PROJECTS: Record<string, ProjectAnalyticsConfig> = {
  // India project
  india: {
    measurementId: 'G-ECMNWKHPGR',
    apiSecret: 'lEXviq-yRuCEWIAwErz6QA',
    projectName: 'India Project',
  },
  
  // US project (example)
  us: {
    measurementId: 'G-5WMX0W6G9C', // Replace with your US GA4 property
    apiSecret: 'Wa5tD0MZQg-VoRXtmtMFdw', // Replace with your US API Secret
    projectName: 'US Project',
  },
  
  // UK project (example)
  uk: {
    measurementId: 'G-VVNR9EKKD8', // Replace with your UK GA4 property
    apiSecret: 'JlV12gomT2CTxFhAWVGqfQ', // Replace with your UK API Secret
    projectName: 'UK Project',
  },
  
  // Add more projects as needed...
};

// Helper function to get project configuration
export const getProjectConfig = (projectId: string): ProjectAnalyticsConfig | null => {
  return ANALYTICS_PROJECTS[projectId] || null;
};

// Helper function to get all project IDs
export const getProjectIds = (): string[] => {
  return Object.keys(ANALYTICS_PROJECTS);
};

// Helper function to check if project exists
export const isProjectExists = (projectId: string): boolean => {
  return projectId in ANALYTICS_PROJECTS;
}; 