# @anonymous-art/fhevm-react

React hooks library for FHEVM - build privacy-preserving dApps with React and Next.js.

## Features

- **React 18+ Support:** Built for modern React applications
- **Wagmi-Like API:** Familiar developer experience
- **Type Safe:** Full TypeScript support
- **Composable Hooks:** Modular, reusable hooks
- **Next.js Ready:** SSR and App Router compatible

## Installation

```bash
npm install @anonymous-art/fhevm-react
```

This will also install `@anonymous-art/fhevm-sdk` as a dependency.

## Quick Start

### 1. Add Provider

Wrap your app with `FhevmProvider`:

```typescript
import { FhevmProvider } from '@anonymous-art/fhevm-react';

function App() {
  return (
    <FhevmProvider chainId={11155111}>
      <YourApp />
    </FhevmProvider>
  );
}
```

### 2. Use Hooks

```typescript
import { useFhevm, useEncryption } from '@anonymous-art/fhevm-react';

function MyComponent() {
  const { client, isInitialized } = useFhevm();
  const { encrypt, isEncrypting } = useEncryption();

  const handleEncrypt = async () => {
    const encrypted = await encrypt(42, 'uint8');
    console.log('Encrypted:', encrypted);
  };

  if (!isInitialized) {
    return <div>Initializing FHEVM...</div>;
  }

  return (
    <button onClick={handleEncrypt} disabled={isEncrypting}>
      Encrypt Value
    </button>
  );
}
```

## Available Hooks

### useFhevm()

Access the FHEVM client and initialization state.

```typescript
const { client, isInitialized, error, chainId } = useFhevm();
```

**Returns:**
- `client` - FhevmClient instance
- `isInitialized` - Initialization status
- `error` - Error if initialization failed
- `chainId` - Current chain ID

### useEncryption()

Encrypt values with loading states.

```typescript
const { encrypt, encryptBatch, isEncrypting, error } = useEncryption();
```

**Returns:**
- `encrypt(value, type)` - Encrypt single value
- `encryptBatch(inputs)` - Encrypt multiple values
- `isEncrypting` - Loading state
- `error` - Error if encryption failed

**Example:**
```typescript
const encrypted = await encrypt(42, 'uint8');
const batch = await encryptBatch([
  { value: 100, type: 'uint8' },
  { value: 200, type: 'uint16' },
]);
```

### useDecryption()

Decrypt encrypted values.

```typescript
const { decrypt, decryptPublic, isDecrypting, error } = useDecryption();
```

**Returns:**
- `decrypt(contract, value)` - User decryption (requires signature)
- `decryptPublic(contract, value)` - Public decryption
- `isDecrypting` - Loading state
- `error` - Error if decryption failed

**Example:**
```typescript
const decrypted = await decrypt(contractAddress, encryptedValue);
const publicData = await decryptPublic(contractAddress, encryptedValue);
```

### useContract()

Interact with smart contracts.

```typescript
const { contract, isLoading, error } = useContract(address, abi);
```

**Returns:**
- `contract` - Ethers Contract instance
- `isLoading` - Loading state
- `error` - Error if contract load failed

**Example:**
```typescript
const { contract } = useContract(address, abi);
const tx = await contract.submitData(encrypted);
await tx.wait();
```

## Components

### FhevmProvider

Root provider for FHEVM context.

```typescript
<FhevmProvider
  chainId={11155111}
>
  <App />
</FhevmProvider>
```

**Props:**
- `chainId` (optional) - Network chain ID (default: 11155111)
- `children` - React children

## Examples

### Complete React Component

```typescript
import { useFhevm, useEncryption, useDecryption } from '@anonymous-art/fhevm-react';
import { useState } from 'react';

function EncryptionDemo() {
  const { isInitialized } = useFhevm();
  const { encrypt, isEncrypting } = useEncryption();
  const { decrypt, isDecrypting } = useDecryption();
  const [value, setValue] = useState('');
  const [encrypted, setEncrypted] = useState(null);

  const handleEncrypt = async () => {
    const enc = await encrypt(Number(value), 'uint8');
    setEncrypted(enc);
  };

  const handleDecrypt = async () => {
    const dec = await decrypt(contractAddress, encrypted);
    console.log('Decrypted:', dec);
  };

  if (!isInitialized) {
    return <div>Initializing...</div>;
  }

  return (
    <div>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button onClick={handleEncrypt} disabled={isEncrypting}>
        Encrypt
      </button>
      {encrypted && (
        <button onClick={handleDecrypt} disabled={isDecrypting}>
          Decrypt
        </button>
      )}
    </div>
  );
}
```

### Next.js App Router

```typescript
'use client';

import { FhevmProvider, useFhevm } from '@anonymous-art/fhevm-react';

// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <FhevmProvider chainId={11155111}>
          {children}
        </FhevmProvider>
      </body>
    </html>
  );
}

// app/page.tsx
function HomePage() {
  const { client, isInitialized } = useFhevm();

  return (
    <div>
      {isInitialized ? 'Ready' : 'Loading...'}
    </div>
  );
}
```

### Error Handling

```typescript
import { useEncryption } from '@anonymous-art/fhevm-react';
import { useEffect } from 'react';

function MyComponent() {
  const { encrypt, error } = useEncryption();

  useEffect(() => {
    if (error) {
      console.error('Encryption error:', error);
      // Show error to user
    }
  }, [error]);

  return <div>...</div>;
}
```

## TypeScript Support

Full TypeScript support with type definitions:

```typescript
import {
  useFhevm,
  useEncryption,
  FhevmClient,
  EncryptedValue,
  FheType
} from '@anonymous-art/fhevm-react';

const { client } = useFhevm();
// client is typed as FhevmClient | null

const { encrypt } = useEncryption();
// encrypt is typed as (value: number, type: FheType) => Promise<EncryptedValue>
```

## SSR Compatibility

The hooks are designed to work with server-side rendering:

```typescript
'use client'; // Mark as client component

import { useFhevm } from '@anonymous-art/fhevm-react';

function MyComponent() {
  const { client } = useFhevm();

  // Client will be null during SSR
  if (!client) {
    return <div>Loading...</div>;
  }

  return <div>Client ready</div>;
}
```

## Documentation

- [Getting Started](../../docs/getting-started.md)
- [API Reference](../../docs/api-reference.md)
- [Best Practices](../../docs/best-practices.md)
- [Troubleshooting](../../docs/troubleshooting.md)

## Examples

Complete working examples:

- [React + Vite](../../examples/react) - Modern SPA
- [Next.js App Router](../../examples/nextjs) - Full-stack application
- [Demo Application](../../examples/FHEAnonymousArtAuthentication) - Production-ready app

## Core SDK

This package is built on [@anonymous-art/fhevm-sdk](../fhevm-sdk), the framework-agnostic core library.

For vanilla JavaScript or other frameworks, use the core SDK directly.

## License

MIT
