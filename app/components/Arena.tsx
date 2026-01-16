
'use client';

import React, { useReducer, useEffect, useState } from 'react';
// import { ArenaProps } from '../types'; // Removed as it is defined locally or not needed from incorrect path
import { battleReducer, getInitialBattleState } from '../../lib/battle/battleReducer';
import { GrimoireInput } from './GrimoireInput';
import { fetchWordDefinition } from '../../lib/dictionaryApi';
import { SpellSystem } from '../../lib/battle/SpellSystem';
import Loader2 from "lucide-react/dist/esm/icons/loader-2";

interface ArenaProps {
    playerClass: 'warrior' | 'archer' | 'mage';
    onRestart: () => void;
}

export const Arena: React.FC<ArenaProps> = ({ playerClass, onRestart }) => {
    const [state, dispatch] = useReducer(battleReducer, getInitialBattleState());
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (state.phase === 'setup') {
            dispatch({ type: 'START_BATTLE', playerClass });
        }
    }, [playerClass]);

    useEffect(() => {
        if (state.phase === 'enemyTurn') {
            // Perform enemy AI
            setTimeout(() => dispatch({ type: 'PERFORM_ENEMY_AI' }), 1000);
        } else if (state.phase === 'resolveAction') {
            // After resolve, advance turn
            setTimeout(() => {
                dispatch({ type: 'ADVANCE_TURN' });
                dispatch({ type: 'CHECK_WIN_LOSE' });
            }, 1000);
        }
    }, [state.phase]);

    const handleCast = async (word: string) => {
        setIsProcessing(true);
        try {
            const data = await fetchWordDefinition(word);
            if (data && data.length > 0) {
                // Determine effect
                const action = SpellSystem.calculateWordEffect(data[0]);
                dispatch(action);
            } else {
                // Fizzle
                alert("The grimoire stays silent... (Word not found)");
                // Penalize slightly or just waste time?
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsProcessing(false);
        }
    };

    const player = state.allies[0];
    // const activeUnit = [...state.allies, ...state.enemies].find(c => c.id === state.activeUnitId);

    // Helper to render health bars
    const renderBar = (current: number, max: number, color: string) => (
        <div className="h-2 w-full bg-slate-700/50 rounded-full overflow-hidden">
            <div
                className={`h-full ${color} transition-all duration-500`}
                style={{ width: `${(current / max) * 100}%` }}
            ></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0f172a] text-white p-4 flex flex-col items-center relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[url('/bg-stars.png')] opacity-10 animate-pulse pointer-events-none"></div>

            {/* Header / Combat Log */}
            <div className="w-full max-w-4xl mt-8 mb-8 z-10">
                <div className="glass-panel p-4 rounded-2xl h-32 overflow-y-auto custom-scrollbar flex flex-col-reverse">
                    {state.log.slice().reverse().map((msg, i) => (
                        <div key={i} className={`mb-1 ${i === 0 ? 'text-yellow-400 font-bold' : 'text-gray-400'}`}>
                            {i === 0 ? '> ' : ''}{msg}
                        </div>
                    ))}
                </div>
            </div>

            {/* Battle Area */}
            <div className="flex-1 w-full max-w-6xl flex justify-between items-center z-10 px-4 mb-24">
                {/* Allies */}
                <div className="space-y-4">
                    {state.allies.map(ally => (
                        <div key={ally.id} className="relative glass-panel p-6 rounded-3xl w-64 border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.15)] animate-float">
                            <h3 className="text-xl font-serif text-blue-200 mb-2">{ally.name}</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-red-300">
                                    <span>HP</span>
                                    <span>{ally.hp}/{ally.maxHp}</span>
                                </div>
                                {renderBar(ally.hp, ally.maxHp, 'bg-red-500')}

                                <div className="flex justify-between text-xs text-blue-300">
                                    <span>Mana</span>
                                    <span>{ally.mana}/{ally.maxMana}</span>
                                </div>
                                {renderBar(ally.mana, ally.maxMana, 'bg-blue-500')}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Enemies */}
                <div className="space-y-4">
                    {state.enemies.map(enemy => (
                        <div key={enemy.id} className={`relative glass-panel p-6 rounded-3xl w-64 border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.15)] animate-float transition-all duration-300 ${enemy.hp === 0 ? 'opacity-50 grayscale scale-95' : ''}`}>
                            <h3 className="text-xl font-serif text-red-200 mb-2">{enemy.name}</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-red-300">
                                    <span>HP</span>
                                    <span>{enemy.hp}/{enemy.maxHp}</span>
                                </div>
                                {renderBar(enemy.hp, enemy.maxHp, 'bg-red-600')}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Grimoire / Input Area */}
            <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#0f172a] to-transparent z-20">
                {state.phase === 'end' ? (
                    <div className="text-center">
                        <h2 className={`text-4xl font-serif mb-6 ${state.winner === 'ally' ? 'text-yellow-400' : 'text-red-500'}`}>
                            {state.winner === 'ally' ? 'Victory!' : 'Defeat'}
                        </h2>
                        <button
                            onClick={onRestart}
                            className="bg-yellow-600 hover:bg-yellow-500 text-white px-8 py-3 rounded-xl text-lg font-bold shadow-lg transition-all"
                        >
                            Reincarnate
                        </button>
                    </div>
                ) : (
                    <div className="max-w-xl mx-auto">
                        <GrimoireInput
                            onCast={handleCast}
                            isLoading={isProcessing || state.phase !== 'playerSelectAction'}
                            disabled={state.phase !== 'playerSelectAction'}
                        />
                        <p className="text-center text-gray-500 text-sm mt-4">
                            {state.phase === 'playerSelectAction' ? 'It is your turn. Cast a spell.' : 'The enemy is plotting...'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};