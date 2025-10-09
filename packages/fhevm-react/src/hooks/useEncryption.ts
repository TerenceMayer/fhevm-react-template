import { useState, useCallback } from 'react';
import { useFhevm } from './useFhevm';

interface UseEncryptionReturn {
  encrypt: (value: number | bigint | boolean, type?: string) => Promise<Uint8Array>;
  isEncrypting: boolean;
  error: Error | null;
  lastEncrypted: Uint8Array | null;
}

/**
 * Hook for encrypting values
 * @param autoInitialize - Auto-initialize FHEVM client
 */
export function useEncryption(autoInitialize: boolean = true): UseEncryptionReturn {
  const { client, isInitialized } = useFhevm(
    { chainId: 11155111 },
    autoInitialize
  );

  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastEncrypted, setLastEncrypted] = useState<Uint8Array | null>(null);

  const encrypt = useCallback(
    async (value: number | bigint | boolean, type?: string): Promise<Uint8Array> => {
      if (!client || !isInitialized) {
        throw new Error('FHEVM client not initialized');
      }

      setIsEncrypting(true);
      setError(null);

      try {
        const encrypted = await client.encrypt(value, type);
        setLastEncrypted(encrypted);
        return encrypted;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client, isInitialized]
  );

  return {
    encrypt,
    isEncrypting,
    error,
    lastEncrypted,
  };
}
