
import { WordEntry } from "@/lib/dictionaryApi";
import { AudioPlayer } from "./AudioPlayer";

interface WordDefinitionProps {
    data: WordEntry;
    onSearch: (word: string) => void;
}

export function WordDefinition({ data, onSearch }: WordDefinitionProps) {
    // Find the first audio url available
    const audioUrl = data.phonetics.find((p) => p.audio && p.audio.length > 0)?.audio || "";

    return (
        <div className="w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden border border-white/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-8 md:p-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-gray-100 pb-8">
                    <div>
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight font-serif mb-4">
                            {data.word}
                        </h1>
                        {data.phonetic && (
                            <p className="text-xl text-indigo-500 font-mono tracking-wide">
                                {data.phonetic}
                            </p>
                        )}
                    </div>
                    {audioUrl && <AudioPlayer audioUrl={audioUrl} />}
                </div>

                {/* Meanings Section */}
                <div className="space-y-12">
                    {data.meanings.map((meaning, index) => (
                        <div key={index} className="relative">
                            <div className="flex items-center gap-4 mb-6">
                                <span className="italic font-bold text-lg text-gray-900 bg-gray-100 px-4 py-1 rounded-full">
                                    {meaning.partOfSpeech}
                                </span>
                                <div className="h-px bg-gray-100 flex-grow"></div>
                            </div>

                            <ul className="space-y-8">
                                {meaning.definitions.map((def, idx) => (
                                    <li key={idx} className="group">
                                        <div className="flex gap-4">
                                            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2.5 group-hover:bg-indigo-600 transition-colors"></span>
                                            <div className="space-y-3">
                                                <p className="text-lg text-gray-700 leading-relaxed font-medium">
                                                    {def.definition}
                                                </p>
                                                {def.example && (
                                                    <p className="text-gray-500 italic pl-4 border-l-2 border-indigo-100 leading-relaxed">
                                                        "{def.example}"
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            {(meaning.synonyms.length > 0 || meaning.antonyms.length > 0) && (
                                <div className="mt-6 pl-6 space-y-3">
                                    {meaning.synonyms.length > 0 && (
                                        <div className="flex flex-wrap gap-2 text-sm">
                                            <span className="text-gray-400 uppercase tracking-wider text-xs font-semibold mr-2">Synonyms</span>
                                            {meaning.synonyms.slice(0, 5).map(syn => (
                                                <button
                                                    key={syn}
                                                    onClick={() => onSearch(syn)}
                                                    className="text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer hover:underline"
                                                >
                                                    {syn}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    {meaning.antonyms.length > 0 && (
                                        <div className="flex flex-wrap gap-2 text-sm">
                                            <span className="text-gray-400 uppercase tracking-wider text-xs font-semibold mr-2">Antonyms</span>
                                            {meaning.antonyms.slice(0, 5).map(ant => (
                                                <button
                                                    key={ant}
                                                    onClick={() => onSearch(ant)}
                                                    className="text-rose-500 hover:text-rose-700 transition-colors cursor-pointer hover:underline"
                                                >
                                                    {ant}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Source Footer */}
                {data.sourceUrls && data.sourceUrls.length > 0 && (
                    <div className="mt-16 pt-6 border-t border-gray-100 text-sm text-gray-400 flex flex-col md:flex-row gap-2">
                        <span>Source:</span>
                        <a href={data.sourceUrls[0]} target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-500 transition-colors truncate">
                            {data.sourceUrls[0]}
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
