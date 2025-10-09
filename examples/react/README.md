# FHEVM React Example

This is a React (Vite) example application using `@anonymous-art/fhevm-sdk` and `@anonymous-art/fhevm-react`.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Visit http://localhost:5173
```

## 📦 Packages Used

- `@anonymous-art/fhevm-sdk` - Core FHEVM SDK
- `@anonymous-art/fhevm-react` - React Hooks for FHEVM
- `vite` - Build tool
- `ethers` - Ethereum interaction

## 🎯 Feature Demonstration

### 1. FHEVM Provider Setup

```tsx
// src/main.tsx
import { FhevmProvider } from '@anonymous-art/fhevm-react';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FhevmProvider config={{ chainId: 11155111 }}>
      <App />
    </FhevmProvider>
  </React.StrictMode>,
);
```

### 2. Using Hooks

```tsx
// src/App.tsx
import { useFhevm, useEncryption } from '@anonymous-art/fhevm-react';

function App() {
  const { client, isInitialized } = useFhevm();
  const { encrypt } = useEncryption();

  const handleEncrypt = async () => {
    const encrypted = await encrypt(42, 'uint8');
    console.log('Encrypted:', encrypted);
  };

  return (
    <div>
      {isInitialized ? (
        <button onClick={handleEncrypt}>Encrypt Value</button>
      ) : (
        <div>Initializing FHEVM...</div>
      )}
    </div>
  );
}
```

### 3. Contract Interaction

```tsx
import { useContract } from '@anonymous-art/fhevm-react';

const { send, isLoading } = useContract();

const handleSubmit = async () => {
  const encrypted = await encrypt(value, 'uint8');

  const tx = await send(
    contractAddress,
    contractABI,
    signer,
    'submitData',
    encrypted
  );

  await tx.wait();
};
```

## 📁 Project Structure

```
react/
├── src/
│   ├── main.tsx           # Entry point with FHEVM Provider
│   ├── App.tsx            # Main application
│   ├── components/
│   │   ├── EncryptForm.tsx
│   │   └── WalletConnect.tsx
│   └── App.css
├── public/
├── index.html
├── vite.config.ts
└── tsconfig.json
```

## 🔧 Configuration

### vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@anonymous-art/fhevm-sdk']
  }
});
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## 🌐 Deployment

### Vercel

```bash
npm run build
# Deploy the 'dist' folder
```

### Environment Variables

Create `.env`:

```
VITE_CONTRACT_ADDRESS=0x...
VITE_CHAIN_ID=11155111
VITE_GATEWAY_ADDRESS=0x...
```

## 📚 More Information

- [FHEVM SDK Documentation](../../README.md)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Zama Documentation](https://docs.zama.ai)
