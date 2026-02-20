/**
 * Calculate attribute modifier using Dungeon World SRD table.
 * NOT the D&D 5e formula.
 *
 * DW Modifier Table:
 * 1–3   → -3
 * 4–5   → -2
 * 6–8   → -1
 * 9–12  →  0
 * 13–15 → +1
 * 16–17 → +2
 * 18    → +3
 *
 * @param attributeValue - The raw attribute value (1–18)
 * @returns The modifier (range: -3 to +3)
 */
export function calculateModifier(attributeValue: number): number {
  if (attributeValue >= 1 && attributeValue <= 3) {
    return -3;
  } else if (attributeValue >= 4 && attributeValue <= 5) {
    return -2;
  } else if (attributeValue >= 6 && attributeValue <= 8) {
    return -1;
  } else if (attributeValue >= 9 && attributeValue <= 12) {
    return 0;
  } else if (attributeValue >= 13 && attributeValue <= 15) {
    return 1;
  } else if (attributeValue >= 16 && attributeValue <= 17) {
    return 2;
  } else if (attributeValue >= 18) {
    return 3;
  }

  // Fallback for unexpected values (shouldn't happen if input is 1–18)
  return 0;
}
