import { useState } from 'react';

interface EncryptFormProps {
  onEncrypt: (value: number) => Promise<void>;
  isLoading: boolean;
}

export default function EncryptForm({ onEncrypt, isLoading }: EncryptFormProps) {
  const [value, setValue] = useState<string>('42');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numValue = parseInt(value);

    if (isNaN(numValue)) {
      alert('Please enter a valid number');
      return;
    }

    if (numValue < 0 || numValue > 255) {
      alert('Please enter a value between 0 and 255 (uint8 range)');
      return;
    }

    await onEncrypt(numValue);
  };

  return (
    <section className="form-section">
      <h2>Encrypt a Value</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="value">
            Value to Encrypt (0-255):
          </label>
          <input
            type="number"
            id="value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            min="0"
            max="255"
            disabled={isLoading}
            className="form-input"
          />
          <small>Enter a number between 0 and 255 (euint8 type)</small>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary"
        >
          {isLoading ? '🔐 Encrypting...' : '🔐 Encrypt Value'}
        </button>
      </form>

      <div className="info-box">
        <strong>💡 What happens:</strong>
        <ul>
          <li>Your value is encrypted using FHEVM</li>
          <li>Encryption happens client-side</li>
          <li>The encrypted value can be sent to smart contracts</li>
          <li>Computations can be performed on encrypted data</li>
        </ul>
      </div>
    </section>
  );
}
