import { useState, useEffect, useCallback } from 'react';
import { FhevmClient, FhevmConfig } from '@anonymous-art/fhevm-sdk';
import { providers } from 'ethers';

interface UseFhevmReturn {
  client: FhevmClient | null;
  isInitialized: boolean;
  isInitializing: boolean;
  error: Error | null;
  initialize: () => Promise<void>;
  resetClient: () => void;
}

/**
 * Main hook for FHEVM client management
 * @param config - FHEVM configuration
 * @param autoInitialize - Auto-initialize on mount (default: true)
 */
export function useFhevm(
  config: FhevmConfig,
  autoInitialize: boolean = true
): UseFhevmReturn {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const initialize = useCallback(async () => {
    if (isInitialized || isInitializing) {
      return;
    }

    setIsInitializing(true);
    setError(null);

    try {
      const newClient = new FhevmClient(config);
      await newClient.initialize();
      setClient(newClient);
      setIsInitialized(true);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error('Failed to initialize FHEVM client:', error);
    } finally {
      setIsInitializing(false);
    }
  }, [config, isInitialized, isInitializing]);

  const resetClient = useCallback(() => {
    setClient(null);
    setIsInitialized(false);
    setError(null);
  }, []);

  useEffect(() => {
    if (autoInitialize && !isInitialized && !isInitializing) {
      initialize();
    }
  }, [autoInitialize, isInitialized, isInitializing, initialize]);

  return {
    client,
    isInitialized,
    isInitializing,
    error,
    initialize,
    resetClient,
  };
}

/**
 * Hook for Web3 provider integration
 */
export function useFhevmWithWeb3(autoConnect: boolean = false): UseFhevmReturn & {
  connect: () => Promise<void>;
  disconnect: () => void;
  account: string | null;
} {
  const [provider, setProvider] = useState<providers.Web3Provider | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [config, setConfig] = useState<FhevmConfig | null>(null);

  const connect = useCallback(async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      throw new Error('MetaMask not detected');
    }

    try {
      const web3Provider = new providers.Web3Provider((window as any).ethereum);
      await web3Provider.send('eth_requestAccounts', []);
      const signer = web3Provider.getSigner();
      const userAccount = await signer.getAddress();
      const network = await web3Provider.getNetwork();

      setProvider(web3Provider);
      setAccount(userAccount);
      setConfig({
        chainId: network.chainId,
        provider: web3Provider,
      });
    } catch (err) {
      console.error('Failed to connect wallet:', err);
      throw err;
    }
  }, []);

  const disconnect = useCallback(() => {
    setProvider(null);
    setAccount(null);
    setConfig(null);
  }, []);

  const fhevmHook = useFhevm(
    config || { chainId: 11155111 },
    !!config
  );

  useEffect(() => {
    if (autoConnect) {
      connect().catch(console.error);
    }
  }, [autoConnect, connect]);

  return {
    ...fhevmHook,
    connect,
    disconnect,
    account,
  };
}
