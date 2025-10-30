'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useEncryption } from '@/hooks/useEncryption';

export default function EncryptionDemo() {
  const { encrypt, isEncrypting, error } = useEncryption();
  const [value, setValue] = useState('');
  const [type, setType] = useState('uint32');
  const [encrypted, setEncrypted] = useState<any>(null);

  const handleEncrypt = async () => {
    if (!value) return;

    try {
      const result = await encrypt(parseInt(value), type);
      if (result) {
        setEncrypted(result);
      }
    } catch (error) {
      console.error('Encryption error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          🔒 Encryption Demo
        </h2>
        <p className="text-gray-600">
          Encrypt values using Fully Homomorphic Encryption
        </p>
      </div>

      <Card title="Encrypt a Value">
        <div className="space-y-4">
          <Input
            type="number"
            label="Value to Encrypt"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter a number"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="uint8">uint8 (0-255)</option>
              <option value="uint16">uint16 (0-65535)</option>
              <option value="uint32">uint32</option>
              <option value="uint64">uint64</option>
            </select>
          </div>

          <Button
            onClick={handleEncrypt}
            isLoading={isEncrypting}
            disabled={!value}
            className="w-full"
          >
            Encrypt Value
          </Button>
        </div>
      </Card>

      {encrypted && (
        <Card title="Encrypted Result">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Encrypted Data:</p>
              <div className="bg-gray-100 p-3 rounded-lg break-all font-mono text-xs">
                {typeof encrypted === 'string' ? encrypted.substring(0, 100) + '...' : JSON.stringify(encrypted).substring(0, 100) + '...'}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Type:</p>
              <div className="bg-blue-100 text-blue-800 inline-block px-3 py-1 rounded-full text-sm font-semibold">
                {type}
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                ✅ Value successfully encrypted using FHEVM SDK!
              </p>
            </div>
          </div>
        </Card>
      )}

      {error && (
        <Card title="Error">
          <div className="text-center py-4">
            <p className="text-red-600">{error}</p>
          </div>
        </Card>
      )}
    </div>
  );
}
