import { describe, it, expect } from 'vitest';
import { getBasicMoves, getSpecialMoves } from '../../src/utils/moves';

describe('moves', () => {
  describe('getBasicMoves', () => {
    it('returns array of 8 basic moves', () => {
      const moves = getBasicMoves();
      expect(moves).toHaveLength(8);
    });

    it('each move has id, name, and description', () => {
      const moves = getBasicMoves();
      moves.forEach((move) => {
        expect(move).toHaveProperty('id');
        expect(move).toHaveProperty('name');
        expect(move).toHaveProperty('description');
        expect(typeof move.id).toBe('string');
        expect(typeof move.name).toBe('string');
        expect(typeof move.description).toBe('string');
      });
    });

    it('includes Hack and Slash', () => {
      const moves = getBasicMoves();
      const hackAndSlash = moves.find(
        (m) => m.name === 'Hack and Slash' || m.id === 'bm-001'
      );
      expect(hackAndSlash).toBeDefined();
    });

    it('includes Volley', () => {
      const moves = getBasicMoves();
      const volley = moves.find(
        (m) => m.name === 'Volley' || m.id === 'bm-002'
      );
      expect(volley).toBeDefined();
    });

    it('includes Defy Danger', () => {
      const moves = getBasicMoves();
      const defyDanger = moves.find(
        (m) => m.name === 'Defy Danger' || m.id === 'bm-003'
      );
      expect(defyDanger).toBeDefined();
    });

    it('includes Defend', () => {
      const moves = getBasicMoves();
      const defend = moves.find(
        (m) => m.name === 'Defend' || m.id === 'bm-004'
      );
      expect(defend).toBeDefined();
    });

    it('includes Spout Lore', () => {
      const moves = getBasicMoves();
      const spoutLore = moves.find(
        (m) => m.name === 'Spout Lore' || m.id === 'bm-005'
      );
      expect(spoutLore).toBeDefined();
    });

    it('includes Discern Realities', () => {
      const moves = getBasicMoves();
      const discernRealities = moves.find(
        (m) => m.name === 'Discern Realities' || m.id === 'bm-006'
      );
      expect(discernRealities).toBeDefined();
    });

    it('includes Parley', () => {
      const moves = getBasicMoves();
      const parley = moves.find(
        (m) => m.name === 'Parley' || m.id === 'bm-007'
      );
      expect(parley).toBeDefined();
    });

    it('includes Aid or Interfere', () => {
      const moves = getBasicMoves();
      const aidOrInterfere = moves.find(
        (m) => m.name === 'Aid or Interfere' || m.id === 'bm-008'
      );
      expect(aidOrInterfere).toBeDefined();
    });
  });

  describe('getSpecialMoves', () => {
    it('returns array of 13 special moves', () => {
      const moves = getSpecialMoves();
      expect(moves).toHaveLength(13);
    });

    it('each move has id, name, and description', () => {
      const moves = getSpecialMoves();
      moves.forEach((move) => {
        expect(move).toHaveProperty('id');
        expect(move).toHaveProperty('name');
        expect(move).toHaveProperty('description');
        expect(typeof move.id).toBe('string');
        expect(typeof move.name).toBe('string');
        expect(typeof move.description).toBe('string');
      });
    });

    it('includes Last Breath', () => {
      const moves = getSpecialMoves();
      const lastBreath = moves.find(
        (m) => m.name === 'Last Breath' || m.id === 'sm-001'
      );
      expect(lastBreath).toBeDefined();
    });

    it('includes Encumbrance', () => {
      const moves = getSpecialMoves();
      const encumbrance = moves.find(
        (m) => m.name === 'Encumbrance' || m.id === 'sm-002'
      );
      expect(encumbrance).toBeDefined();
    });

    it('includes Make Camp', () => {
      const moves = getSpecialMoves();
      const makeCamp = moves.find(
        (m) => m.name === 'Make Camp' || m.id === 'sm-003'
      );
      expect(makeCamp).toBeDefined();
    });

    it('includes Take Watch', () => {
      const moves = getSpecialMoves();
      const takeWatch = moves.find(
        (m) => m.name === 'Take Watch' || m.id === 'sm-004'
      );
      expect(takeWatch).toBeDefined();
    });

    it('includes Undertake a Perilous Journey', () => {
      const moves = getSpecialMoves();
      const undertakePerilousJourney = moves.find(
        (m) =>
          m.name === 'Undertake a Perilous Journey' || m.id === 'sm-005'
      );
      expect(undertakePerilousJourney).toBeDefined();
    });

    it('includes Level Up', () => {
      const moves = getSpecialMoves();
      const levelUp = moves.find(
        (m) => m.name === 'Level Up' || m.id === 'sm-006'
      );
      expect(levelUp).toBeDefined();
    });

    it('includes End of Session', () => {
      const moves = getSpecialMoves();
      const endOfSession = moves.find(
        (m) => m.name === 'End of Session' || m.id === 'sm-007'
      );
      expect(endOfSession).toBeDefined();
    });

    it('includes Carouse', () => {
      const moves = getSpecialMoves();
      const carouse = moves.find(
        (m) => m.name === 'Carouse' || m.id === 'sm-008'
      );
      expect(carouse).toBeDefined();
    });

    it('includes Supply', () => {
      const moves = getSpecialMoves();
      const supply = moves.find(
        (m) => m.name === 'Supply' || m.id === 'sm-009'
      );
      expect(supply).toBeDefined();
    });

    it('includes Recover', () => {
      const moves = getSpecialMoves();
      const recover = moves.find(
        (m) => m.name === 'Recover' || m.id === 'sm-010'
      );
      expect(recover).toBeDefined();
    });

    it('includes Recruit', () => {
      const moves = getSpecialMoves();
      const recruit = moves.find(
        (m) => m.name === 'Recruit' || m.id === 'sm-011'
      );
      expect(recruit).toBeDefined();
    });

    it('includes Outstanding Warrants', () => {
      const moves = getSpecialMoves();
      const outstandingWarrants = moves.find(
        (m) => m.name === 'Outstanding Warrants' || m.id === 'sm-012'
      );
      expect(outstandingWarrants).toBeDefined();
    });

    it('includes Bolster', () => {
      const moves = getSpecialMoves();
      const bolster = moves.find(
        (m) => m.name === 'Bolster' || m.id === 'sm-013'
      );
      expect(bolster).toBeDefined();
    });
  });
});
