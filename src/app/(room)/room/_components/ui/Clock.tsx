'use client';

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function Clock() {
    const [time, setTime] = useState({
        hours: '',
        minutes: '',
        seconds: '',
        ampm: '',
        day: '',
        date: ''
    });
    
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const twelveHours = hours % 12 || 12;
            
            // Get day and date
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const day = days[now.getDay()];
            const date = now.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
            });
            
            setTime({
                hours: twelveHours.toString(),
                minutes,
                seconds,
                ampm,
                day,
                date
            });
        };
        
        updateTime(); // Initial update
        
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={cn("fixed top-20 right-8 z-20 text-white bg-stone-900/60 backdrop-blur-sm rounded-lg p-3 flex flex-col items-center shadow-lg border border-stone-700/50")}>
            <div className={cn("flex items-end")}>
                <span className={cn("text-4xl font-medium filter-green-glow")}>{time.hours}</span>
                <span className={cn("text-4xl font-medium filter-green-glow")}>:</span>
                <span className={cn("text-4xl font-medium filter-green-glow")}>{time.minutes}</span>
                <span className={cn("text-xl ml-1 mb-1 text-green-400")}>{time.ampm}</span>
                <span className={cn("text-sm ml-2 mb-1 text-stone-400")}>{time.seconds}</span>
            </div>
            <div className={cn("text-sm text-stone-300 mt-1")}>
                {time.day}, {time.date}
            </div>
        </div>
    );
} 