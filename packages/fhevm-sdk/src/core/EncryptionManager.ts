import { FhevmConfig, EncryptionInput, EncryptedValue } from '../types';

/**
 * Encryption Manager
 * Handles all encryption operations for FHEVM
 */
export class EncryptionManager {
  private config: FhevmConfig;
  private fhevmInstance: any = null;
  private publicKey: string | null = null;

  constructor(config: FhevmConfig) {
    this.config = config;
  }

  /**
   * Initialize encryption (fetch public keys, setup fhevmjs)
   */
  async initialize(): Promise<void> {
    try {
      // Import fhevmjs dynamically
      const { createInstance } = await import('fhevmjs');

      // Create fhevm instance
      this.fhevmInstance = await createInstance({
        chainId: this.config.chainId,
        publicKey: this.config.publicKey,
        gatewayUrl: this.config.gatewayAddress,
      });

      // Get public key
      this.publicKey = this.fhevmInstance.getPublicKey();

      console.log('✅ EncryptionManager initialized');
    } catch (error) {
      console.error('❌ Failed to initialize EncryptionManager:', error);
      throw error;
    }
  }

  /**
   * Encrypt a uint8 value
   */
  async encryptUint8(value: number): Promise<Uint8Array> {
    if (!this.fhevmInstance) {
      throw new Error('EncryptionManager not initialized');
    }

    try {
      const encrypted = await this.fhevmInstance.encrypt8(value);
      return encrypted;
    } catch (error) {
      throw new Error(`Failed to encrypt uint8: ${error}`);
    }
  }

  /**
   * Encrypt a uint16 value
   */
  async encryptUint16(value: number): Promise<Uint8Array> {
    if (!this.fhevmInstance) {
      throw new Error('EncryptionManager not initialized');
    }

    try {
      const encrypted = await this.fhevmInstance.encrypt16(value);
      return encrypted;
    } catch (error) {
      throw new Error(`Failed to encrypt uint16: ${error}`);
    }
  }

  /**
   * Encrypt a uint32 value
   */
  async encryptUint32(value: number): Promise<Uint8Array> {
    if (!this.fhevmInstance) {
      throw new Error('EncryptionManager not initialized');
    }

    try {
      const encrypted = await this.fhevmInstance.encrypt32(value);
      return encrypted;
    } catch (error) {
      throw new Error(`Failed to encrypt uint32: ${error}`);
    }
  }

  /**
   * Encrypt a uint64 value
   */
  async encryptUint64(value: bigint): Promise<Uint8Array> {
    if (!this.fhevmInstance) {
      throw new Error('EncryptionManager not initialized');
    }

    try {
      const encrypted = await this.fhevmInstance.encrypt64(value);
      return encrypted;
    } catch (error) {
      throw new Error(`Failed to encrypt uint64: ${error}`);
    }
  }

  /**
   * Encrypt a boolean value
   */
  async encryptBool(value: boolean): Promise<Uint8Array> {
    if (!this.fhevmInstance) {
      throw new Error('EncryptionManager not initialized');
    }

    try {
      const encrypted = await this.fhevmInstance.encryptBool(value);
      return encrypted;
    } catch (error) {
      throw new Error(`Failed to encrypt boolean: ${error}`);
    }
  }

  /**
   * Encrypt an address
   */
  async encryptAddress(address: string): Promise<Uint8Array> {
    if (!this.fhevmInstance) {
      throw new Error('EncryptionManager not initialized');
    }

    try {
      const encrypted = await this.fhevmInstance.encryptAddress(address);
      return encrypted;
    } catch (error) {
      throw new Error(`Failed to encrypt address: ${error}`);
    }
  }

  /**
   * Generic encrypt method with auto type detection
   */
  async encrypt(
    value: number | bigint | boolean,
    type?: string
  ): Promise<Uint8Array> {
    if (!this.fhevmInstance) {
      throw new Error('EncryptionManager not initialized');
    }

    try {
      // Auto-detect type if not provided
      if (!type) {
        if (typeof value === 'boolean') {
          return this.encryptBool(value);
        } else if (typeof value === 'bigint') {
          return this.encryptUint64(value);
        } else if (typeof value === 'number') {
          // Default to uint32 for numbers
          if (value <= 255) return this.encryptUint8(value);
          if (value <= 65535) return this.encryptUint16(value);
          return this.encryptUint32(value);
        }
        throw new Error('Unsupported value type');
      }

      // Use specified type
      switch (type.toLowerCase()) {
        case 'uint8':
        case 'euint8':
          return this.encryptUint8(value as number);
        case 'uint16':
        case 'euint16':
          return this.encryptUint16(value as number);
        case 'uint32':
        case 'euint32':
          return this.encryptUint32(value as number);
        case 'uint64':
        case 'euint64':
          return this.encryptUint64(value as bigint);
        case 'bool':
        case 'ebool':
          return this.encryptBool(value as boolean);
        default:
          throw new Error(`Unsupported encryption type: ${type}`);
      }
    } catch (error) {
      throw new Error(`Encryption failed: ${error}`);
    }
  }

  /**
   * Create encrypted input for contract calls
   * This includes generating input proofs
   */
  async createEncryptedInput(
    contractAddress: string,
    userAddress: string
  ): Promise<any> {
    if (!this.fhevmInstance) {
      throw new Error('EncryptionManager not initialized');
    }

    try {
      return this.fhevmInstance.createEncryptedInput(
        contractAddress,
        userAddress
      );
    } catch (error) {
      throw new Error(`Failed to create encrypted input: ${error}`);
    }
  }

  /**
   * Get the public key used for encryption
   */
  getPublicKey(): string | null {
    return this.publicKey;
  }

  /**
   * Get the fhevm instance
   */
  getInstance(): any {
    return this.fhevmInstance;
  }
}
