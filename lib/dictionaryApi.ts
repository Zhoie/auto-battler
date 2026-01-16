
export interface Phonetic {
    text: string;
    audio: string;
    sourceUrl?: string;
    license?: {
        name: string;
        url: string;
    };
}

export interface Definition {
    definition: string;
    synonyms: string[];
    antonyms: string[];
    example?: string;
}

export interface Meaning {
    partOfSpeech: string;
    definitions: Definition[];
    synonyms: string[];
    antonyms: string[];
}

export interface WordEntry {
    word: string;
    phonetic: string;
    phonetics: Phonetic[];
    meanings: Meaning[];
    license: {
        name: string;
        url: string;
    };
    sourceUrls: string[];
}

export async function fetchWordDefinition(word: string): Promise<WordEntry[] | null> {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            throw new Error('Failed to fetch definition');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Dictionary API Error:", error);
        throw error;
    }
}
