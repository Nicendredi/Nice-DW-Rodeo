import { describe, it, expect } from 'vitest';
import { calculateModifier } from '../../src/utils/calculateModifier';

describe('calculateModifier', () => {
  it('returns -3 for attribute value 3', () => {
    expect(calculateModifier(3)).toBe(-3);
  });

  it('returns -3 for attribute value 1', () => {
    expect(calculateModifier(1)).toBe(-3);
  });

  it('returns -2 for attribute value 4', () => {
    expect(calculateModifier(4)).toBe(-2);
  });

  it('returns -2 for attribute value 5', () => {
    expect(calculateModifier(5)).toBe(-2);
  });

  it('returns -1 for attribute value 6', () => {
    expect(calculateModifier(6)).toBe(-1);
  });

  it('returns -1 for attribute value 8', () => {
    expect(calculateModifier(8)).toBe(-1);
  });

  it('returns 0 for attribute value 9', () => {
    expect(calculateModifier(9)).toBe(0);
  });

  it('returns 0 for attribute value 10', () => {
    expect(calculateModifier(10)).toBe(0);
  });

  it('returns 0 for attribute value 12', () => {
    expect(calculateModifier(12)).toBe(0);
  });

  it('returns +1 for attribute value 13', () => {
    expect(calculateModifier(13)).toBe(1);
  });

  it('returns +1 for attribute value 15', () => {
    expect(calculateModifier(15)).toBe(1);
  });

  it('returns +2 for attribute value 16', () => {
    expect(calculateModifier(16)).toBe(2);
  });

  it('returns +2 for attribute value 17', () => {
    expect(calculateModifier(17)).toBe(2);
  });

  it('returns +3 for attribute value 18', () => {
    expect(calculateModifier(18)).toBe(3);
  });
});
