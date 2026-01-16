
import { useState } from "react";
import { DictionarySearch } from "@/components/dictionary/DictionarySearch";
import { WordDefinition } from "@/components/dictionary/WordDefinition";
import { fetchWordDefinition, WordEntry } from "@/lib/dictionaryApi";
import BookOpen from "lucide-react/dist/esm/icons/book-open";
import X from "lucide-react/dist/esm/icons/x";

interface DictionaryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function DictionaryModal({ isOpen, onClose }: DictionaryModalProps) {
    const [wordData, setWordData] = useState<WordEntry | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (word: string) => {
        setIsLoading(true);
        setError(null);
        setWordData(null);
        setHasSearched(true);

        try {
            const data = await fetchWordDefinition(word);
            if (data && data.length > 0) {
                setWordData(data[0]);
            } else {
                setError(`No definition found for "${word}".`);
            }
        } catch (err) {
            setError("An error occurred while fetching the definition. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-5xl h-[90vh] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
                            <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 font-serif">Grimoire</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Modal Body - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-gradient-to-br from-indigo-50/50 via-purple-50/50 to-pink-50/50">
                    <div className="max-w-3xl mx-auto space-y-8">
                        <div className={`text-center transition-all duration-500 ${hasSearched ? 'mt-0' : 'mt-[15vh]'}`}>
                            {!hasSearched && (
                                <p className="text-gray-500 mb-6 font-light">
                                    Consult the ancient texts...
                                </p>
                            )}
                            <DictionarySearch onSearch={handleSearch} isLoading={isLoading} />
                        </div>

                        <div className="transition-all duration-500 ease-in-out">
                            {isLoading && (
                                <div className="flex flex-col items-center justify-center py-20 text-indigo-400">
                                    <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                                    <p className="animate-pulse font-medium">Searching...</p>
                                </div>
                            )}

                            {error && (
                                <div className="max-w-md mx-auto bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center shadow-lg animate-in zoom-in-95 duration-300">
                                    <p className="font-medium">{error}</p>
                                </div>
                            )}

                            {!isLoading && wordData && (
                                <WordDefinition data={wordData} onSearch={handleSearch} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
