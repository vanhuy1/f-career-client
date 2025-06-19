'use client';
import React, {
  useRef,
  useState,
  useEffect,
  useContext,
  createContext,
} from 'react';
import { useRouter } from 'next/navigation';
import SimplePeer from 'simple-peer';
import { Socket } from 'socket.io-client';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { TUser } from '../utils/types';
import { PEER_CONFIGS, TOAST_DEFAULT_CONFIG } from '../utils/constants';
import { videoCallText } from '../utils/text';
import socket from '../utils/socket';

export interface MeetContextProps {
  socketRef: React.RefObject<Socket | null>;
  userVideoRef: React.RefObject<HTMLVideoElement | null>;
  peersVideoRefs: Map<string, React.RefObject<HTMLVideoElement | null>>;
  meetId: string;
  meetName: string;
  userData: TUser;
  peersData: Map<string, TUser>;
  callingOtherUserData: TUser;
  peersMuted: Map<string, boolean>;
  peersVideoStopped: Map<string, boolean>;
  userStream?: MediaStream;
  isCallingUser: boolean;
  meetRequestAccepted: boolean;
  isReceivingMeetRequest: boolean;
  isSharingScreen: boolean;
  isUsingVideo: boolean;
  isUsingMicrophone: boolean;
  peersSharingScreen: Map<string, boolean>;
  peers: SimplePeer.Instance[];
  getUserStream: () => Promise<MediaStream | undefined>;
  startNewMeet: (userName: string, userEmail: string, meetName: string) => boolean;
  joinMeet: (userName: string, userEmail: string, meetId: string) => void;
  acceptMeetRequest: (callerId: string) => void;
  rejectMeetRequest: (callerId: string) => void;
  cancelMeetRequest: () => void;
  renameMeet: (newMeetName: string) => void;
  removePeerFromMeet: (peerId: string) => void;
  leftMeet: () => void;
  updateStreamAudio: () => void;
  updateStreamVideo: () => void;
  updateScreenSharing: () => void;
  clearUserStream: () => void;
}

interface SocketResponse {
  success: boolean;
  error?: string;
}

interface MeetProviderProps {
  testData?: Partial<MeetContextProps>;
  children: React.ReactNode;
}

const MeetContext: React.Context<MeetContextProps> = createContext(
  {} as MeetContextProps,
);

