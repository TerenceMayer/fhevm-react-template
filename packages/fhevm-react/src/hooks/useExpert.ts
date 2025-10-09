import { useState, useCallback } from 'react';
import { useContract } from './useContract';
import { useEncryption } from './useEncryption';
import { Signer } from 'ethers';

interface ExpertData {
  name: string;
  specialty: string;
  experience: number;
  credentials: string;
}

interface AuthenticationData {
  artworkId: number;
  expertId: number;
  authenticity: number;
  confidence: number;
}

interface UseExpertReturn {
  registerExpert: (
    contractAddress: string,
    abi: any[],
    signer: Signer,
    data: ExpertData
  ) => Promise<any>;
  submitAuthentication: (
    contractAddress: string,
    abi: any[],
    signer: Signer,
    data: AuthenticationData
  ) => Promise<any>;
  isProcessing: boolean;
  error: Error | null;
}

/**
 * Hook for expert-specific operations
 */
export function useExpert(): UseExpertReturn {
  const { send } = useContract();
  const { encrypt } = useEncryption();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const registerExpert = useCallback(
    async (
      contractAddress: string,
      abi: any[],
      signer: Signer,
      data: ExpertData
    ): Promise<any> => {
      setIsProcessing(true);
      setError(null);

      try {
        // Generate credentials hash
        const credentialsString = `${data.name}-${data.specialty}-${data.experience}-${data.credentials}`;
        let credentialsHash = 0;
        for (let i = 0; i < credentialsString.length; i++) {
          const char = credentialsString.charCodeAt(i);
          credentialsHash = ((credentialsHash << 5) - credentialsHash) + char;
          credentialsHash = credentialsHash & credentialsHash;
        }
        const credentialsValue = Math.abs(credentialsHash) % 255;

        // Encrypt credentials
        const encryptedCredentials = await encrypt(credentialsValue, 'uint8');

        // Register expert
        const tx = await send(
          contractAddress,
          abi,
          signer,
          'registerExpert',
          encryptedCredentials
        );

        return tx;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setIsProcessing(false);
      }
    },
    [send, encrypt]
  );

  const submitAuthentication = useCallback(
    async (
      contractAddress: string,
      abi: any[],
      signer: Signer,
      data: AuthenticationData
    ): Promise<any> => {
      setIsProcessing(true);
      setError(null);

      try {
        // Encrypt authentication scores
        const encryptedAuthenticity = await encrypt(data.authenticity, 'uint8');
        const encryptedConfidence = await encrypt(data.confidence, 'uint8');

        // Submit authentication
        const tx = await send(
          contractAddress,
          abi,
          signer,
          'submitAuthentication',
          data.artworkId,
          data.expertId,
          encryptedAuthenticity,
          encryptedConfidence
        );

        return tx;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setIsProcessing(false);
      }
    },
    [send, encrypt]
  );

  return {
    registerExpert,
    submitAuthentication,
    isProcessing,
    error,
  };
}
