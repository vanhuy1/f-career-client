'use client';

import { cn } from "@/lib/utils";
import { useRef } from "react";
import { useAppDispatch } from "@/store/hooks";
import { useSelector } from "react-redux";
import { setVolume } from "@/services/state/roomSlice";
import { RootState } from "@/store/store";
import Icon from "./Icon";

interface VolumePropTypes {
    isActive: boolean;
    isMuted: boolean;
}

interface VolumeSettingProps {
    player: any;
    maxSetting?: number;
}

export default function VolumeSetting({ player, maxSetting = 10 }: VolumeSettingProps) {
    const dispatch = useAppDispatch();
    const volume = useSelector((state: RootState) => state.room.music.volume);
    const currentVolumeIndex = Math.round((volume / 100) * maxSetting);
    const previousVolumeRef = useRef<number>(volume > 0 ? volume : 50);
    
    const containerRef = useRef<HTMLDivElement>(null);

    const handleVolumeChange = (newVolume: number) => {
        const scaledVolume = Math.round(newVolume * 100);
        dispatch(setVolume(scaledVolume));
        if (player) {
            player.setVolume(scaledVolume);
        }
        if (scaledVolume > 0) {
            previousVolumeRef.current = scaledVolume;
        }
    };
    
    const handleToggleMute = () => {
        const newVolume = volume === 0 ? previousVolumeRef.current : 0;
        dispatch(setVolume(newVolume));
        if (player) {
            player.setVolume(newVolume);
        }
    };
    
    const handleDragVolume = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickPosition = e.clientX - rect.left;
        const newVolume = Math.min(Math.max(clickPosition / rect.width, 0), 1);
        handleVolumeChange(newVolume);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const newVolume = Math.min(Math.max(mouseX / rect.width, 0), 1);
        handleVolumeChange(newVolume);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        handleDragVolume(e);

        const handleMouseMoveWithRef = (event: MouseEvent) => handleMouseMove(event);

        window.addEventListener("mousemove", handleMouseMoveWithRef);
        window.addEventListener("mouseup", () => {
            window.removeEventListener("mousemove", handleMouseMoveWithRef);
        }, { once: true });
    };
    
    return (
        <div className={cn("flex items-center gap-2")}>
            <div onClick={handleToggleMute} className="cursor-pointer">
                {volume > 0 ? <Icon name="Volume" /> : <Icon className={cn("filter-red-glow")} name="Mute" />}
            </div>
            <div
                ref={containerRef}
                className={cn("flex gap-1 cursor-pointer")}
                onMouseDown={handleMouseDown}
            >
                {Array.from({ length: maxSetting }, (_, index) => (
                    <Volume
                        key={index}
                        isActive={index < currentVolumeIndex}
                        isMuted={volume === 0}
                    />
                ))}
            </div>
        </div>
    );
}

function Volume({ isActive, isMuted }: VolumePropTypes) {
    return (
        <span
            role="button"
            className={cn(
                "h-4 w-2",
                isMuted ? "filter-red-glow bg-slate-400" : isActive ? "bg-white filter-green-glow" : "bg-slate-400"
            )}
        ></span>
    );
} 