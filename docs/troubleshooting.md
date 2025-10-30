# Troubleshooting

## Common Issues

### Client Not Initialized

**Error:**
```
Error: FhevmClient not initialized. Call initialize() first.
```

**Solution:**
```typescript
// Always initialize before use
const client = await FhevmClient.fromWeb3Provider(window.ethereum);
await client.initialize(); // Don't forget this!

const encrypted = await client.encrypt(42, 'uint8');
```

### Encryption Failed

**Error:**
```
Error: Encryption failed - public key not available
```

**Causes:**
1. Client not initialized
2. Network connectivity issues
3. Invalid chain ID

**Solutions:**

```typescript
// Check initialization
if (!client.isInitialized()) {
  await client.initialize();
}

// Verify network
const network = await provider.getNetwork();
console.log('Connected to:', network.chainId);

// Check internet connection
try {
  await fetch('https://google.com');
} catch (error) {
  console.error('No internet connection');
}
```

### Signature Rejection

**Error:**
```
Error: User rejected signature request
```

**Solution:**
```typescript
try {
  const decrypted = await client.userDecrypt(address, value, user);
} catch (error) {
  if (error.code === 'ACTION_REJECTED') {
    alert('Please sign the message to decrypt your data');
    // Retry or provide alternative flow
  }
}
```

### Wrong Network

**Error:**
```
Error: Unsupported network. Please switch to Sepolia.
```

**Solution:**
```typescript
// Check network
const provider = new providers.Web3Provider(window.ethereum);
const network = await provider.getNetwork();

if (network.chainId !== 11155111) {
  // Request network switch
  await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: '0xaa36a7' }], // Sepolia
  });
}
```

### Type Mismatch

**Error:**
```
Error: Value exceeds maximum for type uint8
```

**Solution:**
```typescript
// Use appropriate type for your data
const small = await client.encrypt(42, 'uint8'); // 0-255
const medium = await client.encrypt(1000, 'uint16'); // 0-65535
const large = await client.encrypt(1000000, 'uint32'); // 0-4294967295

// Or validate before encrypting
function encryptWithValidation(value: number) {
  if (value > 255) {
    throw new Error('Value too large for uint8');
  }
  return client.encrypt(value, 'uint8');
}
```

## React-Specific Issues

### Hook Called Outside Provider

**Error:**
```
Error: useFhevm must be used within FhevmProvider
```

**Solution:**
```typescript
// Wrap your app with FhevmProvider
function App() {
  return (
    <FhevmProvider chainId={11155111}>
      <YourComponent />  {/* Now hooks work here */}
    </FhevmProvider>
  );
}
```

### Multiple Providers

**Issue:** Different parts of app have different client instances

**Solution:**
```typescript
// ✅ Good - Single provider at root
<App>
  <FhevmProvider>
    <Component1 />
    <Component2 />
  </FhevmProvider>
</App>

// ❌ Bad - Multiple providers
<App>
  <FhevmProvider>
    <Component1 />
  </FhevmProvider>
  <FhevmProvider>
    <Component2 />
  </FhevmProvider>
</App>
```

### Hook Dependencies

**Issue:** Infinite re-renders

**Solution:**
```typescript
// ✅ Good
const { encrypt } = useEncryption();

useEffect(() => {
  if (shouldEncrypt) {
    encrypt(value, 'uint8');
  }
}, [shouldEncrypt]); // Don't include encrypt

// ❌ Bad
useEffect(() => {
  encrypt(value, 'uint8');
}, [encrypt]); // Causes infinite loop!
```

## Next.js Issues

### SSR Hydration Errors

**Error:**
```
Warning: Text content did not match. Server: "..." Client: "..."
```

**Solution:**
```typescript
// Use client-side only rendering for FHEVM
'use client'; // Add this directive

import { useState, useEffect } from 'react';

function MyComponent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // FHEVM code here
}
```

### Window is Not Defined

**Error:**
```
ReferenceError: window is not defined
```

**Solution:**
```typescript
// Check for window before accessing
if (typeof window !== 'undefined' && window.ethereum) {
  const client = await FhevmClient.fromWeb3Provider(window.ethereum);
}

// Or use 'use client' directive
'use client';

function MyComponent() {
  // Safe to use window here
}
```

