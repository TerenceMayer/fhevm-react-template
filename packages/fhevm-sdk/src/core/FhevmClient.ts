import { providers, Signer } from 'ethers';
import { FhevmConfig, NetworkConfig, NetworkName } from '../types';
import { EncryptionManager } from './EncryptionManager';
import { DecryptionManager } from './DecryptionManager';
import { ContractManager } from './ContractManager';

/**
 * Main FHEVM Client
 * Entry point for all FHEVM operations
 */
export class FhevmClient {
  private config: FhevmConfig;
  private encryptionManager: EncryptionManager;
  private decryptionManager: DecryptionManager;
  private contractManager: ContractManager;
  private initialized: boolean = false;

  constructor(config: FhevmConfig) {
    this.config = config;
    this.encryptionManager = new EncryptionManager(config);
    this.decryptionManager = new DecryptionManager(config);
    this.contractManager = new ContractManager(config);
  }

  /**
   * Initialize the FHEVM client
   * Fetches public keys and sets up encryption
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      console.warn('FhevmClient already initialized');
      return;
    }

    try {
      // Initialize encryption manager (fetch public keys)
      await this.encryptionManager.initialize();

      // Initialize decryption manager (setup gateway)
      await this.decryptionManager.initialize();

      this.initialized = true;
      console.log('✅ FhevmClient initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize FhevmClient:', error);
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
   * Get encryption manager
   */
  getEncryptionManager(): EncryptionManager {
    if (!this.initialized) {
      throw new Error('FhevmClient not initialized. Call initialize() first.');
    }
    return this.encryptionManager;
  }

  /**
   * Get decryption manager
   */
  getDecryptionManager(): DecryptionManager {
    if (!this.initialized) {
      throw new Error('FhevmClient not initialized. Call initialize() first.');
    }
    return this.decryptionManager;
  }

  /**
   * Get contract manager
   */
  getContractManager(): ContractManager {
    return this.contractManager;
  }

  /**
   * Encrypt a value for contract input
   */
  async encrypt(value: number | bigint | boolean, type?: string): Promise<any> {
    return this.encryptionManager.encrypt(value, type);
  }

  /**
   * Request decryption of an encrypted value
   */
  async requestDecryption(
    contractAddress: string,
    handle: string,
    userAddress: string
  ): Promise<string> {
    return this.decryptionManager.requestDecryption(
      contractAddress,
      handle,
      userAddress
    );
  }

  /**
   * Create a network-specific client
   */
  static fromNetwork(
    network: NetworkName,
    provider: providers.Provider,
    customConfig?: Partial<FhevmConfig>
  ): FhevmClient {
    const networkConfigs: Record<NetworkName, NetworkConfig> = {
      sepolia: {
        chainId: 11155111,
        rpcUrl: 'https://sepolia.infura.io/v3/',
        gatewayAddress: process.env.GATEWAY_ADDRESS,
        aclAddress: process.env.ACL_ADDRESS,
      },
      localhost: {
        chainId: 31337,
        rpcUrl: 'http://localhost:8545',
      },
      hardhat: {
        chainId: 31337,
        rpcUrl: 'http://127.0.0.1:8545',
      },
    };

    const networkConfig = networkConfigs[network];
    if (!networkConfig) {
      throw new Error(`Unknown network: ${network}`);
    }

    return new FhevmClient({
      chainId: networkConfig.chainId,
      gatewayAddress: networkConfig.gatewayAddress,
      aclAddress: networkConfig.aclAddress,
      provider,
      ...customConfig,
    });
  }

  /**
   * Create client from Web3 provider (MetaMask, etc.)
   */
  static async fromWeb3Provider(
    web3Provider: any,
    customConfig?: Partial<FhevmConfig>
  ): Promise<FhevmClient> {
    const provider = new providers.Web3Provider(web3Provider);
    const network = await provider.getNetwork();

    return new FhevmClient({
      chainId: network.chainId,
      provider,
      ...customConfig,
    });
  }

  /**
   * Get current configuration
   */
  getConfig(): FhevmConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<FhevmConfig>): void {
    this.config = { ...this.config, ...config };
    this.encryptionManager = new EncryptionManager(this.config);
    this.decryptionManager = new DecryptionManager(this.config);
    this.contractManager = new ContractManager(this.config);
    this.initialized = false;
  }
}
