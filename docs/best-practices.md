# Best Practices

## Initialization

### Always Initialize Before Use

```typescript
// ✅ Good
const client = await FhevmClient.fromWeb3Provider(window.ethereum);
await client.initialize();
const encrypted = await client.encrypt(42, 'uint8');

// ❌ Bad
const client = await FhevmClient.fromWeb3Provider(window.ethereum);
const encrypted = await client.encrypt(42, 'uint8'); // Will fail!
```

### Check Initialization State

```typescript
// React Hook
const { client, isInitialized } = useFhevm();

if (!isInitialized) {
  return <div>Initializing...</div>;
}

// Vanilla JS
if (!client.isInitialized()) {
  await client.initialize();
}
```

## Encryption

### Choose Appropriate Type

Use the smallest type that fits your data to minimize gas costs:

```typescript
// ✅ Good
const age = await client.encrypt(25, 'uint8'); // 0-255
const price = await client.encrypt(1000, 'uint16'); // 0-65535

// ❌ Bad
const age = await client.encrypt(25, 'uint256'); // Wastes gas
```

### Batch Encryption for Multiple Values

```typescript
// ✅ Good - Single transaction
const encrypted = await client.encryptBatch([
  { value: 100, type: 'uint8' },
  { value: 200, type: 'uint16' },
  { value: 300, type: 'uint32' },
]);

// ❌ Bad - Multiple calls
const enc1 = await client.encrypt(100, 'uint8');
const enc2 = await client.encrypt(200, 'uint16');
const enc3 = await client.encrypt(300, 'uint32');
```

## Decryption

### User vs Public Decryption

```typescript
// User Decryption - Requires EIP-712 signature
// Use for private user data
const privateData = await client.userDecrypt(
  contractAddress,
  encryptedValue,
  userAddress
);

// Public Decryption - No signature needed
// Use for publicly accessible data
const publicData = await client.publicDecrypt(
  contractAddress,
  encryptedValue
);
```

## Error Handling

### Always Catch Errors

```typescript
// ✅ Good
try {
  const encrypted = await client.encrypt(value, 'uint8');
  const tx = await contract.submitData(encrypted);
  await tx.wait();
} catch (error) {
  if (error instanceof FhevmError) {
    // Handle FHEVM-specific errors
    console.error('FHE Error:', error.code, error.message);
  } else {
    // Handle other errors
    console.error('Error:', error);
  }
}

// ❌ Bad
const encrypted = await client.encrypt(value, 'uint8');
const tx = await contract.submitData(encrypted);
```

### Handle Signature Rejection

```typescript
try {
  const decrypted = await client.userDecrypt(address, value, user);
} catch (error) {
  if (error.code === ErrorCodes.SIGNATURE_REJECTED) {
    // User rejected signature
    alert('Decryption requires your signature');
  }
}
```

## React Integration

### Use Provider at Root Level

```typescript
// ✅ Good
function App() {
  return (
    <FhevmProvider chainId={11155111}>
      <Router>
        <Routes />
      </Router>
    </FhevmProvider>
  );
}

// ❌ Bad - Multiple providers
function Component1() {
  return (
    <FhevmProvider>
      <Child1 />
    </FhevmProvider>
  );
}

function Component2() {
  return (
    <FhevmProvider>
      <Child2 />
    </FhevmProvider>
  );
}
```

### Use Hooks in Functional Components

```typescript
// ✅ Good
function MyComponent() {
  const { encrypt } = useEncryption();

  const handleSubmit = async (value: number) => {
    const encrypted = await encrypt(value, 'uint8');
    // Use encrypted
  };

  return <button onClick={() => handleSubmit(42)}>Submit</button>;
}

// ❌ Bad - Hooks in class components
class MyComponent extends React.Component {
  handleSubmit = () => {
    const { encrypt } = useEncryption(); // Won't work!
  };
}
```

## Contract Interaction

### Verify Transaction Success

```typescript
// ✅ Good
const tx = await contract.submitData(encrypted);
const receipt = await tx.wait();

if (receipt.status === 1) {
  console.log('Transaction successful');
} else {
  console.error('Transaction failed');
}

// ❌ Bad
await contract.submitData(encrypted);
// Don't know if it succeeded
```

### Use Access Control

```typescript
// Smart Contract (Solidity)
function submitData(einput encryptedValue, bytes calldata inputProof) public {
  euint32 value = TFHE.asEuint32(encryptedValue, inputProof);

  // Allow only the sender to decrypt
  TFHE.allow(value, msg.sender);

  // Allow contract to use the value
  TFHE.allowThis(value);

  myData[msg.sender] = value;
}
```

## Performance

### Cache Client Instance

```typescript
// ✅ Good - Reuse client
let cachedClient: FhevmClient | null = null;

async function getClient() {
  if (!cachedClient) {
    cachedClient = await FhevmClient.fromWeb3Provider(window.ethereum);
    await cachedClient.initialize();
  }
  return cachedClient;
}

// ❌ Bad - Create new client every time
async function encrypt(value: number) {
  const client = await FhevmClient.fromWeb3Provider(window.ethereum);
  await client.initialize(); // Slow!
  return client.encrypt(value, 'uint8');
}
```

### Minimize Encrypted Operations

```typescript
// ✅ Good - Do math in plaintext when possible
const plainSum = values.reduce((a, b) => a + b, 0);
const encrypted = await client.encrypt(plainSum, 'uint32');

// ❌ Bad - Unnecessary encrypted operations
const encrypted = [];
for (const value of values) {
  encrypted.push(await client.encrypt(value, 'uint32'));
}
// Then sum on-chain (expensive!)
```

## Security

### Never Log Sensitive Data

```typescript
// ✅ Good
const encrypted = await client.encrypt(secretValue, 'uint8');
console.log('Data encrypted successfully');

// ❌ Bad
const encrypted = await client.encrypt(secretValue, 'uint8');
console.log('Encrypted value:', secretValue); // Exposed!
```

### Validate Inputs

```typescript
// ✅ Good
function encryptAge(age: number) {
  if (age < 0 || age > 150) {
    throw new Error('Invalid age');
  }
  if (!Number.isInteger(age)) {
    throw new Error('Age must be an integer');
  }
  return client.encrypt(age, 'uint8');
}

// ❌ Bad
function encryptAge(age: number) {
  return client.encrypt(age, 'uint8'); // No validation
}
```

### Use Environment Variables for Config

```typescript
// ✅ Good
const client = new FhevmClient({
  chainId: Number(process.env.CHAIN_ID),
  gatewayUrl: process.env.GATEWAY_URL,
});

// ❌ Bad
const client = new FhevmClient({
  chainId: 11155111, // Hardcoded
  gatewayUrl: 'https://gateway.example.com', // Hardcoded
});
```

## Testing

### Mock the Client in Tests

```typescript
// test.ts
jest.mock('@anonymous-art/fhevm-sdk');

describe('MyComponent', () => {
  it('should encrypt data', async () => {
    const mockEncrypt = jest.fn().mockResolvedValue({
      data: new Uint8Array([1, 2, 3]),
      type: 'uint8',
    });

    FhevmClient.prototype.encrypt = mockEncrypt;

    // Test your component
  });
});
```

## Type Safety

### Use TypeScript

```typescript
// ✅ Good - Type safe
import { FhevmClient, FheType } from '@anonymous-art/fhevm-sdk';

async function encryptValue(value: number, type: FheType) {
  return client.encrypt(value, type);
}

// ❌ Bad - No type safety
async function encryptValue(value, type) {
  return client.encrypt(value, type);
}
```
