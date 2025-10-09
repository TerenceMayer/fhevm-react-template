/**
 * Re-export types from core SDK
 */
export * from '@anonymous-art/fhevm-sdk';

/**
 * React-specific types
 */
export interface FhevmHookState {
  isLoading: boolean;
  error: Error | null;
}

export interface Web3State {
  account: string | null;
  chainId: number | null;
  isConnected: boolean;
}
