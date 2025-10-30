/**
 * API Type Definitions
 */

import { EncryptedValue, FHEOperation, FHEType } from './fhe';

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp?: string;
}

export interface EncryptRequest {
  value: number;
  type?: FHEType;
}

export interface DecryptRequest {
  encryptedData: EncryptedValue;
  signature?: string;
}

export interface ComputeRequest {
  operation: FHEOperation;
  operands: EncryptedValue[];
}

export interface KeysResponse {
  publicKey: string;
  chainId: number;
  gatewayUrl: string;
  aclAddress: string;
}

export interface KeyRotationRequest {
  action: 'rotate';
}

export interface KeyRotationResponse {
  message: string;
  keys: {
    publicKey: string;
    rotatedAt: string;
  };
}
