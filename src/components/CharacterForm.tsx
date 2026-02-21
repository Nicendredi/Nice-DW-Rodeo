import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCharacterStore } from '../hooks/useCharacterStore.tsx';
import { validateCharacterName } from '../utils/validation.ts';

/**
 * CharacterForm Component
 * User Story 1: Display Basic Character Information
 * 
 * Displays form fields for character name, player, campaign, class, health, damage die
 * Includes language selector in header
 * Fully accessible with labels, tab order, focus indicators
 * Includes validation error display with ARIA attributes
 */
export function CharacterForm() {
  const { character, updateCharacter } = useCharacterStore();
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);
  // Store i18n keys instead of translated text so they update when language changes
  const [errorKeys, setErrorKeys] = useState<{ [key: string]: string }>({});

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    i18n.changeLanguage(newLang);
    setCurrentLang(newLang);
    localStorage.setItem('dw-language', newLang);
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    updateCharacter({
      ...character,
      [field]: value,
    });
    // Clear error for this field when user starts typing
    if (errorKeys[field]) {
      setErrorKeys({ ...errorKeys, [field]: '' });
    }
  };
  
  const handleNameBlur = () => {
    const validation = validateCharacterName(character.name);
    if (!validation.valid) {
      // Extract i18n key from error message (e.g., "i18n:validationErrors.nameRequired" -> "validationErrors.nameRequired")
      const i18nKey = validation.error?.replace('i18n:', '') || 'validationErrors.nameRequired';
      setErrorKeys({ ...errorKeys, name: i18nKey });
    } else if (errorKeys.name) {
      // Clear error if now valid
      setErrorKeys({ ...errorKeys, name: '' });
    }
  };

  /**
   * Renders error message with proper ARIA attributes
   * @param fieldName - Field key for error tracking
   * @param errorKey - i18n key for error message (translates dynamically)
   * @returns JSX element or null
   */
  const renderError = (fieldName: string, errorKey: string | undefined) => {
    if (!errorKey) return null;
    
    return (
      <div
        id={`error-${fieldName}`}
        role="alert"
        aria-live="polite"
        style={{ color: '#d32f2f', fontSize: '0.875rem', marginTop: '4px' }}
      >
        {t(errorKey)}
      </div>
    );
  };

  return (
    <div data-testid="character-form">
      <header className="form-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>{t('characterInfo.title')}</h2>
        <div>
          <label htmlFor="language-selector" style={{ marginRight: '8px' }}>
            {t('buttons.language')}
          </label>
          <select
            id="language-selector"
            aria-label={t('buttons.language')}
            value={currentLang}
            onChange={handleLanguageChange}
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
        </div>
      </header>

      <form>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="character-name">{t('characterInfo.characterName')}</label>
            <input
              type="text"
              id="character-name"
              aria-label={t('characterInfo.characterName')}
              aria-describedby={errorKeys.name ? 'error-name' : undefined}
              placeholder={t('characterInfo.characterNamePlaceholder')}
              value={character.name}
              onChange={handleChange('name')}
              onBlur={handleNameBlur}
              maxLength={100}
            />
            {renderError('name', errorKeys.name)}
          </div>

          <div className="form-field">
            <label htmlFor="player-name">{t('characterInfo.playerName')}</label>
            <input
              type="text"
              id="player-name"
              aria-label={t('characterInfo.playerName')}
              placeholder={t('characterInfo.playerNamePlaceholder')}
              value={character.player}
              onChange={handleChange('player')}
              maxLength={100}
            />
          </div>

          <div className="form-field">
            <label htmlFor="campaign">{t('characterInfo.campaign')}</label>
            <input
              type="text"
              id="campaign"
              aria-label={t('characterInfo.campaign')}
              placeholder={t('characterInfo.campaignPlaceholder')}
              value={character.campaign}
              onChange={handleChange('campaign')}
              maxLength={100}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="class">{t('characterInfo.class')}</label>
            <select
              id="class"
              aria-label={t('characterInfo.class')}
              value={character.class}
              onChange={handleChange('class')}
            >
              <option value="Fighter">{t('classOptions.Fighter')}</option>
              <option value="Wizard">{t('classOptions.Wizard')}</option>
              <option value="Thief">{t('classOptions.Thief')}</option>
              <option value="Cleric">{t('classOptions.Cleric')}</option>
              <option value="Ranger">{t('classOptions.Ranger')}</option>
              <option value="Paladin">{t('classOptions.Paladin')}</option>
              <option value="Bard">{t('classOptions.Bard')}</option>
              <option value="Druid">{t('classOptions.Druid')}</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="health-current">{t('characterInfo.health')}</label>
            <div className="health-inputs">
              <input
                type="number"
                id="health-current"
                aria-label={`${t('characterInfo.health')} ${t('characterInfo.currentHealth')}`}
                value={character.healthCurrent}
                onChange={handleChange('healthCurrent')}
                min={0}
                max={character.healthMax}
              />
              <span> / </span>
              <input
                type="number"
                id="health-max"
                aria-label={`${t('characterInfo.health')} ${t('characterInfo.maxHealth')}`}
                value={character.healthMax}
                onChange={handleChange('healthMax')}
                min={1}
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="damage-die">{t('characterInfo.damageDie')}</label>
            <select
              id="damage-die"
              aria-label={t('characterInfo.damageDie')}
              value={character.damageDie}
              onChange={handleChange('damageDie')}
            >
              <option value="d4">{t('damageDieOptions.d4')}</option>
              <option value="d6">{t('damageDieOptions.d6')}</option>
              <option value="d8">{t('damageDieOptions.d8')}</option>
              <option value="d10">{t('damageDieOptions.d10')}</option>
              <option value="d12">{t('damageDieOptions.d12')}</option>
            </select>
          </div>
        </div>
      </form>
    </div>
  );
}
