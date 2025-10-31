# @anonymous-art/fhevm-sdk

Framework-agnostic SDK for building privacy-preserving dApps with Fully Homomorphic Encryption (FHE) on Ethereum.

## Features

- **Framework Agnostic:** Works with any JavaScript/TypeScript project
- **Type Safe:** Full TypeScript support with comprehensive type definitions
- **Easy to Use:** Simple, intuitive API inspired by wagmi
- **Production Ready:** Battle-tested patterns and comprehensive error handling
- **Lightweight:** Minimal dependencies, optimized bundle size

## Installation

```bash
npm install @anonymous-art/fhevm-sdk
```

## Quick Start

```typescript
import { FhevmClient } from '@anonymous-art/fhevm-sdk';

// Initialize from Web3 provider
const client = await FhevmClient.fromWeb3Provider(window.ethereum);
await client.initialize();

// Encrypt data
const encrypted = await client.encrypt(42, 'uint8');

// Use in contract call
const tx = await contract.submitData(encrypted);
await tx.wait();
```

## Core Concepts

### Initialization

Always initialize the client before use:

```typescript
const client = await FhevmClient.fromWeb3Provider(window.ethereum);
await client.initialize();
```

### Encryption

Encrypt data before sending to smart contracts:

```typescript
// Single value
const encrypted = await client.encrypt(100, 'uint8');

// Batch encryption
const batch = await client.encryptBatch([
  { value: 100, type: 'uint8' },
  { value: 200, type: 'uint16' },
]);
```

### Decryption

#### User Decryption (requires EIP-712 signature)

```typescript
const decrypted = await client.userDecrypt(
  contractAddress,
  encryptedValue,
  userAddress
);
```

#### Public Decryption

```typescript
const publicData = await client.publicDecrypt(
  contractAddress,
  encryptedValue
);
```

## API Reference

### FhevmClient

Main client class for FHEVM operations.

#### Methods

- `fromWeb3Provider(provider)` - Create client from Web3 provider
- `initialize()` - Initialize client (fetch public keys)
- `encrypt(value, type)` - Encrypt a single value
- `encryptBatch(inputs)` - Encrypt multiple values
- `userDecrypt(contract, value, user)` - Decrypt with user signature
- `publicDecrypt(contract, value)` - Decrypt public data

### Types

```typescript
type FheType = 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'uint128' | 'uint256'

interface EncryptedValue {
  data: Uint8Array;
  type: FheType;
}

interface FhevmConfig {
  chainId?: number;
  provider?: any;
  gatewayUrl?: string;
}
```

## Examples

### Basic Usage

```typescript
import { FhevmClient } from '@anonymous-art/fhevm-sdk';

const client = await FhevmClient.fromWeb3Provider(window.ethereum);
await client.initialize();

const encrypted = await client.encrypt(42, 'uint8');
console.log('Encrypted:', encrypted);
```

### Contract Interaction

```typescript
import { FhevmClient } from '@anonymous-art/fhevm-sdk';
import { Contract } from 'ethers';

const client = await FhevmClient.fromWeb3Provider(window.ethereum);
await client.initialize();

const contract = new Contract(address, abi, signer);
const encrypted = await client.encrypt(100, 'uint32');

const tx = await contract.submitData(encrypted);
await tx.wait();
```

### Error Handling

```typescript
import { FhevmClient, FhevmError, ErrorCodes } from '@anonymous-art/fhevm-sdk';

try {
  const encrypted = await client.encrypt(value, 'uint8');
} catch (error) {
  if (error instanceof FhevmError) {
    switch (error.code) {
      case ErrorCodes.NOT_INITIALIZED:
        console.error('Client not initialized');
        break;
      case ErrorCodes.ENCRYPTION_FAILED:
        console.error('Encryption failed');
        break;
    }
  }
}
```

## Configuration

### Default Configuration

```typescript
const client = await FhevmClient.fromWeb3Provider(window.ethereum);
await client.initialize();
```

### Custom Configuration

```typescript
const client = new FhevmClient({
  chainId: 11155111,
  gatewayUrl: 'https://custom-gateway.example.com',
});
await client.initialize();
```

## Documentation

- [Getting Started](../../docs/getting-started.md)
- [API Reference](../../docs/api-reference.md)
- [Best Practices](../../docs/best-practices.md)
- [Troubleshooting](../../docs/troubleshooting.md)

## Examples

See the [examples](../../examples) directory for complete working examples:

- **vanilla-js** - Pure JavaScript implementation
- **react** - React + Vite integration
- **nextjs** - Next.js App Router example

## License

MIT
