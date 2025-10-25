'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useFHEContext } from './FHEProvider';

export default function KeyManager() {
  const { publicKey, initialize } = useFHEContext();
  const [isRotating, setIsRotating] = useState(false);
  const [lastRotated, setLastRotated] = useState<string | null>(null);

  const handleRotateKeys = async () => {
    setIsRotating(true);
    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'rotate' }),
      });

      const data = await response.json();
      if (data.success) {
        setLastRotated(data.keys.rotatedAt);
        // Reinitialize to get new keys
        await initialize();
      }
    } catch (error) {
      console.error('Key rotation error:', error);
    } finally {
      setIsRotating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card title="Current Public Key">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Public Key:</p>
            <div className="bg-gray-100 p-3 rounded-lg break-all font-mono text-xs">
              {publicKey || 'Not available'}
            </div>
          </div>

          {lastRotated && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800">
                ✅ Keys last rotated: {new Date(lastRotated).toLocaleString()}
              </p>
            </div>
          )}

          <Button
            onClick={handleRotateKeys}
            isLoading={isRotating}
            variant="secondary"
            className="w-full"
          >
            🔄 Rotate Keys
          </Button>
        </div>
      </Card>

      <Card title="Key Information">
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start">
            <span className="text-2xl mr-3">🔑</span>
            <div>
              <p className="font-semibold text-gray-900">Public Key</p>
              <p>Used to encrypt data before sending to the network</p>
            </div>
          </div>
          <div className="flex items-start">
            <span className="text-2xl mr-3">🔒</span>
            <div>
              <p className="font-semibold text-gray-900">Private Key</p>
              <p>Kept secure on the network, never exposed to clients</p>
            </div>
          </div>
          <div className="flex items-start">
            <span className="text-2xl mr-3">🔄</span>
            <div>
              <p className="font-semibold text-gray-900">Key Rotation</p>
              <p>Regularly rotate keys for enhanced security</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
