'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useAppDispatch } from '@/store/hooks';
import { setSelectedScene } from '@/services/state/roomSlice';
import Modal from './Modal';
import IconButton from './IconButton';

export default function SceneSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const scenes = useSelector((state: RootState) => state.room.scene.scenes);
  const selectedScene = useSelector((state: RootState) => state.room.scene.selectedScene);
  const dispatch = useAppDispatch();
  
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  
  const handleSelectScene = (scene: any) => {
    dispatch(setSelectedScene(scene));
    handleClose();
  };
  
  return (
    <>
      <IconButton
        icon="MultiImage"
        label="Change Scene"
        onClick={handleOpen}
        isActive={isOpen}
      />
      
      <Modal 
        isOpen={isOpen} 
        onClose={handleClose}
        title="Select Background"
        size="lg"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-2">
          {scenes.map((scene) => (
            <button
              key={scene.id}
              onClick={() => handleSelectScene(scene)}
              className={cn(
                "relative overflow-hidden rounded-lg border-2 transition-all",
                selectedScene?.id === scene.id 
                  ? "border-green-500 shadow-lg shadow-green-500/20" 
                  : "border-transparent hover:border-white/30"
              )}
            >
              <img 
                src={scene.image} 
                alt={scene.name}
                className="w-full aspect-video object-cover"
              />
              <div className={cn(
                "absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1",
                selectedScene?.id === scene.id && "bg-green-900/70"
              )}>
                <p className="text-white text-sm truncate">{scene.name}</p>
              </div>
            </button>
          ))}
        </div>
      </Modal>
    </>
  );
} 