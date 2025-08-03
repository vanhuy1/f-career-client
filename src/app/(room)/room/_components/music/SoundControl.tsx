'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import Icon from '../ui/Icon';
import IconButton from '../ui/IconButton';
import { useLocalStorageState } from '../../hooks/useLocalStorage';

interface Sound {
  id: string;
  name: string;
  icon: string;
  file: string;
}

const SOUNDS: Sound[] = [
  { id: 'rain', name: 'Rain', icon: 'Rain', file: '/sound/rain.mp3' },
  { id: 'wind', name: 'Wind', icon: 'Wind', file: '/sound/wind.mp3' },
  { id: 'fire', name: 'Fire', icon: 'Fire', file: '/sound/fire.mp3' },
  { id: 'bird', name: 'Birds', icon: 'Bird', file: '/sound/bird.mp3' },
  { id: 'grass', name: 'Grass', icon: 'Grass', file: '/sound/grass.mp3' },
];

export default function SoundControl() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSounds, setActiveSounds] = useLocalStorageState<
    Record<string, { active: boolean; volume: number }>
  >(
    SOUNDS.reduce(
      (acc, sound) => ({ ...acc, [sound.id]: { active: false, volume: 50 } }),
      {},
    ),
    'study-room-sounds',
  );

  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});

  // Initialize audio elements
  useEffect(() => {
    const currentAudioRefs: Record<string, HTMLAudioElement | null> = {};

    SOUNDS.forEach((sound) => {
      if (typeof window !== 'undefined') {
        const audio = new Audio(sound.file);
        audio.loop = true;
        currentAudioRefs[sound.id] = audio;
        audioRefs.current[sound.id] = audio;
      }
    });

    return () => {
      // Cleanup audio elements
      Object.values(currentAudioRefs).forEach((audio) => {
        if (audio) {
          audio.pause();
          audio.src = '';
        }
      });
    };
  }, []);

  // Update audio playback and volume when activeSounds change
  useEffect(() => {
    Object.entries(activeSounds).forEach(([id, settings]) => {
      const audio = audioRefs.current[id];
      if (audio) {
        if (settings.active) {
          audio.volume = settings.volume / 100;
          audio
            .play()
            .catch((err) => console.error('Error playing audio:', err));
        } else {
          audio.pause();
        }
      }
    });
  }, [activeSounds]);

  const toggleSound = (id: string) => {
    setActiveSounds((prev) => ({
      ...prev,
      [id]: { ...prev[id], active: !prev[id].active },
    }));
  };

  const updateVolume = (id: string, volume: number) => {
    setActiveSounds((prev) => ({
      ...prev,
      [id]: { ...prev[id], volume },
    }));
  };

  return (
    <div className="relative">
      <IconButton
        icon="Volume"
        label="Sounds"
        onClick={() => setIsOpen(!isOpen)}
        isActive={isOpen || Object.values(activeSounds).some((s) => s.active)}
      />

      {isOpen && (
        <div className="absolute top-full right-0 z-50 mt-2 w-64 rounded-lg border border-stone-700/50 bg-stone-900/95 p-3 shadow-lg backdrop-blur-sm">
          <h3 className="mb-3 text-sm font-medium text-white">Sounds</h3>

          <div className="space-y-3">
            {SOUNDS.map((sound) => (
              <div key={sound.id} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleSound(sound.id)}
                    className={cn(
                      'flex items-center gap-2 text-sm',
                      activeSounds[sound.id].active
                        ? 'text-green-400'
                        : 'text-stone-400 hover:text-white',
                    )}
                  >
                    <Icon name={sound.icon} />
                    <span>{sound.name}</span>
                  </button>

                  {activeSounds[sound.id].active && (
                    <span className="text-xs text-stone-400">
                      {activeSounds[sound.id].volume}%
                    </span>
                  )}
                </div>

                {activeSounds[sound.id].active && (
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={activeSounds[sound.id].volume}
                    onChange={(e) =>
                      updateVolume(sound.id, parseInt(e.target.value))
                    }
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-stone-700 accent-green-500"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between border-t border-stone-700/50 pt-3">
            <button
              onClick={() => {
                const allActive = Object.values(activeSounds).every(
                  (s) => s.active,
                );
                const newState = !allActive;

                setActiveSounds(
                  Object.keys(activeSounds).reduce(
                    (acc, id) => ({
                      ...acc,
                      [id]: { ...activeSounds[id], active: newState },
                    }),
                    {},
                  ),
                );
              }}
              className="text-xs text-stone-400 hover:text-white"
            >
              {Object.values(activeSounds).every((s) => s.active)
                ? 'Mute All'
                : 'Play All'}
            </button>

            <button
              onClick={() => setIsOpen(false)}
              className="text-xs text-stone-400 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
