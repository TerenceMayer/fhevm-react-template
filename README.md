# Universal FHEVM SDK

**A Framework-Agnostic SDK for Fully Homomorphic Encryption on Ethereum**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![fhEVM](https://img.shields.io/badge/fhEVM-v0.8.0-blue)](https://docs.zama.ai/fhevm)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)

---

## 🔗 Quick Links

- **🚀 Live Demo**: [https://terencemayer.github.io/FHEAnonymousArtAuthentication/](https://terencemayer.github.io/FHEAnonymousArtAuthentication/)
- **🎥 Video Demo**: Watch demonstration (demo1.mp4 demo2.mp4)
- **📦 SDK Package**: `packages/fhevm-sdk/` - [README](packages/fhevm-sdk/README.md)
- **⚛️ React Hooks**: `packages/fhevm-react/` - [README](packages/fhevm-react/README.md)
- **🏗️ Templates**: `templates/` - [Next.js](#-templates), [React](#-templates)
- **📝 Examples**: `examples/` - [Vanilla JS](#1-vanilla-javascript-example-examplesvanilla-js), [React](#2-react--vite-example-examplesreact), [Next.js](#3-nextjs-example-examplesnextjs), [Demo App (Vanilla)](#4-fheanonymousartauthentication---vanilla-js-examplesfheanonymousartauthentication), [Demo App (React)](#5-fheanonymousartauthentication---react-edition-examplesfheanonymousartauthentication-react)
- **📚 Documentation**: `docs/` - [Getting Started](docs/getting-started.md), [API Reference](docs/api-reference.md), [Best Practices](docs/best-practices.md), [Troubleshooting](docs/troubleshooting.md)

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

✅ **Comprehensive Examples** (`examples/`)
- Vanilla JavaScript example - pure JS, no framework
- React + Vite example - modern SPA development
- Next.js example - SSR and full-stack apps
- Anonymous Art Authentication - production-ready demo application

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
│   │   │   ├── core/          # Core classes (FhevmClient, managers)
│   │   │   ├── types/         # TypeScript type definitions
│   │   │   ├── utils/         # Utility functions
│   │   │   └── index.ts       # Main exports
│   │   ├── package.json
│   │   └── README.md          # SDK documentation
│   │
│   └── fhevm-react/            # React hooks library
│       ├── src/
│       │   ├── hooks/         # React hooks (useFhevm, useEncryption, etc.)
│       │   ├── context/       # React context providers
│       │   ├── types/         # React-specific types
│       │   └── index.ts       # Main exports
│       ├── package.json
│       └── README.md          # React hooks documentation
│
├── templates/                  # Example templates for quick start
│   ├── nextjs/                # Next.js template
│   └── react/                 # React + Vite template
│
├── contracts/                  # Solidity smart contracts
│   └── AnonymousArtAuthentication.sol
│
├── scripts/                    # Deployment & ABI generation
│   └── deploy.js
│
├── examples/                   # Usage examples
│   ├── vanilla-js/            # Pure JavaScript example
│   ├── react/                 # React + Vite example
│   ├── nextjs/                # Next.js example
│   ├── FHEAnonymousArtAuthentication/      # Full demo (vanilla JS)
│   └── FHEAnonymousArtAuthentication-react/ # Full demo (React + TS)
│
├── docs/                       # Documentation
│   ├── getting-started.md     # Installation and quick start
│   ├── api-reference.md       # Complete API documentation
│   ├── best-practices.md      # Recommended patterns
│   └── troubleshooting.md     # Common issues and solutions
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

## 📋 Templates

The `templates/` directory provides ready-to-use project templates for quick start:

- **`templates/nextjs/`** - Next.js 14+ template with App Router, complete FHE integration, and TypeScript
- **`templates/react/`** - React 18+ template with Vite, FHEVM SDK hooks, and TypeScript

These templates are production-ready starting points for building your own FHE-powered applications.

---

## 📝 Examples

The `examples/` directory contains complete, working examples demonstrating how to use the FHEVM SDK in different environments. Each example is self-contained and ready to run.

### Available Examples

All examples demonstrate complete SDK integration using `@anonymous-art/fhevm-sdk` and `@anonymous-art/fhevm-react` packages.

#### 1. Vanilla JavaScript Example (`examples/vanilla-js/`)

**Perfect for:** Developers who want to use the SDK without any framework overhead.

**Features:**
- ✅ **SDK Integrated**: Uses `@anonymous-art/fhevm-sdk` for all FHE operations
- Pure JavaScript implementation with direct FhevmClient usage
- Web3 provider integration with ethers.js v6
- Runs with Vite dev server - fast HMR
- Minimal bundle size and fast load times
- Full SDK access without framework abstractions
- Demonstrates core encryption/decryption workflow
- Live wallet connection and transaction handling

**Quick Start:**
```bash
cd examples/vanilla-js
npm install
npm run dev  # Visit http://localhost:5173
```

**Key Files:**
- `src/main.js` - Main application logic with FhevmClient SDK usage
- `index.html` - Simple HTML structure
- `style.css` - Basic styling

**SDK Integration:**
```javascript
import { FhevmClient } from '@anonymous-art/fhevm-sdk';

const client = FhevmClient.fromWeb3Provider(window.ethereum);
await client.initialize({ chainId: 11155111 });

const encrypted = await client.encrypt(42, 'uint8');
```

**Use Cases:**
- Simple dApps or prototypes
- Projects that don't need a framework
- Learning the SDK fundamentals
- Embedding FHE into existing vanilla JS projects

---

#### 2. React + Vite Example (`examples/react/`)

**Perfect for:** React developers building modern single-page applications.

**Features:**
- ✅ **SDK Integrated**: Full integration with `@anonymous-art/fhevm-react` hooks
- React 18+ with TypeScript for type safety
- Demonstrates all React hooks (`useFhevm`, `useEncryption`, `useDecryption`)
- FhevmProvider context for app-wide state
- Fast development with Vite and HMR
- Type-safe component development
- Complete wallet integration flow
- Loading states and error handling

**Quick Start:**
```bash
cd examples/react
npm install
npm run dev  # Visit http://localhost:5173
```

**Key Files:**
- `src/main.tsx` - Entry point with `FhevmProvider` setup
- `src/App.tsx` - Main component demonstrating SDK hooks
- `src/components/EncryptForm.tsx` - Encryption form component
- `src/components/WalletConnect.tsx` - Wallet connection component
- `vite.config.ts` - Vite configuration

**SDK Integration:**
```typescript
import { useFhevm, useEncryption, useDecryption } from '@anonymous-art/fhevm-react';

function App() {
  const { client, isInitialized, error } = useFhevm();
  const { encrypt, isEncrypting } = useEncryption();
  const { decrypt, isDecrypting } = useDecryption();

  const encrypted = await encrypt(42, 'uint8');
  const decrypted = await decrypt(encrypted, 'uint8');
}
```

**Demonstrated Hooks:**
- `useFhevm()` - Access FHEVM client and initialization state
- `useEncryption()` - Encrypt values with loading states
- `useDecryption()` - Decrypt encrypted values with EIP-712 signatures

**Use Cases:**
- Modern React applications
- dApps with complex UI requirements
- Projects using React ecosystem tools

---

#### 3. Next.js Example (`examples/nextjs/`)

**Perfect for:** Full-stack applications with server-side rendering and SEO requirements.

**Features:**
- ✅ **SDK Integrated**: Complete `@anonymous-art/fhevm-sdk` integration
- Next.js 14+ with App Router and React Server Components
- Server-side rendering (SSR) compatible architecture
- TypeScript with comprehensive type definitions
- Custom hooks (`useFHE`, `useEncryption`, `useComputation`)
- FHEProvider with client-side state management
- Responsive UI with Tailwind CSS
- Interactive demos (Encryption, Computation, Banking example)
- API routes for FHE operations

**Quick Start:**
```bash
cd examples/nextjs
npm install
npm run dev  # Visit http://localhost:3000
```

**Key Files:**
- `src/app/page.tsx` - Main page with tabbed demo interface
- `src/components/fhe/FHEProvider.tsx` - FHEVM SDK provider using `FhevmClient`
- `src/hooks/useFHE.ts` - Main hook for accessing FHEVM client
- `src/hooks/useEncryption.ts` - Encryption operations hook
- `src/hooks/useComputation.ts` - Homomorphic computation hook
- `src/components/fhe/EncryptionDemo.tsx` - Encryption demonstration
- `src/components/fhe/ComputationDemo.tsx` - Computation demonstration
- `src/components/examples/BankingExample.tsx` - Banking use case example
- `next.config.js` - Next.js configuration with webpack fallbacks

**SDK Integration Highlights:**
```typescript
// FHEProvider initializes FhevmClient
const fhevmClient = await FhevmClient.fromWeb3Provider(provider);
await fhevmClient.initialize();

// useEncryption hook
const { encrypt, isEncrypting } = useEncryption();
const encrypted = await encrypt(42, 'uint32');

// useComputation hook
const { compute, isComputing } = useComputation();
const result = await compute('add', 10, 20);
```

**Use Cases:**
- Production-ready FHE applications
- Full-stack Web3 applications with privacy
- Projects demonstrating complete SDK integration
- Multi-page applications with complex FHE workflows

---

#### 4. FHEAnonymousArtAuthentication - Vanilla JS (`examples/FHEAnonymousArtAuthentication/`)

**Perfect for:** Understanding a complete, production-ready FHE application with real-world use case (vanilla JavaScript version).

**Features:**
- 🎨 **Full Production dApp** - Complete anonymous artwork authentication platform
- 🔐 **Privacy-Preserving** - Eliminates bias by hiding artist identity, value, and provenance
- ⛓️ **Live on Sepolia** - Fully deployed and operational testnet contract
- 📦 **SDK Ready** - Package.json configured with `@anonymous-art/fhevm-sdk`
- 🎯 **Advanced FHE Patterns** - Encrypted computation, ACL management, consensus mechanisms
- 📱 **Responsive UI** - Modern, mobile-friendly interface
- 🔄 **Real-Time Updates** - Event-driven blockchain synchronization
- 📚 **Migration Guide** - [SDK_INTEGRATION.md](examples/FHEAnonymousArtAuthentication/SDK_INTEGRATION.md) for full SDK integration

**Quick Start:**
```bash
cd examples/FHEAnonymousArtAuthentication
npm install
# Compile contracts
npm run compile
# Open index.html in browser or use:
npm run serve
# Visit http://localhost:8080
```

**Live Demo:**
- **🚀 Application**: [https://terencemayer.github.io/FHEAnonymousArtAuthentication/](https://terencemayer.github.io/FHEAnonymousArtAuthentication/)
- **📜 Contract**: [0x4D874585f820437656554590C812b672305fbb72](https://sepolia.etherscan.io/address/0x4D874585f820437656554590C812b672305fbb72)

**Complete Workflow:**
1. **Artwork Owner** submits encrypted artwork metadata (age, style, condition)
2. **Experts** register and get verified by admin
3. **Experts** authenticate artworks without seeing sensitive info (artist, value)
4. **Smart Contract** computes consensus on encrypted scores
5. **Results** become available once consensus threshold is met

**What It Demonstrates:**

*SDK Integration:*
- 📦 Package configured with `@anonymous-art/fhevm-sdk` dependency
- 📚 Complete SDK integration guide provided
- ✅ Multiple encrypted data types (`euint8`, `euint32`)
- ✅ EIP-712 signature workflows for decryption
- 📖 See [SDK_INTEGRATION.md](examples/FHEAnonymousArtAuthentication/SDK_INTEGRATION.md) for migration steps

*Smart Contract Patterns:*
- ✅ Access control lists (ACL) with `FHE.allow()` and `FHE.allowThis()`
- ✅ Encrypted on-chain computation (averaging, consensus)
- ✅ Role-based permissions (owners, experts, admins)
- ✅ Event emission for transparency

*Real-World Features:*
- ✅ User authentication with MetaMask
- ✅ Form validation and error handling
- ✅ Transaction status tracking
- ✅ Network detection and switching
- ✅ Real blockchain transactions on Sepolia

**Use Cases:**
- 🎓 **Learning Reference** - Study a complete FHE application architecture
- 🏗️ **Template** - Starting point for similar authentication/voting systems
- 🔬 **Research** - Understanding privacy-preserving computation patterns

---

#### 5. FHEAnonymousArtAuthentication - React Edition (`examples/FHEAnonymousArtAuthentication-react/`)

**Perfect for:** Modern React developers building production-ready FHE applications with TypeScript.

**Features:**
- ⚛️ **React 18 + TypeScript** - Modern, type-safe component architecture
- 🔄 **Converted from Vanilla JS** - Complete React migration of the authentication platform
- ✅ **Full SDK Integration** - Uses `@anonymous-art/fhevm-sdk` with React Context API
- 🎯 **Component-Based** - Modular, reusable components (WalletConnect, ArtworkSubmission, ExpertAuthentication, AdminPanel)
- 🔐 **Same FHE Features** - All privacy-preserving features from vanilla version
- 🎨 **Improved UX** - Better state management and user feedback
- 🚀 **Vite + HMR** - Fast development with Hot Module Replacement
- 📱 **Responsive Design** - Mobile-friendly with modern CSS

**Quick Start:**
```bash
cd examples/FHEAnonymousArtAuthentication-react
npm install
npm run dev  # Visit http://localhost:5173
```

**Key Components:**
- `src/context/FHEContext.tsx` - FHE provider with wallet state management
- `src/components/WalletConnect.tsx` - Wallet connection UI component
- `src/components/ArtworkSubmission.tsx` - Submit encrypted artworks
- `src/components/ExpertAuthentication.tsx` - Expert registration & authentication
- `src/components/AdminPanel.tsx` - Admin verification functions

**React Architecture:**
```typescript
// FHE Context Provider
<FHEProvider>
  <App />
</FHEProvider>

// Using FHE hooks
const { client, isInitialized, wallet } = useFHE();
const contract = new ethers.Contract(address, abi, signer);
await contract.submitArtwork(metadata, condition, consensus);
```

**Advantages over Vanilla Version:**
- ✅ Better code organization with components
- ✅ Type safety with TypeScript
- ✅ Easier state management with React hooks
- ✅ Improved developer experience with HMR
- ✅ More maintainable and testable code
- ✅ Modern build tooling with Vite

**Use Cases:**
- 🎓 **Learning React + FHE** - See how to integrate FHE in modern React apps
- 🏗️ **Production Templates** - Starting point for enterprise React dApps
- 🔬 **Best Practices** - Study modern React architecture with blockchain
- ⚛️ **Component Library** - Reusable FHE components for your projects
- 🎨 **Art Market** - Bias-free artwork authentication in practice
- 🗳️ **Voting Systems** - Anonymous voting with verifiable results
- 🏥 **Healthcare** - Private medical record verification

**Technical Highlights:**
- Pure JavaScript (no framework) for maximum compatibility
- Ethers.js v5.7.2 for Web3 interaction
- fhevmjs for FHE encryption
- Responsive CSS Grid layout
- CDN-based dependency loading with fallbacks

---

### Choosing the Right Example

| Example | Framework | TypeScript | SDK Integration | Complexity | Best For |
|---------|-----------|------------|----------------|------------|----------|
| **vanilla-js** | None | ✗ | ✅ Full | ⭐ Simple | Prototypes, learning SDK basics |
| **react** | React + Vite | ✓ | ✅ Full | ⭐⭐ Moderate | Modern SPAs, component-based apps |
| **nextjs** | Next.js | ✓ | ✅ Full | ⭐⭐ Moderate | SEO-friendly dApps, full-stack apps |
| **FHEAnonymousArtAuthentication** | Vanilla JS | ✗ | 📚 Guide Provided | ⭐⭐⭐ Advanced | Production reference (vanilla) |
| **FHEAnonymousArtAuthentication-react** | React + Vite + TS | ✓ | ✅ Full | ⭐⭐⭐ Advanced | Production reference (React) |

**Recommendation:**
- 🚀 **Just starting?** → Use `vanilla-js` to learn SDK fundamentals
- ⚛️ **Building with React?** → Use `react` for hooks and components
- 🌐 **Need SEO/SSR?** → Use `nextjs` for server-side rendering
- 🎨 **Want complete vanilla app?** → Explore `FHEAnonymousArtAuthentication` for real-world patterns
- ⚛️ **Want complete React app?** → Explore `FHEAnonymousArtAuthentication-react` for production-ready React architecture

---

### Running All Examples

From the project root:

```bash
# Install all dependencies
npm install

# Build SDK packages (required for all examples)
npm run build

# Run specific example
cd examples/vanilla-js && npm run dev
cd examples/react && npm run dev
cd examples/nextjs && npm run dev
cd examples/FHEAnonymousArtAuthentication && npm run serve
cd examples/FHEAnonymousArtAuthentication-react && npm run dev
```

---

### Common Patterns Across Examples

All examples demonstrate these core SDK capabilities:

1. **Initialization**
   ```javascript
   const client = FhevmClient.fromWeb3Provider(provider);
   await client.initialize({ chainId: 11155111 });
   ```

2. **Encryption**
   ```javascript
   const encrypted = await client.encrypt(42, 'uint8');
   ```

3. **Decryption**
   ```javascript
   const decrypted = await client.decrypt(encrypted, 'uint8', userAddress);
   ```

4. **Contract Interaction**
   ```javascript
   const tx = await contract.submitData(encrypted);
   await tx.wait();
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

### Comprehensive Guides

The `docs/` directory contains complete documentation for the SDK:

#### Getting Started
- **[Getting Started Guide](docs/getting-started.md)**
  - Installation instructions
  - Quick start for vanilla JS, React, and Next.js
  - Configuration options
  - Core concepts (encryption, decryption, contract interaction)

#### API Reference
- **[API Reference](docs/api-reference.md)**
  - Complete API documentation for `@anonymous-art/fhevm-sdk`
  - React hooks API for `@anonymous-art/fhevm-react`
  - Type definitions and interfaces
  - Error handling reference

#### Best Practices
- **[Best Practices](docs/best-practices.md)**
  - Initialization patterns
  - Encryption optimization
  - Error handling strategies
  - React integration tips
  - Performance optimization
  - Security considerations

#### Troubleshooting
- **[Troubleshooting Guide](docs/troubleshooting.md)**
  - Common issues and solutions
  - React-specific problems
  - Next.js SSR issues
  - Build and deployment problems
  - Debugging techniques

### Package Documentation

Each package has its own README with specific usage instructions:

- **[fhevm-sdk README](packages/fhevm-sdk/README.md)** - Core SDK documentation
- **[fhevm-react README](packages/fhevm-react/README.md)** - React hooks documentation

### For Contributors

- **Architecture Overview**: SDK design principles (see this README)
- **Development Guide**: How to contribute (see [Contributing](#-contributing))
- **Testing Guide**: Writing and running tests (`npm test`)
- **Release Process**: Standard npm package release workflow

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

