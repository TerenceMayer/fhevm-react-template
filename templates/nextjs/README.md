# FHEVM Next.js Example

This is a Next.js example application using `@anonymous-art/fhevm-sdk` and `@anonymous-art/fhevm-react`.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Visit http://localhost:3000
```

## 📦 Packages Used

- `@anonymous-art/fhevm-sdk` - Core FHEVM SDK
- `@anonymous-art/fhevm-react` - React Hooks for FHEVM
- `next` - Next.js framework
- `ethers` - Ethereum interaction

## 🎯 Feature Demonstration

### 1. FHEVM Provider Setup

```tsx
// pages/_app.tsx
import { FhevmProvider } from '@anonymous-art/fhevm-react';

export default function App({ Component, pageProps }) {
  return (
    <FhevmProvider config={{ chainId: 11155111 }}>
      <Component {...pageProps} />
    </FhevmProvider>
  );
}
```

### 2. Using Hooks

```tsx
// pages/index.tsx
import { useFhevm, useEncryption } from '@anonymous-art/fhevm-react';

export default function Home() {
  const { client, isInitialized } = useFhevm();
  const { encrypt } = useEncryption();

  const handleEncrypt = async () => {
    const encrypted = await encrypt(42, 'uint8');
    console.log('Encrypted:', encrypted);
  };

  return (
    <div>
      <h1>FHEVM Next.js Example</h1>
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
nextjs/
├── pages/
│   ├── _app.tsx          # FHEVM Provider setup
│   ├── index.tsx         # Home page
│   └── api/              # API routes (optional)
├── components/
│   ├── EncryptForm.tsx   # Encryption form
│   └── WalletConnect.tsx # Wallet connection
├── styles/
│   └── globals.css
├── public/
├── next.config.js
└── tsconfig.json
```

## 🔧 Configuration

### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

module.exports = nextConfig;
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_GATEWAY_ADDRESS=0x...
```

## 📚 More Information

- [FHEVM SDK Documentation](../../SDK_README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Zama Documentation](https://docs.zama.ai)
