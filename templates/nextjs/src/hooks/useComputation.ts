'use client';

import { useState, useCallback } from 'react';
import { useFHEContext } from '@/components/fhe/FHEProvider';

type FHEOperation = 'add' | 'sub' | 'mul' | 'div' | 'max' | 'min';

export function useComputation() {
  const { client, isInitialized } = useFHEContext();
  const [isComputing, setIsComputing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<string | null>(null);

  const compute = useCallback(async (
    operation: FHEOperation,
    value1: number,
    value2: number,
    type: string = 'uint32'
  ): Promise<string | null> => {
    if (!isInitialized || !client) {
      const err = 'FHEVM client not initialized';
      setError(err);
      return null;
    }

    setIsComputing(true);
    setError(null);

    try {
      // Encrypt both values
      const encrypted1 = await client.encrypt(value1, type);
      const encrypted2 = await client.encrypt(value2, type);

      // For demonstration purposes - in real app, send to smart contract
      const result = `Computed: ${operation}(${value1}, ${value2}) on encrypted data`;
      setLastResult(result);

      console.log('Encrypted computation:', { operation, encrypted1, encrypted2 });

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Computation failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsComputing(false);
    }
  }, [client, isInitialized]);

  const add = useCallback((a: number, b: number) => compute('add', a, b), [compute]);
  const subtract = useCallback((a: number, b: number) => compute('sub', a, b), [compute]);
  const multiply = useCallback((a: number, b: number) => compute('mul', a, b), [compute]);
  const divide = useCallback((a: number, b: number) => compute('div', a, b), [compute]);

  return {
    compute,
    add,
    subtract,
    multiply,
    divide,
    isComputing,
    error,
    lastResult,
  };
}
