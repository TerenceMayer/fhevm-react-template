import { ContractInterface, providers, Signer } from 'ethers';

/**
 * Core FHEVM SDK Types
 */

export interface FhevmConfig {
  /** Network chain ID */
  chainId: number;
  /** Gateway contract address for decryption */
  gatewayAddress?: string;
  /** ACL contract address */
  aclAddress?: string;
  /** KMS verifier address */
  kmsVerifierAddress?: string;
  /** Public key for encryption */
  publicKey?: string;
  /** Network provider */
  provider?: providers.Provider;
}

export interface EncryptionInput {
  /** Value to encrypt (supports multiple types) */
  value: number | bigint | boolean;
  /** Security parameter (bits) */
  securityZone?: number;
}

export interface EncryptedValue {
  /** Encrypted handles for contract */
  handles: Uint8Array[];
  /** Input proof for verification */
  inputProof: string;
}

export interface DecryptionRequest {
  /** Contract address */
  contractAddress: string;
  /** Encrypted handle/ciphertext */
  handle: string;
  /** User address requesting decryption */
  userAddress: string;
}

export interface DecryptionResponse {
  /** Request ID */
  requestId: string;
  /** Decrypted value */
  value: number | bigint | boolean;
  /** Signature from KMS */
  signature: string;
}

export interface ContractConfig {
  /** Contract address */
  address: string;
  /** Contract ABI */
  abi: ContractInterface;
  /** Signer for transactions */
  signer: Signer;
}

export interface FhevmTransaction {
  /** Transaction hash */
  hash: string;
  /** Wait for confirmation */
  wait: (confirmations?: number) => Promise<FhevmTransactionReceipt>;
}

export interface FhevmTransactionReceipt {
  /** Transaction hash */
  transactionHash: string;
  /** Block number */
  blockNumber: number;
  /** Gas used */
  gasUsed: bigint;
  /** Status (1 = success) */
  status: number;
  /** Contract events */
  events?: any[];
}

export enum EncryptedType {
  EUINT8 = 'euint8',
  EUINT16 = 'euint16',
  EUINT32 = 'euint32',
  EUINT64 = 'euint64',
  EBOOL = 'ebool',
  EADDRESS = 'eaddress',
}

export interface FhevmError extends Error {
  code: string;
  details?: any;
}

export type NetworkName = 'sepolia' | 'localhost' | 'hardhat';

export interface NetworkConfig {
  chainId: number;
  rpcUrl: string;
  gatewayAddress?: string;
  aclAddress?: string;
  kmsVerifierAddress?: string;
}
