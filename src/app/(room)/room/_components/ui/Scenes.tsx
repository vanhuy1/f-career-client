'use client';

import { useSelector } from 'react-redux';
import { cn } from '@/lib/utils';
import { RootState } from '@/store/store';

export default function Scenes() {
  const selectedScene = useSelector(
    (state: RootState) => state.room.scene.selectedScene,
  );

  if (!selectedScene) {
    return (
      <div
        className={cn(
          'absolute inset-0 z-0 flex items-center justify-center overflow-hidden bg-black',
        )}
      >
        <p className="text-xl text-white">No scene selected</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'absolute inset-0 z-0 flex items-center justify-center overflow-hidden',
      )}
    >
      <img
        className={cn(
          'h-full w-full object-cover transition-all duration-500 ease-in-out',
        )}
        src={selectedScene.image}
        alt={selectedScene.name}
      />
    </div>
  );
}
