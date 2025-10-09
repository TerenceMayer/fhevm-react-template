import { Contract, providers } from 'ethers';
import { FhevmConfig, DecryptionRequest, DecryptionResponse } from '../types';

/**
 * Decryption Manager
 * Handles decryption requests through the Gateway contract
 */
export class DecryptionManager {
  private config: FhevmConfig;
  private gatewayContract: Contract | null = null;

  constructor(config: FhevmConfig) {
    this.config = config;
  }

  /**
   * Initialize decryption manager (setup gateway contract)
   */
  async initialize(): Promise<void> {
    try {
      if (!this.config.gatewayAddress) {
        console.warn('⚠️  No gateway address provided, decryption features disabled');
        return;
      }

      if (!this.config.provider) {
        throw new Error('Provider required for decryption');
      }

      // Gateway ABI for decryption (simplified)
      const gatewayABI = [
        'function requestDecryption(uint256[] calldata ct, bytes4 callbackSelector, uint256 msgValue, uint256 maxTimestamp, bool passSignaturesToCaller) external returns (uint256)',
        'function isPublicDecryptAllowed() external view returns (bool)',
        'event DecryptionResult(uint256 indexed requestId, bool success, bytes result)',
      ];

      this.gatewayContract = new Contract(
        this.config.gatewayAddress,
        gatewayABI,
        this.config.provider
      );

      console.log('✅ DecryptionManager initialized');
    } catch (error) {
      console.error('❌ Failed to initialize DecryptionManager:', error);
      throw error;
    }
  }

  /**
   * Request decryption of an encrypted value
   * Returns the request ID
   */
  async requestDecryption(
    contractAddress: string,
    handle: string,
    userAddress: string
  ): Promise<string> {
    if (!this.gatewayContract) {
      throw new Error('DecryptionManager not initialized or gateway not available');
    }

    try {
      // Convert handle to uint256 array
      const handles = [handle];

      // Request decryption through gateway
      const tx = await this.gatewayContract.requestDecryption(
        handles,
        '0x00000000', // callback selector placeholder
        0, // msgValue
        Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
        false // passSignaturesToCaller
      );

      const receipt = await tx.wait();

      // Extract request ID from events
      const event = receipt.events?.find((e: any) => e.event === 'DecryptionRequested');
      const requestId = event?.args?.requestId?.toString();

      if (!requestId) {
        throw new Error('Failed to get request ID from transaction');
      }

      return requestId;
    } catch (error) {
      throw new Error(`Decryption request failed: ${error}`);
    }
  }

  /**
   * Check if public decryption is allowed
   * Uses new is...() pattern from fhEVM v0.6.0+
   */
  async isPublicDecryptAllowed(): Promise<boolean> {
    if (!this.gatewayContract) {
      throw new Error('DecryptionManager not initialized');
    }

    try {
      return await this.gatewayContract.isPublicDecryptAllowed();
    } catch (error) {
      console.error('Failed to check public decrypt permission:', error);
      return false;
    }
  }

  /**
   * Listen for decryption results
   * @param requestId - The decryption request ID
   * @param callback - Function to call when result is available
   */
  async waitForDecryptionResult(
    requestId: string,
    callback: (result: DecryptionResponse) => void,
    timeout: number = 60000
  ): Promise<void> {
    if (!this.gatewayContract) {
      throw new Error('DecryptionManager not initialized');
    }

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.gatewayContract?.off('DecryptionResult', listener);
        reject(new Error('Decryption timeout'));
      }, timeout);

      const listener = (id: any, success: boolean, result: any) => {
        if (id.toString() === requestId) {
          clearTimeout(timeoutId);
          this.gatewayContract?.off('DecryptionResult', listener);

          if (success) {
            callback({
              requestId,
              value: result,
              signature: '',
            });
            resolve();
          } else {
            reject(new Error('Decryption failed'));
          }
        }
      };

      this.gatewayContract.on('DecryptionResult', listener);
    });
  }

  /**
   * Get gateway contract instance
   */
  getGatewayContract(): Contract | null {
    return this.gatewayContract;
  }
}
