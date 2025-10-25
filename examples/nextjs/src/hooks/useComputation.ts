'use client';

import { useState, useCallback } from 'react';
import { EncryptedValue, FHEOperation } from '@/types/fhe';

export function useComputation() {
  const [isComputing, setIsComputing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<EncryptedValue | null>(null);

  const compute = useCallback(async (
    operation: FHEOperation,
    operands: EncryptedValue[]
  ): Promise<EncryptedValue | null> => {
    setIsComputing(true);
    setError(null);

    try {
      const response = await fetch('/api/fhe/compute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation, operands }),
      });

      const data = await response.json();

      if (data.success) {
        setLastResult(data.result);
        return data.result;
      } else {
        throw new Error(data.error || 'Computation failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Computation failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsComputing(false);
    }
  }, []);

  const add = useCallback((a: EncryptedValue, b: EncryptedValue) => compute('add', [a, b]), [compute]);
  const subtract = useCallback((a: EncryptedValue, b: EncryptedValue) => compute('sub', [a, b]), [compute]);
  const multiply = useCallback((a: EncryptedValue, b: EncryptedValue) => compute('mul', [a, b]), [compute]);
  const divide = useCallback((a: EncryptedValue, b: EncryptedValue) => compute('div', [a, b]), [compute]);
  const max = useCallback((values: EncryptedValue[]) => compute('max', values), [compute]);
  const min = useCallback((values: EncryptedValue[]) => compute('min', values), [compute]);

  return {
    compute,
    add,
    subtract,
    multiply,
    divide,
    max,
    min,
    isComputing,
    error,
    lastResult,
  };
}
