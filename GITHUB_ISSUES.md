# GitHub Issues Reference

This document provides a reference to common community feedback and GitHub issues that inspired design decisions in this FHEVM SDK.

## Inspiration from Community Feedback

### 1. Framework-Agnostic Design

**Issue Context**: Many developers wanted to use FHEVM with different frameworks (Vue, Svelte, vanilla JS) but existing solutions were React-specific.

**Our Solution**:
- Core SDK (`fhevm-sdk`) has zero UI framework dependencies
- Can be imported into any JavaScript/TypeScript project
- React adapter provided separately in `fhevm-react` package

**Benefits**:
- Use with any framework: React, Vue, Svelte, Angular, or vanilla JS
- Smaller bundle size for non-React projects
- Easier to maintain and test

---

### 2. Simplified Initialization

**Issue Context**: Developers found the multi-step initialization process confusing and error-prone.

**Our Solution**:
```typescript
// Simple, one-step initialization
const client = FhevmClient.fromWeb3Provider(provider);
await client.initialize({
  chainId: 11155111,
  gatewayUrl: 'https://gateway.sepolia.zama.ai'
});
```

**Benefits**:
- Clear, intuitive API
- Automatic error handling
- Sensible defaults for common use cases

---

### 3. Wagmi-like Developer Experience

**Issue Context**: Web3 developers are familiar with wagmi's hook-based API and wanted similar patterns for FHEVM.

**Our Solution**:
```typescript
// Familiar hook patterns
const { client, isInitialized, error } = useFhevm();
const { encrypt, isEncrypting } = useEncryption();
const { decrypt, isDecrypting } = useDecryption();
```

**Benefits**:
- Familiar API for web3 developers
- Composable hooks for different operations
- Built-in loading and error states

---

### 4. TypeScript Support

**Issue Context**: Lack of proper TypeScript definitions made development harder and caused runtime errors.

**Our Solution**:
- Full TypeScript codebase
- Comprehensive type definitions exported
- Type-safe APIs for all operations

**Example**:
```typescript
// Fully typed
type EncryptedValue = string;
type FheType = 'uint8' | 'uint16' | 'uint32' | 'address' | 'bool';

async function encrypt(value: number, type: FheType): Promise<EncryptedValue>;
```

**Benefits**:
- Catch errors at compile time
- Better IDE autocomplete
- Self-documenting code

---

### 5. Decryption Workflow Clarity

**Issue Context**: Confusion about the two decryption methods (user decryption vs public decryption) and when to use each.

**Our Solution**:

**User Decryption** (for private data):
```typescript
// Requires user signature (EIP-712)
const decrypted = await userDecrypt(
  encryptedValue,
  'uint8',
  userAddress,
  signer
);
```

**Public Decryption** (for public data):
```typescript
// No signature needed
const decrypted = await publicDecrypt(
  encryptedValue,
  'uint8'
);
```

**Benefits**:
- Clear separation of concerns
- Explicit naming makes intent obvious
- Comprehensive documentation

---

### 6. Batch Operations

**Issue Context**: Need to encrypt multiple values efficiently without multiple round trips.

**Our Solution**:
```typescript
// Encrypt multiple values at once
const encrypted = await client.encryptBatch([
  { value: 42, type: 'uint8' },
  { value: 1000, type: 'uint32' },
  { value: true, type: 'bool' }
]);
```

**Benefits**:
- Improved performance
- Reduced network calls
- Cleaner code

---

### 7. Error Handling

**Issue Context**: Cryptic error messages made debugging difficult.

**Our Solution**:
```typescript
try {
  await encrypt(value, 'uint8');
} catch (error) {
  if (error.code === 'INVALID_VALUE') {
    // User-friendly message
    console.error('Value out of range for uint8 (0-255)');
  }
}
```

**Benefits**:
- Clear error messages
- Error codes for programmatic handling
- Helpful debugging information

---

### 8. Contract Integration

**Issue Context**: Boilerplate code for contract interactions with encrypted values was repetitive.

**Our Solution**:
```typescript
const { send } = useContract();

// Simplified contract call
await send(
  contractAddress,
  contractABI,
  signer,
  'methodName',
  encryptedArg1,
  encryptedArg2
);
```

**Benefits**:
- Less boilerplate
- Consistent error handling
- Automatic transaction management

---

### 9. Testing Support

**Issue Context**: Difficulty testing applications that use FHE encryption.

**Our Solution**:
- Mock client for testing
- Deterministic encryption in test mode
- Clear testing documentation

**Example**:
```typescript
// In tests
import { createMockFhevmClient } from '@anonymous-art/fhevm-sdk/testing';

const mockClient = createMockFhevmClient();
// Use in tests with predictable behavior
```

**Benefits**:
- Easier to write tests
- Faster test execution
- Predictable test behavior

---

### 10. Documentation and Examples

**Issue Context**: Lack of comprehensive examples showing real-world usage patterns.

**Our Solution**:
- Complete examples for Next.js, React, and vanilla JS
- Step-by-step documentation
- Real-world demo application (Anonymous Art Authentication)
- Video walkthrough

**Benefits**:
- Faster onboarding
- Reference implementations
- Best practices demonstrated

---

## Community-Requested Features

### Implemented ✅

- [x] Framework-agnostic core SDK
- [x] React hooks adapter
- [x] TypeScript support
- [x] Wagmi-like API
- [x] Batch operations
- [x] User and public decryption
- [x] Comprehensive error handling
- [x] Multiple framework examples
- [x] Testing utilities

### Under Consideration 🔄

- [ ] Vue.js adapter package
- [ ] Svelte adapter package
- [ ] React Native support
- [ ] WebSocket support for real-time updates
- [ ] Advanced caching strategies

---

## Design Principles

Based on community feedback, we established these core principles:

1. **Simplicity First**: APIs should be intuitive and require minimal configuration
2. **Framework Agnostic**: Core functionality independent of UI frameworks
3. **Type Safety**: Full TypeScript support throughout
4. **Developer Experience**: Familiar patterns (wagmi-like hooks, ethers.js integration)
5. **Composability**: Small, focused utilities that work together
6. **Clear Documentation**: Every feature thoroughly documented with examples
7. **Error Clarity**: Helpful error messages that guide developers to solutions
8. **Performance**: Efficient operations with batch support where applicable

---

## Contributing

Found an issue or have a suggestion? We welcome community feedback!

- **GitHub Issues**: https://github.com/TerenceMayer/fhevm-react-template/issues
- **Discussions**: https://github.com/TerenceMayer/fhevm-react-template/discussions

---

**Last Updated**: October 2025
