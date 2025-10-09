import { useState, useCallback } from 'react';
import { useFhevm } from './useFhevm';
import { DecryptionResponse } from '@anonymous-art/fhevm-sdk';

interface UseDecryptionReturn {
  requestDecryption: (
    contractAddress: string,
    handle: string,
    userAddress: string
  ) => Promise<string>;
  waitForResult: (
    requestId: string,
    timeout?: number
  ) => Promise<DecryptionResponse>;
  isDecrypting: boolean;
  error: Error | null;
  lastResult: DecryptionResponse | null;
}

/**
 * Hook for requesting decryption
 */
export function useDecryption(): UseDecryptionReturn {
  const { client, isInitialized } = useFhevm({ chainId: 11155111 });

  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastResult, setLastResult] = useState<DecryptionResponse | null>(null);

  const requestDecryption = useCallback(
    async (
      contractAddress: string,
      handle: string,
      userAddress: string
    ): Promise<string> => {
      if (!client || !isInitialized) {
        throw new Error('FHEVM client not initialized');
      }

      setError(null);

      try {
        const requestId = await client.requestDecryption(
          contractAddress,
          handle,
          userAddress
        );
        return requestId;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      }
    },
    [client, isInitialized]
  );

  const waitForResult = useCallback(
    async (requestId: string, timeout: number = 60000): Promise<DecryptionResponse> => {
      if (!client || !isInitialized) {
        throw new Error('FHEVM client not initialized');
      }

      setIsDecrypting(true);
      setError(null);

      try {
        const decryptionManager = client.getDecryptionManager();

        return new Promise((resolve, reject) => {
          decryptionManager
            .waitForDecryptionResult(
              requestId,
              (result) => {
                setLastResult(result);
                resolve(result);
              },
              timeout
            )
            .catch(reject);
        });
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setIsDecrypting(false);
      }
    },
    [client, isInitialized]
  );

  return {
    requestDecryption,
    waitForResult,
    isDecrypting,
    error,
    lastResult,
  };
}
