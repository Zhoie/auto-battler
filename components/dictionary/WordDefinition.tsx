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
        <div className="ios-card overflow-hidden">
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-gray-100">
                <div className="flex flex-col">
                    <h2 className="text-[22px] font-bold text-black tracking-tight leading-tight">
                        {data.word}
                    </h2>
                    {data.phonetic && (
                        <p className="text-[17px] text-[#007AFF] font-medium mt-0.5">
                            {data.phonetic}
                        </p>
                    )}
                </div>
                {audioUrl && <AudioPlayer audioUrl={audioUrl} />}
            </div>

            {/* Meanings */}
            <div className="divide-y divide-gray-100 pl-4">
                {data.meanings.map((meaning, index) => (
                    <div key={index} className="py-4 pr-4">
                        <div className="mb-2">
                            <span className="text-[15px] font-semibold text-black italic">
                                {meaning.partOfSpeech}
                            </span>
                        </div>

                        <ul className="space-y-3">
                            {meaning.definitions.map((def, idx) => (
                                <li key={idx} className="text-[17px] leading-relaxed text-black">
                                    <span className="text-gray-400 mr-2">•</span>
                                    {def.definition}
                                    {def.example && (
                                        <p className="mt-1 text-gray-500 text-[15px]">
                                            "{def.example}"
                                        </p>
                                    )}
                                </li>
                            ))}
                        </ul>

                        {/* Synonyms / Antonyms could go here as chips */}
                    </div>
                ))}
            </div>

            {/* Source Footer */}
            {data.sourceUrls && data.sourceUrls.length > 0 && (
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 text-[13px] text-gray-400 flex items-center gap-2 truncate">
                    <span>Source:</span>
                    <a href={data.sourceUrls[0]} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#007AFF] transition-colors truncate">
                        {data.sourceUrls[0]}
                    </a>
                </div>
            )}
        </div>
    );
}
