
import React, { useState, useEffect } from "react";
import Search from "lucide-react/dist/esm/icons/search";
import Loader2 from "lucide-react/dist/esm/icons/loader-2";

interface GrimoireInputProps {
    onCast: (word: string) => void;
    isLoading: boolean;
    disabled?: boolean;
}

export function GrimoireInput({ onCast, isLoading, disabled }: GrimoireInputProps) {
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    // Debounce logic for instant search/cast preview could go here
    // For now, we want explicit casting for the game feel?
    // Actually, user said "Type 'Burn' -> Dictionary says...". 
    // Maybe "Enter" to cast is better for a game to feel deliberate.

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim() && !isLoading && !disabled) {
            onCast(query.trim());
            setQuery("");
        }
    };

    return (
        <div className={`relative w-full max-w-2xl mx-auto transition-all duration-500 ${isFocused ? 'scale-105' : 'scale-100'}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 rounded-2xl blur opacity-20 animate-pulse"></div>

            <form onSubmit={handleSubmit} className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    disabled={disabled || isLoading}
                    placeholder="Incant a word..."
                    className="w-full glass-panel text-amber-100 placeholder-amber-100/30 text-2xl font-serif py-6 pl-16 pr-6 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] border-transparent focus:border-yellow-500/30"
                    autoFocus
                />

                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-yellow-500">
                    {isLoading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <Search className="w-6 h-6 opacity-60" />
                    )}
                </div>

                <button
                    type="submit"
                    disabled={!query.trim() || isLoading || disabled}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 px-6 py-2 rounded-xl font-serif font-bold tracking-wider transition-all duration-300 ${query.trim() && !isLoading && !disabled
                            ? 'bg-gradient-to-r from-yellow-600 to-amber-600 text-white shadow-lg shadow-amber-900/40 hover:scale-105 active:scale-95'
                            : 'bg-slate-800/50 text-slate-500 cursor-not-allowed'
                        }`}
                >
                    CAST
                </button>
            </form>
        </div>
    );
}
