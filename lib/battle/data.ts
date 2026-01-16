import { Character, Skill } from '../types';
import { calculateDamage, applyDamage, applyStatusEffect } from './combat';

// Class definitions
export const CLASSES = {
    warrior: {
        name: 'Warrior',
        baseStats: { hp: 120, maxHp: 120, mana: 30, maxMana: 30, atk: 12, def: 8, spd: 8 },
    },
    archer: {
        name: 'Archer',
        baseStats: { hp: 100, maxHp: 100, mana: 40, maxMana: 40, atk: 15, def: 4, spd: 10 },
    },
    mage: {
        name: 'Mage',
        baseStats: { hp: 80, maxHp: 80, mana: 60, maxMana: 60, atk: 8, def: 3, spd: 9 },
    },
};

// Skill effects
function basicAttack(caster: Character, targets: Character[], log: string[]): { targets: Character[], log: string[] } {
    const target = targets[0];
    const damage = calculateDamage(caster, target);
    const newTarget = applyDamage(target, damage);
    return {
        targets: [newTarget],
        log: [...log, `${caster.name} attacks ${target.name} for ${damage} damage!`],
    };
}

function guard(caster: Character, targets: Character[], log: string[]): { targets: Character[], log: string[] } {
    const newCaster = applyStatusEffect(caster, { type: 'guard', duration: 1, value: 0.5 });
    return {
        targets: [newCaster],
        log: [...log, `${caster.name} guards!`],
    };
}

function mark(caster: Character, targets: Character[], log: string[]): { targets: Character[], log: string[] } {
    const target = targets[0];
    const newTarget = applyStatusEffect(target, { type: 'mark', duration: 2, value: 0.3 });
    return {
        targets: [newTarget],
        log: [...log, `${caster.name} marks ${target.name}!`],
    };
}

function fireball(caster: Character, targets: Character[], log: string[]): { targets: Character[], log: string[] } {
    const damage = 20; // Fixed AoE damage
    const newTargets = targets.map(t => applyDamage(t, damage));
    return {
        targets: newTargets,
        log: [...log, `${caster.name} casts Fireball for ${damage} damage to all enemies!`],
    };
}

export function getSkillsForClass(classType: 'warrior' | 'archer' | 'mage'): Skill[] {
    switch (classType) {
        case 'warrior':
            return [
                { id: 'basicAttack', name: 'Basic Attack', cost: 0, targetType: 'enemy', cooldown: 0, currentCooldown: 0, effect: basicAttack },
                { id: 'guard', name: 'Guard', cost: 0, targetType: 'self', cooldown: 0, currentCooldown: 0, effect: guard },
            ];
        case 'archer':
            return [
                { id: 'basicShot', name: 'Basic Shot', cost: 0, targetType: 'enemy', cooldown: 0, currentCooldown: 0, effect: basicAttack }, // Reuse basicAttack
                { id: 'mark', name: 'Mark', cost: 0, targetType: 'enemy', cooldown: 0, currentCooldown: 0, effect: mark },
            ];
        case 'mage':
            return [
                { id: 'wandHit', name: 'Wand Hit', cost: 0, targetType: 'enemy', cooldown: 0, currentCooldown: 0, effect: basicAttack }, // Reuse basicAttack
                { id: 'fireball', name: 'Fireball', cost: 5, targetType: 'allEnemies', cooldown: 0, currentCooldown: 0, effect: fireball },
            ];
    }
}

export function createPlayerCharacter(classType: 'warrior' | 'archer' | 'mage'): Character {
    const classDef = CLASSES[classType];
    return {
        id: 'player',
        name: classDef.name,
        team: 'ally',
        ...classDef.baseStats,
        statusEffects: [],
    };
}

export function createEnemies(): Character[] {
    return [
        {
            id: 'enemy1',
            name: 'Goblin',
            team: 'enemy',
            hp: 80,
            maxHp: 80,
            mana: 20,
            maxMana: 20,
            atk: 8,
            def: 3,
            spd: 8,
            statusEffects: [],
        },
        // Add more enemies if needed
    ];
}