'use client';

import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Icon from "./Icon";
import { useAppDispatch } from "@/store/hooks";
import { setIsPlaying, setVolume } from "@/services/state/roomSlice";
import { Volume2, VolumeX } from "lucide-react";
import { useState } from "react";

export default function Music() {
    const musicState = useSelector((state: RootState) => state.room.music);
    const dispatch = useAppDispatch();
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    
    const togglePlay = () => {
        dispatch(setIsPlaying(!musicState.isPlaying));
    };
    
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseInt(e.target.value, 10);
        dispatch(setVolume(newVolume));
    };
    
    const toggleMute = () => {
        if (musicState.volume > 0) {
            dispatch(setVolume(0));
        } else {
            dispatch(setVolume(50));
        }
    };
    
    if (!musicState.currentTrack) {
        return null;
    }
    
    const isYouTubeVideo = musicState.currentTrack.id.startsWith('custom-');
    
    return (
        <div className={cn("absolute bottom-0 left-0 w-full z-10 p-4")}>
            <div className={cn("flex items-center gap-4 bg-black/30 backdrop-blur-sm p-3 rounded-lg max-w-md")}>
                <button 
                    onClick={togglePlay}
                    className={cn("p-2 rounded-full bg-stone-800/60 hover:bg-stone-700/60 transition-colors")}
                >
                    <Icon name={musicState.isPlaying ? "Pause" : "Play"} />
                </button>
                
                <div className="flex-1 overflow-hidden">
                    <p className={cn("text-white filter-green-glow text-sm truncate")}>
                        {musicState.currentTrack?.name || 'No track selected'}
                    </p>
                    {isYouTubeVideo && (
                        <p className="text-xs text-gray-400">YouTube Video</p>
                    )}
                </div>
                
                {/* Volume Control */}
                <div className="relative flex items-center">
                    <button 
                        onClick={toggleMute}
                        onMouseEnter={() => setShowVolumeSlider(true)}
                        className="p-2 rounded-full bg-stone-800/60 hover:bg-stone-700/60 transition-colors mr-2"
                    >
                        {musicState.volume === 0 ? (
                            <VolumeX className="h-4 w-4 text-gray-400" />
                        ) : (
                            <Volume2 className="h-4 w-4 text-green-400" />
                        )}
                    </button>
                    
                    {/* Volume slider that appears on hover */}
                    {showVolumeSlider && (
                        <div 
                            className="absolute bottom-full mb-2 bg-stone-900 p-2 rounded-md flex items-center gap-2"
                            onMouseLeave={() => setShowVolumeSlider(false)}
                        >
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={musicState.volume}
                                onChange={handleVolumeChange}
                                className="w-24 h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                            />
                            <span className="text-xs text-gray-300 w-6 text-right">{musicState.volume}%</span>
                        </div>
                    )}
                
                    <div className={cn("flex items-center gap-1")}>
                        {Array.from({ length: 5 }, (_, i) => (
                            <span 
                                key={i}
                                className={cn(
                                    "h-3 w-1", 
                                    musicState.isPlaying 
                                        ? "bg-green-500 filter-green-glow animate-pulse" 
                                        : "bg-stone-500"
                                )}
                                style={{ 
                                    animationDelay: `${i * 0.1}s`,
                                    animationDuration: `${0.5 + Math.random() * 0.5}s`
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
} 