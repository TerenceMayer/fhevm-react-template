import { useState, useCallback } from 'react';
import { useContract } from './useContract';
import { useEncryption } from './useEncryption';
import { Signer } from 'ethers';

interface ArtworkData {
  title: string;
  age: number;
  style: string;
  materials: string;
  condition: number;
  consensus: number;
}

interface UseArtworkReturn {
  submitArtwork: (
    contractAddress: string,
    abi: any[],
    signer: Signer,
    data: ArtworkData
  ) => Promise<any>;
  isSubmitting: boolean;
  error: Error | null;
}

/**
 * Hook for artwork-specific operations
 */
export function useArtwork(): UseArtworkReturn {
  const { send } = useContract();
  const { encrypt } = useEncryption();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submitArtwork = useCallback(
    async (
      contractAddress: string,
      abi: any[],
      signer: Signer,
      data: ArtworkData
    ): Promise<any> => {
      setIsSubmitting(true);
      setError(null);

      try {
        // Generate metadata hash (simplified)
        const metadataString = `${data.title}-${data.age}-${data.style}-${data.materials}`;
        let metadataHash = 0;
        for (let i = 0; i < metadataString.length; i++) {
          const char = metadataString.charCodeAt(i);
          metadataHash = ((metadataHash << 5) - metadataHash) + char;
          metadataHash = metadataHash & metadataHash;
        }
        const metadataValue = Math.abs(metadataHash) % 4294967295;

        // Encrypt data
        const encryptedMetadata = await encrypt(metadataValue, 'uint32');
        const encryptedCondition = await encrypt(data.condition, 'uint8');

        // Submit to contract
        const tx = await send(
          contractAddress,
          abi,
          signer,
          'submitArtwork',
          encryptedMetadata,
          encryptedCondition,
          data.consensus
        );

        return tx;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [send, encrypt]
  );

  return {
    submitArtwork,
    isSubmitting,
    error,
  };
}
