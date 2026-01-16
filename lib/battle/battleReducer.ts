import { BattleState, BattleAction, Character, Skill, Team } from '../types';
import { createPlayerCharacter as _createPlayerCharacter, createEnemies as _createEnemies, getSkillsForClass } from './data';
import { calculateDamage, applyDamage, tickStatusEffects } from './combat';

export { _createPlayerCharacter as createPlayerCharacter };
export { _createEnemies as createEnemies };

export function getInitialBattleState(): BattleState {
    return {
        phase: 'setup',
        turnQueue: [],
        activeUnitId: null,
        selectedSkill: null,
        allies: [],
        enemies: [],
        log: [],
        winner: null,
    };
}

export function battleReducer(state: BattleState, action: BattleAction): BattleState {
    switch (action.type) {
        case 'START_BATTLE':
            const player = { ..._createPlayerCharacter(action.playerClass), skills: getSkillsForClass(action.playerClass) };
            const enemies = _createEnemies();
            const allUnits = [player, ...enemies];
            const turnQueue = allUnits.sort((a, b) => b.spd - a.spd).map(u => u.id); // Higher spd first
            return {
                ...state,
                phase: 'playerSelectAction',
                turnQueue,
                activeUnitId: turnQueue[0],
                allies: [player],
                enemies,
                log: ['Battle starts!'],
            };

        case 'SELECT_SKILL':
            const activeUnit = [...state.allies, ...state.enemies].find(c => c.id === state.activeUnitId);
            if (!activeUnit || !activeUnit.skills) return state;
            const skill = activeUnit.skills.find(s => s.id === action.skillId);
            if (!skill || activeUnit.mana < skill.cost || skill.currentCooldown > 0) return state;
            return {
                ...state,
                selectedSkill: skill,
                phase: 'playerSelectTarget',
            };

        case 'SELECT_TARGET':
            if (!state.selectedSkill) return state;
            const caster = [...state.allies, ...state.enemies].find(c => c.id === state.activeUnitId)!;
            let targets: Character[] = [];
            if (state.selectedSkill.targetType === 'self') {
                targets = [caster];
            } else if (state.selectedSkill.targetType === 'enemy') {
                targets = state.enemies.filter(e => e.id === action.targetId);
            } else if (state.selectedSkill.targetType === 'allEnemies') {
                targets = state.enemies.filter(e => e.hp > 0);
            }
            if (targets.length === 0) return state;

            const { targets: updatedTargets, log: newLog } = state.selectedSkill.effect(caster, targets, state.log);
            let updatedAllies = [...state.allies];
            let updatedEnemies = [...state.enemies];
            updatedTargets.forEach(t => {
                if (t.team === 'ally') {
                    updatedAllies = updatedAllies.map(a => a.id === t.id ? t : a);
                } else {
                    updatedEnemies = updatedEnemies.map(e => e.id === t.id ? t : e);
                }
            });
            // Deduct mana and set cooldown
            const updatedCaster = {
                ...caster,
                mana: caster.mana - state.selectedSkill.cost,
                skills: caster.skills?.map(s => s.id === state.selectedSkill!.id ? { ...s, currentCooldown: s.cooldown } : s),
            };
            if (updatedCaster.team === 'ally') {
                updatedAllies = updatedAllies.map(a => a.id === updatedCaster.id ? updatedCaster : a);
            } else {
                updatedEnemies = updatedEnemies.map(e => e.id === updatedCaster.id ? updatedCaster : e);
            }

            return {
                ...state,
                allies: updatedAllies,
                enemies: updatedEnemies,
                log: newLog,
                phase: 'resolveAction',
            };

        case 'ADVANCE_TURN':
            // Tick status effects and reduce cooldowns for all units
            const tickedAllies = state.allies.map(tickStatusEffects).map(c => ({
                ...c,
                skills: c.skills?.map(s => ({ ...s, currentCooldown: Math.max(0, s.currentCooldown - 1) })),
            }));
            const tickedEnemies = state.enemies.map(tickStatusEffects).map(c => ({
                ...c,
                skills: c.skills?.map(s => ({ ...s, currentCooldown: Math.max(0, s.currentCooldown - 1) })),
            }));

            // Move to next unit in queue
            const currentIndex = state.turnQueue.indexOf(state.activeUnitId!);
            const nextIndex = (currentIndex + 1) % state.turnQueue.length;
            const nextUnitId = state.turnQueue[nextIndex];
            const nextUnit = [...tickedAllies, ...tickedEnemies].find(u => u.id === nextUnitId);
            const nextPhase = nextUnit?.team === 'ally' ? 'playerSelectAction' : 'enemyTurn';

            return {
                ...state,
                allies: tickedAllies,
                enemies: tickedEnemies,
                activeUnitId: nextUnitId,
                phase: nextPhase,
                selectedSkill: null,
            };

        case 'PERFORM_ENEMY_AI':
            const enemy = state.enemies.find(e => e.id === state.activeUnitId);
            if (!enemy) return state;
            // Simple AI: use basic attack on random living ally
            const livingAllies = state.allies.filter(a => a.hp > 0);
            if (livingAllies.length === 0) return state;
            const target = livingAllies[Math.floor(Math.random() * livingAllies.length)];
            // Assume enemies have basic attack: cost 0, target enemy
            const damage = calculateDamage(enemy, target);
            const updatedTarget = applyDamage(target, damage);
            const aiUpdatedAllies = state.allies.map(a => a.id === target.id ? updatedTarget : a);
            return {
                ...state,
                allies: aiUpdatedAllies,
                log: [...state.log, `${enemy.name} attacks ${target.name} for ${damage} damage!`],
                phase: 'resolveAction',
            };

        case 'CAST_SPELL': {
            if (state.phase !== 'playerSelectAction') return state;
            const spellCaster = state.allies[0]; // Player is always first ally
            const { spellName, effectType, power, cost } = action.payload;

            if (spellCaster.mana < cost) {
                return { ...state, log: [...state.log, `Not enough mana to cast ${spellName}!`] };
            }

            const casterAfterCost = { ...spellCaster, mana: spellCaster.mana - cost };
            let spellLog = [...state.log];
            let spellUpdatedAllies = [...state.allies];
            let spellUpdatedEnemies = [...state.enemies];

            if (effectType === 'ATTACK') {
                const livingEnemies = state.enemies.filter(e => e.hp > 0);
                if (livingEnemies.length > 0) {
                    const targetEnemy = livingEnemies[0];
                    const damage = power;
                    const hurtEnemy = { ...targetEnemy, hp: Math.max(0, targetEnemy.hp - damage) };
                    spellUpdatedEnemies = spellUpdatedEnemies.map(e => e.id === hurtEnemy.id ? hurtEnemy : e);
                    spellLog.push(`${spellCaster.name} casts "${spellName}"! It deals ${damage} damage to ${hurtEnemy.name}.`);
                } else {
                    spellLog.push(`${spellCaster.name} casts "${spellName}" but there are no targets!`);
                }
            } else if (effectType === 'HEAL') {
                const healAmount = power;
                const healedCaster = { ...casterAfterCost, hp: Math.min(casterAfterCost.maxHp, casterAfterCost.hp + healAmount) };
                spellUpdatedAllies = [healedCaster, ...spellUpdatedAllies.slice(1)];
                spellLog.push(`${spellCaster.name} casts "${spellName}"! It heals for ${healAmount}.`);
            } else if (effectType === 'DEFEND') {
                spellLog.push(`${spellCaster.name} casts "${spellName}"! Defense increased (Placeholder).`);
            }

            // Apply mana cost to the caster in the updated array if not already handled by HEAL
            if (effectType !== 'HEAL') {
                spellUpdatedAllies = spellUpdatedAllies.map(a => a.id === casterAfterCost.id ? casterAfterCost : a);
            }

            return {
                ...state,
                allies: spellUpdatedAllies,
                enemies: spellUpdatedEnemies,
                log: spellLog,
                phase: 'resolveAction'
            };
        }

        case 'CHECK_WIN_LOSE':
            const alliesAlive = state.allies.some(c => c.hp > 0);
            const enemiesAlive = state.enemies.some(c => c.hp > 0);
            if (!alliesAlive) {
                return { ...state, phase: 'end', winner: 'enemy', log: [...state.log, 'You lose!'] };
            } else if (!enemiesAlive) {
                return { ...state, phase: 'end', winner: 'ally', log: [...state.log, 'You win!'] };
            }
            return state;

        case 'RESTART':
            return getInitialBattleState();

        default:
            return state;
    }
}