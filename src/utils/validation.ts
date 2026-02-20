/**
 * Character name validation.
 * Must be non-empty (whitespace trimmed).
 *
 * @param name - Character name to validate
 * @returns {valid: boolean; error?: string} - If invalid, error is an i18n key
 */
export function validateCharacterName(
  name: string
): { valid: boolean; error?: string } {
  if (!name.trim()) {
    return { valid: false, error: 'i18n:validationErrors.nameRequired' };
  }
  return { valid: true };
}

/**
 * Health validation.
 * Current health must not exceed max health.
 *
 * @param current - Current health points
 * @param max - Maximum health points
 * @returns {valid: boolean; error?: string} - If invalid, error is an i18n key
 */
export function validateHealth(
  current: number,
  max: number
): { valid: boolean; error?: string } {
  if (current > max) {
    return { valid: false, error: 'i18n:validationErrors.healthExceedsMax' };
  }
  return { valid: true };
}

/**
 * Attribute value validation and clamping.
 * Clamps value to range [1, 18].
 *
 * @param value - Raw attribute value
 * @returns {valid: boolean; value: number; error?: string} - Clamped value; if invalid, error is an i18n key
 */
export function validateAttributeValue(
  value: number
): { valid: boolean; value: number; error?: string } {
  const clamped = Math.max(1, Math.min(18, value));
  return { valid: true, value: clamped };
}
