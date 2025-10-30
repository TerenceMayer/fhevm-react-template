'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

interface Account {
  id: string;
  name: string;
  encryptedBalance: any;
  transactions: Transaction[];
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  encryptedAmount: any;
  timestamp: string;
}

export default function BankingExample() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountName, setAccountName] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [balances, setBalances] = useState<Record<string, number>>({});

  const createAccount = async () => {
    if (!accountName) return;

    setIsProcessing(true);
    try {
      // Encrypt initial balance of 0
      const response = await fetch('/api/fhe/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: 0, type: 'uint32' }),
      });

      const data = await response.json();
      if (data.success) {
        const newAccount: Account = {
          id: Date.now().toString(),
          name: accountName,
          encryptedBalance: data.encrypted,
          transactions: [],
        };

        setAccounts([...accounts, newAccount]);
        setAccountName('');
      }
    } catch (error) {
      console.error('Account creation error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const deposit = async () => {
    if (!selectedAccount || !amount) return;

    setIsProcessing(true);
    try {
      const account = accounts.find(a => a.id === selectedAccount);
      if (!account) return;

      // Encrypt the deposit amount
      const encryptResponse = await fetch('/api/fhe/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: parseInt(amount), type: 'uint32' }),
      });

      const encryptData = await encryptResponse.json();
      if (!encryptData.success) return;

      // Add encrypted amount to encrypted balance
      const computeResponse = await fetch('/api/fhe/compute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation: 'add',
          operands: [account.encryptedBalance, encryptData.encrypted],
        }),
      });

      const computeData = await computeResponse.json();
      if (computeData.success) {
        const transaction: Transaction = {
          id: Date.now().toString(),
          type: 'deposit',
          encryptedAmount: encryptData.encrypted,
          timestamp: new Date().toISOString(),
        };

        setAccounts(accounts.map(a =>
          a.id === selectedAccount
            ? {
                ...a,
                encryptedBalance: computeData.result,
                transactions: [...a.transactions, transaction],
              }
            : a
        ));

        setAmount('');
      }
    } catch (error) {
      console.error('Deposit error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const viewBalance = async (accountId: string) => {
    const account = accounts.find(a => a.id === accountId);
    if (!account) return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/fhe/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ encryptedData: account.encryptedBalance }),
      });

      const data = await response.json();
      if (data.success) {
        setBalances({ ...balances, [accountId]: data.decrypted });
      }
    } catch (error) {
      console.error('Balance view error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          🏦 Private Banking Example
        </h2>
        <p className="text-gray-600">
          Manage encrypted balances with full privacy
        </p>
      </div>

      <Card title="Create New Account">
        <div className="space-y-4">
          <Input
            label="Account Name"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            placeholder="Enter account name"
          />
          <Button
            onClick={createAccount}
            isLoading={isProcessing}
            disabled={!accountName}
            className="w-full"
          >
            Create Account
          </Button>
        </div>
      </Card>

      {accounts.length > 0 && (
        <>
          <Card title="Deposit Funds">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Account
                </label>
                <select
                  value={selectedAccount || ''}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose an account</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                type="number"
                label="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount to deposit"
              />

              <Button
                onClick={deposit}
                isLoading={isProcessing}
                disabled={!selectedAccount || !amount}
                variant="success"
                className="w-full"
              >
                Deposit
              </Button>
            </div>
          </Card>

          <Card title="Your Accounts">
            <div className="space-y-4">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-400 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{account.name}</h4>
                    <span className="text-sm text-gray-500">
                      {account.transactions.length} transactions
                    </span>
                  </div>

                  <div className="mb-3">
                    {balances[account.id] !== undefined ? (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Balance</p>
                        <p className="text-2xl font-bold text-green-600">
                          ${balances[account.id].toFixed(2)}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Encrypted Balance</p>
                        <p className="font-mono text-xs text-gray-500 truncate">
                          {account.encryptedBalance.data.substring(0, 40)}...
                        </p>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => viewBalance(account.id)}
                    isLoading={isProcessing}
                    variant="secondary"
                    size="sm"
                    className="w-full"
                  >
                    {balances[account.id] !== undefined ? 'Refresh Balance' : 'View Balance'}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
