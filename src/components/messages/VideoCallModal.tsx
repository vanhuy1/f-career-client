'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { X, Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SimplePeer from 'simple-peer';
import { Socket } from 'socket.io-client';

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

  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [callStatus, setCallStatus] = useState<
    | 'idle'
    | 'calling'
    | 'incoming'
    | 'connected'
    | 'ended'
    | 'timeout'
    | 'busy'
    | 'error'
  >('idle');
  const [remoteVideoEnabled, setRemoteVideoEnabled] = useState(true);

  // Get or create media stream
  const getLocalStream = useCallback(async (forceNew = false) => {
    // If we already have a stream and don't need a new one, return it
    if (globalStream && !forceNew) {
      console.log('Reusing existing stream');
      return globalStream;
    }

    // Clean up old stream if forcing new
    if (globalStream && forceNew) {
      console.log('Stopping old stream before creating new one');
      globalStream.getTracks().forEach((track) => {
        track.stop();
      });
      globalStream = null;
    }

    try {
      console.log('Getting new media stream');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      globalStream = stream;
      return stream;
    } catch (error) {
      console.error('Failed to get media stream:', error);

      // Try audio only if video fails
      const err = error as Error & { name?: string };
      if (err.name === 'NotReadableError' || err.name === 'NotFoundError') {
        try {
          console.log('Trying audio-only stream');
          const audioStream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true,
          });
          globalStream = audioStream;
          setIsVideoEnabled(false);
          return audioStream;
        } catch (audioError) {
          console.error('Audio-only also failed:', audioError);
          throw audioError;
        }
      }
      throw error;
    }
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    console.log('Cleaning up call resources');

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
      peerRef.current.destroy();
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
      console.log('Stopping global stream');
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
      console.error('Failed to initialize local video:', error);
      throw error;
    }
  }, [getLocalStream]);

  // Start outgoing call
  const startCall = useCallback(async () => {
    if (!socket || isInitializingRef.current) {
      console.log('Already initializing or no socket');
      return;
    }

    isInitializingRef.current = true;
    console.log('Starting outgoing call');
    setCallStatus('calling');
    setIsConnecting(true);

    // Set timeout
    callTimerRef.current = setTimeout(() => {
      console.log('Call timeout');
      if (socket && (isConnected || isConnecting)) {
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
    }, 60000);

    try {
      const stream = await initializeLocalVideo();

      const peer = new SimplePeer({
        initiator: true,
        trickle: false,
        stream,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
          ],
        },
      });

      peer.on('signal', (signal) => {
        console.log('Sending offer');
        socket.emit('video-call-offer', {
          conversationId,
          to: contactId,
          from: currentUserId,
          signal,
        });
      });

      peer.on('stream', (remoteStream) => {
        console.log('Got remote stream');
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
        setIsConnected(true);
        setCallStatus('connected');
        setIsConnecting(false);

        if (callTimerRef.current) {
          clearTimeout(callTimerRef.current);
          callTimerRef.current = null;
        }
      });

      peer.on('connect', () => {
        console.log('Peer connected');
        setCallStatus('connected');
        setIsConnected(true);
      });

      peer.on('error', (err) => {
        console.error('Peer error:', err);
        if (socket) {
          socket.emit('video-call-end', {
            conversationId,
            to: contactId,
            from: currentUserId,
            reason: 'error',
          });
        }
        cleanup();
        setCallStatus('error');
        setTimeout(() => {
          completeCleanup();
          onClose();
        }, 2000);
      });

      peer.on('close', () => {
        console.log('Peer closed');
      });

      peerRef.current = peer;
    } catch (error) {
      console.error('Failed to start call:', error);
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
    isConnected,
    isConnecting,
    cleanup,
    completeCleanup,
    onClose,
  ]);

  // Answer incoming call
  const answerCall = useCallback(
    async (signal: SimplePeer.SignalData) => {
      if (!socket || hasAnsweredRef.current || isInitializingRef.current) {
        console.log('Already answered or initializing');
        return;
      }

      hasAnsweredRef.current = true;
      isInitializingRef.current = true;
      console.log('Answering call');
      setCallStatus('connected');
      setIsConnecting(true);

      try {
        const stream = await initializeLocalVideo();

        const peer = new SimplePeer({
          initiator: false,
          trickle: false,
          stream,
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:stun1.l.google.com:19302' },
            ],
          },
        });

        peer.on('signal', (answerSignal) => {
          console.log('Sending answer');
          socket.emit('video-call-answer', {
            conversationId,
            to: contactId,
            from: currentUserId,
            signal: answerSignal,
          });
        });

        peer.on('stream', (remoteStream) => {
          console.log('Got remote stream on answer');
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
          setIsConnected(true);
          setIsConnecting(false);
        });

        peer.on('connect', () => {
          console.log('Peer connected after answer');
          setCallStatus('connected');
          setIsConnected(true);
        });

        peer.on('error', (err) => {
          console.error('Peer error on answer:', err);
          if (socket) {
            socket.emit('video-call-end', {
              conversationId,
              to: contactId,
              from: currentUserId,
              reason: 'error',
            });
          }
          cleanup();
          setCallStatus('error');
          setTimeout(() => {
            completeCleanup();
            onClose();
          }, 2000);
        });

        peer.on('close', () => {
          console.log('Peer closed on answer');
        });

        // Signal the offer
        peer.signal(signal);
        peerRef.current = peer;
      } catch (error) {
        console.error('Failed to answer call:', error);
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
      cleanup,
      completeCleanup,
      onClose,
    ],
  );

  // End call
  const endCall = useCallback(
    (reason: 'normal' | 'timeout' | 'error' | 'busy' = 'normal') => {
      console.log('Ending call, reason:', reason);

      if (socket && (isConnected || isConnecting)) {
        socket.emit('video-call-end', {
          conversationId,
          to: contactId,
          from: currentUserId,
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

        if (socket) {
          socket.emit('video-call-toggle-video', {
            conversationId,
            to: contactId,
            from: currentUserId,
            enabled: videoTrack.enabled,
          });
        }
      }
    }
  }, [socket, conversationId, contactId, currentUserId]);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (globalStream) {
      const audioTrack = globalStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);

        if (socket) {
          socket.emit('video-call-toggle-audio', {
            conversationId,
            to: contactId,
            from: currentUserId,
            enabled: audioTrack.enabled,
          });
        }
      }
    }
  }, [socket, conversationId, contactId, currentUserId]);

  // Socket handlers
  useEffect(() => {
    if (!socket || !isOpen) return;

    interface VideoCallAnswerPayload {
      from: string;
      signal: SimplePeer.SignalData;
    }

    interface VideoCallEndPayload {
      from: string;
      reason?: string;
    }

    interface VideoCallDeclinedPayload {
      from: string;
    }

    interface VideoCallTogglePayload {
      from: string;
      enabled: boolean;
    }

    const handlers = {
      'video-call-answer': ({ from, signal }: VideoCallAnswerPayload) => {
        if (from === contactId && peerRef.current) {
          console.log('Received answer');
          try {
            peerRef.current.signal(signal);
          } catch (err) {
            console.error('Error processing answer:', err);
          }
        }
      },
      'video-call-end': ({ from }: VideoCallEndPayload) => {
        if (from === contactId) {
          console.log('Remote ended call');
          cleanup();
          setCallStatus('ended');
          setTimeout(() => {
            completeCleanup();
            onClose();
          }, 1000);
        }
      },
      'video-call-declined': ({ from }: VideoCallDeclinedPayload) => {
        if (from === contactId) {
          endCall('busy');
        }
      },
      'video-call-toggle-video': ({
        from,
        enabled,
      }: VideoCallTogglePayload) => {
        if (from === contactId) {
          setRemoteVideoEnabled(enabled);
        }
      },
      'video-call-toggle-audio': ({
        from,
        enabled: _enabled,
      }: VideoCallTogglePayload) => {
        if (from === contactId) {
          // Handle remote audio toggle if needed
        }
      },
    };

    // Add listeners
    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    // Cleanup
    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, [socket, isOpen, contactId, cleanup, completeCleanup, onClose, endCall]);

  // Initialize call when modal opens
  useEffect(() => {
    if (isOpen && callStatus === 'idle') {
      if (isIncoming && incomingCallData?.signal && !hasAnsweredRef.current) {
        answerCall(incomingCallData.signal);
      } else if (!isIncoming && !isInitializingRef.current) {
        startCall();
      }
    }
  }, [isOpen, isIncoming, incomingCallData, callStatus, answerCall, startCall]);

  // Cleanup when modal closes
  useEffect(() => {
    if (!isOpen) {
      cleanup();
      setCallStatus('idle');
    }
  }, [isOpen, cleanup]);

  // Complete cleanup on unmount
  useEffect(() => {
    return () => {
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
              <p className="text-sm text-gray-300">
                {callStatus === 'calling' && 'Đang gọi...'}
                {callStatus === 'incoming' && 'Cuộc gọi đến...'}
                {callStatus === 'connected' && 'Đã kết nối'}
                {callStatus === 'ended' && 'Cuộc gọi đã kết thúc'}
                {callStatus === 'timeout' && 'Không có phản hồi'}
                {callStatus === 'busy' && 'Người dùng bận'}
                {callStatus === 'error' && 'Lỗi kết nối'}
              </p>
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

            {/* Remote placeholder */}
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

            {/* Local Video */}
            <div className="absolute right-4 bottom-4 h-36 w-48 overflow-hidden rounded-lg bg-gray-800 shadow-lg">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="mirror h-full w-full object-cover"
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
            disabled={!isConnected}
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
            disabled={!isConnected}
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
      </div>
    </div>
  );
};

export default VideoCallModal;
