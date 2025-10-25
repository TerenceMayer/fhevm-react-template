# FHE Anonymous Art Authentication Platform

**A production-ready demonstration of privacy-preserving artwork authentication using Fully Homomorphic Encryption (FHE)**

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://terencemayer.github.io/FHEAnonymousArtAuthentication/)
[![Contract](https://img.shields.io/badge/Contract-Sepolia-blue)](https://sepolia.etherscan.io/address/0x4D874585f820437656554590C812b672305fbb72)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🎯 Project Overview

This application demonstrates how **Fully Homomorphic Encryption (FHE)** can eliminate bias in artwork authentication by enabling experts to evaluate artworks without knowing sensitive information like:

- Artist name or reputation
- Artwork title or provenance
- Estimated value or market price
- Owner identity

All evaluations are performed on **encrypted data**, ensuring completely anonymous and unbiased authentication.

---

## 🌟 Key Features

### Privacy-Preserving Authentication
- **Encrypted Submissions**: Artwork metadata encrypted before submission
- **Anonymous Evaluation**: Experts assess artworks without seeing plaintext data
- **Confidential Scoring**: Authentication scores remain encrypted on-chain
- **Selective Disclosure**: Only authorized parties can decrypt specific data

### Advanced FHE Patterns
- **Multiple Encrypted Types**: `euint8`, `euint32` for different data ranges
- **On-chain Computation**: Encrypted calculations (averaging, consensus)
- **Access Control Lists (ACL)**: Fine-grained permission management
- **EIP-712 Signatures**: User-friendly signature requests for decryption

### Real-World Integration
- **Live on Sepolia**: Fully deployed and operational testnet contract
- **MetaMask Compatible**: Standard Web3 wallet integration
- **Event-Driven Updates**: Real-time blockchain event monitoring
- **Responsive UI**: Works on desktop and mobile devices

---

## 🚀 Live Demo

**🔗 Try it now**: [https://terencemayer.github.io/FHEAnonymousArtAuthentication/](https://terencemayer.github.io/FHEAnonymousArtAuthentication/)

**📜 Smart Contract**: [0x4D874585f820437656554590C812b672305fbb72](https://sepolia.etherscan.io/address/0x4D874585f820437656554590C812b672305fbb72)

**🌐 Network**: Ethereum Sepolia Testnet (Chain ID: 11155111)

---

## 📦 Technology Stack

### Frontend
- **Pure JavaScript**: No framework overhead, works directly in browser
- **HTML5/CSS3**: Modern, responsive design
- **Ethers.js v5.7.2**: Ethereum interaction library
- **FHEVM SDK**: `@anonymous-art/fhevm-sdk` for FHE operations

### Smart Contracts
- **Solidity 0.8.24**: Latest stable version
- **fhEVM v0.8.0**: Zama's FHE library for Solidity
- **Hardhat**: Development and deployment framework
- **OpenZeppelin**: Security-audited contract patterns

### Blockchain
- **Network**: Ethereum Sepolia Testnet
- **FHE Provider**: Zama fhEVM
- **Gateway**: Decryption gateway integration (ready)

---

## 🏗️ Architecture

### Data Flow

```
┌─────────────────┐
│  User Submits   │
│    Artwork      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────────┐
│  Encrypt Data   │─────▶│  Submit to       │
│  (Client-side)  │      │  Smart Contract  │
└─────────────────┘      └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │  Encrypted Data  │
                         │  Stored On-Chain │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ Experts Evaluate │
                         │  (Anonymously)   │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │  FHE Computation │
                         │  (Consensus)     │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │   Decryption     │
                         │ (Authorized Only)│
                         └──────────────────┘
```

### Smart Contract Components

**Key Functions:**
- `submitArtwork()` - Submit encrypted artwork data
- `registerExpert()` - Register as authentication expert
- `submitAuthentication()` - Submit expert evaluation
- `verifyExpert()` - Admin verification of experts
- `getArtworkInfo()` - Query artwork status
- `getExpertInfo()` - Query expert credentials

**Encrypted Data Types:**
- `euint32` - Metadata hash, age, style codes
- `euint8` - Condition scores (0-100)
- `euint8` - Authenticity scores (0-100)
- `euint8` - Confidence levels (0-100)

---

## 🚦 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **MetaMask** browser extension
- **Sepolia ETH** for testnet transactions ([Get from faucet](https://sepoliafaucet.com/))

### Installation

```bash
# Clone the repository
git clone https://github.com/TerenceMayer/fhevm-react-template.git
cd fhevm-react-template/examples/FHEAnonymousArtAuthentication

# Install dependencies
npm install

# Compile smart contracts
npm run compile
```

### Running Locally

#### Option 1: Direct Browser Access (No Build Required)

```bash
# Simply open index.html in your browser
# Or serve with any HTTP server:
npm run serve

# Visit http://localhost:8080
```

#### Option 2: Development Server

```bash
# Using Python
python -m http.server 8080

# Using Node.js http-server
npx http-server . -p 8080 --cors
```

### Deployment

```bash
# Deploy to Sepolia testnet
npm run deploy

# Deploy to local Hardhat network
npm run deploy:local
```

---

## 📖 Usage Guide

### 1. Connect Wallet

1. Click "Connect Wallet" button
2. Approve MetaMask connection
3. Ensure you're on **Sepolia testnet**
4. Get test ETH from [Sepolia Faucet](https://sepoliafaucet.com/)

### 2. Submit Artwork

**As an Artwork Owner:**

1. Fill in artwork details:
   - Title (stored off-chain for reference)
   - Estimated age in years
   - Art style (Renaissance, Baroque, etc.)
   - Materials used
   - Condition score (0-100)
   - Required expert consensus (51-100%)

2. Click "Submit for Authentication"
3. Confirm MetaMask transaction
4. Receive Artwork ID for tracking

**What Happens:**
- Metadata is hashed and encrypted client-side
- Encrypted data submitted to smart contract
- Original sensitive information never stored on-chain
- You receive a unique Artwork ID

### 3. Register as Expert

**To Become an Authentication Expert:**

1. Fill in expert credentials:
   - Full name
   - Area of expertise
   - Years of experience
   - Professional credentials

2. Click "Register as Expert"
3. Confirm transaction
4. Receive Expert ID
5. **Wait for admin verification**

**Note:** Only verified experts can submit authentications.

### 4. Submit Authentication

**As a Verified Expert:**

1. Enter Artwork ID to authenticate
2. Enter your verified Expert ID
3. Provide assessment:
   - **Authenticity Score** (0-100)
     - 0 = Definitely fake
     - 50 = Uncertain
     - 100 = Definitely authentic
   - **Confidence Level** (0-100)
     - How confident are you in this assessment?
   - Optional private analysis notes

4. Click "Submit Authentication"
5. Confirm transaction

**Privacy Guarantee:**
- You never see the artist name or artwork title
- You don't know the estimated value
- Your evaluation is based purely on the artwork itself
- Your assessment is encrypted on-chain

### 5. View Results

**Refresh Gallery to See:**
- All submitted artworks
- Authentication status (Pending/Authenticated)
- Number of expert evaluations
- Required consensus percentage
- Submission timestamps

**Load Your Artworks:**
- View only artworks you submitted
- Track authentication progress
- See number of expert reviews

---

## 🔐 Security Features

### Encryption
- **Client-Side Encryption**: All sensitive data encrypted before leaving browser
- **fhevmjs Library**: Industry-standard FHE implementation
- **Key Management**: Secure public key fetching from blockchain

### Access Control
- **ACL System**: `FHE.allow()` and `FHE.allowThis()` manage permissions
- **Role-Based Access**: Owners, experts, and admins have different privileges
- **Signature Verification**: EIP-712 signatures for decryption requests

### Smart Contract Security
- **Reentrancy Protection**: Safe against reentrancy attacks
- **Owner-Only Functions**: Critical functions restricted to contract owner
- **Input Validation**: All inputs validated before processing
- **Event Logging**: Comprehensive event emission for transparency

---

## 🎨 Advanced Features

### Encrypted Consensus Mechanism

The smart contract computes consensus **on encrypted data**:

```solidity
// Pseudocode - actual implementation uses FHE operations
euint8 totalScore = 0;
uint8 expertCount = 0;

for each authentication:
    totalScore = FHE.add(totalScore, encryptedAuthenticityScore);
    expertCount++;

euint8 averageScore = FHE.div(totalScore, expertCount);
bool isAuthentic = FHE.gte(averageScore, THRESHOLD);
```

### Decryption Flows

**User Decryption (EIP-712)**
```javascript
// Request decryption with user signature
const signature = await signer._signTypedData(domain, types, message);
const decrypted = await decrypt(encryptedValue, signature);
```

**Admin Decryption**
```javascript
// Contract owner can decrypt consensus results
const result = await contract.decryptConsensus(artworkId);
```

### Gateway Integration

The application is **gateway-ready** for automated decryption:

```javascript
// Future: Automated threshold decryption
const result = await gateway.requestDecryption(
  contractAddress,
  encryptedHandle,
  conditions
);
```

---

## 📊 Contract Interface

### Events

```solidity
event ArtworkSubmitted(uint256 indexed artworkId, address indexed owner);
event ExpertRegistered(uint256 indexed expertId, address indexed expert);
event AuthenticationSubmitted(uint256 indexed artworkId, uint256 indexed expertId);
event ExpertVerified(uint256 indexed expertId, address indexed expert);
```

### View Functions

```solidity
// Get artwork information
function getArtworkInfo(uint256 artworkId) external view returns (
    address artworkOwner,
    bool isSubmitted,
    bool isAuthenticated,
    uint256 submissionTime,
    uint256 authenticationCount,
    uint256 expertConsensus
);

// Get expert information
function getExpertInfo(uint256 expertId) external view returns (
    address expertAddress,
    bool isVerified,
    uint256 authenticationsCompleted,
    uint256 successRate
);

// Get next IDs
function nextArtworkId() external view returns (uint256);
function nextExpertId() external view returns (uint256);
```

---

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
npm test

# Run specific test file
npx hardhat test test/AnonymousArtAuthentication.test.js

# Run with gas reporting
REPORT_GAS=true npm test
```

### Integration Testing

```bash
# Start local Hardhat node
npm run node

# In another terminal, deploy contracts
npm run deploy:local

# Run integration tests
npm run test:integration
```

### Manual Testing Workflow

1. **Deploy Contract**
   ```bash
   npm run deploy
   ```

2. **Register Multiple Experts**
   - Use different MetaMask accounts
   - Register at least 3 experts
   - Admin verifies all experts

3. **Submit Test Artwork**
   - Use realistic artwork data
   - Set consensus to 75%

4. **Submit Authentications**
   - Have each expert authenticate
   - Use varied authenticity scores
   - Add confidence levels

5. **Verify Results**
   - Check artwork status changes to "Authenticated"
   - Verify consensus calculation
   - Test decryption flows

---

## 🛠️ Development

### Project Structure

```
FHEAnonymousArtAuthentication/
├── contracts/                      # Solidity smart contracts
│   └── AnonymousArtAuthentication.sol
├── scripts/                        # Deployment scripts
│   └── deploy.js
├── test/                          # Contract tests
│   └── AnonymousArtAuthentication.test.js
├── artifacts/                     # Compiled contracts (generated)
├── cache/                         # Hardhat cache (generated)
├── index.html                     # Main application
├── package.json                   # Dependencies
├── hardhat.config.js              # Hardhat configuration
└── README.md                      # This file
```

### Configuration

**hardhat.config.js**
```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111
    }
  }
};
```

**Environment Variables (.env)**
```
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_key
```

### Adding New Features

**Example: Add New Encrypted Field**

1. **Update Contract**
```solidity
struct Artwork {
    euint32 metadataHash;
    euint8 condition;
    euint8 newField;  // Add new encrypted field
    // ...
}
```

2. **Update Frontend**
```javascript
// Encrypt new field
const encryptedNewField = await client.encrypt(newValue, 'uint8');

// Submit to contract
const tx = await contract.submitArtwork(
    metadataHash,
    condition,
    encryptedNewField  // Include in transaction
);
```

3. **Recompile and Deploy**
```bash
npm run compile
npm run deploy
```

---

## 🌐 Deployment Guide

### Deploying to Sepolia

1. **Get Sepolia ETH**
   - Visit [Sepolia Faucet](https://sepoliafaucet.com/)
   - Request test ETH for deployment

2. **Configure Environment**
```bash
# Create .env file
cp .env.example .env

# Add your credentials
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
PRIVATE_KEY=your_deployer_private_key
```

3. **Deploy Contract**
```bash
npm run deploy
```

4. **Verify on Etherscan**
```bash
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

5. **Update Frontend**
```javascript
// In index.html, update CONTRACT_ADDRESS
const CONTRACT_ADDRESS = 'YOUR_NEW_CONTRACT_ADDRESS';
```

### Deploying Frontend to GitHub Pages

```bash
# Build (if needed)
# No build step required for this vanilla JS app

# Push to gh-pages branch
git checkout -b gh-pages
git add index.html
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages

# Enable GitHub Pages in repository settings
# Select gh-pages branch as source
```

---

## 🐛 Troubleshooting

### Common Issues

**MetaMask Not Detected**
```
Solution: Install MetaMask browser extension
https://metamask.io/download/
```

**Wrong Network**
```
Solution: Switch to Sepolia testnet in MetaMask
Network Name: Sepolia
RPC URL: https://sepolia.infura.io/v3/
Chain ID: 11155111
```

**Insufficient Funds**
```
Solution: Get Sepolia ETH from faucet
https://sepoliafaucet.com/
```

**Transaction Failed: "Expert not verified"**
```
Solution: Wait for admin to verify your expert registration
Only verified experts can submit authentications
```

**Cannot Load Ethers.js**
```
Solution: Check internet connection
The app loads ethers.js from CDN
Ensure no browser extensions are blocking scripts
```

### Debug Mode

Enable console logging:
```javascript
// In browser console
localStorage.setItem('debug', 'true');
```

View detailed logs for:
- Contract interactions
- Encryption operations
- Transaction status
- Error messages

---

## 📚 Resources

### Documentation
- [fhEVM Documentation](https://docs.zama.ai/fhevm)
- [Zama](https://www.zama.ai/)
- [Ethers.js Docs](https://docs.ethers.org)
- [Hardhat Docs](https://hardhat.org/docs)

### Related Projects
- [Main FHEVM SDK](../../README.md)
- [Vanilla JS Example](../vanilla-js/README.md)
- [React Example](../react/README.md)
- [Next.js Example](../nextjs/README.md)

### Community
- [GitHub Issues](https://github.com/TerenceMayer/fhevm-react-template/issues)
- [Zama Discord](https://discord.gg/zama)

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the Repository**
2. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make Changes**
   - Add tests for new features
   - Update documentation
   - Follow existing code style
4. **Test Thoroughly**
   ```bash
   npm test
   npm run compile
   ```
5. **Commit Changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
6. **Push and Create PR**
   ```bash
   git push origin feature/amazing-feature
   ```

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 Anonymous Art Authentication Team

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

- **[Zama](https://www.zama.ai/)** - For pioneering FHE technology and fhEVM
- **[Ethereum Foundation](https://ethereum.org/)** - For the blockchain platform
- **Community Contributors** - For feedback and improvements

---

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/TerenceMayer/fhevm-react-template/issues)
- **Live Demo**: [Try the application](https://terencemayer.github.io/FHEAnonymousArtAuthentication/)
- **Contract**: [View on Etherscan](https://sepolia.etherscan.io/address/0x4D874585f820437656554590C812b672305fbb72)

---

**Built with ❤️ for the privacy-preserving Web3 community**

*Demonstrating the power of Fully Homomorphic Encryption in real-world applications*
