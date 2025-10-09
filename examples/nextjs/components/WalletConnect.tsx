import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function WalletConnect() {
  const [account, setAccount] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0].address);
          setIsConnected(true);
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        setIsConnected(true);
      } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Failed to connect wallet. Please try again.');
      }
    } else {
      alert('Please install MetaMask to use this application.');
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    setIsConnected(false);
  };

  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(38)}`;
  };

  return (
    <section className="wallet-section">
      <h2>Wallet Connection</h2>
      {isConnected ? (
        <div className="wallet-connected">
          <div className="status success">
            ✅ Connected: <code>{formatAddress(account)}</code>
          </div>
          <button onClick={disconnectWallet} className="btn btn-secondary">
            Disconnect
          </button>
        </div>
      ) : (
        <button onClick={connectWallet} className="btn btn-primary">
          🦊 Connect MetaMask
        </button>
      )}
    </section>
  );
}
