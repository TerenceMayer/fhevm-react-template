import type { AppProps } from 'next/app';
import { FhevmProvider } from '@anonymous-art/fhevm-react';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <FhevmProvider
      config={{
        chainId: 11155111, // Sepolia
        gatewayUrl: 'https://gateway.sepolia.zama.ai'
      }}
    >
      <Component {...pageProps} />
    </FhevmProvider>
  );
}
