'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function EncryptionDemo() {
  const [value, setValue] = useState('');
  const [type, setType] = useState('uint32');
  const [encrypted, setEncrypted] = useState<any>(null);
  const [decrypted, setDecrypted] = useState<number | null>(null);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);

  const handleEncrypt = async () => {
    if (!value) return;

    setIsEncrypting(true);
    try {
      const response = await fetch('/api/fhe/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: parseInt(value), type }),
      });

      const data = await response.json();
      if (data.success) {
        setEncrypted(data.encrypted);
        setDecrypted(null);
      }
    } catch (error) {
      console.error('Encryption error:', error);
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleDecrypt = async () => {
    if (!encrypted) return;

    setIsDecrypting(true);
    try {
      const response = await fetch('/api/fhe/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ encryptedData: encrypted }),
      });

      const data = await response.json();
      if (data.success) {
        setDecrypted(data.decrypted);
      }
    } catch (error) {
      console.error('Decryption error:', error);
    } finally {
      setIsDecrypting(false);
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
                {encrypted.data}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Handle:</p>
              <div className="bg-gray-100 p-3 rounded-lg break-all font-mono text-xs">
                {encrypted.handles}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Type:</p>
              <div className="bg-blue-100 text-blue-800 inline-block px-3 py-1 rounded-full text-sm font-semibold">
                {encrypted.type}
              </div>
            </div>

            <Button
              onClick={handleDecrypt}
              isLoading={isDecrypting}
              variant="success"
              className="w-full"
            >
              Decrypt Value
            </Button>
          </div>
        </Card>
      )}

      {decrypted !== null && (
        <Card title="Decrypted Result">
          <div className="text-center py-4">
            <p className="text-4xl font-bold text-green-600 mb-2">
              {decrypted}
            </p>
            <p className="text-gray-600">Original value recovered!</p>
          </div>
        </Card>
      )}
    </div>
  );
}
