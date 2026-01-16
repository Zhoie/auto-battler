// Combat rules and calculations

import { Character, StatusEffect } from '../types';

export function calculateDamage(attacker: Character, defender: Character): number {
    let effectiveAtk = attacker.atk;

    // Check if attacker has mark on defender? Wait, mark is on the target, increasing damage received.
    // The prompt: "mark an enemy: they take +30% damage for 2 turns"
    // So, the defender takes more damage.

    const baseDamage = effectiveAtk - defender.def;
    const variance = Math.floor(Math.random() * 5) - 2; // -2 to +2
    const rawDamage = baseDamage + variance;
    let damage = Math.max(1, rawDamage);

    // Apply defender status effects
    const guardEffect = defender.statusEffects.find(e => e.type === 'guard');
    if (guardEffect) {
        damage = Math.floor(damage * (1 - guardEffect.value!)); // 50% reduction
        // Remove the guard effect after use
        defender.statusEffects = defender.statusEffects.filter(e => e !== guardEffect);
    }

    const markEffect = defender.statusEffects.find(e => e.type === 'mark');
    if (markEffect) {
        damage = Math.floor(damage * (1 + markEffect.value!)); // +30% damage
        // Mark persists, don't remove here
    }

    return damage;
}

export function applyDamage(character: Character, damage: number): Character {
    return {
        ...character,
        hp: Math.max(0, character.hp - damage),
    };
}

export function applyStatusEffect(character: Character, effect: StatusEffect): Character {
    const existing = character.statusEffects.find(e => e.type === effect.type);
    if (existing) {
        // Refresh duration
        existing.duration = Math.max(existing.duration, effect.duration);
    } else {
        character.statusEffects.push({ ...effect });
    }
    return character;
}

export function tickStatusEffects(character: Character): Character {
    return {
        ...character,
        statusEffects: character.statusEffects
            .map(e => ({ ...e, duration: e.duration - 1 }))
            .filter(e => e.duration > 0),
    };
}