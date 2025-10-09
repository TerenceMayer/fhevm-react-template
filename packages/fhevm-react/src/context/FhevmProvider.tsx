import React, { createContext, useContext, ReactNode } from 'react';
import { FhevmClient, FhevmConfig } from '@anonymous-art/fhevm-sdk';
import { useFhevm } from '../hooks/useFhevm';

interface FhevmContextValue {
  client: FhevmClient | null;
  isInitialized: boolean;
  isInitializing: boolean;
  error: Error | null;
}

const FhevmContext = createContext<FhevmContextValue | undefined>(undefined);

interface FhevmProviderProps {
  config: FhevmConfig;
  children: ReactNode;
}

/**
 * Context Provider for FHEVM
 * Provides FHEVM client to all child components
 */
export function FhevmProvider({ config, children }: FhevmProviderProps) {
  const fhevmState = useFhevm(config, true);

  return (
    <FhevmContext.Provider value={fhevmState}>
      {children}
    </FhevmContext.Provider>
  );
}

/**
 * Hook to use FHEVM context
 */
export function useFhevmContext(): FhevmContextValue {
  const context = useContext(FhevmContext);
  if (context === undefined) {
    throw new Error('useFhevmContext must be used within FhevmProvider');
  }
  return context;
}
