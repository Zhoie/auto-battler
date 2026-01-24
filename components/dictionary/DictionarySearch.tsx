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
        <form onSubmit={handleSubmit} className="w-full">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-[18px] w-[18px] text-gray-500 opacity-70" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-9 pr-3 py-2.5 bg-[#E3E3E8] rounded-xl text-[17px] leading-5 placeholder-gray-500 text-black focus:outline-none focus:bg-[#d8d8dc] transition-colors appearance-none"
                    placeholder="Search"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="absolute right-2 top-2 p-1 text-[#007AFF] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center ios-active"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-[#007AFF]/30 border-t-[#007AFF] rounded-full animate-spin" />
                    ) : (
                        <span className="sr-only">Search</span>
                    )}
                </button>
            </div>
        </form>
    );
}
