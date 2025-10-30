/**
 * FHE Type Definitions
 */

export type FHEType = 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'uint128' | 'uint256';

export interface EncryptedValue {
  data: string;
  type: FHEType;
  handles: string;
}

export type FHEOperation = 'add' | 'sub' | 'mul' | 'div' | 'max' | 'min';

export interface ComputationResult {
  success: boolean;
  operation: FHEOperation;
  result: EncryptedValue;
  operandCount: number;
  timestamp: string;
}

export interface EncryptionResult {
  success: boolean;
  encrypted: EncryptedValue;
  originalValue: number;
  timestamp: string;
}

export interface DecryptionResult {
  success: boolean;
  decrypted: number;
  type: FHEType;
  timestamp: string;
}

export interface FHEKeys {
  publicKey: string;
  chainId: number;
  gatewayUrl: string;
  aclAddress: string;
}

export interface FHEClientConfig {
  chainId?: number;
  gatewayUrl?: string;
  aclAddress?: string;
}

export interface FHEError {
  code: string;
  message: string;
  details?: any;
}
