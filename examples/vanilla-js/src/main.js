import { FhevmClient } from '@anonymous-art/fhevm-sdk';
import { ethers } from 'ethers';

// Global state
let client = null;
let provider = null;
let signer = null;
let isConnected = false;
let encryptedValue = '';

// DOM elements
const fhevmStatus = document.getElementById('fhevm-status');
const errorStatus = document.getElementById('error-status');
const connectBtn = document.getElementById('connect-btn');
const disconnectBtn = document.getElementById('disconnect-btn');
const walletConnected = document.getElementById('wallet-connected');
const walletAddress = document.getElementById('wallet-address');
const encryptSection = document.getElementById('encrypt-section');
const encryptForm = document.getElementById('encrypt-form');
const encryptBtn = document.getElementById('encrypt-btn');
const resultSection = document.getElementById('result-section');
const encryptedOutput = document.getElementById('encrypted-output');
const decryptBtn = document.getElementById('decrypt-btn');
const decryptedResult = document.getElementById('decrypted-result');
const decryptedOutput = document.getElementById('decrypted-output');

// Initialize FHEVM
async function initializeFhevm() {
  try {
    if (typeof window.ethereum === 'undefined') {
      showError('Please install MetaMask to use this application.');
      return;
    }

    provider = new ethers.BrowserProvider(window.ethereum);
    client = await FhevmClient.fromWeb3Provider(provider);

    await client.initialize();

    fhevmStatus.className = 'status success';
    fhevmStatus.textContent = '✅ FHEVM Client Initialized';

    console.log('FHEVM Client initialized successfully');
  } catch (error) {
    console.error('FHEVM initialization error:', error);
    showError(`Failed to initialize FHEVM: ${error.message}`);
  }
}

// Show error
function showError(message) {
  errorStatus.textContent = `❌ Error: ${message}`;
  errorStatus.style.display = 'block';
}

// Format address
function formatAddress(address) {
  return `${address.substring(0, 6)}...${address.substring(38)}`;
}

// Connect wallet
async function connectWallet() {
  try {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask to use this application.');
      return;
    }

    await provider.send('eth_requestAccounts', []);
    signer = await provider.getSigner();
    const address = await signer.getAddress();

    isConnected = true;
    walletAddress.textContent = `✅ Connected: ${formatAddress(address)}`;

    connectBtn.style.display = 'none';
    walletConnected.style.display = 'block';
    encryptSection.style.display = 'block';

    console.log('Wallet connected:', address);
  } catch (error) {
    console.error('Wallet connection error:', error);
    alert('Failed to connect wallet. Please try again.');
  }
}

// Disconnect wallet
function disconnectWallet() {
  isConnected = false;
  signer = null;

  connectBtn.style.display = 'block';
  walletConnected.style.display = 'none';
  encryptSection.style.display = 'none';
  resultSection.style.display = 'none';

  console.log('Wallet disconnected');
}

// Encrypt value
async function encryptValue(value) {
  try {
    encryptBtn.disabled = true;
    encryptBtn.textContent = '🔐 Encrypting...';

    encryptedValue = await client.encrypt(value, 'uint8');

    encryptedOutput.textContent = `${encryptedValue.substring(0, 50)}...`;
    resultSection.style.display = 'block';
    decryptedResult.style.display = 'none';

    console.log('Value encrypted:', encryptedValue);
  } catch (error) {
    console.error('Encryption error:', error);
    alert(`Encryption failed: ${error.message}`);
  } finally {
    encryptBtn.disabled = false;
    encryptBtn.textContent = '🔐 Encrypt Value';
  }
}

// Decrypt value
async function decryptValue() {
  try {
    if (!encryptedValue) {
      alert('No encrypted value to decrypt');
      return;
    }

    decryptBtn.disabled = true;
    decryptBtn.textContent = '🔓 Decrypting...';

    const address = await signer.getAddress();
    const decrypted = await client.decrypt(encryptedValue, 'uint8', address);

    decryptedOutput.textContent = decrypted;
    decryptedResult.style.display = 'block';

    console.log('Value decrypted:', decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    alert(`Decryption failed: ${error.message}`);
  } finally {
    decryptBtn.disabled = false;
    decryptBtn.textContent = '🔓 Decrypt Value';
  }
}

// Event listeners
connectBtn.addEventListener('click', connectWallet);
disconnectBtn.addEventListener('click', disconnectWallet);

encryptForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const value = parseInt(document.getElementById('value-input').value);

  if (isNaN(value)) {
    alert('Please enter a valid number');
    return;
  }

  if (value < 0 || value > 255) {
    alert('Please enter a value between 0 and 255 (uint8 range)');
    return;
  }

  await encryptValue(value);
});

decryptBtn.addEventListener('click', decryptValue);

// Initialize on load
initializeFhevm();
