import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/fhe/encrypt
 * Encrypt data using FHE
 */
export async function POST(request: NextRequest) {
  try {
    const { value, type } = await request.json();

    if (value === undefined || value === null) {
      return NextResponse.json(
        { success: false, error: 'Value is required' },
        { status: 400 }
      );
    }

    // Validate type
    const validTypes = ['uint8', 'uint16', 'uint32', 'uint64', 'uint128', 'uint256'];
    if (type && !validTypes.includes(type)) {
      return NextResponse.json(
        { success: false, error: `Invalid type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // In a real implementation, this would use fhevmjs to encrypt
    // For this example, we'll simulate the encryption
    const encrypted = {
      data: Buffer.from(`encrypted_${value}`).toString('base64'),
      type: type || 'uint32',
      handles: generateHandle(),
    };

    return NextResponse.json({
      success: true,
      encrypted,
      originalValue: value,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Encryption error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Encryption failed',
      },
      { status: 500 }
    );
  }
}

function generateHandle(): string {
  return '0x' + Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}
