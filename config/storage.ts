/**
 * Storage configuration using MMKV for fast, synchronous storage
 */

// Storage interface for type safety
interface Storage {
  set: (key: string, value: string) => void;
  getString: (key: string) => string | undefined;
  delete: (key: string) => void;
}

// Create storage instance
let storage: Storage;

try {
  // Dynamic import to avoid issues in CI/CD
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { MMKV } = require("react-native-mmkv");
  storage = new MMKV({
    id: "perfumario-storage",
    encryptionKey: "perfumario-secret-key", // In production, use a more secure key
  });
} catch {
  // Fallback for environments without MMKV (CI/CD, tests)
  const memoryStorage: Record<string, string> = {};
  storage = {
    set: (key: string, value: string) => {
      memoryStorage[key] = value;
    },
    getString: (key: string) => memoryStorage[key],
    delete: (key: string) => {
      delete memoryStorage[key];
    },
  };
}

export { storage };

/**
 * Persister for React Query
 */
export const mmkvPersister = {
  persistClient: async (client: any) => {
    storage.set("reactQueryCache", JSON.stringify(client));
  },
  restoreClient: async () => {
    const cached = storage.getString("reactQueryCache");
    return cached ? JSON.parse(cached) : undefined;
  },
  removeClient: async () => {
    storage.delete("reactQueryCache");
  },
};
