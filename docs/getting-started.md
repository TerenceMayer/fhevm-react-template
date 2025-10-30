# Getting Started with FHEVM SDK

## Overview

The FHEVM SDK is a framework-agnostic library for building privacy-preserving dApps using Fully Homomorphic Encryption (FHE) on Ethereum.

## Installation

### Core SDK

```bash
npm install @anonymous-art/fhevm-sdk
```

### React Hooks (for React/Next.js projects)

```bash
npm install @anonymous-art/fhevm-react
```

## Quick Start

### Vanilla JavaScript

```javascript
import { FhevmClient } from '@anonymous-art/fhevm-sdk';

// Initialize from Web3 provider
const client = await FhevmClient.fromWeb3Provider(window.ethereum);
await client.initialize();

// Encrypt data
const encrypted = await client.encrypt(42, 'uint8');

// Use in contract call
const tx = await contract.submitData(encrypted);
```

### React/Next.js

```typescript
import { FhevmProvider, useFhevm, useEncryption } from '@anonymous-art/fhevm-react';

function App() {
  return (
    <FhevmProvider chainId={11155111}>
      <YourComponent />
    </FhevmProvider>
  );
}

function YourComponent() {
  const { client, isInitialized } = useFhevm();
  const { encrypt, isEncrypting } = useEncryption();

  const handleEncrypt = async () => {
    const encrypted = await encrypt(42, 'uint8');
    // Use encrypted value
  };

  return <button onClick={handleEncrypt}>Encrypt</button>;
}
```

## Configuration

### Default Configuration

The SDK works out of the box with Sepolia testnet:

```typescript
const client = await FhevmClient.fromWeb3Provider(provider);
await client.initialize();
```

### Custom Configuration

```typescript
const client = new FhevmClient({
  chainId: 11155111,
  provider: customProvider,
  gatewayUrl: 'https://custom-gateway.example.com',
});
await client.initialize();
```

## Core Concepts

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

#### User Decryption (EIP-712 Signature)

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

### Contract Interaction

```typescript
import { Contract } from 'ethers';

const contract = new Contract(address, abi, signer);
const encrypted = await client.encrypt(42, 'uint8');
const tx = await contract.submitData(encrypted);
await tx.wait();
```

## Next Steps

- [API Reference](./api-reference.md)
- [Examples](../examples/)
- [Best Practices](./best-practices.md)
- [Troubleshooting](./troubleshooting.md)
