import Volume2 from "lucide-react/dist/esm/icons/volume-2";
import Play from "lucide-react/dist/esm/icons/play";
import { useRef, useState } from "react";

interface AudioPlayerProps {
    audioUrl: string;
}

export function AudioPlayer({ audioUrl }: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                setIsPlaying(false);
            } else {
                audioRef.current.play().catch((err) => {
                    console.error("Audio playback failed:", err);
                    setIsPlaying(false);
                });
                setIsPlaying(true);
            }
        }
    };

    const handleEnded = () => {
        setIsPlaying(false);
    }

    if (!audioUrl) return null;

    return (
        <div className="inline-flex items-center">
            <button
                onClick={togglePlay}
                className="p-2 rounded-full bg-[#007AFF]/10 text-[#007AFF] hover:bg-[#007AFF]/20 active:bg-[#007AFF]/30 transition-colors ios-active"
                aria-label="Play pronunciation"
            >
                {isPlaying ? <Volume2 className="h-5 w-5 animate-pulse" /> : <Volume2 className="h-5 w-5" />}
            </button>
            <audio ref={audioRef} src={audioUrl} onEnded={handleEnded} className="hidden" />
        </div>
    );
}
