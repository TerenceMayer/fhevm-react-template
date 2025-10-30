import React from 'react';
import ReactDOM from 'react-dom/client';
import { FhevmProvider } from '@anonymous-art/fhevm-react';
import App from './App';
import './App.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FhevmProvider
      config={{
        chainId: 11155111, // Sepolia
      }}
    >
      <App />
    </FhevmProvider>
  </React.StrictMode>,
);
