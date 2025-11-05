/**
 * API Configuration
 * Centralizes all API-related configuration
 */

/**
 * Base URL for the Perfumario API
 * Uses environment variable or falls back to production URL
 */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://perfumario-server.vercel.app";

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Perfumes
  perfumes: {
    list: () => `${API_BASE_URL}/perfumes`,
    search: (query: string) => `${API_BASE_URL}/perfumes/search?q=${query}`,
    byGender: (gender: string) => `${API_BASE_URL}/perfumes/gender/${gender}`,
    byBrand: (brandId: string) => `${API_BASE_URL}/perfumes/brand/${brandId}`,
    byId: (id: string) => `${API_BASE_URL}/perfumes/${id}`,
    create: () => `${API_BASE_URL}/perfumes`,
    update: (id: string) => `${API_BASE_URL}/perfumes/${id}`,
    delete: (id: string) => `${API_BASE_URL}/perfumes/${id}`,
  },
  // Brands
  brands: {
    list: () => `${API_BASE_URL}/brands`,
    create: () => `${API_BASE_URL}/brands`,
    delete: (id: string) => `${API_BASE_URL}/brands/${id}`,
  },
} as const;

/**
 * Common fetch options
 */
export const DEFAULT_FETCH_OPTIONS: RequestInit = {
  headers: {
    "Content-Type": "application/json",
  },
};

/**
 * API Configuration for development
 */
export const API_CONFIG = {
  timeout: 10000, // 10 seconds
  retries: 3,
  retryDelay: 1000, // 1 second
} as const;
