
import { BattleAction } from "../types";
import { WordEntry } from "../dictionaryApi";

export const SpellSystem = {
    calculateWordEffect: (wordData: WordEntry): BattleAction => {
        // Default to basic attack if no specific logic matches
        let actionType: 'ATTACK' | 'DEFEND' | 'HEAL' = 'ATTACK';
        let power = 10;
        let cost = 5;

        // Analyze first meaning
        const mainMeaning = wordData.meanings[0];
        const partOfSpeech = mainMeaning.partOfSpeech;

        // 1. Part of Speech Logic
        if (partOfSpeech === 'verb') {
            actionType = 'ATTACK';
            power = 15;
        } else if (partOfSpeech === 'noun') {
            actionType = 'DEFEND';
            power = 10; // Shield amount
        } else if (partOfSpeech === 'adjective') {
            actionType = 'HEAL';
            power = 12;
        }

        // 2. Word Length Bonus (Complexity)
        const length = wordData.word.length;
        if (length > 6) {
            power += (length - 6) * 2;
            cost += Math.floor((length - 6) / 2);
        }

        // 3. Keyword Matching (Elemental/Specific effects)
        const allDefinitions = mainMeaning.definitions.map((d: any) => d.definition.toLowerCase()).join(' ');

        if (allDefinitions.includes('fire') || allDefinitions.includes('burn') || allDefinitions.includes('flame')) {
            // Logic for elemental tags could be added here
            power += 5;
        }

        if (allDefinitions.includes('protect') || allDefinitions.includes('shield') || allDefinitions.includes('guard')) {
            actionType = 'DEFEND';
            power += 5;
        }

        if (allDefinitions.includes('health') || allDefinitions.includes('cure') || allDefinitions.includes('restore')) {
            actionType = 'HEAL';
            power += 5;
        }

        // Construct the BattleAction
        // Note: We need to adapt BattleAction type or make sure the reducer handles these custom actions.
        // For now, we map to existing types or generic 'CAST_SPELL'

        return {
            type: 'CAST_SPELL', // This needs to be handled in the reducer
            payload: {
                spellName: wordData.word,
                effectType: actionType,
                power: power,
                cost: cost
            }
        } as any; // Temporary cast until we update types
    }
};
