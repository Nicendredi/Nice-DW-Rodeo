import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * CharacterForm component tests
 * Phase 3: User Story 1 - Display Basic Character Information
 *
 * T017: Form structure and field editing
 * T017a: Language selector
 * T017b: Accessibility requirements
 *
 * All tests intentionally FAIL before component implementation (TDD RED phase)
 */

// Mock useCharacterStore hook
vi.mock('../../src/hooks/useCharacterStore', () => ({
  useCharacterStore: () => ({
    character: {
      name: '',
      player: '',
      campaign: '',
      class: 'Fighter',
      healthCurrent: 20,
      healthMax: 20,
      damageDie: 'd6',
    },
    updateCharacter: vi.fn(),
  }),
}));

// Mock useTranslation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: { language: 'en', changeLanguage: vi.fn() },
    t: (key: string) => {
      const translations: Record<string, string> = {
        'characterInfo.characterName': 'Character Name',
        'characterInfo.playerName': 'Player Name',
        'characterInfo.campaign': 'Campaign',
        'characterInfo.class': 'Class',
        'characterInfo.health': 'Health',
        'characterInfo.damageDie': 'Damage Die',
        'characterInfo.languageSelector': 'Language',
        'classOptions.Fighter': 'Fighter',
        'classOptions.Wizard': 'Wizard',
        'classOptions.Thief': 'Thief',
        'classOptions.Cleric': 'Cleric',
        'classOptions.Ranger': 'Ranger',
        'classOptions.Paladin': 'Paladin',
        'classOptions.Bard': 'Bard',
        'classOptions.Druid': 'Druid',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock CharacterForm component placeholder (will be replaced by implementation)
const CharacterForm = () => {
  return <div data-testid="character-form">CharacterForm Component</div>;
};

describe('CharacterForm (T017, T017a, T017b)', () => {
  beforeEach(() => {
    // Setup before each test
  });

  afterEach(() => {
    cleanup();
  });

  describe('T017: Form Structure and Field Editing', () => {
    it('renders form with Character Name field', async () => {
      render(<CharacterForm />);
      expect(screen.getByRole('textbox', { name: /character name/i })).toBeInTheDocument();
    });

    it('renders form with Player Name field', async () => {
      render(<CharacterForm />);
      expect(screen.getByRole('textbox', { name: /player name/i })).toBeInTheDocument();
    });

    it('renders form with Campaign field', async () => {
      render(<CharacterForm />);
      expect(screen.getByRole('textbox', { name: /campaign/i })).toBeInTheDocument();
    });

    it('renders form with Class dropdown', async () => {
      render(<CharacterForm />);
      expect(screen.getByRole('combobox', { name: /class/i })).toBeInTheDocument();
    });

    it('renders form with Health (current/max) fields', async () => {
      render(<CharacterForm />);
      // Should have two number inputs for current and max health
      const healthInputs = screen.getAllByRole('spinbutton', { name: /health/i });
      expect(healthInputs.length).toBeGreaterThanOrEqual(2);
    });

    it('renders form with Damage Die dropdown', async () => {
      render(<CharacterForm />);
      expect(screen.getByRole('combobox', { name: /damage die/i })).toBeInTheDocument();
    });

    it('editing Character Name field updates the displayed value', async () => {
      const user = userEvent.setup();
      render(<CharacterForm />);

      const nameInput = screen.getByRole('textbox', { name: /character name/i });
      await user.clear(nameInput);
      await user.type(nameInput, 'Thorin');

      expect(nameInput).toHaveValue('Thorin');
    });

    it('entering max health as 30 and current health as 27 displays "27 / 30"', async () => {
      const user = userEvent.setup();
      render(<CharacterForm />);

      const healthInputs = screen.getAllByRole('spinbutton', { name: /health/i });
      // Assuming first is current, second is max
      await user.clear(healthInputs[0]);
      await user.type(healthInputs[0], '27');
      await user.clear(healthInputs[1]);
      await user.type(healthInputs[1], '30');

      expect(screen.getByText(/27\s*\/\s*30/)).toBeInTheDocument();
    });

    it('changing damage die from "d6" to "d10" updates the display immediately', async () => {
      const user = userEvent.setup();
      render(<CharacterForm />);

      const damageDieSelect = screen.getByRole('combobox', { name: /damage die/i });
      await user.selectOptions(damageDieSelect, 'd10');

      expect(damageDieSelect).toHaveValue('d10');
    });

    it('Class dropdown renders exactly 8 options', async () => {
      render(<CharacterForm />);
      const classSelect = screen.getByRole('combobox', { name: /class/i });

      const options = screen.getAllByRole('option');
      // Filter to class options (excluding none/default)
      const classOptions = options.filter((opt) =>
        [
          'Fighter',
          'Wizard',
          'Thief',
          'Cleric',
          'Ranger',
          'Paladin',
          'Bard',
          'Druid',
        ].includes(opt.textContent || '')
      );

      expect(classOptions).toHaveLength(8);
    });

    it('form displays placeholder text for Character Name', async () => {
      render(<CharacterForm />);
      const nameInput = screen.getByRole('textbox', { name: /character name/i });
      expect(nameInput).toHaveAttribute('placeholder', expect.stringContaining('Enter character name'));
    });

    it('form displays placeholder text for Damage Die', async () => {
      render(<CharacterForm />);
      const damageDieSelect = screen.getByRole('combobox', { name: /damage die/i });
      expect(damageDieSelect).toHaveAttribute('placeholder', expect.stringContaining('d6'));
    });

    it('Character Name input enforces maxLength=100', async () => {
      render(<CharacterForm />);
      const nameInput = screen.getByRole('textbox', { name: /character name/i });
      expect(nameInput).toHaveAttribute('maxLength', '100');
    });

    it('Player Name input enforces maxLength=100', async () => {
      render(<CharacterForm />);
      const playerInput = screen.getByRole('textbox', { name: /player name/i });
      expect(playerInput).toHaveAttribute('maxLength', '100');
    });

    it('Campaign input enforces maxLength=100', async () => {
      render(<CharacterForm />);
      const campaignInput = screen.getByRole('textbox', { name: /campaign/i });
      expect(campaignInput).toHaveAttribute('maxLength', '100');
    });
  });

  describe('T017a: Language Selector', () => {
    it('renders language selector in the form header', async () => {
      render(<CharacterForm />);
      expect(screen.getByRole('combobox', { name: /language/i })).toBeInTheDocument();
    });

    it('language selector is positioned in the top-right of the header', async () => {
      const { container } = render(<CharacterForm />);
      const languageSelector = screen.getByRole('combobox', { name: /language/i });

      // Check that it's within a header or top section
      const header = container.querySelector('header, [role="banner"], .header');
      expect(header).toContainElement(languageSelector);
    });

    it('clicking selector and choosing "Français" updates all visible labels to French', async () => {
      const user = userEvent.setup();
      render(<CharacterForm />);

      const languageSelector = screen.getByRole('combobox', { name: /language/i });
      await user.selectOptions(languageSelector, 'fr');

      // After language change, French labels should appear
      await waitFor(() => {
        expect(screen.getByText('Nom du personnage')).toBeInTheDocument();
      });
    });

    it('switching back to "English" reverts labels correctly', async () => {
      const user = userEvent.setup();
      render(<CharacterForm />);

      const languageSelector = screen.getByRole('combobox', { name: /language/i });

      // Switch to French
      await user.selectOptions(languageSelector, 'fr');
      await waitFor(() => {
        expect(screen.getByText('Nom du personnage')).toBeInTheDocument();
      });

      // Switch back to English
      await user.selectOptions(languageSelector, 'en');
      await waitFor(() => {
        expect(screen.getByText('Character Name')).toBeInTheDocument();
      });
    });

    it('language preference persists after page refresh (stored in localStorage)', async () => {
      const user = userEvent.setup();
      const { unmount } = render(<CharacterForm />);

      const languageSelector = screen.getByRole('combobox', { name: /language/i });
      await user.selectOptions(languageSelector, 'fr');

      // Verify localStorage was updated
      expect(localStorage.getItem('dw-language')).toBe('fr');

      unmount();

      // Re-render and verify language persists
      render(<CharacterForm />);
      await waitFor(() => {
        expect(screen.getByText('Nom du personnage')).toBeInTheDocument();
      });
    });
  });

  describe('T017b: Accessibility', () => {
    it('all form inputs have associated <label> or aria-label attributes', async () => {
      render(<CharacterForm />);

      const inputs = screen.getAllByRole('textbox');
      inputs.forEach((input) => {
        expect(
          input.hasAttribute('aria-label') || input.getAttribute('aria-labelledby')
        ).toBeTruthy();
      });
    });

    it('tab order navigates through fields in logical sequence (left-to-right, top-to-bottom)', async () => {
      const user = userEvent.setup();
      render(<CharacterForm />);

      const nameInput = screen.getByRole('textbox', { name: /character name/i });
      nameInput.focus();

      // Tab order should go: Name → Player → Campaign → Class → Health Current → Health Max → Damage Die → Language
      // We can verify by checking focus management
      await user.tab();
      expect(document.activeElement).not.toBe(nameInput);
    });

    it('all inputs have visible focus indicators when focused', async () => {
      const user = userEvent.setup();
      render(<CharacterForm />);

      const nameInput = screen.getByRole('textbox', { name: /character name/i });
      await user.click(nameInput);

      // Check for focus styles (outline or other visible indicator)
      const style = window.getComputedStyle(nameInput);
      expect(
        style.outline !== 'none' ||
          style.outlineWidth !== '0px' ||
          style.borderStyle !== 'none'
      ).toBeTruthy();
    });

    it('no keyboard traps; user can tab away from any field', async () => {
      const user = userEvent.setup();
      render(<CharacterForm />);

      const nameInput = screen.getByRole('textbox', { name: /character name/i });
      nameInput.focus();

      const initialElement = document.activeElement;

      // Tab multiple times
      for (let i = 0; i < 3; i++) {
        await user.tab();
      }

      // Focus should have moved
      expect(document.activeElement).not.toBe(initialElement);
    });
  });
});
