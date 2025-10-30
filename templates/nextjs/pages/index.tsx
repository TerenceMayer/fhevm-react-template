import { useState } from 'react';
import { useFhevm, useEncryption, useDecryption } from '@anonymous-art/fhevm-react';
import WalletConnect from '../components/WalletConnect';
import EncryptForm from '../components/EncryptForm';

export default function Home() {
  const { client, isInitialized, error } = useFhevm();
  const { encrypt, isEncrypting } = useEncryption();
  const { decrypt, isDecrypting } = useDecryption();
  const [encryptedValue, setEncryptedValue] = useState<string>('');
  const [decryptedValue, setDecryptedValue] = useState<number | null>(null);

  const handleEncrypt = async (value: number) => {
    try {
      const encrypted = await encrypt(value, 'uint8');
      setEncryptedValue(encrypted);
      console.log('Encrypted value:', encrypted);
    } catch (err) {
      console.error('Encryption error:', err);
    }
  };

  const handleDecrypt = async () => {
    if (!encryptedValue) return;

    try {
      const decrypted = await decrypt(encryptedValue, 'uint8');
      setDecryptedValue(decrypted as number);
      console.log('Decrypted value:', decrypted);
    } catch (err) {
      console.error('Decryption error:', err);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>🔐 FHEVM SDK Next.js Example</h1>
        <p>Demonstration of Universal FHEVM SDK with Next.js</p>
      </header>

      <main>
        <section className="status-section">
          <h2>Connection Status</h2>
          <div className={`status ${isInitialized ? 'success' : 'pending'}`}>
            {isInitialized ? '✅ FHEVM Client Initialized' : '⏳ Initializing FHEVM...'}
          </div>
          {error && <div className="status error">❌ Error: {error.message}</div>}
        </section>

        <WalletConnect />

        {isInitialized && (
          <>
            <EncryptForm
              onEncrypt={handleEncrypt}
              isLoading={isEncrypting}
            />

            {encryptedValue && (
              <section className="result-section">
                <h2>Encrypted Result</h2>
                <div className="encrypted-value">
                  <code>{encryptedValue.substring(0, 50)}...</code>
                </div>

                <button
                  onClick={handleDecrypt}
                  disabled={isDecrypting}
                  className="btn btn-primary"
                >
                  {isDecrypting ? 'Decrypting...' : '🔓 Decrypt Value'}
                </button>

                {decryptedValue !== null && (
                  <div className="decrypted-value">
                    <strong>Decrypted Value:</strong> {decryptedValue}
                  </div>
                )}
              </section>
            )}
          </>
        )}

        <section className="info-section">
          <h2>SDK Features Demonstrated</h2>
          <ul>
            <li>✅ FHEVM Client Initialization</li>
            <li>✅ React Context Provider</li>
            <li>✅ Custom Hooks (useFhevm, useEncryption, useDecryption)</li>
            <li>✅ Value Encryption (euint8)</li>
            <li>✅ User Decryption with EIP-712 Signature</li>
            <li>✅ TypeScript Support</li>
          </ul>
        </section>

        <section className="links-section">
          <h2>Resources</h2>
          <ul>
            <li><a href="https://github.com/TerenceMayer/FHEAnonymousArtAuthentication" target="_blank" rel="noopener noreferrer">GitHub Repository</a></li>
            <li><a href="https://docs.zama.ai" target="_blank" rel="noopener noreferrer">Zama Documentation</a></li>
            <li><a href="../../README.md">SDK Documentation</a></li>
          </ul>
        </section>
      </main>

      <footer>
        <p>Built with Universal FHEVM SDK | Powered by Zama</p>
      </footer>
    </div>
  );
}
