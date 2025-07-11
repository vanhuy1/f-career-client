'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setScenes, setSelectedScene, setMusicTracks } from '@/services/state/roomSlice';
import { initialScenes, initialMusicTracks } from '../utils/initialData';

export function useRoomInit() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initialize scenes
    dispatch(setScenes(initialScenes));
    if (initialScenes.length > 0) {
      dispatch(setSelectedScene(initialScenes[0]));
    }

    // Initialize music tracks
    dispatch(setMusicTracks(initialMusicTracks));
  }, [dispatch]);
} 