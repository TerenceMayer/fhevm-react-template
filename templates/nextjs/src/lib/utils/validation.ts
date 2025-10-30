/**
 * Validation utilities
 */

import { FHEType } from '@/types/fhe';

/**
 * Validate FHE type
 */
export function validateFHEType(type: string): boolean {
  const validTypes: FHEType[] = ['uint8', 'uint16', 'uint32', 'uint64', 'uint128', 'uint256'];
  return validTypes.includes(type as FHEType);
}

/**
 * Validate value for specific FHE type
 */
export function validateValueForType(value: number, type: FHEType): {
  valid: boolean;
  error?: string;
} {
  const boundaries = {
    uint8: { min: 0, max: 255 },
    uint16: { min: 0, max: 65535 },
    uint32: { min: 0, max: 4294967295 },
    uint64: { min: 0, max: Number.MAX_SAFE_INTEGER },
    uint128: { min: 0, max: Number.MAX_SAFE_INTEGER },
    uint256: { min: 0, max: Number.MAX_SAFE_INTEGER },
  };

  const { min, max } = boundaries[type];

  if (value < min) {
    return {
      valid: false,
      error: `Value must be at least ${min} for type ${type}`,
    };
  }

  if (value > max) {
    return {
      valid: false,
      error: `Value must not exceed ${max} for type ${type}`,
    };
  }

  return { valid: true };
}

/**
 * Validate operation
 */
export function validateOperation(operation: string): boolean {
  const validOperations = ['add', 'sub', 'mul', 'div', 'max', 'min'];
  return validOperations.includes(operation);
}

/**
 * Validate encrypted value structure
 */
export function validateEncryptedValue(value: any): {
  valid: boolean;
  error?: string;
} {
  if (!value || typeof value !== 'object') {
    return { valid: false, error: 'Encrypted value must be an object' };
  }

  if (!value.data || typeof value.data !== 'string') {
    return { valid: false, error: 'Encrypted value must have data field' };
  }

  if (!value.type || !validateFHEType(value.type)) {
    return { valid: false, error: 'Invalid or missing type field' };
  }

  if (!value.handles || typeof value.handles !== 'string') {
    return { valid: false, error: 'Invalid or missing handles field' };
  }

  return { valid: true };
}

/**
 * Validate operands array
 */
export function validateOperands(operands: any[]): {
  valid: boolean;
  error?: string;
} {
  if (!Array.isArray(operands)) {
    return { valid: false, error: 'Operands must be an array' };
  }

  if (operands.length < 2) {
    return { valid: false, error: 'At least 2 operands are required' };
  }

  for (let i = 0; i < operands.length; i++) {
    const validation = validateEncryptedValue(operands[i]);
    if (!validation.valid) {
      return {
        valid: false,
        error: `Invalid operand at index ${i}: ${validation.error}`,
      };
    }
  }

  return { valid: true };
}

/**
 * Sanitize and validate string input
 */
export function validateStringInput(
  input: string,
  minLength: number = 1,
  maxLength: number = 1000
): {
  valid: boolean;
  error?: string;
} {
  if (typeof input !== 'string') {
    return { valid: false, error: 'Input must be a string' };
  }

  const trimmed = input.trim();

  if (trimmed.length < minLength) {
    return {
      valid: false,
      error: `Input must be at least ${minLength} characters`,
    };
  }

  if (trimmed.length > maxLength) {
    return {
      valid: false,
      error: `Input must not exceed ${maxLength} characters`,
    };
  }

  return { valid: true };
}
