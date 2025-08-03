'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function Clock() {
  const [time, setTime] = useState({
    hours: '',
    minutes: '',
    seconds: '',
    ampm: '',
    day: '',
    date: '',
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
      const days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
      const day = days[now.getDay()];
      const date = now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      setTime({
        hours: twelveHours.toString(),
        minutes,
        seconds,
        ampm,
        day,
        date,
      });
    };

    updateTime(); // Initial update

    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={cn(
        'fixed top-20 right-8 z-20 flex flex-col items-center rounded-lg border border-stone-700/50 bg-stone-900/60 p-3 text-white shadow-lg backdrop-blur-sm',
      )}
    >
      <div className={cn('flex items-end')}>
        <span className={cn('filter-green-glow text-4xl font-medium')}>
          {time.hours}
        </span>
        <span className={cn('filter-green-glow text-4xl font-medium')}>:</span>
        <span className={cn('filter-green-glow text-4xl font-medium')}>
          {time.minutes}
        </span>
        <span className={cn('mb-1 ml-1 text-xl text-green-400')}>
          {time.ampm}
        </span>
        <span className={cn('mb-1 ml-2 text-sm text-stone-400')}>
          {time.seconds}
        </span>
      </div>
      <div className={cn('mt-1 text-sm text-stone-300')}>
        {time.day}, {time.date}
      </div>
    </div>
  );
}
