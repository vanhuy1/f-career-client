'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useAppDispatch } from '@/store/hooks';
import {
  setCurrentTrack,
  setIsPlaying,
  setMusicTracks,
  setVolume,
} from '@/services/state/roomSlice';
import Modal from './Modal';
import Icon from './Icon';
import IconButton from './IconButton';
import { Volume2, VolumeX } from 'lucide-react';

interface YouTubePlayer {
  loadVideoById: (videoId: string) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  setVolume: (volume: number) => void;
  destroy: () => void;
}

interface YouTubeEvent {
  data: number;
  target: YouTubePlayer;
}

interface Track {
  id: string;
  name: string;
  url: string;
}

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        options: {
          videoId: string;
          playerVars: Record<string, string | number>;
          events: {
            onReady: (event: { target: YouTubePlayer }) => void;
            onStateChange: (event: YouTubeEvent) => void;
            onError: (event: unknown) => void;
          };
        },
      ) => YouTubePlayer;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function MusicSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [isApiReady, setIsApiReady] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [isAddingTrack, setIsAddingTrack] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  const tracks = useSelector((state: RootState) => state.room.music.tracks);
  const currentTrack = useSelector(
    (state: RootState) => state.room.music.currentTrack,
  );
  const isPlaying = useSelector(
    (state: RootState) => state.room.music.isPlaying,
  );
  const volume = useSelector((state: RootState) => state.room.music.volume);
  const dispatch = useAppDispatch();

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  // Initialize YouTube API
  useEffect(() => {
    // Clean up any existing YouTube API scripts
    const existingScript = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]',
    );
    if (existingScript) {
      existingScript.remove();
    }

    // Reset player state
    if (player) {
      try {
        player.destroy();
      } catch (error) {
        console.error('Error destroying player:', error);
      }
      setPlayer(null);
    }

    // Create a new script element
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;

    // Define the callback function
    window.onYouTubeIframeAPIReady = () => {
      console.log('YouTube API Ready');
      setIsApiReady(true);
    };

    // Add the script to the document
    document.body.appendChild(script);

    // Clean up on unmount
    return () => {
      if (player) {
        try {
          player.destroy();
        } catch (error) {
          console.error('Error destroying player:', error);
        }
      }

      const scriptTag = document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]',
      );
      if (scriptTag) scriptTag.remove();

      // Clean up the global callback
      if (window.onYouTubeIframeAPIReady) {
        // Use type assertion instead of any
        window.onYouTubeIframeAPIReady = undefined as unknown as () => void;
      }
    };
  }, [player]); // Add player to dependency array

  // Initialize player when API is ready and current track changes
  useEffect(() => {
    if (isApiReady && currentTrack?.url) {
      if (player && player.loadVideoById) {
        try {
          player.loadVideoById(currentTrack.url);
          if (isPlaying) {
            player.playVideo();
          } else {
            player.pauseVideo();
          }
          // Set volume when player is ready
          player.setVolume(volume);
        } catch (error) {
          console.error('Error with YouTube player:', error);
          // Recreate player if there was an error
          setPlayer(null);
        }
      } else {
        try {
          const newPlayer = new window.YT.Player('youtube-player', {
            videoId: currentTrack.url,
            playerVars: {
              autoplay: isPlaying ? 1 : 0,
              loop: 1,
              playlist: String(currentTrack.url),
              controls: 0,
              modestbranding: 1,
              rel: 0,
              showinfo: 0,
              fs: 0,
              iv_load_policy: 3,
              cc_load_policy: 0,
              disablekb: 1,
            },
            events: {
              onReady: (event: { target: YouTubePlayer }) => {
                console.log('YouTube player ready');
                event.target.setVolume(volume);
              },
              onStateChange: (event: YouTubeEvent) => {
                // Don't directly update state here to prevent infinite loops
                // Only update state if there's an actual change needed
                if (
                  event.data === window.YT.PlayerState.PLAYING &&
                  !isPlaying
                ) {
                  dispatch(setIsPlaying(true));
                } else if (
                  event.data === window.YT.PlayerState.PAUSED &&
                  isPlaying
                ) {
                  dispatch(setIsPlaying(false));
                }
              },
              onError: (event: unknown) => {
                console.error('YouTube player error:', event);
              },
            },
          });
          setPlayer(newPlayer);
        } catch (error) {
          console.error('Error creating YouTube player:', error);
        }
      }
    }
  }, [isApiReady, currentTrack, isPlaying, dispatch, volume]);

  // Update player volume when volume state changes
  useEffect(() => {
    if (player && player.setVolume) {
      try {
        player.setVolume(volume);
      } catch (error) {
        console.error('Error setting volume:', error);
      }
    }
  }, [volume, player]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value, 10);
    dispatch(setVolume(newVolume));
  };

  const toggleMute = () => {
    if (volume > 0) {
      // Store current volume before muting
      dispatch(setVolume(0));
    } else {
      // Restore to default volume or last volume
      dispatch(setVolume(50));
    }
  };

  const handleSelectTrack = (track: Track) => {
    dispatch(setCurrentTrack(track));
    dispatch(setIsPlaying(true));
    handleClose();
  };

  // Extract YouTube video ID from URL
  const extractYoutubeId = (url: string) => {
    try {
      // Handle various YouTube URL formats
      const regExps = [
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/,
        /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/,
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/,
      ];

      // Try the first two regex patterns that extract ID from different positions
      for (let i = 0; i < 2; i++) {
        const match = url.match(regExps[i]);
        if (match && (match[2]?.length === 11 || match[7]?.length === 11)) {
          return match[2] || match[7];
        }
      }

      // For URLs that match the YouTube domain but not the specific patterns
      if (url.match(regExps[2])) {
        // Try to extract ID from URL parameters
        const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
        if (
          urlObj.hostname.includes('youtube.com') ||
          urlObj.hostname.includes('youtu.be')
        ) {
          // Get from youtube.com/?v=ID
          const searchParams = new URLSearchParams(urlObj.search);
          const videoId = searchParams.get('v');
          if (videoId?.length === 11) return videoId;

          // Get from youtu.be/ID
          if (urlObj.hostname.includes('youtu.be')) {
            const pathId = urlObj.pathname.substring(1);
            if (pathId?.length === 11) return pathId;
          }
        }
      }
    } catch (error) {
      console.error('Error parsing YouTube URL:', error);
    }

    return null;
  };

  // Fetch YouTube video title
  const fetchVideoTitle = async (videoId: string) => {
    try {
      // Use oEmbed API to get video info (no API key required)
      const response = await fetch(
        `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`,
      );
      const data = await response.json();
      return data.title || `YouTube Video (${videoId})`;
    } catch (error) {
      console.error('Error fetching video title:', error);
      return `YouTube Video (${videoId})`;
    }
  };

  // Handle adding a new YouTube track
  const handleAddYoutubeTrack = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset error state
    setUrlError('');

    // Trim the URL
    const trimmedUrl = youtubeUrl.trim();
    if (!trimmedUrl) {
      setUrlError('Please enter a YouTube URL');
      return;
    }

    // Extract video ID from URL
    const videoId = extractYoutubeId(trimmedUrl);

    if (!videoId) {
      setUrlError(
        'Invalid YouTube URL. Please enter a valid YouTube video URL.',
      );
      return;
    }

    // Check if this video is already in the tracks list
    const existingTrack = tracks.find((track) => track.url === videoId);
    if (existingTrack) {
      // If it exists, just select it instead of adding a duplicate
      dispatch(setCurrentTrack(existingTrack));
      dispatch(setIsPlaying(true));
      setYoutubeUrl('');
      handleClose();
      return;
    }

    setIsAddingTrack(true);

    try {
      // Get video title
      const videoTitle = await fetchVideoTitle(videoId);

      // Create new track
      const newTrack = {
        id: `custom-${Date.now()}`,
        name: videoTitle || `YouTube Video (${videoId})`,
        url: videoId,
      };

      // Add to tracks list
      const updatedTracks = [...tracks, newTrack];
      dispatch(setMusicTracks(updatedTracks));

      // Select the new track
      dispatch(setCurrentTrack(newTrack));
      dispatch(setIsPlaying(true));

      // Reset form and close modal
      setYoutubeUrl('');
      handleClose();
    } catch (error) {
      console.error('Error adding YouTube track:', error);
      setUrlError(
        'Failed to add YouTube video. Please try again with a different URL.',
      );
    } finally {
      setIsAddingTrack(false);
    }
  };

  return (
    <>
      <IconButton
        icon="Music"
        label="Select Music"
        onClick={handleOpen}
        isActive={isOpen}
      />

      <div
        ref={playerRef}
        id="youtube-player"
        style={{ width: '0', height: '0', position: 'absolute' }}
      ></div>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Select Music"
        size="md"
      >
        <div className="max-h-[60vh] space-y-4 overflow-y-auto p-2">
          {/* YouTube URL Input Form */}
          <form onSubmit={handleAddYoutubeTrack} className="mb-4">
            <div className="mb-2">
              <label
                htmlFor="youtube-url"
                className="mb-1 block text-sm font-medium text-gray-200"
              >
                Add YouTube Video
              </label>
              <div className="flex gap-2">
                <input
                  id="youtube-url"
                  type="text"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="Paste YouTube URL here"
                  className="flex-1 rounded-md border border-stone-700 bg-stone-800 px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                  disabled={isAddingTrack}
                />
                <button
                  type="submit"
                  disabled={isAddingTrack || !youtubeUrl.trim()}
                  className={cn(
                    'rounded-md px-4 py-2 text-white transition-colors',
                    isAddingTrack || !youtubeUrl.trim()
                      ? 'cursor-not-allowed bg-green-600/50'
                      : 'bg-green-600 hover:bg-green-700',
                  )}
                >
                  {isAddingTrack ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Adding...
                    </span>
                  ) : (
                    'Add'
                  )}
                </button>
              </div>
              {urlError && (
                <p className="mt-1 text-sm text-red-500">{urlError}</p>
              )}
              <p className="mt-1 text-xs text-gray-400">
                Paste any YouTube video URL (e.g.,
                https://www.youtube.com/watch?v=dQw4w9WgXcQ)
              </p>
            </div>
          </form>

          {/* Volume Control */}
          <div className="mb-4 border-t border-stone-700 pt-4">
            <h3 className="mb-2 text-sm font-medium text-gray-300">
              Volume Control
            </h3>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleMute}
                className="rounded-full bg-stone-800 p-2 transition-colors hover:bg-stone-700"
              >
                {volume === 0 ? (
                  <VolumeX className="h-4 w-4 text-gray-400" />
                ) : (
                  <Volume2 className="h-4 w-4 text-green-400" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-stone-700 accent-green-500"
              />
              <span className="w-8 text-center text-xs text-gray-300">
                {volume}%
              </span>
            </div>
          </div>

          <div className="border-t border-stone-700 pt-4">
            <h3 className="mb-2 text-sm font-medium text-gray-300">
              Available Tracks
            </h3>
            <div className="space-y-2">
              {tracks.map((track) => (
                <button
                  key={track.id}
                  onClick={() => handleSelectTrack(track)}
                  className={cn(
                    'flex w-full items-center rounded-lg p-3 transition-all',
                    currentTrack?.id === track.id
                      ? 'border border-green-500/50 bg-green-900/30'
                      : 'border border-transparent bg-stone-800/50 hover:bg-stone-700/50',
                  )}
                >
                  <div className="mr-3">
                    {currentTrack?.id === track.id && isPlaying ? (
                      <Icon name="Pause" />
                    ) : (
                      <Icon name="Play" />
                    )}
                  </div>
                  <div className="overflow-hidden text-left">
                    <p className="truncate text-sm text-white">{track.name}</p>
                    {track.id.startsWith('custom-') && (
                      <p className="truncate text-xs text-gray-400">
                        YouTube Video
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
