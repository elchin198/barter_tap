import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Default API URL or from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || "";

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  noAuth?: boolean;
}

export const useApi = () {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch function that handles common API patterns
  const fetchFromApi = async <T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> => {
    // Prepare URL with query parameters if needed
    let url = `${API_BASE_URL}${endpoint}`;

    if (options.params) {
      const queryParams = new URLSearchParams();
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
      const queryString = queryParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    // Configure fetch options
    const fetchOptions: RequestInit = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Always include credentials for auth
      ...options,
    };

    // Convert body to JSON if needed
    if (options.body && typeof options.body === 'object') {
      fetchOptions.body = JSON.stringify(options.body);
    }

    try {
      setIsLoading(true);
      setError(null);

      // console.log(`API Request: ${options.method || 'GET'} ${url}`);
      const response = await fetch(url, fetchOptions);

      // Handle HTTP errors
      if (!response.ok) {
        let errorMessage = `API Error: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // Ignore JSON parsing errors in error responses
        }

        const error = new Error(errorMessage);
        throw error;
      }

      // Parse JSON response
      const data = await response.json();
      return data as T;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));

      // Show toast for errors
      toast({
        title: "API Xətası",
        description: err instanceof Error ? err.message : "Bilinməyən xəta baş verdi",
        variant: "destructive",
      });

      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Return the fetch function and status
  return {
    fetchFromApi,
    isLoading,
    error,
  };
}

// Direct API function without the hook for use in helpers/utils
export async function callApi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  // Similar to fetchFromApi but without state management
  let url = `${API_BASE_URL}${endpoint}`;

  if (options.params) {
    const queryParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    });
    const queryString = queryParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const fetchOptions: RequestInit = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
    ...options,
  };

  if (options.body && typeof options.body === 'object') {
    fetchOptions.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // Ignore JSON parsing errors
    }
    throw new Error(errorMessage);
  }

  return await response.json() as T;
}