
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
                audioRef.current.play();
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
                className="p-3 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                aria-label="Play pronunciation"
            >
                {isPlaying ? <Volume2 className="h-6 w-6 animate-pulse" /> : <Play className="h-6 w-6 fill-current" />}
            </button>
            <audio ref={audioRef} src={audioUrl} onEnded={handleEnded} className="hidden" />
        </div>
    );
}
