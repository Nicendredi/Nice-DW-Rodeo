import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * Character data interface
 */
export interface Character {
  name: string;
  player: string;
  campaign: string;
  class: string;
  healthCurrent: number;
  healthMax: number;
  damageDie: string;
  attributes?: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
  notes?: string;
}

/**
 * Character store context value
 */
interface CharacterStore {
  character: Character;
  updateCharacter: (character: Character) => void;
}

const defaultCharacter: Character = {
  name: '',
  player: '',
  campaign: '',
  class: 'Fighter',
  healthCurrent: 20,
  healthMax: 20,
  damageDie: 'd6',
  attributes: {
    str: 10,
    dex: 10,
    con: 10,
    int: 10,
    wis: 10,
    cha: 10,
  },
  notes: '',
};

const CharacterStoreContext = createContext<CharacterStore | undefined>(undefined);

/**
 * Provider component for character store
 */
export function CharacterStoreProvider({ children }: { children: ReactNode }) {
  const [character, setCharacter] = useState<Character>(() => {
    // Initialize from localStorage if available
    const stored = localStorage.getItem('dw-character');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.warn('Failed to parse stored character data:', error);
        return defaultCharacter;
      }
    }
    return defaultCharacter;
  });

  const updateCharacter = (newCharacter: Character) => {
    setCharacter(newCharacter);
    // Persist to localStorage
    localStorage.setItem('dw-character', JSON.stringify(newCharacter));
  };

  return (
    <CharacterStoreContext.Provider value={{ character, updateCharacter }}>
      {children}
    </CharacterStoreContext.Provider>
  );
}

/**
 * Hook to access character store
 * Must be used within CharacterStoreProvider
 */
export function useCharacterStore(): CharacterStore {
  const context = useContext(CharacterStoreContext);
  if (!context) {
    throw new Error('useCharacterStore must be used within CharacterStoreProvider');
  }
  return context;
}
