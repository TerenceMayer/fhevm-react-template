import { useState, useCallback } from 'react';
import { ContractInterface, Signer } from 'ethers';
import { useFhevm } from './useFhevm';
import { FhevmTransaction } from '@anonymous-art/fhevm-sdk';

interface UseContractReturn {
  call: (
    address: string,
    abi: ContractInterface,
    signer: Signer,
    method: string,
    ...args: any[]
  ) => Promise<any>;
  send: (
    address: string,
    abi: ContractInterface,
    signer: Signer,
    method: string,
    ...args: any[]
  ) => Promise<FhevmTransaction>;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook for contract interactions
 */
export function useContract(): UseContractReturn {
  const { client, isInitialized } = useFhevm({ chainId: 11155111 });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const call = useCallback(
    async (
      address: string,
      abi: ContractInterface,
      signer: Signer,
      method: string,
      ...args: any[]
    ): Promise<any> => {
      if (!client || !isInitialized) {
        throw new Error('FHEVM client not initialized');
      }

      setIsLoading(true);
      setError(null);

      try {
        const contractManager = client.getContractManager();
        const result = await contractManager.call(address, abi, signer, method, ...args);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [client, isInitialized]
  );

  const send = useCallback(
    async (
      address: string,
      abi: ContractInterface,
      signer: Signer,
      method: string,
      ...args: any[]
    ): Promise<FhevmTransaction> => {
      if (!client || !isInitialized) {
        throw new Error('FHEVM client not initialized');
      }

      setIsLoading(true);
      setError(null);

      try {
        const contractManager = client.getContractManager();
        const tx = await contractManager.send(address, abi, signer, method, ...args);
        return tx;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [client, isInitialized]
  );

  return {
    call,
    send,
    isLoading,
    error,
  };
}
