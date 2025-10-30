/**
 * Client-side FHE operations
 * These functions run in the browser
 */

import { EncryptedValue, FHEType } from '@/types/fhe';

export class FHEClient {
  private publicKey: string | null = null;
  private initialized: boolean = false;

  /**
   * Initialize the FHE client with public keys
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      console.warn('FHE Client already initialized');
      return;
    }

    try {
      const response = await fetch('/api/keys');
      const data = await response.json();

      if (data.success) {
        this.publicKey = data.keys.publicKey;
        this.initialized = true;
        console.log('✅ FHE Client initialized');
      } else {
        throw new Error(data.error || 'Failed to fetch public keys');
      }
    } catch (error) {
      console.error('FHE Client initialization error:', error);
      throw error;
    }
  }

  /**
   * Encrypt a value
   */
  async encrypt(value: number, type: FHEType = 'uint32'): Promise<EncryptedValue> {
    if (!this.initialized) {
      throw new Error('FHE Client not initialized. Call initialize() first.');
    }

    try {
      const response = await fetch('/api/fhe/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value, type }),
      });

      const data = await response.json();

      if (data.success) {
        return data.encrypted;
      } else {
        throw new Error(data.error || 'Encryption failed');
      }
    } catch (error) {
      console.error('Encryption error:', error);
      throw error;
    }
  }

  /**
   * Decrypt a value
   */
  async decrypt(encryptedValue: EncryptedValue, signature?: string): Promise<number> {
    if (!this.initialized) {
      throw new Error('FHE Client not initialized. Call initialize() first.');
    }

    try {
      const response = await fetch('/api/fhe/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ encryptedData: encryptedValue, signature }),
      });

      const data = await response.json();

      if (data.success) {
        return data.decrypted;
      } else {
        throw new Error(data.error || 'Decryption failed');
      }
    } catch (error) {
      console.error('Decryption error:', error);
      throw error;
    }
  }

  /**
   * Perform homomorphic computation
   */
  async compute(
    operation: 'add' | 'sub' | 'mul' | 'div' | 'max' | 'min',
    operands: EncryptedValue[]
  ): Promise<EncryptedValue> {
    if (!this.initialized) {
      throw new Error('FHE Client not initialized. Call initialize() first.');
    }

    try {
      const response = await fetch('/api/fhe/compute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation, operands }),
      });

      const data = await response.json();

      if (data.success) {
        return data.result;
      } else {
        throw new Error(data.error || 'Computation failed');
      }
    } catch (error) {
      console.error('Computation error:', error);
      throw error;
    }
  }

  /**
   * Check if client is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get the public key
   */
  getPublicKey(): string | null {
    return this.publicKey;
  }
}

// Export a singleton instance
export const fheClient = new FHEClient();
