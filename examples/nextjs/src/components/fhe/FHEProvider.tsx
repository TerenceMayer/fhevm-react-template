'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { FhevmClient } from '@anonymous-art/fhevm-sdk';
import { providers } from 'ethers';

interface FHEContextType {
  client: FhevmClient | null;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
}

const FHEContext = createContext<FHEContextType | undefined>(undefined);

export const useFHEContext = () => {
  const context = useContext(FHEContext);
  if (!context) {
    throw new Error('useFHEContext must be used within FHEProvider');
  }
  return context;
};

export const FHEProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initialize = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if window.ethereum is available
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const provider = new providers.Web3Provider((window as any).ethereum);
        const fhevmClient = await FhevmClient.fromWeb3Provider(provider);
        await fhevmClient.initialize();

        setClient(fhevmClient);
        setIsInitialized(true);
      } else {
        // Initialize with default config for SSR or no wallet
        const fhevmClient = new FhevmClient({
          chainId: 11155111, // Sepolia
        });
        await fhevmClient.initialize();

        setClient(fhevmClient);
        setIsInitialized(true);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('FHE initialization error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const value: FHEContextType = {
    client,
    isInitialized,
    isLoading,
    error,
    initialize,
  };

  return (
    <FHEContext.Provider value={value}>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Initializing FHEVM SDK...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md">
            <div className="text-red-600 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Initialization Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={initialize}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        children
      )}
    </FHEContext.Provider>
  );
};
