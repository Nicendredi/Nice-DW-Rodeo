import React from 'react';
import { CharacterForm } from '../../components/CharacterForm.tsx';

/**
 * CharacterSheet Page
 * Main page container for Dungeon World character sheet
 * 
 * Phase 3 (US1): Displays CharacterForm
 * Phase 4 (US2): Will add Attributes section
 * Phase 5 (US3): Will add Moves sections
 * Phase 6 (US4): Will add Notes section
 */
export function CharacterSheet() {
  return (
    <div className="character-sheet">
      <CharacterForm />
      
      {/* Placeholder for future sections */}
      {/* Phase 4: Attributes section will go here */}
      {/* Phase 5: Basic Moves and Special Moves sections will go here */}
      {/* Phase 6: Notes section will go here */}
    </div>
  );
}
