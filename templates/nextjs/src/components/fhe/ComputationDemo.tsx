'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useComputation } from '@/hooks/useComputation';

export default function ComputationDemo() {
  const { compute, isComputing, error } = useComputation();
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [operation, setOperation] = useState<any>('add');
  const [result, setResult] = useState<string | null>(null);

  const handleCompute = async () => {
    if (!value1 || !value2) return;

    try {
      const computeResult = await compute(
        operation,
        parseInt(value1),
        parseInt(value2),
        'uint32'
      );
      if (computeResult) {
        setResult(computeResult);
      }
    } catch (error) {
      console.error('Computation error:', error);
    }
  };

  const operations = [
    { value: 'add', label: '➕ Addition', symbol: '+' },
    { value: 'sub', label: '➖ Subtraction', symbol: '-' },
    { value: 'mul', label: '✖️ Multiplication', symbol: '×' },
    { value: 'max', label: '⬆️ Maximum', symbol: 'max' },
    { value: 'min', label: '⬇️ Minimum', symbol: 'min' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          ⚙️ Homomorphic Computation
        </h2>
        <p className="text-gray-600">
          Perform operations on encrypted data without decrypting it
        </p>
      </div>

      <Card title="Configure Computation">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              label="First Value"
              value={value1}
              onChange={(e) => setValue1(e.target.value)}
              placeholder="e.g., 10"
            />
            <Input
              type="number"
              label="Second Value"
              value={value2}
              onChange={(e) => setValue2(e.target.value)}
              placeholder="e.g., 20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Operation
            </label>
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {operations.map((op) => (
                <option key={op.value} value={op.value}>
                  {op.label}
                </option>
              ))}
            </select>
          </div>

          {value1 && value2 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-center text-lg font-semibold text-blue-900">
                {value1} {operations.find(op => op.value === operation)?.symbol} {value2}
              </p>
            </div>
          )}

          <Button
            onClick={handleCompute}
            isLoading={isComputing}
            disabled={!value1 || !value2}
            className="w-full"
          >
            Compute on Encrypted Data
          </Button>
        </div>
      </Card>

      {result && (
        <Card title="Computation Result">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                Computation performed successfully on encrypted data!
              </p>
              <div className="bg-gray-100 p-3 rounded-lg break-all font-mono text-xs">
                {result}
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                ✅ The computation was performed entirely on encrypted values using FHEVM SDK.
                The values were encrypted before computation!
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
