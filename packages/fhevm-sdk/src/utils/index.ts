/**
 * Utility functions for FHEVM SDK
 */

/**
 * Convert Uint8Array to hex string
 */
export function toHex(bytes: Uint8Array): string {
  return '0x' + Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Convert hex string to Uint8Array
 */
export function fromHex(hex: string): Uint8Array {
  const cleaned = hex.startsWith('0x') ? hex.slice(2) : hex;
  const bytes = new Uint8Array(cleaned.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleaned.substr(i * 2, 2), 16);
  }
  return bytes;
}

/**
 * Format Ethereum address
 */
export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Check if value is valid Ethereum address
 */
export function isAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Sleep utility
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts) {
        await sleep(delayMs * Math.pow(2, attempt - 1));
      }
    }
  }

  throw lastError!;
}

/**
 * Create a debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  waitMs: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), waitMs);
  };
}

/**
 * Parse error message from contract call
 */
export function parseContractError(error: any): string {
  if (error.reason) return error.reason;
  if (error.message) return error.message;
  if (error.error?.message) return error.error.message;
  return 'Unknown error occurred';
}

/**
 * Format gas amount
 */
export function formatGas(gas: bigint): string {
  return gas.toLocaleString();
}

/**
 * Convert wei to eth
 */
export function weiToEth(wei: bigint): string {
  return (Number(wei) / 1e18).toFixed(4);
}

/**
 * Convert eth to wei
 */
export function ethToWei(eth: string): bigint {
  return BigInt(Math.floor(parseFloat(eth) * 1e18));
}

/**
 * Validate encryption input
 */
export function validateEncryptionInput(
  value: number | bigint | boolean,
  type?: string
): boolean {
  if (type) {
    switch (type.toLowerCase()) {
      case 'uint8':
      case 'euint8':
        return typeof value === 'number' && value >= 0 && value <= 255;
      case 'uint16':
      case 'euint16':
        return typeof value === 'number' && value >= 0 && value <= 65535;
      case 'uint32':
      case 'euint32':
        return typeof value === 'number' && value >= 0 && value <= 4294967295;
      case 'uint64':
      case 'euint64':
        return typeof value === 'bigint';
      case 'bool':
      case 'ebool':
        return typeof value === 'boolean';
      default:
        return false;
    }
  }

  // Auto-validate
  return (
    typeof value === 'number' ||
    typeof value === 'bigint' ||
    typeof value === 'boolean'
  );
}

/**
 * Generate random request ID (for testing)
 */
export function generateRequestId(): string {
  return Math.floor(Math.random() * 1000000000).toString();
}

/**
 * Check if running in browser
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Check if Web3 provider is available
 */
export function hasWeb3Provider(): boolean {
  return isBrowser() && typeof (window as any).ethereum !== 'undefined';
}
