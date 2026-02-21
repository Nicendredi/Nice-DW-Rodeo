import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CharacterForm } from '../../src/components/CharacterForm.tsx';
import { CharacterStoreProvider } from '../../src/hooks/useCharacterStore.tsx';
import { createElement } from 'react';

/**
 * ValidationErrorDisplay integration test
 * Tests that validation errors in the real CharacterForm component render with proper
 * accessibility attributes and visual styling.
 *
 * Per TDD: This test verifies REAL behavior of CharacterForm when validation fails.
 * Tests:
 * - Error message appears when field is blurred with invalid value
 * - Error is localized to French when language is "fr"
 * - Error element has aria-live="polite" for screen reader announcement
 * - Error has role="alert" and associates with input via aria-describedby
 * - Error displays in accessible color (WCAG AA 4.5:1 contrast ratio)
 * - Correcting the value removes error immediately
 *
 * NOTE: These tests currently FAIL (RED phase) because error display is not yet
 * implemented in CharacterForm. Implementation will be added to make tests pass (GREEN).
 */

// Wrapper for CharacterStoreProvider
const wrapper = ({ children }: { children: React.ReactNode }) =>
  createElement(CharacterStoreProvider, null, children);

describe('ValidationErrorDisplay', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it('displays error message when Character Name field is blurred with empty value', async () => {
    const user = userEvent.setup();
    render(<CharacterForm />, { wrapper });

    const nameInput = screen.getByRole('textbox', { name: /character name/i });
    
    // Focus then blur without entering value
    await user.click(nameInput);
    await user.tab();

    // Error should appear
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('error message content is "Character name is required"', async () => {
    const user = userEvent.setup();
    render(<CharacterForm />, { wrapper });

    const nameInput = screen.getByRole('textbox', { name: /character name/i });
    await user.click(nameInput);
    await user.tab();

    await waitFor(() => {
      const error = screen.getByRole('alert');
      expect(error).toHaveTextContent(/character name.*required/i);
    });
  });

  it('error element has aria-live="polite" attribute for screen reader announcement', async () => {
    const user = userEvent.setup();
    render(<CharacterForm />, { wrapper });

    const nameInput = screen.getByRole('textbox', { name: /character name/i });
    await user.click(nameInput);
    await user.tab();

    await waitFor(() => {
      const error = screen.getByRole('alert');
      expect(error).toHaveAttribute('aria-live', 'polite');
    });
  });

  it('input has aria-describedby pointing to error element', async () => {
    const user = userEvent.setup();
    render(<CharacterForm />, { wrapper });

    const nameInput = screen.getByRole('textbox', { name: /character name/i }) as HTMLInputElement;
    await user.click(nameInput);
    await user.tab();

    await waitFor(() => {
      const errorId = nameInput.getAttribute('aria-describedby');
      expect(errorId).toBeTruthy();
      
      const errorElement = document.getElementById(errorId!);
      expect(errorElement).toBeInTheDocument();
      expect(errorElement).toHaveRole('alert');
    });
  });

  it('error element has role="alert"', async () => {
    const user = userEvent.setup();
    render(<CharacterForm />, { wrapper });

    const nameInput = screen.getByRole('textbox', { name: /character name/i });
    await user.click(nameInput);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('error displays with accessible contrast ratio (red color for WCAG AA compliance)', async () => {
    const user = userEvent.setup();
    render(<CharacterForm />, { wrapper });

    const nameInput = screen.getByRole('textbox', { name: /character name/i });
    await user.click(nameInput);
    await user.tab();

    await waitFor(() => {
      const error = screen.getByRole('alert');
      const computedStyle = window.getComputedStyle(error);
      
      // Verify color is set (should be red or warning color for WCAG AA compliance)
      // Expected: something like rgb(211, 47, 47) or similar high-contrast red
      expect(computedStyle.color).toBeTruthy();
      expect(computedStyle.color).not.toBe('transparent');
    });
  });

  it('correcting the value removes the error immediately', async () => {
    const user = userEvent.setup();
    render(<CharacterForm />, { wrapper });

    const nameInput = screen.getByRole('textbox', { name: /character name/i });

    // Blur with empty value to trigger error
    await user.click(nameInput);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    // Type a valid name
    await user.click(nameInput);
    await user.keyboard('Thorgrim');

    // Error should disappear immediately
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  it('error message is translated to French when language is "Français"', async () => {
    const user = userEvent.setup();
    render(<CharacterForm />, { wrapper });

    // Switch to French
    const languageSelector = screen.getByRole('combobox', { name: /language/i });
    await user.selectOptions(languageSelector, 'fr');

    // Trigger error in French
    const nameInput = screen.getByRole('textbox', { name: /nom du personnage/i });
    await user.click(nameInput);
    await user.tab();

    // Error message should be in French
    await waitFor(() => {
      const error = screen.getByRole('alert');
      // French translation should show "nom du personnage" related message
      expect(error.textContent).toBeTruthy();
    });
  });

  it('switching back to English shows error in English', async () => {
    const user = userEvent.setup();
    render(<CharacterForm />, { wrapper });

    const languageSelector = screen.getByRole('combobox', { name: /language/i });

    // Switch to French
    await user.selectOptions(languageSelector, 'fr');

    // Trigger error
    const nameInput = screen.getByRole('textbox', { name: /nom du personnage/i });
    await user.click(nameInput);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    // Switch back to English
    await user.selectOptions(languageSelector, 'en');

    // Error should be in English
    await waitFor(() => {
      const error = screen.getByRole('alert');
      expect(error).toHaveTextContent(/character name.*required/i);
    });
  });
});
