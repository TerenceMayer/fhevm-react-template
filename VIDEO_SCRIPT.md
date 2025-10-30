# Video Demo Script (3 Minutes)

## 🎬 Scene Breakdown

### Scene 1: Introduction (0:00 - 0:20)
**Visual**: Show project title screen
**Action**:
- Open README.md in editor
- Scroll to show project logo/title

**Script**:
"Hello! Welcome to the Universal FHEVM SDK. This is a complete, production-ready SDK for building privacy-preserving dApps using Fully Homomorphic Encryption on Ethereum. Let me show you what makes this SDK special."

---

### Scene 2: Core Architecture (0:20 - 0:50)
**Visual**: Show directory structure in file explorer
**Action**:
- Expand `packages/fhevm-sdk/` folder
- Show `packages/fhevm-react/` folder
- Briefly show examples folder

**Script**:
"The SDK has a framework-agnostic core in the fhevm-sdk package - meaning it works with React, Vue, Svelte, or pure JavaScript. We also provide a React hooks library that follows the familiar wagmi-like API pattern. And we've included three complete examples: Next.js, React with Vite, and vanilla JavaScript."

---

### Scene 3: Setup & Installation (0:50 - 1:20)
**Visual**: Terminal showing commands
**Action**:
```bash
cd fhevm-react-template
npm install
npm run compile
```

**Script**:
"Getting started is simple. Just install dependencies, compile the smart contracts, and you're ready to go. The SDK handles all the complex FHE initialization automatically. Everything can be done from the root directory - install, compile, deploy, and start."

---

### Scene 4: SDK Usage - Core (1:20 - 1:50)
**Visual**: Show `packages/fhevm-sdk/src/core/FhevmClient.ts` in editor
**Action**:
- Highlight key methods: `fromWeb3Provider`, `initialize`, `encrypt`, `decrypt`
- Show simple code example

**Script**:
"Here's the core SDK. Initialization is just two lines of code. The client provides encrypt and decrypt methods with full TypeScript support. We support both user decryption with EIP-712 signatures for private data, and public decryption for data that everyone can see."

---

### Scene 5: React Integration (1:50 - 2:20)
**Visual**: Show `examples/nextjs/pages/index.tsx`
**Action**:
- Show FhevmProvider wrapper
- Highlight hooks: useFhevm, useEncryption, useDecryption
- Show component usage

**Script**:
"The React integration is incredibly clean. Wrap your app with FhevmProvider, then use composable hooks like useFhevm, useEncryption, and useDecryption. It follows the same patterns as wagmi, so web3 developers will feel right at home. The hooks handle loading states, errors, and all the complexity for you."

---

### Scene 6: Live Demo Application (2:20 - 2:50)
**Visual**: Open browser showing the demo at localhost or GitHub Pages
**Action**:
- Connect wallet
- Encrypt a value (show the process)
- Decrypt the value (show signature request)
- Show the result

**Script**:
"Let me show you the live demo. This is our Anonymous Art Authentication platform. Watch how we encrypt sensitive data client-side, send it to the blockchain, and then decrypt it with a simple signature. All of this is powered by the SDK we just showed you. The same patterns work for any privacy-preserving application."

---

### Scene 7: Closing (2:50 - 3:00)
**Visual**: Show SUBMISSION.md with checklist
**Action**:
- Scroll to show all green checkmarks
- Show GitHub and deployment links

**Script**:
"Everything you need is included: framework-agnostic SDK, React hooks, three complete examples, comprehensive documentation, and a live deployment. Check out the GitHub repository to get started building your own privacy-preserving dApps today. Thank you!"

---

## 🎯 Recording Tips

1. **Screen Resolution**: 1920x1080 for best quality
2. **Frame Rate**: 30fps or 60fps
3. **Audio**: Use a good microphone, speak clearly
4. **Pacing**: Speak at moderate speed, pause between sections
5. **Cursor**: Use a cursor highlighter tool for visibility
6. **Zoom**: Zoom in on important code sections
7. **Transitions**: Use smooth transitions between scenes

## 📝 Pre-Recording Checklist

- [ ] Close unnecessary applications
- [ ] Clear browser history/cache for clean demo
- [ ] Have MetaMask wallet ready with test ETH
- [ ] Test the demo application works perfectly
- [ ] Prepare all files to be shown in advance
- [ ] Set IDE theme to high contrast for visibility
- [ ] Test audio levels
- [ ] Have a glass of water nearby

## 🎥 Recommended Tools

- **Screen Recording**: OBS Studio (free), Camtasia, or ScreenFlow
- **Video Editing**: DaVinci Resolve (free), Adobe Premiere, or Final Cut Pro
- **Cursor Highlight**: PointerFocus or Mouse Highlight
- **Code Font**: Fira Code or JetBrains Mono (large size 16-18pt)
- **Browser**: Chrome with React DevTools

## 📤 Export Settings

- **Format**: MP4 (H.264)
- **Resolution**: 1920x1080
- **Bitrate**: 8-10 Mbps
- **Audio**: AAC 128-192 kbps
- **File Name**: demo.mp4
