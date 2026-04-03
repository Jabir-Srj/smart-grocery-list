import { useEffect, useCallback } from 'react';

type ApiError = {
  code: string;
  message: string;
  status: number;
};

type ApiResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: ApiError;
};

// Request cache to prevent duplicate calls
const requestCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

class ApiClient {
  private baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.edamam.com';

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const cacheKey = `${endpoint}:${JSON.stringify(options)}`;
    const cached = requestCache.get(cacheKey);

    // Return cached data if fresh
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return { success: true, data: cached.data };
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Cache successful response
      requestCache.set(cacheKey, { data, timestamp: Date.now() });

      return { success: true, data };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: {
          code: 'API_ERROR',
          message,
          status: 500,
        },
      };
    }
  }

  clearCache() {
    requestCache.clear();
  }
}

export const apiClient = new ApiClient();

// Keyboard shortcuts hook
export function useKeyboardShortcuts(shortcuts: { [key: string]: () => void }) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isCtrlOrCmd = event.ctrlKey || event.metaKey;
      const key = `${isCtrlOrCmd ? 'ctrl+' : ''}${event.key.toLowerCase()}`;

      if (shortcuts[key]) {
        event.preventDefault();
        shortcuts[key]();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}
