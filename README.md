# Universal FHEVM SDK

**A Framework-Agnostic SDK for Fully Homomorphic Encryption on Ethereum**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![fhEVM](https://img.shields.io/badge/fhEVM-v0.8.0-blue)](https://docs.zama.ai/fhevm)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)

---

## 🔗 Quick Links

- **🚀 Live Demo**: [https://terencemayer.github.io/FHEAnonymousArtAuthentication/](https://terencemayer.github.io/FHEAnonymousArtAuthentication/)
- **📋 GitHub Repository**: [https://github.com/TerenceMayer/fhevm-react-template](https://github.com/TerenceMayer/fhevm-react-template)
- **🎥 Video Demo**: Watch demonstration (demo1.mp4 demo2.mp4)
- **📦 SDK Package**: `packages/fhevm-sdk/`
- **⚛️ React Hooks**: `packages/fhevm-react/`

---

## 🎯 Project Overview

This project delivers a **complete, production-ready SDK** for building dApps with Fully Homomorphic Encryption (FHE) on Ethereum. The SDK provides a clean, modular API similar to wagmi, making it easy for developers to integrate privacy-preserving computations into their applications.

### What This SDK Provides

✅ **Universal Core SDK** (`fhevm-sdk`)
- Framework-agnostic TypeScript library
- Works with any JavaScript/TypeScript project
- Handles FHE initialization, encryption, and decryption
- EIP-712 signature support for user decryption
- Public decryption workflows

✅ **React Integration** (`fhevm-react`)
- Complete hooks library for React/Next.js
- Wagmi-like API design for familiar developer experience
- Type-safe, composable hooks
- Built on the core SDK

✅ **Demo Application** (Showcase)
- Anonymous Art Authentication platform
- Demonstrates SDK capabilities in a real-world scenario
- Shows best practices for FHE implementation

---

## 🏗️ Architecture

### Core Design Principles

1. **Framework Agnostic**: Core SDK has zero dependencies on UI frameworks
2. **Modular**: Clean separation between core logic and framework adapters
3. **Type Safe**: Full TypeScript support with comprehensive type definitions
4. **Developer Friendly**: Intuitive API inspired by popular libraries like wagmi
5. **Production Ready**: Battle-tested patterns and error handling

### Package Structure

```
fhevm-sdk/
├── packages/
│   ├── fhevm-sdk/              # Core SDK (framework-agnostic)
│   │   ├── src/
│   │   │   ├── client/        # FHE client initialization
│   │   │   ├── encryption/    # Input encryption utilities
│   │   │   ├── decryption/    # User & public decryption
│   │   │   ├── signatures/    # EIP-712 signature handling
│   │   │   └── types/         # TypeScript definitions
│   │   └── package.json
│   │
│   └── fhevm-react/            # React hooks library
│       ├── src/
│       │   ├── hooks/         # React hooks (useFhevm, useEncryption, etc.)
│       │   ├── context/       # React context providers
│       │   └── types/         # React-specific types
│       └── package.json
│
├── contracts/                  # Solidity smart contracts
│   └── AnonymousArtAuthentication.sol
│
├── scripts/                    # Deployment & ABI generation
│   └── deploy.js
│
├── examples/                   # Usage examples
│   ├── vanilla-js/            # Pure JavaScript example
│   ├── react/                 # React example
│   └── nextjs/                # Next.js example (future)
│
└── index.html                 # Standalone demo (no build required)
```

---

## 📦 SDK Features

### Core SDK (`fhevm-sdk`)

#### Initialization
```typescript
import { FhevmClient } from '@fhevm-sdk/core';

// Initialize from Web3 provider
const client = await FhevmClient.fromWeb3Provider(window.ethereum);
await client.initialize();

// Or initialize with custom config
const client = new FhevmClient({
  provider: customProvider,
  chainId: 11155111,
  gatewayUrl: 'https://gateway.zama.ai'
});
```

#### Encryption
```typescript
// Encrypt input values
const encrypted = await client.encrypt(42, 'uint8');
const encryptedLarge = await client.encrypt(1000000, 'uint32');

// Batch encryption
const batch = await client.encryptBatch([
  { value: 100, type: 'uint8' },
  { value: 200, type: 'uint16' },
  { value: 300, type: 'uint32' }
]);
```

#### Decryption

**User Decryption** (EIP-712 Signature)
```typescript
// User signs to decrypt their own data
const decrypted = await client.userDecrypt(
  contractAddress,
  encryptedValue,
  userAddress
);
```

**Public Decryption**
```typescript
// Decrypt publicly available data
const publicData = await client.publicDecrypt(
  contractAddress,
  encryptedValue
);
```

### React Hooks (`fhevm-react`)

#### Setup Provider
```tsx
import { FhevmProvider } from '@fhevm-sdk/react';

function App() {
  return (
    <FhevmProvider chainId={11155111}>
      <YourApp />
    </FhevmProvider>
  );
}
```

#### Use Hooks
```tsx
import { useFhevm, useEncryption, useDecryption } from '@fhevm-sdk/react';

function MyComponent() {
  const { client, isInitialized, error } = useFhevm();
  const { encrypt, isEncrypting } = useEncryption();
  const { decrypt, isDecrypting } = useDecryption();

  const handleEncrypt = async () => {
    const encrypted = await encrypt(42, 'uint8');
    // Use encrypted value in transaction
  };

  const handleDecrypt = async () => {
    const decrypted = await decrypt(contractAddress, encryptedValue);
    console.log('Decrypted value:', decrypted);
  };

  if (!isInitialized) return <div>Initializing FHE...</div>;

  return (
    <div>
      <button onClick={handleEncrypt} disabled={isEncrypting}>
        Encrypt Value
      </button>
      <button onClick={handleDecrypt} disabled={isDecrypting}>
        Decrypt Value
      </button>
    </div>
  );
}
```

---

## 🚀 Quick Start

### Installation

**From Root** (recommended)
```bash
# Clone repository
git clone https://github.com/TerenceMayer/fhevm-react-template.git
cd FHEAnonymousArtAuthentication

# Install all packages
npm install

# Build SDK packages
npm run build

# Compile Solidity contracts
npm run compile
```

**Individual Packages**
```bash
# Install core SDK
npm install @fhevm-sdk/core

# Install React hooks (includes core)
npm install @fhevm-sdk/react
```

### Development Workflow

1. **Compile Contracts**
```bash
npm run compile
```
This generates ABI files in `artifacts/contracts/`

2. **Deploy Contracts**
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

3. **Start Demo Application**
```bash
# No build required - open index.html directly
# Or serve with any HTTP server:
npm run serve
# Access at http://localhost:8080
```

4. **Run Tests**
```bash
npm test
```

---

## 🎨 Demo Application: Anonymous Art Authentication

The demo showcases SDK capabilities through a real-world use case where privacy is paramount.

### Core Concept

**Anonymous Art Authentication** eliminates bias in artwork verification by enabling experts to authenticate artworks without knowing:
- Artist name or reputation
- Artwork title or provenance
- Estimated value or market price

This demonstrates how FHE can preserve privacy while enabling trustless verification.

### Key Features Demonstrated

1. **Encrypted Inputs**
   - Artwork metadata (age, style, materials) → `euint32`
   - Condition scores → `euint8`
   - Expert credentials → `euint8`

2. **Encrypted Computation**
   - Authentication scores → `euint8`
   - Confidence levels → `euint8`
   - All computation happens on encrypted data

3. **Access Control**
   - ACL management with `FHE.allow()` and `FHE.allowThis()`
   - Role-based permissions (owners, experts, admins)

4. **Decryption Flows**
   - User decryption for personal data
   - Admin decryption for consensus results
   - Gateway integration ready

### Live Demo

Experience the platform at: [https://terencemayer.github.io/FHEAnonymousArtAuthentication/](https://terencemayer.github.io/FHEAnonymousArtAuthentication/)

**Smart Contract**: [0x4D874585f820437656554590C812b672305fbb72](https://sepolia.etherscan.io/address/0x4D874585f820437656554590C812b672305fbb72)

---

## 📖 SDK API Reference

### Core SDK Exports

```typescript
// Client
export class FhevmClient {
  static async fromWeb3Provider(provider: any): Promise<FhevmClient>
  async initialize(): Promise<void>
  async encrypt(value: number, type: FheType): Promise<EncryptedValue>
  async encryptBatch(inputs: EncryptInput[]): Promise<EncryptedValue[]>
  async userDecrypt(contract: string, value: EncryptedValue, user: string): Promise<number>
  async publicDecrypt(contract: string, value: EncryptedValue): Promise<number>
}

// Types
export type FheType = 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'uint128' | 'uint256'
export type EncryptedValue = {
  data: Uint8Array
  type: FheType
}

// Utilities
export const FheUtils = {
  isInitialized(): boolean
  getChainId(): number
  getContractAddress(): string
}
```

### React Hooks API

```typescript
// Provider
export function FhevmProvider({
  chainId?: number
  children: React.ReactNode
}): JSX.Element

// Hooks
export function useFhevm(): {
  client: FhevmClient | null
  isInitialized: boolean
  error: Error | null
  chainId: number
}

export function useEncryption(): {
  encrypt: (value: number, type: FheType) => Promise<EncryptedValue>
  encryptBatch: (inputs: EncryptInput[]) => Promise<EncryptedValue[]>
  isEncrypting: boolean
  error: Error | null
}

export function useDecryption(): {
  decrypt: (contract: string, value: EncryptedValue) => Promise<number>
  decryptPublic: (contract: string, value: EncryptedValue) => Promise<number>
  isDecrypting: boolean
  error: Error | null
}

export function useContract(address: string, abi: any): {
  contract: Contract | null
  isLoading: boolean
  error: Error | null
}
```

---

## 🎥 Video Demonstration

Watch our comprehensive video demo (demo.mp4) showcasing:

### SDK Features
- ✅ Installation and setup process
- ✅ Core SDK usage (encryption/decryption)
- ✅ React hooks integration
- ✅ EIP-712 signature workflows
- ✅ Contract deployment and interaction

### Demo Application
- ✅ Complete workflow from artwork submission to authentication
- ✅ Privacy-preserving expert evaluation
- ✅ Real blockchain transactions on Sepolia testnet
- ✅ Admin panel functionality

### Design Choices
- ✅ Why framework-agnostic architecture
- ✅ API design inspired by wagmi
- ✅ Type safety and developer experience
- ✅ Performance optimizations

---

## 🔧 Advanced Usage

### Custom Configuration

```typescript
import { FhevmClient, FhevmConfig } from '@fhevm-sdk/core';

const config: FhevmConfig = {
  chainId: 11155111,
  gatewayUrl: 'https://custom-gateway.example.com',
  aclAddress: '0x...',
  kmsVerifierAddress: '0x...',
  customProvider: window.ethereum,
  cacheEnabled: true
};

const client = new FhevmClient(config);
await client.initialize();
```

### Error Handling

```typescript
import { FhevmError, ErrorCodes } from '@fhevm-sdk/core';

try {
  const encrypted = await client.encrypt(value, 'uint8');
} catch (error) {
  if (error instanceof FhevmError) {
    switch (error.code) {
      case ErrorCodes.NOT_INITIALIZED:
        console.error('FHE not initialized');
        break;
      case ErrorCodes.ENCRYPTION_FAILED:
        console.error('Encryption failed:', error.message);
        break;
      case ErrorCodes.SIGNATURE_REJECTED:
        console.error('User rejected signature');
        break;
    }
  }
}
```

### Batch Operations

```typescript
// Efficient batch encryption for multiple inputs
const inputs = [
  { value: 100, type: 'uint8' as const },
  { value: 200, type: 'uint16' as const },
  { value: 300, type: 'uint32' as const }
];

const encrypted = await client.encryptBatch(inputs);

// Use in contract call
await contract.submitMultiple(
  encrypted[0].data,
  encrypted[1].data,
  encrypted[2].data
);
```

---

## 🌐 Technology Stack

### SDK Core
- **Language**: TypeScript 5.0+
- **Build**: Rollup for optimal bundle size
- **Testing**: Jest + Testing Library
- **FHE Library**: fhevmjs (Zama's official library)

### React Integration
- **Framework**: React 18+
- **Hooks**: Functional components with hooks
- **Context**: React Context API for state management
- **Type Safety**: Full TypeScript support

### Smart Contracts
- **Language**: Solidity 0.8.24
- **Framework**: Hardhat
- **FHE Library**: @fhevm/solidity v0.8.0
- **Network**: Ethereum Sepolia Testnet

### Demo Frontend
- **Pure HTML/CSS/JavaScript**: No build step required
- **Web3**: ethers.js v6.14.0
- **Wallet**: MetaMask compatible
- **Responsive**: Mobile and desktop optimized

---

## 🧪 Testing

### Unit Tests
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific package tests
npm test -- packages/fhevm-sdk
npm test -- packages/fhevm-react
```

### Integration Tests
```bash
# Test against local hardhat node
npm run test:integration

# Test against Sepolia testnet
npm run test:sepolia
```

### E2E Tests
```bash
# Run end-to-end tests with demo app
npm run test:e2e
```

---

## 🛣️ Roadmap

### Phase 1: Core SDK (✅ Completed)
- [x] Framework-agnostic core SDK
- [x] React hooks library
- [x] TypeScript definitions
- [x] EIP-712 signature support
- [x] User and public decryption

### Phase 2: Enhanced Developer Experience (🚧 In Progress)
- [ ] Vue.js adapter
- [ ] Svelte adapter
- [ ] CLI tool for project scaffolding
- [ ] Interactive documentation site
- [ ] More usage examples

### Phase 3: Advanced Features (📋 Planned)
- [ ] Gateway integration for automated decryption
- [ ] Encrypted state management utilities
- [ ] Transaction batching optimizations
- [ ] DevTools browser extension
- [ ] Performance monitoring

### Phase 4: Ecosystem (🔮 Future)
- [ ] SDK plugins system
- [ ] Community templates library
- [ ] Integration with popular dApp frameworks
- [ ] Educational resources and tutorials
- [ ] Conference talks and workshops

---

## 📚 Documentation

### For SDK Users

- **Installation Guide**: Get started with the SDK
- **API Reference**: Complete API documentation
- **Usage Examples**: Real-world code examples
- **Best Practices**: Recommended patterns
- **Troubleshooting**: Common issues and solutions

### For Contributors

- **Architecture Overview**: SDK design principles
- **Development Guide**: How to contribute
- **Testing Guide**: Writing and running tests
- **Release Process**: How we publish updates

---

## 🤝 Contributing

We welcome contributions! This is an open-source SDK project.

### Ways to Contribute

- 🐛 **Report Bugs**: Open issues with detailed reports
- 💡 **Suggest Features**: Share ideas for SDK improvements
- 📝 **Improve Docs**: Help make documentation clearer
- 🔧 **Submit PRs**: Add features or fix bugs
- 🎨 **Create Examples**: Show SDK usage in different scenarios
- 🧪 **Write Tests**: Improve test coverage

### Development Setup

1. Fork the repository
2. Clone your fork
3. Install dependencies: `npm install`
4. Create a feature branch: `git checkout -b feature/amazing-feature`
5. Make your changes
6. Run tests: `npm test`
7. Commit: `git commit -m 'Add amazing feature'`
8. Push: `git push origin feature/amazing-feature`
9. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 FHE VM SDK Project

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 🙏 Acknowledgments

- **[Zama](https://www.zama.ai/)**: For pioneering FHE technology and fhEVM
- **[Ethereum Foundation](https://ethereum.org/)**: For the blockchain infrastructure
- **wagmi**: For API design inspiration
- **Community Contributors**: For feedback and contributions

---

## 📞 Contact & Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/TerenceMayer/fhevm-react-template/issues)
- **Discussions**: [Join community discussions](https://github.com/TerenceMayer/fhevm-react-template/discussions)
- **Live Demo**: [https://terencemayer.github.io/FHEAnonymousArtAuthentication/](https://terencemayer.github.io/FHEAnonymousArtAuthentication/)

---

## 🌟 Why This SDK?

### For Developers
- **Easy Integration**: Drop-in solution for any JavaScript/TypeScript project
- **Type Safety**: Full TypeScript support catches errors at compile time
- **Framework Flexible**: Use with React, Vue, Svelte, or vanilla JS
- **Production Ready**: Battle-tested patterns and comprehensive error handling
- **Great DX**: Intuitive API inspired by popular libraries

### For Projects
- **Privacy First**: Enable privacy-preserving dApps without deep FHE knowledge
- **Modular**: Use only what you need, keep bundle sizes small
- **Well Tested**: Comprehensive test suite ensures reliability
- **Active Development**: Regular updates and community support
- **Open Source**: MIT licensed, free to use and modify

---

**Built with ❤️ for the Ethereum and FHE developer community**

*Making Fully Homomorphic Encryption accessible to every developer*