## Build Issues

### Module Not Found

**Error:**
```
Module not found: Can't resolve '@anonymous-art/fhevm-sdk'
```

**Solution:**
```bash
# Install dependencies
npm install

# For workspace setup
npm install --workspaces

# Build SDK packages first
npm run build

# Clear cache if needed
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

**Error:**
```
Type 'FhevmClient' is not assignable to type 'null'
```

**Solution:**
```typescript
// Properly type your state
const [client, setClient] = useState<FhevmClient | null>(null);

// Or use non-null assertion (when you're sure)
const encrypted = client!.encrypt(42, 'uint8');
```

## Contract Interaction Issues

### Transaction Reverted

**Error:**
```
Error: transaction reverted without a reason string
```

**Solutions:**

1. **Check Gas Limits:**
```typescript
const tx = await contract.submitData(encrypted, {
  gasLimit: 500000,
});
```

2. **Verify ACL Permissions:**
```solidity
// Make sure contract has permission
TFHE.allowThis(encryptedValue);
```

3. **Check Input Proof:**
```typescript
// Ensure proof is provided
const encrypted = await client.encrypt(value, 'uint8');
const tx = await contract.submitData(
  encrypted.data,
  encrypted.proof // Don't forget proof!
);
```

### Access Control Errors

**Error:**
```
Error: Caller not allowed to access this value
```

**Solution:**
```solidity
// In smart contract, grant access
euint32 value = TFHE.asEuint32(encryptedInput, inputProof);

// Allow sender
TFHE.allow(value, msg.sender);

// Allow contract
TFHE.allowThis(value);

// Allow specific address
TFHE.allow(value, otherAddress);
```

## Performance Issues

### Slow Initialization

**Issue:** Client takes too long to initialize

**Solutions:**

1. **Cache Client:**
```typescript
let clientCache: FhevmClient | null = null;

async function getClient() {
  if (!clientCache) {
    clientCache = await FhevmClient.fromWeb3Provider(window.ethereum);
    await clientCache.initialize();
  }
  return clientCache;
}
```

2. **Parallel Initialization:**
```typescript
// Initialize while showing loading screen
const [client, setClient] = useState<FhevmClient | null>(null);

useEffect(() => {
  async function init() {
    const c = await FhevmClient.fromWeb3Provider(window.ethereum);
    await c.initialize();
    setClient(c);
  }
  init();
}, []);
```

### Large Bundle Size

**Issue:** Application bundle too large

**Solutions:**

1. **Dynamic Import:**
```typescript
// Instead of
import { FhevmClient } from '@anonymous-art/fhevm-sdk';

// Use
const { FhevmClient } = await import('@anonymous-art/fhevm-sdk');
```

2. **Code Splitting (Next.js):**
```typescript
import dynamic from 'next/dynamic';

const FhevmComponent = dynamic(
  () => import('./FhevmComponent'),
  { ssr: false }
);
```

## Debugging

### Enable Verbose Logging

```typescript
// Set debug mode
const client = new FhevmClient({
  chainId: 11155111,
  debug: true, // Enable verbose logs
});

// Or manually
client.setLogLevel('debug');
```

### Check Network Requests

```typescript
// Monitor network calls
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  console.log('Fetch:', args);
  const response = await originalFetch(...args);
  console.log('Response:', response);
  return response;
};
```

### Inspect Encrypted Data

```typescript
const encrypted = await client.encrypt(42, 'uint8');

console.log('Encrypted type:', encrypted.type);
console.log('Encrypted data length:', encrypted.data.length);
console.log('Encrypted data:', Array.from(encrypted.data));
```

## Getting Help

If you continue to experience issues:

1. **Check Documentation:**
   - [Getting Started](./getting-started.md)
   - [API Reference](./api-reference.md)
   - [Best Practices](./best-practices.md)

2. **Search Issues:**
   - [GitHub Issues](https://github.com/TerenceMayer/fhevm-react-template/issues)

3. **Create New Issue:**
   - Provide error message
   - Include code snippet
   - Specify environment (browser, Node version, etc.)
   - Steps to reproduce

4. **Community:**
   - Join discussions
   - Ask questions
   - Share solutions
