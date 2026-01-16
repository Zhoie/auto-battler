// Battle types for turn-based combat

export type Team = 'ally' | 'enemy';

export interface StatusEffect {
    type: string; // e.g., 'guard', 'mark'
    duration: number; // turns left
    value?: number; // e.g., damage reduction for guard
}

export interface Character {
    id: string;
    name: string;
    team: Team;
    hp: number;
    maxHp: number;
    mana: number;
    maxMana: number;
    atk: number;
    def: number;
    spd: number;
    statusEffects: StatusEffect[];
    skills?: Skill[]; // Only for player
}

export type TargetType = 'self' | 'ally' | 'enemy' | 'allEnemies';

export interface Skill {
    id: string;
    name: string;
    cost: number; // mana cost
    targetType: TargetType;
    cooldown: number; // turns
    currentCooldown: number;
    effect: (caster: Character, targets: Character[], battleLog: string[]) => { targets: Character[], log: string[] };
}

export type BattlePhase =
    | 'setup'
    | 'playerSelectAction'
    | 'playerSelectTarget'
    | 'resolveAction'
    | 'enemyTurn'
    | 'checkWinLose'
    | 'end';

export interface BattleState {
    phase: BattlePhase;
    turnQueue: string[]; // character ids in turn order
    activeUnitId: string | null;
    selectedSkill: Skill | null;
    allies: Character[];
    enemies: Character[];
    log: string[];
    winner: Team | null;
}

export type BattleAction =
    | { type: 'START_BATTLE'; playerClass: 'warrior' | 'archer' | 'mage' }
    | { type: 'SELECT_SKILL'; skillId: string }
    | { type: 'SELECT_TARGET'; targetId: string }
    | { type: 'ADVANCE_TURN' }
    | { type: 'PERFORM_ENEMY_AI' }
    | { type: 'CHECK_WIN_LOSE' }
    | { type: 'RESTART' }
    | { type: 'CAST_SPELL'; payload: { spellName: string; effectType: 'ATTACK' | 'DEFEND' | 'HEAL'; power: number; cost: number } };