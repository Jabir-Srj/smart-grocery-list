// Environment configuration
interface AppConfig {
  apiUrl: string;
  enableServiceWorker: boolean;
  enableAnalytics: boolean;
  cacheTimeout: number;
  maxHistoryItems: number;
}

// Default configuration
const defaultConfig: AppConfig = {
  apiUrl: import.meta.env.VITE_API_URL || 'https://api.edamam.com',
  enableServiceWorker: import.meta.env.VITE_ENABLE_SW !== 'false',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  cacheTimeout: parseInt(import.meta.env.VITE_CACHE_TIMEOUT || '3600000'), // 1 hour
  maxHistoryItems: parseInt(import.meta.env.VITE_MAX_HISTORY || '1000')
};

// Type-safe environment variables
declare global {
  interface ImportMetaEnv {
    readonly VITE_API_URL?: string;
    readonly VITE_ENABLE_SW?: string;
    readonly VITE_ENABLE_ANALYTICS?: string;
    readonly VITE_CACHE_TIMEOUT?: string;
    readonly VITE_MAX_HISTORY?: string;
  }
}

export const config = {
  ...defaultConfig,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  version: import.meta.env.VITE_APP_VERSION || '1.0.0'
};

export type { AppConfig };