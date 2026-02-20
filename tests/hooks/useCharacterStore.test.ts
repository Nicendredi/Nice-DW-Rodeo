import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useCharacterStore } from '../../src/hooks/useCharacterStore';

/**
 * useCharacterStore hook tests
 * Phase 3: User Story 1 - Character Data Persistence
 *
 * T018: Hook initialization, state updates, localStorage persistence
 *
 * All tests intentionally FAIL before hook implementation (TDD RED phase)
 */

describe('useCharacterStore (T018)', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
  });

  it('initializes with default character (empty name, default class, etc.)', () => {
    const { result } = renderHook(() => useCharacterStore());

    expect(result.current.character).toBeDefined();
    expect(result.current.character.name).toBe('');
    expect(result.current.character.class).toBe('Fighter');
    expect(result.current.character.healthMax).toBe(20);
    expect(result.current.character.damageDie).toBe('d6');
  });

  it('has updateCharacter function that updates the store', () => {
    const { result } = renderHook(() => useCharacterStore());

    expect(typeof result.current.updateCharacter).toBe('function');

    act(() => {
      result.current.updateCharacter({
        ...result.current.character,
        name: 'Aragorn',
      });
    });

    expect(result.current.character.name).toBe('Aragorn');
  });

  it('triggers re-render when updateCharacter is called', async () => {
    let renderCount = 0;
    const { result, rerender } = renderHook(() => {
      renderCount++;
      return useCharacterStore();
    });

    const initialRenderCount = renderCount;

    act(() => {
      result.current.updateCharacter({
        ...result.current.character,
        name: 'Legolas',
      });
    });

    rerender();

    // Should have re-rendered due to state change
    expect(renderCount).toBeGreaterThan(initialRenderCount);
  });

  it('persists character data to localStorage on update', () => {
    const { result } = renderHook(() => useCharacterStore());

    const testCharacter = {
      ...result.current.character,
      name: 'Gandalf',
      player: 'DM',
      campaign: 'Fellowship',
      class: 'Wizard',
    };

    act(() => {
      result.current.updateCharacter(testCharacter);
    });

    // Check localStorage
    const stored = localStorage.getItem('dw-character');
    expect(stored).toBeDefined();
    const storedData = JSON.parse(stored || '{}');
    expect(storedData.name).toBe('Gandalf');
    expect(storedData.player).toBe('DM');
  });

  it('restores character data from localStorage on mount', () => {
    const initialCharacter = {
      name: 'Frodo',
      player: 'Sam',
      campaign: 'The Ring',
      class: 'Thief',
      healthCurrent: 12,
      healthMax: 18,
      damageDie: 'd6',
      attributes: {
        str: 10,
        dex: 14,
        con: 11,
        int: 9,
        wis: 12,
        cha: 13,
      },
    };

    // Pre-populate localStorage
    localStorage.setItem('dw-character', JSON.stringify(initialCharacter));

    const { result } = renderHook(() => useCharacterStore());

    expect(result.current.character.name).toBe('Frodo');
    expect(result.current.character.player).toBe('Sam');
    expect(result.current.character.healthMax).toBe(18);
  });

  it('can update individual character fields', () => {
    const { result } = renderHook(() => useCharacterStore());

    act(() => {
      result.current.updateCharacter({
        ...result.current.character,
        healthCurrent: 15,
      });
    });

    expect(result.current.character.healthCurrent).toBe(15);
  });

  it('can update attributes within character store', () => {
    const { result } = renderHook(() => useCharacterStore());

    act(() => {
      result.current.updateCharacter({
        ...result.current.character,
        attributes: {
          str: 16,
          dex: 12,
          con: 14,
          int: 11,
          wis: 13,
          cha: 10,
        },
      });
    });

    expect(result.current.character.attributes?.str).toBe(16);
    expect(result.current.character.attributes?.dex).toBe(12);
  });

  it('persists character data across multiple updates', async () => {
    const { result } = renderHook(() => useCharacterStore());

    const update1 = {
      ...result.current.character,
      name: 'Boromir',
    };

    act(() => {
      result.current.updateCharacter(update1);
    });

    const stored1 = localStorage.getItem('dw-character');
    expect(JSON.parse(stored1 || '{}').name).toBe('Boromir');

    const update2 = {
      ...result.current.character,
      player: 'Sean Bean',
    };

    act(() => {
      result.current.updateCharacter(update2);
    });

    const stored2 = localStorage.getItem('dw-character');
    const storedData = JSON.parse(stored2 || '{}');
    expect(storedData.name).toBe('Boromir');
    expect(storedData.player).toBe('Sean Bean');
  });

  it('survives full refresh cycle (localStorage persistence)', async () => {
    // First hook instance - create and save data
    let { result, unmount } = renderHook(() => useCharacterStore());

    const testCharacter = {
      ...result.current.character,
      name: 'Gimli',
      campaign: 'Moria',
      healthMax: 24,
    };

    act(() => {
      result.current.updateCharacter(testCharacter);
    });

    unmount();

    // Second hook instance - should load persisted data
    ({ result } = renderHook(() => useCharacterStore()));

    await waitFor(() => {
      expect(result.current.character.name).toBe('Gimli');
      expect(result.current.character.campaign).toBe('Moria');
      expect(result.current.character.healthMax).toBe(24);
    });
  });
});
