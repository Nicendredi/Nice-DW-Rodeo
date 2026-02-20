/**
 * Move interface representing a Dungeon World move.
 */
export interface Move {
  id: string;
  name: string;
  description: string;
}

/**
 * Get all basic moves (8 core DW moves).
 * All characters get access to these moves regardless of class.
 *
 * @returns Array of 8 basic moves
 */
export function getBasicMoves(): Move[] {
  return [
    {
      id: 'bm-001',
      name: 'Hack and Slash',
      description:
        'When you attack an enemy in melee, roll+STR. On a 10+, you deal your damage to the enemy and avoid their attack. On a 7–9, you deal your damage to the enemy and the enemy makes an attack against you.',
    },
    {
      id: 'bm-002',
      name: 'Volley',
      description:
        'When you attack an enemy at range, roll+DEX. On a 10+, you deal your damage to the enemy and you are in a safe spot. On a 7–9, you deal your damage to the enemy but you are exposed to danger.',
    },
    {
      id: 'bm-003',
      name: 'Defy Danger',
      description:
        'When you do something risky in the face of danger, tell me what you do. If you act on instinct, roll+DEX. If you act carefully, roll+INT. If you rely on your guts, roll+CON. On a 10+, you pull it off. On a 7–9, you pull it off, but the GM chooses one: you take 1d6 damage, you lose something, or you put yourself in a spot.',
    },
    {
      id: 'bm-004',
      name: 'Defend',
      description:
        'When you are in a melee and an ally near you takes damage, you can step in. Reduce that damage by half (round up). You take the remaining damage.',
    },
    {
      id: 'bm-005',
      name: 'Spout Lore',
      description:
        'When you consult your accumulated knowledge about something, roll+INT. On a 10+, the GM tells you something interesting and useful about the subject relevant to your situation. On a 7–9, the GM tells you something interesting about it, but there is a false impression.',
    },
    {
      id: 'bm-006',
      name: 'Discern Realities',
      description:
        'When you closely study a situation or person, roll+WIS. On a 10+, you can find the answer to one question. On a 7–9, you get an impression, but the answer is vague and unclear. Ask one question from the list.',
    },
    {
      id: 'bm-007',
      name: 'Parley',
      description:
        'When you have leverage on someone and tell them what you want, roll+CHA. On a 10+, they do what you ask if you first promise what they ask of you. On a 7–9, they will do what you ask, but only if you do what they ask first.',
    },
    {
      id: 'bm-008',
      name: 'Aid or Interfere',
      description:
        'When you help or hinder someone, tell the GM what you do and how. That character then rolls, using your aid or your hindrance. If you aid, they take +1 forward; if you interfere, they take −1.',
    },
  ];
}

/**
 * Get all special moves (13 universal special moves).
 * All characters get access to these moves regardless of class.
 *
 * @returns Array of 13 special moves
 */
export function getSpecialMoves(): Move[] {
  return [
    {
      id: 'sm-001',
      name: 'Last Breath',
      description:
        'When you are dying, you catch a glimpse of what lies beyond the mortal veil. Whoever is with you gets +1 forward against the thing that is killing you.',
    },
    {
      id: 'sm-002',
      name: 'Encumbrance',
      description:
        'You have 10 load. When you make use of an item, mark off load equal to its weight in coins. If you go over your load, you are encumbered and move at half speed.',
    },
    {
      id: 'sm-003',
      name: 'Make Camp',
      description:
        'When you camp, eat a ration, recover armor, prepare spells (if needed), and take your ease, each character chooses one person to hold a watch. Take +1 forward to checks after a full rest.',
    },
    {
      id: 'sm-004',
      name: 'Take Watch',
      description:
        'When you take watch and something bad approaches, the GM will tell you. You can sound an alarm to give your party a chance to prepare.',
    },
    {
      id: 'sm-005',
      name: 'Undertake a Perilous Journey',
      description:
        'When you and your companions travel to a new location, one of you is the scout, one is the trailblazer, and one is the provisioner. Each rolls+WIS or +STR or +CON depending on role.',
    },
    {
      id: 'sm-006',
      name: 'Level Up',
      description:
        'When you gain a level, you increase one of your ability scores by 1. Choose a 2nd-level move you do not have—you have gained it.',
    },
    {
      id: 'sm-007',
      name: 'End of Session',
      description:
        'When you reach the end of a session, each character chooses one person who was a champion for their class. That person takes +1 forward to the next session.',
    },
    {
      id: 'sm-008',
      name: 'Carouse',
      description:
        'When you return to a civilized settlement, you can blow off steam. Roll+CON. On a 10+, you experience what you want. On a 7–9, choose one: you get drunk, you get into debt, or you draw unwanted attention.',
    },
    {
      id: 'sm-009',
      name: 'Supply',
      description:
        'When you return to a civilized settlement, you can replenish your supplies and stock. You can get common items with some negotiation. Magic items require serious money.',
    },
    {
      id: 'sm-010',
      name: 'Recover',
      description:
        'When you spend time healing from wounds and damage, you recover 1d6 HP per full day of rest. If you have a healer tending to you, you recover 2d6 HP instead.',
    },
    {
      id: 'sm-011',
      name: 'Recruit',
      description:
        'When you spend your leisure time recruiting followers, roll+CHA. On a 10+, you gain loyal followers equal to your level. On a 7–9, you gain half as many.',
    },
    {
      id: 'sm-012',
      name: 'Outstanding Warrants',
      description:
        'When you gain a level, you may have left behind a warrant for your arrest. Work with the GM to establish consequences.',
    },
    {
      id: 'sm-013',
      name: 'Bolster',
      description:
        'When you help a companion make a move or recover from failure, grant them advantage on their next move.',
    },
  ];
}
