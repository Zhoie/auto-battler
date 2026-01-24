"use client";

import { useState } from "react";
import { DictionarySearch } from "@/components/dictionary/DictionarySearch";
import { WordDefinition } from "@/components/dictionary/WordDefinition";
import { fetchWordDefinition, WordEntry } from "@/lib/dictionaryApi";

export default function Home() {
  const [data, setData] = useState<WordEntry[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (word: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchWordDefinition(word);
      if (result) {
        setData(result);
      } else {
        setError("Word not found.");
        setData(null);
      }
    } catch (err) {
      setError("Failed to fetch definition.");
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen pb-20 md:pt-20 pt-14 px-5 max-w-2xl mx-auto">
      <div className="mb-5">
        <h1 className="text-[34px] font-bold text-black tracking-tight">
          Dictionary
        </h1>
      </div>

      <DictionarySearch onSearch={handleSearch} isLoading={isLoading} />

      {error && (
        <div className="mt-6 p-4 rounded-xl bg-gray-200/50 text-gray-500 text-center font-medium">
          {error}
        </div>
      )}

      {data && data.length > 0 && (
        <div className="mt-6 space-y-5">
          {data.map((entry, idx) => (
            <div key={idx}>
              <WordDefinition data={entry} onSearch={handleSearch} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
