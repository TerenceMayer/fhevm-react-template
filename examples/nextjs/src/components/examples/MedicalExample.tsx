'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

interface MedicalRecord {
  id: string;
  patientName: string;
  encryptedHeartRate: any;
  encryptedBloodPressure: any;
  encryptedWeight: any;
  timestamp: string;
}

export default function MedicalExample() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [patientName, setPatientName] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');
  const [weight, setWeight] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [decryptedData, setDecryptedData] = useState<Record<string, any>>({});

  const submitRecord = async () => {
    if (!patientName || !heartRate || !bloodPressure || !weight) return;

    setIsProcessing(true);
    try {
      // Encrypt all medical data
      const [hrResponse, bpResponse, weightResponse] = await Promise.all([
        fetch('/api/fhe/encrypt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: parseInt(heartRate), type: 'uint8' }),
        }),
        fetch('/api/fhe/encrypt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: parseInt(bloodPressure), type: 'uint8' }),
        }),
        fetch('/api/fhe/encrypt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: parseInt(weight), type: 'uint16' }),
        }),
      ]);

      const [hrData, bpData, weightData] = await Promise.all([
        hrResponse.json(),
        bpResponse.json(),
        weightResponse.json(),
      ]);

      if (hrData.success && bpData.success && weightData.success) {
        const newRecord: MedicalRecord = {
          id: Date.now().toString(),
          patientName,
          encryptedHeartRate: hrData.encrypted,
          encryptedBloodPressure: bpData.encrypted,
          encryptedWeight: weightData.encrypted,
          timestamp: new Date().toISOString(),
        };

        setRecords([...records, newRecord]);

        // Clear form
        setPatientName('');
        setHeartRate('');
        setBloodPressure('');
        setWeight('');
      }
    } catch (error) {
      console.error('Record submission error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const viewRecord = async (recordId: string) => {
    const record = records.find(r => r.id === recordId);
    if (!record) return;

    setIsProcessing(true);
    try {
      const [hrResponse, bpResponse, weightResponse] = await Promise.all([
        fetch('/api/fhe/decrypt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ encryptedData: record.encryptedHeartRate }),
        }),
        fetch('/api/fhe/decrypt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ encryptedData: record.encryptedBloodPressure }),
        }),
        fetch('/api/fhe/decrypt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ encryptedData: record.encryptedWeight }),
        }),
      ]);

      const [hrData, bpData, weightData] = await Promise.all([
        hrResponse.json(),
        bpResponse.json(),
        weightResponse.json(),
      ]);

      if (hrData.success && bpData.success && weightData.success) {
        setDecryptedData({
          ...decryptedData,
          [recordId]: {
            heartRate: hrData.decrypted,
            bloodPressure: bpData.decrypted,
            weight: weightData.decrypted,
          },
        });
      }
    } catch (error) {
      console.error('Record view error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          🏥 Medical Records Example
        </h2>
        <p className="text-gray-600">
          Store sensitive health data with complete privacy
        </p>
      </div>

      <Card title="Submit Medical Record">
        <div className="space-y-4">
          <Input
            label="Patient Name"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Enter patient name"
          />

          <div className="grid grid-cols-3 gap-4">
            <Input
              type="number"
              label="Heart Rate (BPM)"
              value={heartRate}
              onChange={(e) => setHeartRate(e.target.value)}
              placeholder="e.g., 72"
              helperText="60-100 normal"
            />

            <Input
              type="number"
              label="Blood Pressure"
              value={bloodPressure}
              onChange={(e) => setBloodPressure(e.target.value)}
              placeholder="e.g., 120"
              helperText="Systolic"
            />

            <Input
              type="number"
              label="Weight (kg)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g., 70"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              🔒 All medical data will be encrypted before storage.
              Only authorized personnel can decrypt and view this information.
            </p>
          </div>

          <Button
            onClick={submitRecord}
            isLoading={isProcessing}
            disabled={!patientName || !heartRate || !bloodPressure || !weight}
            className="w-full"
          >
            Submit Encrypted Record
          </Button>
        </div>
      </Card>

      {records.length > 0 && (
        <Card title="Medical Records">
          <div className="space-y-4">
            {records.map((record) => (
              <div
                key={record.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {record.patientName}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {new Date(record.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    onClick={() => viewRecord(record.id)}
                    isLoading={isProcessing}
                    variant="secondary"
                    size="sm"
                  >
                    {decryptedData[record.id] ? 'Refresh' : 'View Data'}
                  </Button>
                </div>

                {decryptedData[record.id] ? (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Heart Rate</p>
                      <p className="text-xl font-bold text-green-600">
                        {decryptedData[record.id].heartRate} BPM
                      </p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Blood Pressure</p>
                      <p className="text-xl font-bold text-blue-600">
                        {decryptedData[record.id].bloodPressure} mmHg
                      </p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Weight</p>
                      <p className="text-xl font-bold text-purple-600">
                        {decryptedData[record.id].weight} kg
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-sm text-gray-600 text-center">
                      🔒 Encrypted data - Authorization required to view
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
