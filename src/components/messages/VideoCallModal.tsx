'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { X, Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SimplePeer from 'simple-peer';
import { Socket } from 'socket.io-client';

// Type definitions for video call events
interface VideoCallAnswerPayload {
  from: string | number;
  signal: SimplePeer.SignalData;
  conversationId?: string;
}

interface VideoCallEndPayload {
  from: string | number;
  reason?: string;
  conversationId?: string;
}

interface VideoCallDeclinedPayload {
  from: string | number;
  conversationId?: string;
}

interface VideoCallTogglePayload {
  from: string | number;
  enabled: boolean;
  conversationId?: string;
}

interface VideoCallUserOfflinePayload {
  userId: string | number;
}

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  socket: Socket | null;
  currentUserId: string;
  contactId: string;
  contactName: string;
  contactAvatar?: string;
  conversationId: string;
  isIncoming?: boolean;
  incomingCallData?: {
    from: string;
    signal: SimplePeer.SignalData;
    conversationId: string;
  } | null;
}

// Global stream manager to prevent multiple getUserMedia calls
let globalStream: MediaStream | null = null;

const VideoCallModal: React.FC<VideoCallModalProps> = ({
  isOpen,
  onClose,
  socket,
  currentUserId,
  contactId,
  contactName,
  contactAvatar,
  conversationId,
  isIncoming = false,
  incomingCallData,
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<SimplePeer.Instance | null>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializingRef = useRef(false);
  const hasAnsweredRef = useRef(false);
  const socketListenersRef = useRef(false);
  const callStatusRef = useRef<string>('idle'); // Add ref for call status

  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [callStatus, setCallStatus] = useState<
    | 'idle'
    | 'calling'
    | 'incoming'
    | 'connecting'
    | 'connected'
    | 'ended'
    | 'timeout'
    | 'busy'
    | 'error'
  >('idle');
  const [remoteVideoEnabled, setRemoteVideoEnabled] = useState(true);

  // Update ref when status changes
  useEffect(() => {
    callStatusRef.current = callStatus;
  }, [callStatus]);

  // Get or create media stream
  const getLocalStream = useCallback(async (forceNew = false) => {
    // If we already have a stream and don't need a new one, return it
    if (globalStream && !forceNew) {
      console.log('[VideoCall] Reusing existing stream');
      return globalStream;
    }

    // Clean up old stream if forcing new
    if (globalStream && forceNew) {
      console.log('[VideoCall] Stopping old stream before creating new one');
      globalStream.getTracks().forEach((track) => {
        track.stop();
      });
      globalStream = null;
    }

    try {
      console.log('[VideoCall] Getting new media stream');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      globalStream = stream;
      return stream;
    } catch (error) {
      console.error('[VideoCall] Failed to get media stream:', error);

      // Try audio only if video fails
      const err = error as Error & { name?: string };
      if (err.name === 'NotReadableError' || err.name === 'NotFoundError') {
        try {
          console.log('[VideoCall] Trying audio-only stream');
          const audioStream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true,
          });
          globalStream = audioStream;
          setIsVideoEnabled(false);
          return audioStream;
        } catch (audioError) {
          console.error('[VideoCall] Audio-only also failed:', audioError);
          throw audioError;
        }
      }
      throw error;
    }
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    console.log('[VideoCall] Cleaning up call resources');

    // Clear timer
    if (callTimerRef.current) {
      clearTimeout(callTimerRef.current);
      callTimerRef.current = null;
    }

    // Clear video elements
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    // Destroy peer connection
    if (peerRef.current) {
      try {
        peerRef.current.destroy();
      } catch (e) {
        console.error('[VideoCall] Error destroying peer:', e);
      }
      peerRef.current = null;
    }

    // Reset refs
    isInitializingRef.current = false;
    hasAnsweredRef.current = false;

    // Reset states
    setIsConnected(false);
    setIsConnecting(false);
    setRemoteVideoEnabled(true);
  }, []);

  // Complete cleanup including stream
  const completeCleanup = useCallback(() => {
    cleanup();

    // Stop global stream
    if (globalStream) {
      console.log('[VideoCall] Stopping global stream');
      globalStream.getTracks().forEach((track) => {
        track.stop();
      });
      globalStream = null;
    }
  }, [cleanup]);

  // Initialize local video
  const initializeLocalVideo = useCallback(async () => {
    try {
      const stream = await getLocalStream();
      if (localVideoRef.current && stream) {
        localVideoRef.current.srcObject = stream;
        // Update video enabled state based on actual stream
        setIsVideoEnabled(stream.getVideoTracks().length > 0);
        setIsAudioEnabled(stream.getAudioTracks().length > 0);
      }
      return stream;
    } catch (error) {
      console.error('[VideoCall] Failed to initialize local video:', error);
      throw error;
    }
  }, [getLocalStream]);

  // Create peer connection
  const createPeer = useCallback((initiator: boolean, stream: MediaStream) => {
    console.log(`[VideoCall] Creating peer, initiator: ${initiator}`);

    const peer = new SimplePeer({
      initiator,
      trickle: false,
      stream,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
          { urls: 'stun:stun3.l.google.com:19302' },
          { urls: 'stun:stun4.l.google.com:19302' },
        ],
      },
    });

    peer.on('stream', (remoteStream) => {
      console.log('[VideoCall] Got remote stream');
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
      setIsConnected(true);
      setCallStatus('connected');
      setIsConnecting(false);

      // Clear any remaining timeout
      if (callTimerRef.current) {
        console.log('[VideoCall] Clearing timeout on stream received');
        clearTimeout(callTimerRef.current);
        callTimerRef.current = null;
      }
    });

    peer.on('connect', () => {
      console.log('[VideoCall] Peer connected');
      setCallStatus('connected');
      setIsConnected(true);
      setIsConnecting(false);

      // Clear any remaining timeout
      if (callTimerRef.current) {
        console.log('[VideoCall] Clearing timeout on peer connect');
        clearTimeout(callTimerRef.current);
        callTimerRef.current = null;
      }
    });

    peer.on('error', (err) => {
      console.error('[VideoCall] Peer error:', err);
      setCallStatus('error');
      setIsConnecting(false);

      // Clear timeout on error
      if (callTimerRef.current) {
        clearTimeout(callTimerRef.current);
        callTimerRef.current = null;
      }
    });

    peer.on('close', () => {
      console.log('[VideoCall] Peer closed');
    });

    return peer;
  }, []);

  // Start outgoing call
  const startCall = useCallback(async () => {
    if (!socket || isInitializingRef.current) {
      console.log('[VideoCall] Already initializing or no socket');
      return;
    }

    isInitializingRef.current = true;
    console.log('[VideoCall] Starting outgoing call');
    setCallStatus('calling');
    setIsConnecting(true);

    try {
      const stream = await initializeLocalVideo();
      const peer = createPeer(true, stream);

      // Set timeout AFTER peer is created
      callTimerRef.current = setTimeout(() => {
        console.log(
          '[VideoCall] Timeout check - current status:',
          callStatusRef.current,
        );
        console.log('[VideoCall] Peer connected:', peerRef.current?.connected);

        // Only timeout if still in calling state (not connecting or connected)
        if (
          callStatusRef.current === 'calling' &&
          !peerRef.current?.connected
        ) {
          console.log('[VideoCall] Call timeout - no answer');
          if (socket) {
            socket.emit('video-call-end', {
              conversationId,
              to: contactId,
              from: currentUserId,
              reason: 'timeout',
            });
          }
          cleanup();
          setCallStatus('timeout');
          setTimeout(() => {
            completeCleanup();
            onClose();
          }, 2000);
        } else {
          console.log(
            '[VideoCall] Timeout cancelled - status changed or peer connected',
          );
        }
      }, 30000); // 30 seconds timeout

      peer.on('signal', (signal) => {
        console.log('[VideoCall] Sending offer signal');
        // Ensure IDs are strings for consistency
        socket.emit('video-call-offer', {
          conversationId,
          to: String(contactId),
          from: String(currentUserId),
          signal,
        });
      });

      peerRef.current = peer;
    } catch (error) {
      console.error('[VideoCall] Failed to start call:', error);
      setCallStatus('error');
      setIsConnecting(false);
      isInitializingRef.current = false;

      if (callTimerRef.current) {
        clearTimeout(callTimerRef.current);
        callTimerRef.current = null;
      }
    }
  }, [
    socket,
    conversationId,
    contactId,
    currentUserId,
    initializeLocalVideo,
    createPeer,
    cleanup,
    completeCleanup,
    onClose,
  ]);

  // Answer incoming call
  const answerCall = useCallback(
    async (signal: SimplePeer.SignalData) => {
      if (!socket || hasAnsweredRef.current || isInitializingRef.current) {
        console.log('[VideoCall] Already answered or initializing');
        return;
      }

      hasAnsweredRef.current = true;
      isInitializingRef.current = true;
      console.log('[VideoCall] Answering incoming call');
      setCallStatus('connecting');
      setIsConnecting(true);

      try {
        const stream = await initializeLocalVideo();
        const peer = createPeer(false, stream);

        peer.on('signal', (answerSignal) => {
          console.log('[VideoCall] Sending answer signal back to caller');
          // Ensure IDs are strings for consistency
          socket.emit('video-call-answer', {
            conversationId,
            to: String(contactId),
            from: String(currentUserId),
            signal: answerSignal,
          });
        });

        // Process the incoming offer signal
        console.log('[VideoCall] Processing incoming offer signal');
        peer.signal(signal);

        peerRef.current = peer;
      } catch (error) {
        console.error('[VideoCall] Failed to answer call:', error);
        setCallStatus('error');
        setIsConnecting(false);
        hasAnsweredRef.current = false;
        isInitializingRef.current = false;
      }
    },
    [
      socket,
      conversationId,
      contactId,
      currentUserId,
      initializeLocalVideo,
      createPeer,
    ],
  );

  // End call
  const endCall = useCallback(
    (reason: 'normal' | 'timeout' | 'error' | 'busy' = 'normal') => {
      console.log(`[VideoCall] Ending call, reason: ${reason}`);

      if (socket && (isConnected || isConnecting || callStatus === 'calling')) {
        socket.emit('video-call-end', {
          conversationId,
          to: String(contactId),
          from: String(currentUserId),
          reason,
        });
      }

      cleanup();

      switch (reason) {
        case 'timeout':
          setCallStatus('timeout');
          break;
        case 'busy':
          setCallStatus('busy');
          break;
        case 'error':
          setCallStatus('error');
          break;
        default:
          setCallStatus('ended');
      }

      setTimeout(
        () => {
          completeCleanup();
          onClose();
        },
        reason === 'normal' ? 100 : 2000,
      );
    },
    [
      socket,
      isConnected,
      isConnecting,
      callStatus,
      conversationId,
      contactId,
      currentUserId,
      cleanup,
      completeCleanup,
      onClose,
    ],
  );

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (globalStream) {
      const videoTrack = globalStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);

        if (socket && isConnected) {
          socket.emit('video-call-toggle-video', {
            conversationId,
            to: String(contactId),
            from: String(currentUserId),
            enabled: videoTrack.enabled,
          });
        }
      }
    }
  }, [socket, isConnected, conversationId, contactId, currentUserId]);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (globalStream) {
      const audioTrack = globalStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);

        if (socket && isConnected) {
          socket.emit('video-call-toggle-audio', {
            conversationId,
            to: String(contactId),
            from: String(currentUserId),
            enabled: audioTrack.enabled,
          });
        }
      }
    }
  }, [socket, isConnected, conversationId, contactId, currentUserId]);

  // Socket handlers - Setup once when modal opens
  useEffect(() => {
    if (!socket || !isOpen || socketListenersRef.current) return;

    console.log('[VideoCall] Setting up socket listeners');
    socketListenersRef.current = true;

    const handleVideoCallAnswer = ({
      from,
      signal,
    }: VideoCallAnswerPayload) => {
      console.log(`[VideoCall] Received answer signal from ${from}`);
      console.log(
        '[VideoCall] Current status when answer received:',
        callStatusRef.current,
      );
      console.log(
        '[VideoCall] ContactId:',
        contactId,
        'Type:',
        typeof contactId,
      );
      console.log('[VideoCall] From:', from, 'Type:', typeof from);
      console.log('[VideoCall] PeerRef exists:', !!peerRef.current);

      // Convert both to string for comparison
      const fromStr = String(from);
      const contactStr = String(contactId);

      if (fromStr === contactStr && peerRef.current) {
        try {
          // Clear timeout immediately when answer is received
          if (callTimerRef.current) {
            console.log('[VideoCall] Clearing timeout after receiving answer');
            clearTimeout(callTimerRef.current);
            callTimerRef.current = null;
          }

          // Update status before processing signal
          setCallStatus('connecting');
          setIsConnecting(true);

          console.log('[VideoCall] Processing answer signal');
          peerRef.current.signal(signal);
          console.log('[VideoCall] Answer signal processed successfully');
        } catch (err) {
          console.error('[VideoCall] Error processing answer signal:', err);
          setCallStatus('error');
        }
      } else {
        console.log('[VideoCall] Answer ignored - Comparison failed');
        console.log(
          `[VideoCall] fromStr (${fromStr}) !== contactStr (${contactStr}):`,
          fromStr !== contactStr,
        );
        console.log('[VideoCall] No peer:', !peerRef.current);
      }
    };

    const handleVideoCallEnd = ({ from, reason }: VideoCallEndPayload) => {
      console.log(
        `[VideoCall] Remote ended call from ${from}, reason: ${reason}`,
      );
      const fromStr = String(from);
      const contactStr = String(contactId);

      if (fromStr === contactStr) {
        cleanup();
        setCallStatus('ended');
        setTimeout(() => {
          completeCleanup();
          onClose();
        }, 1000);
      }
    };

    const handleVideoCallDeclined = ({ from }: VideoCallDeclinedPayload) => {
      console.log(`[VideoCall] Call declined by ${from}`);
      const fromStr = String(from);
      const contactStr = String(contactId);

      if (fromStr === contactStr) {
        endCall('busy');
      }
    };

    const handleVideoCallToggleVideo = ({
      from,
      enabled,
    }: VideoCallTogglePayload) => {
      const fromStr = String(from);
      const contactStr = String(contactId);

      if (fromStr === contactStr) {
        console.log(`[VideoCall] Remote video toggled: ${enabled}`);
        setRemoteVideoEnabled(enabled);
      }
    };

    const handleVideoCallToggleAudio = ({
      from,
      enabled,
    }: VideoCallTogglePayload) => {
      const fromStr = String(from);
      const contactStr = String(contactId);

      if (fromStr === contactStr) {
        console.log(`[VideoCall] Remote audio toggled: ${enabled}`);
        // Handle remote audio toggle if needed
      }
    };

    const handleVideoCallUserOffline = ({
      userId,
    }: VideoCallUserOfflinePayload) => {
      console.log(`[VideoCall] User ${userId} is offline`);
      const userStr = String(userId);
      const contactStr = String(contactId);

      if (userStr === contactStr) {
        setCallStatus('error');
        setTimeout(() => {
          endCall('error');
        }, 2000);
      }
    };

    // Add listeners
    socket.on('video-call-answer', handleVideoCallAnswer);
    socket.on('video-call-end', handleVideoCallEnd);
    socket.on('video-call-declined', handleVideoCallDeclined);
    socket.on('video-call-toggle-video', handleVideoCallToggleVideo);
    socket.on('video-call-toggle-audio', handleVideoCallToggleAudio);
    socket.on('video-call-user-offline', handleVideoCallUserOffline);

    // Cleanup
    return () => {
      console.log('[VideoCall] Removing socket listeners');
      socket.off('video-call-answer', handleVideoCallAnswer);
      socket.off('video-call-end', handleVideoCallEnd);
      socket.off('video-call-declined', handleVideoCallDeclined);
      socket.off('video-call-toggle-video', handleVideoCallToggleVideo);
      socket.off('video-call-toggle-audio', handleVideoCallToggleAudio);
      socket.off('video-call-user-offline', handleVideoCallUserOffline);
      socketListenersRef.current = false;
    };
  }, [socket, isOpen, contactId, cleanup, completeCleanup, onClose, endCall]);

  // Initialize call when modal opens
  useEffect(() => {
    if (isOpen && callStatus === 'idle') {
      // Reset initialization flag when modal opens
      isInitializingRef.current = false;
      hasAnsweredRef.current = false;

      if (isIncoming && incomingCallData?.signal && !hasAnsweredRef.current) {
        console.log('[VideoCall] Modal opened for incoming call, answering...');
        setCallStatus('incoming');
        // Small delay to ensure everything is ready
        setTimeout(() => {
          answerCall(incomingCallData.signal);
        }, 100);
      } else if (!isIncoming && !isInitializingRef.current) {
        console.log('[VideoCall] Modal opened for outgoing call, starting...');
        // Small delay to prevent double initialization
        setTimeout(() => {
          if (!isInitializingRef.current) {
            startCall();
          }
        }, 100);
      }
    }
  }, [isOpen, isIncoming, incomingCallData, callStatus, answerCall, startCall]);

  // Cleanup when modal closes
  useEffect(() => {
    if (!isOpen && callStatus !== 'idle') {
      console.log('[VideoCall] Modal closed, cleaning up');
      cleanup();
      setCallStatus('idle');
    }
  }, [isOpen, callStatus, cleanup]);

  // Complete cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('[VideoCall] Component unmounting, complete cleanup');
      completeCleanup();
    };
  }, [completeCleanup]);

  if (!isOpen) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusText = () => {
    switch (callStatus) {
      case 'calling':
        return 'Đang gọi...';
      case 'incoming':
        return 'Cuộc gọi đến...';
      case 'connecting':
        return 'Đang kết nối...';
      case 'connected':
        return 'Đã kết nối';
      case 'ended':
        return 'Cuộc gọi đã kết thúc';
      case 'timeout':
        return 'Không có phản hồi';
      case 'busy':
        return 'Người dùng bận';
      case 'error':
        return 'Lỗi kết nối';
      default:
        return '';
    }
  };

  return (
    <div className="bg-opacity-90 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="relative h-full w-full max-w-7xl">
        {/* Header */}
        <div className="absolute top-4 right-4 left-4 z-10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={contactAvatar} />
              <AvatarFallback className="bg-blue-100 text-blue-700">
                {getInitials(contactName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-white">{contactName}</h3>
              <p className="text-sm text-gray-300">{getStatusText()}</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => endCall('normal')}
            className="text-white hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Video Container */}
        <div className="flex h-full w-full items-center justify-center">
          <div className="relative h-full max-h-[80vh] w-full overflow-hidden rounded-lg bg-gray-900">
            {/* Remote Video */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="h-full w-full object-contain"
            />

            {/* Remote placeholder when not connected or video disabled */}
            {(!isConnected || !remoteVideoEnabled) && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={contactAvatar} />
                  <AvatarFallback className="bg-blue-100 text-3xl text-blue-700">
                    {getInitials(contactName)}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}

            {/* Local Video - Picture in Picture */}
            <div className="absolute right-4 bottom-4 h-36 w-48 overflow-hidden rounded-lg bg-gray-800 shadow-lg">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover"
                style={{ transform: 'scaleX(-1)' }}
              />
              {!isVideoEnabled && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gray-600 text-sm text-white">
                      Bạn
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 transform items-center space-x-4">
          <Button
            onClick={toggleAudio}
            disabled={!isConnected && callStatus !== 'calling'}
            className={`rounded-full p-4 ${
              isAudioEnabled
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isAudioEnabled ? (
              <Mic className="h-6 w-6" />
            ) : (
              <MicOff className="h-6 w-6" />
            )}
          </Button>

          <Button
            onClick={toggleVideo}
            disabled={!isConnected && callStatus !== 'calling'}
            className={`rounded-full p-4 ${
              isVideoEnabled
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isVideoEnabled ? (
              <Video className="h-6 w-6" />
            ) : (
              <VideoOff className="h-6 w-6" />
            )}
          </Button>

          <Button
            onClick={() => endCall('normal')}
            className="rounded-full bg-red-600 p-4 hover:bg-red-700"
          >
            <PhoneOff className="h-6 w-6" />
          </Button>
        </div>

        {/* Status Messages */}
        {(callStatus === 'timeout' ||
          callStatus === 'busy' ||
          callStatus === 'error') && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-center">
            <p className="text-xl font-semibold text-white">
              {getStatusText()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCallModal;
