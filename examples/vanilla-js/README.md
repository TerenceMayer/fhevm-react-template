# FHEVM Vanilla JavaScript Example

This is a vanilla JavaScript example using only `@anonymous-art/fhevm-sdk` (no framework required).

## 🚀 Quick Start

### Option 1: Using Vite Dev Server

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Visit http://localhost:5173
```

### Option 2: Simple HTTP Server

```bash
# No installation needed - just serve the files
npm run serve

# Or use Python
python -m http.server 8080

# Visit http://localhost:8080
```

## 📦 Packages Used

- `@anonymous-art/fhevm-sdk` - Core FHEVM SDK
- `ethers` - Ethereum interaction
- No UI framework required!

## 🎯 Feature Demonstration

### 1. SDK Initialization

```javascript
// src/main.js
import { FhevmClient } from '@anonymous-art/fhevm-sdk';
import { ethers } from 'ethers';

// Initialize FHEVM client
const provider = new ethers.BrowserProvider(window.ethereum);
const client = FhevmClient.fromWeb3Provider(provider);

await client.initialize({
  chainId: 11155111,
  gatewayUrl: 'https://gateway.sepolia.zama.ai'
});

console.log('FHEVM Client initialized!');
```

### 2. Encrypt Values

```javascript
// Encrypt a value
const value = 42;
const encryptedValue = await client.encrypt(value, 'uint8');

console.log('Encrypted:', encryptedValue);
```

### 3. Decrypt Values

```javascript
// User decryption with EIP-712 signature
const decryptedValue = await client.decrypt(
  encryptedValue,
  'uint8',
  signerAddress
);

console.log('Decrypted:', decryptedValue);
```

### 4. Contract Interaction

```javascript
// Send encrypted data to contract
const contract = new ethers.Contract(contractAddress, abi, signer);

const encryptedInput = await client.encrypt(42, 'uint8');
const tx = await contract.submitData(encryptedInput);
await tx.wait();

console.log('Transaction confirmed!');
```

## 📁 Project Structure

```
vanilla-js/
├── src/
│   └── main.js          # Main application logic
├── index.html           # HTML structure
├── style.css            # Styling
├── vite.config.js       # Vite config (optional)
└── package.json
```

## 🔧 Direct Browser Usage (No Build Step)

You can also use the SDK directly in the browser:

```html
<!DOCTYPE html>
<html>
<head>
  <title>FHEVM Example</title>
</head>
<body>
  <h1>FHEVM SDK Example</h1>
  <button id="encrypt-btn">Encrypt Value</button>

  <script type="module">
    import { FhevmClient } from 'https://unpkg.com/@anonymous-art/fhevm-sdk';
    import { ethers } from 'https://unpkg.com/ethers@6';

    // Your code here
    const provider = new ethers.BrowserProvider(window.ethereum);
    const client = FhevmClient.fromWeb3Provider(provider);

    await client.initialize();

    document.getElementById('encrypt-btn').onclick = async () => {
      const encrypted = await client.encrypt(42, 'uint8');
      console.log('Encrypted:', encrypted);
    };
  </script>
</body>
</html>
```

## 🌐 Deployment

### GitHub Pages

```bash
# Build
npm run build

# Deploy the 'dist' folder to GitHub Pages
```

### Any Static Host

Just upload the `index.html`, `style.css`, and `src/main.js` files to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

## 💡 Key Advantages

- ✅ **No Framework Overhead** - Pure JavaScript, minimal bundle size
- ✅ **Simple Deployment** - Just HTML, CSS, and JS files
- ✅ **Fast Load Times** - No framework to download and parse
- ✅ **Easy to Understand** - Direct SDK usage without abstractions
- ✅ **Full SDK Access** - All SDK features available

## 📚 More Information

- [FHEVM SDK Documentation](../../README.md)
- [Ethers.js Documentation](https://docs.ethers.org)
- [Zama Documentation](https://docs.zama.ai)
