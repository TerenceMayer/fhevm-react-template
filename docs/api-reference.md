# API Reference

## Core SDK (`@anonymous-art/fhevm-sdk`)

### FhevmClient

The main client class for FHEVM operations.

#### Constructor

```typescript
new FhevmClient(config: FhevmConfig)
```

**Parameters:**
- `config.chainId` - Network chain ID (default: 11155111 for Sepolia)
- `config.provider` - Ethers provider (optional)
- `config.gatewayUrl` - Gateway URL for decryption (optional)

#### Static Methods

##### `fromWeb3Provider()`

```typescript
static async fromWeb3Provider(provider: any): Promise<FhevmClient>
```

Creates a client from a Web3 provider (e.g., MetaMask).

**Parameters:**
- `provider` - Web3 provider instance (window.ethereum)

**Returns:** `Promise<FhevmClient>`

**Example:**
```typescript
const client = await FhevmClient.fromWeb3Provider(window.ethereum);
```

#### Instance Methods

##### `initialize()`

```typescript
async initialize(): Promise<void>
```

Initializes the client by fetching public keys and setting up encryption.

**Throws:** Error if initialization fails

**Example:**
```typescript
await client.initialize();
```

##### `encrypt()`

```typescript
async encrypt(value: number, type: FheType): Promise<EncryptedValue>
```

Encrypts a single value.

**Parameters:**
- `value` - Number to encrypt
- `type` - FHE type: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'uint128' | 'uint256'

**Returns:** `Promise<EncryptedValue>`

**Example:**
```typescript
const encrypted = await client.encrypt(42, 'uint8');
```

##### `encryptBatch()`

```typescript
async encryptBatch(inputs: EncryptInput[]): Promise<EncryptedValue[]>
```

Encrypts multiple values efficiently.

**Parameters:**
- `inputs` - Array of { value: number, type: FheType }

**Returns:** `Promise<EncryptedValue[]>`

**Example:**
```typescript
const encrypted = await client.encryptBatch([
  { value: 100, type: 'uint8' },
  { value: 200, type: 'uint16' },
]);
```

##### `userDecrypt()`

```typescript
async userDecrypt(
  contract: string,
  value: EncryptedValue,
  user: string
): Promise<number>
```

Decrypts a value using EIP-712 signature.

**Parameters:**
- `contract` - Contract address
- `value` - Encrypted value
- `user` - User address

**Returns:** `Promise<number>`

##### `publicDecrypt()`

```typescript
async publicDecrypt(
  contract: string,
  value: EncryptedValue
): Promise<number>
```

Decrypts publicly available data.

**Parameters:**
- `contract` - Contract address
- `value` - Encrypted value

**Returns:** `Promise<number>`

### Types

#### FheType

```typescript
type FheType = 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'uint128' | 'uint256'
```

#### EncryptedValue

```typescript
interface EncryptedValue {
  data: Uint8Array;
  type: FheType;
}
```

#### FhevmConfig

```typescript
interface FhevmConfig {
  chainId?: number;
  provider?: any;
  gatewayUrl?: string;
  aclAddress?: string;
  kmsVerifierAddress?: string;
}
```

## React Hooks (`@anonymous-art/fhevm-react`)

### FhevmProvider

Root provider for FHEVM context.

```typescript
function FhevmProvider({
  chainId?: number;
  children: React.ReactNode;
}): JSX.Element
```

**Example:**
```typescript
<FhevmProvider chainId={11155111}>
  <App />
</FhevmProvider>
```

### useFhevm()

Access the FHEVM client.

```typescript
function useFhevm(): {
  client: FhevmClient | null;
  isInitialized: boolean;
  error: Error | null;
  chainId: number;
}
```

**Example:**
```typescript
const { client, isInitialized } = useFhevm();
```

### useEncryption()

Hook for encryption operations.

```typescript
function useEncryption(): {
  encrypt: (value: number, type: FheType) => Promise<EncryptedValue>;
  encryptBatch: (inputs: EncryptInput[]) => Promise<EncryptedValue[]>;
  isEncrypting: boolean;
  error: Error | null;
}
```

**Example:**
```typescript
const { encrypt, isEncrypting } = useEncryption();
const encrypted = await encrypt(42, 'uint8');
```

### useDecryption()

Hook for decryption operations.

```typescript
function useDecryption(): {
  decrypt: (contract: string, value: EncryptedValue) => Promise<number>;
  decryptPublic: (contract: string, value: EncryptedValue) => Promise<number>;
  isDecrypting: boolean;
  error: Error | null;
}
```

**Example:**
```typescript
const { decrypt, isDecrypting } = useDecryption();
const decrypted = await decrypt(contractAddress, encrypted);
```

### useContract()

Hook for contract interaction.

```typescript
function useContract(address: string, abi: any): {
  contract: Contract | null;
  isLoading: boolean;
  error: Error | null;
}
```

**Example:**
```typescript
const { contract } = useContract(address, abi);
const tx = await contract.submitData(encrypted);
```

## Error Handling

### FhevmError

```typescript
class FhevmError extends Error {
  code: ErrorCode;
  message: string;
}
```

### Error Codes

```typescript
enum ErrorCodes {
  NOT_INITIALIZED = 'NOT_INITIALIZED',
  ENCRYPTION_FAILED = 'ENCRYPTION_FAILED',
  DECRYPTION_FAILED = 'DECRYPTION_FAILED',
  SIGNATURE_REJECTED = 'SIGNATURE_REJECTED',
  NETWORK_ERROR = 'NETWORK_ERROR',
}
```

**Example:**
```typescript
import { FhevmError, ErrorCodes } from '@anonymous-art/fhevm-sdk';

try {
  const encrypted = await client.encrypt(value, 'uint8');
} catch (error) {
  if (error instanceof FhevmError) {
    switch (error.code) {
      case ErrorCodes.NOT_INITIALIZED:
        console.error('Client not initialized');
        break;
      case ErrorCodes.ENCRYPTION_FAILED:
        console.error('Encryption failed:', error.message);
        break;
    }
  }
}
```
