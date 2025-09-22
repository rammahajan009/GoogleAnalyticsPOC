// Generic Analytics Configuration
// Add your GA4 properties here

export interface ProjectAnalyticsConfig {
  measurementId: string;
  apiSecret: string;
  projectName?: string;
}

// Define your analytics projects
// SECURITY WARNING: Never commit API secrets to version control!
// Use environment variables or secure configuration management
export const ANALYTICS_PROJECTS: Record<string, ProjectAnalyticsConfig> = {
  // India project
  india: {
    measurementId: process.env.ANALYTICS_INDIA_MEASUREMENT_ID || 'G-ECMNWKHPGR',
    apiSecret: process.env.ANALYTICS_INDIA_API_SECRET || '',
    projectName: 'India Project',
  },
  
  // US project (example)
  us: {
    measurementId: process.env.ANALYTICS_US_MEASUREMENT_ID || 'G-5WMX0W6G9C',
    apiSecret: process.env.ANALYTICS_US_API_SECRET || '',
    projectName: 'US Project',
  },
  
  // UK project (example)
  uk: {
    measurementId: process.env.ANALYTICS_UK_MEASUREMENT_ID || 'G-VVNR9EKKD8',
    apiSecret: process.env.ANALYTICS_UK_API_SECRET || '',
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