export const MeetProvider: React.FC<MeetProviderProps> = ({
  testData,
  children,
}) => {
  const router = useRouter();

  const peerRefs = useRef<Map<string, SimplePeer.Instance>>(new Map());
  const socketRef = useRef<Socket | null>(null);
  const userVideoRef = useRef<HTMLVideoElement | null>(null);
  const peersVideoRefs = useRef<Map<string, React.RefObject<HTMLVideoElement | null>>>(
    new Map(),
  );

  const [peers, setPeers] = useState<SimplePeer.Instance[]>([]);
  const [meetId, setMeetId] = useState<string>('');
  const [meetName, setMeetName] = useState<string>('');
  const [userData, setUserData] = useState<TUser>({} as TUser);
  const [peersData, setPeersData] = useState<Map<string, TUser>>(new Map());
  const [callingOtherUserData, setCallingOtherUserData] = useState<TUser>(
    {} as TUser,
  );
  const [peersMuted, setPeersMuted] = useState<Map<string, boolean>>(new Map());
  const [peersVideoStopped, setPeersVideoStopped] = useState<Map<string, boolean>>(
    new Map(),
  );
  const [userStream, setUserStream] = useState<MediaStream>();
  const [isCallingUser, setIsCallingUser] = useState<boolean>(false);
  const [meetRequestAccepted, setMeetRequestAccepted] = useState<boolean>(false);
  const [isReceivingMeetRequest, setIsReceivingMeetRequest] =
    useState<boolean>(false);
  const [isSharingScreen, setIsSharingScreen] = useState<boolean>(false);
  const [isUsingVideo, setIsUsingVideo] = useState<boolean>(false);
  const [isUsingMicrophone, setIsUsingMicrophone] = useState<boolean>(false);
  const [peersSharingScreen, setPeersSharingScreen] = useState<Map<string, boolean>>(
    new Map(),
  );

  const clearMeetData = () => {
    setPeersData(new Map());
    setCallingOtherUserData({} as TUser);
    setIsCallingUser(false);
    setMeetRequestAccepted(false);
    setIsReceivingMeetRequest(false);
    setIsSharingScreen(false);
    setPeersSharingScreen(new Map());
    setPeersMuted(new Map());
    setPeersVideoStopped(new Map());
    setPeers([]);
    peerRefs.current.forEach((peer) => peer.destroy());
    peerRefs.current.clear();
    peersVideoRefs.current.clear();
  };

  const clearUserStream = () => {
    if (userStream) {
      userStream.getTracks().forEach((track) => track.stop());
      setUserStream(undefined);
    }
  };

  const getUserStream = async () => {
    try {
      if (userStream) return userStream;
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream;
        userVideoRef.current.muted = true;
      }
      setUserStream(stream);
      setIsUsingVideo(true);
      setIsUsingMicrophone(true);
      return stream;
    } catch (error) {
      console.error('Failed to get user media:', error);
      setIsUsingVideo(false);
      setIsUsingMicrophone(false);
      toast(
        videoCallText.toastMessage.allowGetVideoAndAudio,
        TOAST_DEFAULT_CONFIG,
      );
    }
  };

  const checkUserStream = async () => {
    let stream = userStream;
    if (!stream) {
      stream = await getUserStream();
      if (!stream) return true;
    }
    return false;
  };

  const startNewMeet = (userName: string, userEmail: string, meetDisplayName: string) => {
    try {
      if (!socketRef.current) {
        console.error('Socket is not initialized');
        toast('Connection error. Please try again.', TOAST_DEFAULT_CONFIG);
        return false;
      }

      const user = {
        id: socketRef.current.id ?? '',
        name: userName,
        email: userEmail,
        isHost: true,
      };

      socketRef.current.emit('BE-save-user-data', user, (response: any) => {
        if (response?.success) {
          setUserData(user);

          const meetId = uuidv4();

          socketRef.current?.emit('BE-create-meet', {
            meetId,
            meetName: meetDisplayName,
          }, (response: any) => {
            if (response?.success) {
              setMeetId(meetId);
              setMeetName(meetDisplayName);
              router.push('/video-call/meet');
            } else {
              console.error('Failed to create meeting:', response?.error);
              toast(response?.error || 'Failed to create meeting', TOAST_DEFAULT_CONFIG);
            }
          });
        } else {
          console.error('Failed to save user data:', response?.error);
          toast(response?.error || 'Failed to save user data', TOAST_DEFAULT_CONFIG);
        }
      });

      return true;
    } catch (error) {
      console.error('Error starting new meet:', error);
      toast('Error starting meeting', TOAST_DEFAULT_CONFIG);
      return false;
    }
  };

  const joinMeet = async (userName: string, userEmail: string, meetId: string) => {
    try {
      if (!socketRef.current) {
        console.error('Socket not initialized');
        toast('Connection error. Please try again.', TOAST_DEFAULT_CONFIG);
        return;
      }

      const user = {
        id: socketRef.current.id ?? '',
        name: userName,
        email: userEmail,
        isHost: false,
      };

      setMeetId(meetId);

      socketRef.current.emit('BE-save-user-data', user, (response: any) => {
        if (response?.success) {
          setUserData(user);
          setIsCallingUser(true);

          socketRef.current?.emit('BE-request-join-meet', {
            meetId,
            user,
          }, (response: any) => {
            if (!response?.success) {
              setIsCallingUser(false);
              toast(response?.error || 'Failed to join meeting', TOAST_DEFAULT_CONFIG);
              router.replace('/video-call');
            }
          });
        } else {
          console.error('Failed to save user data:', response?.error);
          toast(response?.error || 'Failed to save user data', TOAST_DEFAULT_CONFIG);
          router.replace('/video-call');
        }
      });
    } catch (error) {
      console.error('Error joining meet:', error);
      toast('Error joining meeting', TOAST_DEFAULT_CONFIG);
      router.replace('/video-call');
    }
  };

  const createPeer = (peerId: string, stream: MediaStream) => {
    try {
      const peer = new SimplePeer({
        initiator: true,
        trickle: false,
        stream,
        config: PEER_CONFIGS,
      });

      peer.on('signal', (signal: any) => {
        socketRef.current?.emit('BE-call-user', {
          userToCall: peerId,
          from: socketRef.current?.id,
          signal,
          info: {
            userName: userData.name,
            userEmail: userData.email,
            video: isUsingVideo,
            audio: isUsingMicrophone,
          },
        });
      });

      peer.on('disconnect', () => peer.destroy());
      peer.on('close', () => peer.destroy());

      return peer;
    } catch (error) {
      console.error('Error creating peer:', error);
      return null;
    }
  };

  const addPeer = (incomingSignal: SimplePeer.SignalData, callerId: string, stream: MediaStream) => {
    try {
      const peer = new SimplePeer({
        initiator: false,
        trickle: false,
        stream,
        config: PEER_CONFIGS,
      });

      peer.on('signal', (signal: any) => {
        socketRef.current?.emit('BE-accept-call', {
          signal,
          to: callerId,
          info: {
            userName: userData.name,
            userEmail: userData.email,
            video: isUsingVideo,
            audio: isUsingMicrophone,
          },
        });
      });

      peer.on('disconnect', () => peer.destroy());
      peer.on('close', () => peer.destroy());

      peer.signal(incomingSignal);
      return peer;
    } catch (error) {
      console.error('Error adding peer:', error);
      return null;
    }
  };

  const acceptMeetRequest = (callerId: string) => {
    setIsReceivingMeetRequest(false);

    const requestId = localStorage.getItem('pendingRequestId');
    if (!requestId) {
      console.error('No pending request ID found');
      toast('Error accepting request', TOAST_DEFAULT_CONFIG);
      return;
    }

    socketRef.current?.emit(
      'BE-approve-join-request',
      { requestId, meetId, userId: callerId },
      (response: SocketResponse) => {
        if (!response.success) {
          console.error('Failed to accept meet request:', response.error);
          toast(response.error || 'Failed to accept meeting request', TOAST_DEFAULT_CONFIG);
        } else {
          localStorage.removeItem('pendingRequestId');
        }
      },
    );
  };

  const rejectMeetRequest = (callerId: string) => {
    setIsReceivingMeetRequest(false);

    const requestId = localStorage.getItem('pendingRequestId');
    if (!requestId) {
      console.error('No pending request ID found');
      toast('Error rejecting request', TOAST_DEFAULT_CONFIG);
      return;
    }

    socketRef.current?.emit(
      'BE-reject-join-request',
      { requestId, meetId, userId: callerId },
      (response: SocketResponse) => {
        if (!response.success) {
          console.error('Failed to reject meet request:', response.error);
        } else {
          localStorage.removeItem('pendingRequestId');
        }
      },
    );
  };

  const cancelMeetRequest = () => {
    setIsCallingUser(false);

    const requestId = localStorage.getItem('pendingRequestId');
    if (requestId) {
      socketRef.current?.emit(
        'BE-cancel-join-request',
        { requestId, meetId },
        (response: SocketResponse) => {
          if (!response.success) {
            console.error('Failed to cancel join request:', response.error);
          } else {
            localStorage.removeItem('pendingRequestId');
          }
        },
      );
    }

    router.replace('/video-call');
  };

  const renameMeet = (newMeetName: string) => {
    socketRef.current?.emit(
      'BE-meet-rename',
      { meetId, newMeetName },
      (response: SocketResponse) => {
        if (response.success) {
          setMeetName(newMeetName);
        } else {
          console.error('Failed to rename meet:', response.error);
          toast('Failed to rename meeting', TOAST_DEFAULT_CONFIG);
        }
      },
    );
  };

  const removePeerFromMeet = (peerId: string) => {
    if (userData.isHost) {
      socketRef.current?.emit(
        'BE-remove-from-meet',
        { meetId, userId: peerId },
        (response: SocketResponse) => {
          if (!response.success) {
            console.error('Failed to remove peer from meet:', response.error);
            toast(response.error || 'Failed to remove participant', TOAST_DEFAULT_CONFIG);
          }
        },
      );
    } else {
      console.error('Only host can remove peers from meet');
      toast('Only the host can remove participants', TOAST_DEFAULT_CONFIG);
    }
  };

  const leftMeet = () => {
    socketRef.current?.emit('BE-left-meet', {
      meetId,
      userId: userData.id,
    }, (response: any) => {
      if (response && !response.success) {
        console.error('Failed to leave meeting:', response.error);
      }
    });

    clearMeetData();
    router.replace('/video-call?stopStream=true');
  };

  const updateStreamAudio = async () => {
    const hasNoStream = await checkUserStream();
    if (hasNoStream) return;

    userStream?.getAudioTracks().forEach((track) => {
      track.enabled = !isUsingMicrophone;
    });

    const newStatus = !isUsingMicrophone;
    setIsUsingMicrophone(newStatus);

    socketRef.current?.emit('BE-update-user-audio', {
      meetId,
      userId: userData.id,
      status: newStatus,
    });
  };

  const updateStreamVideo = async () => {
    const hasNoStream = await checkUserStream();
    if (hasNoStream) return;

    userStream?.getVideoTracks().forEach((track) => {
      track.enabled = !isUsingVideo;
    });

    const newStatus = !isUsingVideo;
    setIsUsingVideo(newStatus);

    socketRef.current?.emit('BE-update-user-video', {
      meetId,
      userId: userData.id,
      status: newStatus,
    });
  };

  const updateScreenSharing = async () => {
    try {
      const hasNoStream = await checkUserStream();
      if (hasNoStream) return;

      if (!isSharingScreen) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });

        const screenTrack = screenStream.getVideoTracks()[0];

        peerRefs.current.forEach((peer) => {
          const peerWithPC = peer as unknown as { _pc: RTCPeerConnection };
          const sender = peerWithPC._pc
            .getSenders()
            .find((s: RTCRtpSender) => s.track?.kind === 'video');
          sender?.replaceTrack(screenTrack);
        });

        const originalVideoTrack = userStream?.getVideoTracks()[0];
        if (originalVideoTrack) {
          originalVideoTrack.enabled = false;
        }

        if (userVideoRef.current) {
          userVideoRef.current.srcObject = screenStream;
          userVideoRef.current.muted = true;
        }

        screenTrack.onended = () => {
          updateScreenSharing();
        };

        setIsSharingScreen(true);
        socketRef.current?.emit('BE-update-screen-sharing', {
          meetId,
          userId: userData.id,
          status: true,
        });
      } else {
        if (userStream) {
          const videoTrack = userStream.getVideoTracks()[0];
          if (videoTrack) {
            videoTrack.enabled = true;

            peerRefs.current.forEach((peer) => {
              const peerWithPC = peer as unknown as { _pc: RTCPeerConnection };
              const sender = peerWithPC._pc
                .getSenders()
                .find((s: RTCRtpSender) => s.track?.kind === 'video');
              sender?.replaceTrack(videoTrack);
            });

            if (userVideoRef.current) {
              userVideoRef.current.srcObject = userStream;
              userVideoRef.current.muted = true;
            }
          }
        }

        setIsSharingScreen(false);
        socketRef.current?.emit('BE-update-screen-sharing', {
          meetId,
          userId: userData.id,
          status: false,
        });
      }
    } catch (error) {
      console.error('Error updating screen sharing:', error);
      setIsSharingScreen(false);
      toast('Error sharing screen', TOAST_DEFAULT_CONFIG);
    }
  };

  useEffect(() => {
    const connectSocket = () => {
      socketRef.current = socket;

      if (socket && !socket.connected) {
        console.log('Socket not connected, attempting to reconnect...');
        socket.connect();
      }

      socketRef.current.on('connect', () => {
        console.log('Socket connected with ID:', socketRef.current?.id);
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        toast('Connection error. Please try again.', TOAST_DEFAULT_CONFIG);
      });

      socketRef.current.on('FE-new-user-joined', async ({ user }: { user: TUser }) => {
        console.log('New user joined:', user);
        const stream = await getUserStream();
        if (!stream) return;

        if (user.id !== userData.id) {
          const peer = createPeer(user.id, stream);
          if (peer) {
            peerRefs.current.set(user.id, peer);
            setPeers(prevPeers => [...prevPeers, peer]);

            peer.on('stream', (peerStream: MediaStream) => {
              console.log(`Received stream from new peer ${user.id}`);
              const videoRef = peersVideoRefs.current.get(user.id)?.current;
              if (videoRef) {
                videoRef.srcObject = peerStream;
                videoRef.play().catch(err => console.error(`Error playing video for peer ${user.id}:`, err));
              }
            });

            const videoRef = React.createRef<HTMLVideoElement>();
            peersVideoRefs.current.set(user.id, videoRef);

            setPeersData(prev => {
              const newMap = new Map(prev);
              newMap.set(user.id, user);
              return newMap;
            });

            setPeersMuted(prev => {
              const newMap = new Map(prev);
              newMap.set(user.id, false);
              return newMap;
            });

            setPeersVideoStopped(prev => {
              const newMap = new Map(prev);
              newMap.set(user.id, false);
              return newMap;
            });
          }
        }
      });

      socketRef.current.on('FE-meet-joined', ({ meetId, meetName, users, isHost }: { meetId: string; meetName: string; users: TUser[]; isHost: boolean }) => {
        console.log('Joined meeting:', meetId, meetName, users);
        setMeetId(meetId);
        setMeetName(meetName);
        setIsCallingUser(false);
        setMeetRequestAccepted(true);

        getUserStream().then(stream => {
          if (!stream) return;

          const newPeers: SimplePeer.Instance[] = [];
          const newPeersData = new Map();

          users.forEach(user => {
            if (user.id !== userData.id) {
              const peer = createPeer(user.id, stream);
              if (peer) {
                peerRefs.current.set(user.id, peer);
                newPeers.push(peer);

                const videoRef = React.createRef<HTMLVideoElement>();
                peersVideoRefs.current.set(user.id, videoRef);

                newPeersData.set(user.id, user);

                setPeersMuted(prev => {
                  const newMap = new Map(prev);
                  newMap.set(user.id, false);
                  return newMap;
                });

                setPeersVideoStopped(prev => {
                  const newMap = new Map(prev);
                  newMap.set(user.id, false);
                  return newMap;
                });
              }
            }
          });

          setPeers(newPeers);
          setPeersData(newPeersData);
        });

        if (!window.location.pathname.includes('/meet')) {
          router.push('/video-call/meet');
        }
      });

      socketRef.current.on('FE-join-request-received', ({ requestId, meetId, meetName, user }) => {
        console.log('Join request received:', requestId, meetId, user);
        setCallingOtherUserData(user);
        setIsReceivingMeetRequest(true);

        localStorage.setItem('pendingRequestId', requestId);
      });

      socketRef.current.on('FE-join-request-sent', ({ requestId, meetId, meetName }) => {
        console.log('Join request sent:', requestId, meetId);
        localStorage.setItem('pendingRequestId', requestId);
      });

      socketRef.current.on('FE-join-meet-approved', ({ requestId, meetId, meetName }) => {
        console.log('Join request approved:', requestId, meetId);
        setIsCallingUser(false);
        setMeetRequestAccepted(true);

        socketRef.current?.emit('BE-join-after-approval', { meetId, requestId }, (response: any) => {
          if (!response.success) {
            console.error('Failed to join after approval:', response.error);
            toast('Failed to join meeting', TOAST_DEFAULT_CONFIG);
            router.replace('/video-call');
          }
        });
      });

      socketRef.current.on('FE-join-request-rejected', ({ requestId, meetId }) => {
        console.log('Join request rejected:', requestId, meetId);
        setIsCallingUser(false);
        toast('Your request to join the meeting was rejected', TOAST_DEFAULT_CONFIG);
        router.replace('/video-call');
      });

      socketRef.current.on('FE-join-request-timeout', ({ meetId, requestId }) => {
        console.log('Join request timed out:', requestId, meetId);
        setIsCallingUser(false);
        toast('Your request to join the meeting timed out', TOAST_DEFAULT_CONFIG);
        router.replace('/video-call');
      });

      socketRef.current.on('FE-meet-not-found', () => {
        console.log('Meeting not found');
        setIsCallingUser(false);
        toast('Meeting not found', TOAST_DEFAULT_CONFIG);
        router.replace('/video-call');
      });

      socketRef.current.on('FE-receive-call', async ({ signal, from, info }) => {
        console.log('Received call from:', from, info);
        const stream = await getUserStream();
        if (!stream) return;

        if (!peerRefs.current.has(from)) {
          const peer = addPeer(signal, from, stream);
          if (peer) {
            peerRefs.current.set(from, peer);
            setPeers(prevPeers => [...prevPeers, peer]);

            peer.on('stream', (peerStream: MediaStream) => {
              console.log(`Received stream from new peer ${from}`);
              const videoRef = peersVideoRefs.current.get(from)?.current;
              if (videoRef) {
                videoRef.srcObject = peerStream;
                videoRef.play().catch(err => console.error(`Error playing video for peer ${from}:`, err));
              }
            });

            if (!peersVideoRefs.current.has(from)) {
              const videoRef = React.createRef<HTMLVideoElement>();
              peersVideoRefs.current.set(from, videoRef);
            }

            if (!peersData.has(from)) {
              const userData = {
                id: from,
                name: info.userName,
                email: info.userEmail || '',
                isHost: info.isHost || false,
              };

              setPeersData(prev => {
                const newMap = new Map(prev);
                newMap.set(from, userData);
                return newMap;
              });

              setPeersMuted(prev => {
                const newMap = new Map(prev);
                newMap.set(from, !info.audio);
                return newMap;
              });

              setPeersVideoStopped(prev => {
                const newMap = new Map(prev);
                newMap.set(from, !info.video);
                return newMap;
              });
            }
          }
        }
      });

      socketRef.current.on('FE-call-accepted', ({ signal, answerId }) => {
        console.log('Call accepted from:', answerId);
        const peerObj = peerRefs.current.get(answerId);
        if (peerObj) {
          peerObj.signal(signal);
        }
      });

      const handleUserLeave = (userId: string) => {
        console.log('User left:', userId);
        const peerObj = peerRefs.current.get(userId);
        if (peerObj) {
          peerObj.destroy();
          peerRefs.current.delete(userId);
          peersVideoRefs.current.delete(userId);

          setPeers(prevPeers =>
            prevPeers.filter(p => p !== peerObj),
          );

          setPeersData(prev => {
            const newMap = new Map(prev);
            newMap.delete(userId);
            return newMap;
          });

          setPeersMuted(prev => {
            const newMap = new Map(prev);
            newMap.delete(userId);
            return newMap;
          });

          setPeersVideoStopped(prev => {
            const newMap = new Map(prev);
            newMap.delete(userId);
            return newMap;
          });

          setPeersSharingScreen(prev => {
            const newMap = new Map(prev);
            newMap.delete(userId);
            return newMap;
          });
        }
      };

      socketRef.current.on('FE-user-left', ({ userId }) => {
        handleUserLeave(userId);
      });

      socketRef.current.on('FE-user-audio-update', ({ userId, status }) => {
        setPeersMuted(prev => {
          const newMap = new Map(prev);
          newMap.set(userId, !status);
          return newMap;
        });
      });

      socketRef.current.on('FE-user-video-update', ({ userId, status }) => {
        setPeersVideoStopped(prev => {
          const newMap = new Map(prev);
          newMap.set(userId, !status);
          return newMap;
        });
      });

      socketRef.current.on('FE-screen-sharing-update', ({ userId, status }) => {
        console.log('Screen sharing update from user:', userId, status);
        setPeersSharingScreen(prev => {
          const newMap = new Map(prev);
          newMap.set(userId, status);
          return newMap;
        });
      });

      socketRef.current.on('FE-removed-from-meet', () => {
        console.log('You were removed from the meeting');
        toast('You have been removed from the meeting', TOAST_DEFAULT_CONFIG);
        clearMeetData();
        router.replace('/video-call?stopStream=true');
      });

      socketRef.current.on('FE-meet-name-updated', ({ name }) => {
        console.log('Meeting renamed to:', name);
        setMeetName(name);
      });
    };

    connectSocket();

    return () => {
      socketRef.current?.disconnect();
      clearUserStream();
      clearMeetData();
    };
  }, []);

  useEffect(() => {
    const setupPeerVideoHandlers = (peer: SimplePeer.Instance, peerId: string) => {
      peer.on('stream', (stream: MediaStream) => {
        console.log(`Received stream from peer ${peerId}`);
        const videoRef = peersVideoRefs.current.get(peerId)?.current;
        if (videoRef) {
          videoRef.srcObject = stream;
          videoRef.play().catch(err =>
            console.error(`Error playing video for peer ${peerId}:`, err),
          );
        }
      });

      peer.on('connect', () => {
        console.log(`Peer ${peerId} connected`);
      });

      peer.on('error', (err: any) => {
        console.error(`Peer ${peerId} error:`, err);
      });

      peer.on('close', () => {
        console.log(`Peer ${peerId} connection closed`);
      });
    };

    Array.from(peerRefs.current.entries()).forEach(([peerId, peer]) => {
      setupPeerVideoHandlers(peer, peerId);
    });
  }, []);

  return (
    <MeetContext.Provider
      value={{
        socketRef,
        userVideoRef,
        peersVideoRefs: peersVideoRefs.current,
        meetId,
        meetName,
        userData,
        peersData,
        callingOtherUserData,
        peersMuted,
        peersVideoStopped,
        userStream,
        isCallingUser,
        meetRequestAccepted,
        isReceivingMeetRequest,
        isSharingScreen,
        isUsingVideo,
        isUsingMicrophone,
        peersSharingScreen,
        peers,
        getUserStream,
        startNewMeet,
        joinMeet,
        acceptMeetRequest,
        rejectMeetRequest,
        cancelMeetRequest,
        renameMeet,
        removePeerFromMeet,
        leftMeet,
        updateStreamAudio,
        updateStreamVideo,
        updateScreenSharing,
        clearUserStream,
      }}
    >
      {children}
    </MeetContext.Provider>
  );
};

const useMeetContext = () => useContext(MeetContext);

export default useMeetContext;