'use client';

import { useState, useCallback } from 'react';
import { useFHEContext } from '@/components/fhe/FHEProvider';

export function useEncryption() {
  const { client, isInitialized } = useFHEContext();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastEncrypted, setLastEncrypted] = useState<any>(null);

  const encrypt = useCallback(async (value: number, type: string = 'uint32'): Promise<any> => {
    if (!isInitialized || !client) {
      const err = 'FHEVM client not initialized';
      setError(err);
      throw new Error(err);
    }

    setIsEncrypting(true);
    setError(null);

    try {
      const encrypted = await client.encrypt(value, type);
      setLastEncrypted(encrypted);
      return encrypted;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Encryption failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsEncrypting(false);
    }
  }, [client, isInitialized]);

  const encryptBatch = useCallback(async (values: Array<{ value: number; type: string }>): Promise<any[]> => {
    if (!isInitialized || !client) {
      const err = 'FHEVM client not initialized';
      setError(err);
      return [];
    }

    setIsEncrypting(true);
    setError(null);

    try {
      const promises = values.map(({ value, type }) => client.encrypt(value, type));
      const encrypted = await Promise.all(promises);
      return encrypted;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Batch encryption failed';
      setError(errorMessage);
      return [];
    } finally {
      setIsEncrypting(false);
    }
  }, [client, isInitialized]);

  return {
    encrypt,
    encryptBatch,
    isEncrypting,
    error,
    lastEncrypted,
  };
}
