'use client';

import { useFHEContext } from '@/components/fhe/FHEProvider';

export function useFHE() {
  const { client, isInitialized, isLoading, error } = useFHEContext();

  return {
    client,
    isInitialized,
    isLoading,
    error,
  };
}
