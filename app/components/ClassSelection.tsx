import React from 'react';

interface ClassSelectionProps {
    onSelectClass: (classType: 'warrior' | 'archer' | 'mage') => void;
}

export const ClassSelection: React.FC<ClassSelectionProps> = ({ onSelectClass }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[url('/bg-stars.png')] opacity-20 animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-[#0f172a]"></div>

            <h1 className="text-5xl md:text-7xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600 mb-4 z-10 animate-float drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                Lexicon Legends
            </h1>
            <p className="text-gray-400 mb-12 text-lg font-light tracking-widest z-10">CHOOSE YOUR ORIGIN</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 z-10 max-w-6xl w-full px-8">
                {[
                    { id: 'warrior', name: 'Warlord', desc: 'Masters of force. Common words hit harder.', color: 'from-red-900/80 to-red-600/20' },
                    { id: 'archer', name: 'Ranger', desc: 'Precision strikes. Fast typing bonuses.', color: 'from-green-900/80 to-green-600/20' },
                    { id: 'mage', name: 'Scholar', desc: 'Knowledge is power. Complex words amplify spells.', color: 'from-blue-900/80 to-blue-600/20' }
                ].map((cls) => (
                    <button
                        key={cls.id}
                        onClick={() => onSelectClass(cls.id as any)}
                        className={`group relative h-96 rounded-3xl glass-panel p-8 flex flex-col items-center justify-center transition-all duration-500 hover:scale-105 hover:bg-slate-800/80 border border-white/5 hover:border-yellow-500/50`}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-b ${cls.color} opacity-0 group-hover:opacity-40 transition-opacity duration-700 rounded-3xl`}></div>
                        <h2 className="text-3xl font-serif text-gray-200 group-hover:text-yellow-400 transition-colors mb-4">{cls.name}</h2>
                        <div className="w-12 h-0.5 bg-gray-700 group-hover:bg-yellow-500 transition-colors mb-6"></div>
                        <p className="text-center text-gray-400 group-hover:text-gray-200 font-light leading-relaxed">
                            {cls.desc}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
};