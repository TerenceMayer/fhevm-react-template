'use client';

import { useState, useEffect, useCallback } from 'react';
import { fheClient } from '@/lib/fhe/client';
import { EncryptedValue, FHEType, FHEOperation } from '@/types/fhe';

export function useFHE() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await fheClient.initialize();
        setIsInitialized(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Initialization failed');
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const encrypt = useCallback(async (value: number, type: FHEType = 'uint32'): Promise<EncryptedValue | null> => {
    try {
      return await fheClient.encrypt(value, type);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Encryption failed');
      return null;
    }
  }, []);

  const decrypt = useCallback(async (encryptedValue: EncryptedValue, signature?: string): Promise<number | null> => {
    try {
      return await fheClient.decrypt(encryptedValue, signature);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Decryption failed');
      return null;
    }
  }, []);

  const compute = useCallback(async (operation: FHEOperation, operands: EncryptedValue[]): Promise<EncryptedValue | null> => {
    try {
      return await fheClient.compute(operation, operands);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Computation failed');
      return null;
    }
  }, []);

  return {
    isInitialized,
    isLoading,
    error,
    encrypt,
    decrypt,
    compute,
    publicKey: fheClient.getPublicKey(),
  };
}
