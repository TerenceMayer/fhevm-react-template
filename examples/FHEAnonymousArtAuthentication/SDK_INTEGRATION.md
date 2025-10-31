# SDK Integration Guide for FHEAnonymousArtAuthentication

## Current Status

The FHEAnonymousArtAuthentication example is a production-ready demo application that uses direct contract interaction. To fully integrate with `@anonymous-art/fhevm-sdk`, the following updates are recommended:

## How to Integrate the SDK

### 1. Add SDK Script Tag

Add the SDK to your HTML file (if using CDN) or import in your JavaScript:

```html
<!-- Option 1: CDN (for standalone HTML) -->
<script type="module">
  import { FhevmClient } from 'https://cdn.skypack.dev/@anonymous-art/fhevm-sdk';
  // Use FhevmClient...
</script>

<!-- Option 2: Use with build tool -->
<script type="module" src="./main.js"></script>
```

### 2. Initialize FHEVM Client

Replace manual fhevmjs initialization with SDK client:

```javascript
// OLD: Direct fhevmjs usage
import { createInstance } from 'fhevmjs';
const instance = await createInstance({ chainId: 11155111 });

// NEW: Use SDK
import { FhevmClient } from '@anonymous-art/fhevm-sdk';

const provider = new ethers.BrowserProvider(window.ethereum);
const client = await FhevmClient.fromWeb3Provider(provider);
await client.initialize();
```

### 3. Encrypt Data

Replace manual encryption with SDK methods:

```javascript
// OLD: Manual encryption
const encrypted = await instance.encrypt_uint8(value);

// NEW: Use SDK
const encrypted = await client.encrypt(value, 'uint8');
const encrypted32 = await client.encrypt(largeValue, 'uint32');
```

### 4. Batch Encryption

For multiple values, use batch encryption:

```javascript
// Encrypt multiple artwork attributes at once
const encryptedData = await client.encryptBatch([
  { value: artworkAge, type: 'uint32' },
  { value: conditionScore, type: 'uint8' },
  { value: metadataHash, type: 'uint32' }
]);
```

### 5. Decryption

Use SDK for decryption with EIP-712 signatures:

```javascript
// User decryption (requires signature)
const decryptedScore = await client.userDecrypt(
  contractAddress,
  encryptedValue,
  userAddress
);

// Public decryption (for publicly available data)
const publicResult = await client.publicDecrypt(
  contractAddress,
  encryptedValue
);
```

## Implementation Steps

### Step 1: Update HTML to Load SDK

Add to the `<head>` section or create a separate JS module file:

```html
<script type="module">
  import { FhevmClient } from '@anonymous-art/fhevm-sdk';

  // Make available globally if needed
  window.FhevmClient = FhevmClient;
</script>
```

### Step 2: Modify Initialization Function

Update the `initializeWeb3()` function:

```javascript
let fhevmClient = null;

async function initializeWeb3() {
  try {
    if (!window.ethereum) {
      updateConnectionStatus('MetaMask not detected.', 'error');
      return;
    }

    // Initialize provider and signer
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();

    // Initialize FHEVM SDK client
    fhevmClient = await FhevmClient.fromWeb3Provider(provider);
    await fhevmClient.initialize();

    console.log('✅ FHEVM SDK initialized');

    // Rest of initialization...
  } catch (error) {
    console.error('Initialization error:', error);
  }
}
```

### Step 3: Update Artwork Submission

Modify the artwork submission to use SDK encryption:

```javascript
document.getElementById('artworkForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  try {
    const age = parseInt(document.getElementById('artworkAge').value);
    const condition = parseInt(document.getElementById('artworkCondition').value);

    // Use SDK for encryption
    const encryptedAge = await fhevmClient.encrypt(age, 'uint32');
    const encryptedCondition = await fhevmClient.encrypt(condition, 'uint8');

    // Submit to contract
    const tx = await contract.submitArtwork(
      encryptedAge,
      encryptedCondition,
      consensusThreshold
    );

    await tx.wait();
    showStatus('success', 'Artwork submitted successfully!', 'artworkStatus');
  } catch (error) {
    console.error('Submission error:', error);
    showStatus('error', parseErrorMessage(error), 'artworkStatus');
  }
});
```

### Step 4: Update Expert Authentication

Modify authentication submission to use SDK:

```javascript
document.getElementById('authForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  try {
    const authenticityScore = parseInt(document.getElementById('authenticityScore').value);
    const confidenceScore = parseInt(document.getElementById('confidenceScore').value);

    // Use SDK for encryption
    const encryptedAuth = await fhevmClient.encrypt(authenticityScore, 'uint8');
    const encryptedConf = await fhevmClient.encrypt(confidenceScore, 'uint8');

    // Submit to contract
    const tx = await contract.submitAuthentication(
      artworkId,
      expertId,
      encryptedAuth,
      encryptedConf
    );

    await tx.wait();
    showStatus('success', 'Authentication submitted!', 'authStatus');
  } catch (error) {
    console.error('Authentication error:', error);
    showStatus('error', parseErrorMessage(error), 'authStatus');
  }
});
```

### Step 5: Add Decryption Features

Add functionality to decrypt results:

```javascript
async function decryptArtworkResult(artworkId) {
  try {
    const artwork = await contract.getArtwork(artworkId);

    // Decrypt using SDK
    const decryptedScore = await fhevmClient.userDecrypt(
      contractAddress,
      artwork.finalScore,
      await signer.getAddress()
    );

    console.log('Decrypted authentication score:', decryptedScore);
    return decryptedScore;
  } catch (error) {
    console.error('Decryption error:', error);
    throw error;
  }
}
```

## Benefits of SDK Integration

### Developer Experience
- ✅ **Simplified API**: One-line encryption/decryption
- ✅ **Type Safety**: Built-in TypeScript support
- ✅ **Error Handling**: Consistent error messages and codes
- ✅ **Less Code**: Reduced boilerplate

### Functionality
- ✅ **Automatic Initialization**: SDK handles key fetching
- ✅ **Batch Operations**: Efficient multi-value encryption
- ✅ **EIP-712 Support**: Built-in signature handling
- ✅ **Provider Abstraction**: Works with any Web3 provider

### Maintenance
- ✅ **Future-Proof**: SDK updates automatically improve your app
- ✅ **Best Practices**: SDK enforces recommended patterns
- ✅ **Documentation**: Comprehensive guides and examples

## Testing

After integration, test these scenarios:

1. **Initialization**: SDK initializes successfully
2. **Artwork Submission**: Encrypted data submitted to contract
3. **Authentication**: Experts can submit encrypted scores
4. **Decryption**: Users can decrypt their own data
5. **Error Handling**: Graceful error messages

## Migration Checklist

- [ ] Add SDK dependency to package.json
- [ ] Update initialization to use FhevmClient
- [ ] Replace manual encryption with client.encrypt()
- [ ] Update artwork submission to use SDK
- [ ] Update authentication submission to use SDK
- [ ] Add decryption functionality
- [ ] Test all flows end-to-end
- [ ] Update documentation

## Reference

- [SDK Documentation](../../docs/getting-started.md)
- [API Reference](../../docs/api-reference.md)
- [Vanilla JS Example](../vanilla-js/)
- [React Example](../react/)

## Support

For questions or issues with SDK integration:
- Check [Troubleshooting Guide](../../docs/troubleshooting.md)
- Review [Examples](../)
- Open an issue on GitHub
