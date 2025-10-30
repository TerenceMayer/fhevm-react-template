'use client';

import { useState } from 'react';
import { FHEProvider } from '@/components/fhe/FHEProvider';
import EncryptionDemo from '@/components/fhe/EncryptionDemo';
import ComputationDemo from '@/components/fhe/ComputationDemo';
import BankingExample from '@/components/examples/BankingExample';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'encryption' | 'computation' | 'banking'>('encryption');

  return (
    <FHEProvider>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🔐 FHEVM Next.js Example
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Fully Homomorphic Encryption with Next.js App Router
          </p>
          <p className="text-gray-500 mt-2">
            Perform computations on encrypted data without decrypting it
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8 space-x-4">
          <button
            onClick={() => setActiveTab('encryption')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'encryption'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            🔒 Encryption Demo
          </button>
          <button
            onClick={() => setActiveTab('computation')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'computation'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            ⚙️ Computation Demo
          </button>
          <button
            onClick={() => setActiveTab('banking')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'banking'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            🏦 Banking Example
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {activeTab === 'encryption' && <EncryptionDemo />}
          {activeTab === 'computation' && <ComputationDemo />}
          {activeTab === 'banking' && <BankingExample />}
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-500">
          <p>
            Built with{' '}
            <a
              href="https://docs.zama.ai/fhevm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Zama fhEVM
            </a>
            {' '}and{' '}
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Next.js
            </a>
          </p>
        </footer>
      </div>
    </FHEProvider>
  );
}
