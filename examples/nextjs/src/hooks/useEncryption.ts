'use client';

import { useState, useCallback } from 'react';
import { EncryptedValue, FHEType } from '@/types/fhe';

export function useEncryption() {
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastEncrypted, setLastEncrypted] = useState<EncryptedValue | null>(null);

  const encrypt = useCallback(async (value: number, type: FHEType = 'uint32'): Promise<EncryptedValue | null> => {
    setIsEncrypting(true);
    setError(null);

    try {
      const response = await fetch('/api/fhe/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value, type }),
      });

      const data = await response.json();

      if (data.success) {
        setLastEncrypted(data.encrypted);
        return data.encrypted;
      } else {
        throw new Error(data.error || 'Encryption failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Encryption failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsEncrypting(false);
    }
  }, []);

  const encryptBatch = useCallback(async (values: Array<{ value: number; type: FHEType }>): Promise<EncryptedValue[]> => {
    setIsEncrypting(true);
    setError(null);

    try {
      const promises = values.map(({ value, type }) =>
        fetch('/api/fhe/encrypt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value, type }),
        }).then(res => res.json())
      );

      const results = await Promise.all(promises);
      const encrypted = results
        .filter(r => r.success)
        .map(r => r.encrypted);

      return encrypted;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Batch encryption failed';
      setError(errorMessage);
      return [];
    } finally {
      setIsEncrypting(false);
    }
  }, []);

  return {
    encrypt,
    encryptBatch,
    isEncrypting,
    error,
    lastEncrypted,
  };
}
