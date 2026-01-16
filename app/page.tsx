
"use client";

import { useState } from "react";
import { ClassSelection } from "./components/ClassSelection";
import { Arena } from "./components/Arena";
import { DictionaryModal } from "@/components/game/DictionaryModal";
import BookOpen from "lucide-react/dist/esm/icons/book-open";

export default function Home() {
  const [playerClass, setPlayerClass] = useState<"warrior" | "archer" | "mage" | null>(null);
  const [isGrimoireOpen, setIsGrimoireOpen] = useState(false);

  return (
    <>
      {/* Grimoire Toggle Button */}
      <button
        onClick={() => setIsGrimoireOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-700 hover:scale-105 transition-all duration-300 border-4 border-indigo-400/30 group"
        aria-label="Open Grimoire"
      >
        <BookOpen className="h-6 w-6 group-hover:rotate-12 transition-transform" />
      </button>

      {/* Dictionary Modal */}
      <DictionaryModal
        isOpen={isGrimoireOpen}
        onClose={() => setIsGrimoireOpen(false)}
      />

      {!playerClass ? (
        <ClassSelection onSelectClass={setPlayerClass} />
      ) : (
        <Arena playerClass={playerClass} onRestart={() => setPlayerClass(null)} />
      )}
    </>
  );
}
