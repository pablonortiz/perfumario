/**
 * Storage configuration using MMKV for fast, synchronous storage
 */
import { MMKV } from "react-native-mmkv";

export const storage = new MMKV({
  id: "perfumario-storage",
  encryptionKey: "perfumario-secret-key", // In production, use a more secure key
});

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
