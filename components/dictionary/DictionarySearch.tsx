import Search from "lucide-react/dist/esm/icons/search";
import { useState, useEffect } from "react";

interface DictionarySearchProps {
    onSearch: (word: string) => void;
    isLoading: boolean;
}

export function DictionarySearch({ onSearch, isLoading }: DictionarySearchProps) {
    const [input, setInput] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            if (input.trim()) {
                onSearch(input.trim());
            }
        }, 500); // Debounce for 500ms

        return () => clearTimeout(timer);
    }, [input, onSearch]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            onSearch(input.trim());
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto mb-8">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-100 rounded-full leading-5 bg-white/50 backdrop-blur-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 sm:text-sm shadow-sm transition-all duration-300"
                    placeholder="Search for a word..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="absolute right-2 top-2 p-1.5 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <svg className="w-5 h-5 transform -rotate-45 translate-y-[1px] -translate-x-[1px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    )}
                </button>
            </div>
        </form>
    );
}
