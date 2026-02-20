import { describe, it, expect } from 'vitest';
import {
  validateCharacterName,
  validateHealth,
  validateAttributeValue,
} from '../../src/utils/validation';

describe('validation', () => {
  describe('validateCharacterName', () => {
    it('returns invalid for empty string', () => {
      const result = validateCharacterName('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('i18n:validationErrors.nameRequired');
    });

    it('returns valid for non-empty string', () => {
      const result = validateCharacterName('Valid Name');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('returns valid for single character', () => {
      const result = validateCharacterName('A');
      expect(result.valid).toBe(true);
    });

    it('returns invalid for 100 character string', () => {
      const name = 'a'.repeat(100);
      const result = validateCharacterName(name);
      expect(result.valid).toBe(true);
    });
  });

  describe('validateHealth', () => {
    it('returns valid when current equals max', () => {
      const result = validateHealth(30, 30);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('returns valid when current is 0', () => {
      const result = validateHealth(0, 30);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('returns valid when current is less than max', () => {
      const result = validateHealth(15, 30);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('returns invalid when current exceeds max', () => {
      const result = validateHealth(101, 100);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('i18n:validationErrors.healthExceedsMax');
    });

    it('returns invalid when current exceeds max by large amount', () => {
      const result = validateHealth(50, 30);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('i18n:validationErrors.healthExceedsMax');
    });
  });

  describe('validateAttributeValue', () => {
    it('returns valid and unchanged for value 5', () => {
      const result = validateAttributeValue(5);
      expect(result.valid).toBe(true);
      expect(result.value).toBe(5);
      expect(result.error).toBeUndefined();
    });

    it('returns valid and unchanged for value 10', () => {
      const result = validateAttributeValue(10);
      expect(result.valid).toBe(true);
      expect(result.value).toBe(10);
    });

    it('returns valid and unchanged for value 18', () => {
      const result = validateAttributeValue(18);
      expect(result.valid).toBe(true);
      expect(result.value).toBe(18);
    });

    it('clamps value 25 to 18', () => {
      const result = validateAttributeValue(25);
      expect(result.valid).toBe(true);
      expect(result.value).toBe(18);
    });

    it('clamps value 0 to 1', () => {
      const result = validateAttributeValue(0);
      expect(result.valid).toBe(true);
      expect(result.value).toBe(1);
    });

    it('clamps negative value to 1', () => {
      const result = validateAttributeValue(-5);
      expect(result.valid).toBe(true);
      expect(result.value).toBe(1);
    });

    it('returns valid for value 1 (minimum)', () => {
      const result = validateAttributeValue(1);
      expect(result.valid).toBe(true);
      expect(result.value).toBe(1);
    });
  });
});
