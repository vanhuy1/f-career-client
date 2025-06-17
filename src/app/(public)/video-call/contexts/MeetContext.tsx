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
import { io, Socket } from 'socket.io-client';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import {
  TUser,
} from '../utils/types';
import {
  PEER_CONFIGS,
  TOAST_DEFAULT_CONFIG,
  SOCKET_URL,
  SOCKET_OPTIONS,
} from '../utils/constants';
import { isEmpty } from '../utils/functions';
import { videoCallText } from '../utils/text';

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
  getUserStream: () => Promise<MediaStream | undefined>;
  startNewMeet: (
    userName: string,
    userEmail: string,
    meetName: string,
  ) => boolean;
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
  const [disconnectedPeerId, setDisconnectedPeerId] = useState<string>('');

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
      };
      const newMeetId = uuidv4();
      socketRef.current.emit(
        'save-user-data',
        user,
        (response: SocketResponse) => {
          if (response.success) {
            setUserData(user);
            socketRef.current?.emit(
              'create-meet',
              { meetId: newMeetId, meetName: meetDisplayName },
              (res: SocketResponse & { meetId?: string; meetName?: string }) => {
                if (res.success) {
                  setMeetId(newMeetId);
                  setMeetName(meetDisplayName);
                  router.push('/video-call/meet');
                } else {
                  toast(res.error || 'Failed to create meeting', TOAST_DEFAULT_CONFIG);
                }
              },
            );
          } else {
            console.error('Failed to save user data:', response.error);
            toast(response.error || 'Failed to save user data', TOAST_DEFAULT_CONFIG);
          }
        },
      );
      return true;
    } catch (error) {
      console.error('Error starting new meet:', error);
      toast('Error starting meeting', TOAST_DEFAULT_CONFIG);
      return false;
    }
  };

  const joinMeet = async (userName: string, userEmail: string, meetId: string) => {
    try {
      const stream = await getUserStream();
      if (!stream || !socketRef.current) {
        console.error('Socket or stream not initialized');
        toast('Connection error. Please try again.', TOAST_DEFAULT_CONFIG);
        return;
      }
      const user = {
        id: socketRef.current.id ?? '',
        name: userName,
        email: userEmail,
      };
      socketRef.current.emit(
        'save-user-data',
        user,
        (response: SocketResponse) => {
          if (response.success) {
            setUserData(user);
            socketRef.current?.emit(
              'join-meet',
              { meetId, user },
              (res: SocketResponse & { meetName?: string }) => {
                if (res.success && res.meetName) {
                  setMeetName(res.meetName);
                } else {
                  toast(res.error || 'Failed to join meeting', TOAST_DEFAULT_CONFIG);
                }
              },
            );
          } else {
            console.error('Failed to save user data:', response.error);
            toast(response.error || 'Failed to save user data', TOAST_DEFAULT_CONFIG);
          }
        },
      );
    } catch (error) {
      console.error('Error joining meet:', error);
      toast('Error joining meeting', TOAST_DEFAULT_CONFIG);
    }
  };

  const createPeer = (peerId: string, initiator: boolean, stream: MediaStream) => {
    if (!stream) {
      console.error('No stream available for peer creation');
      return null;
    }
    const peer = new SimplePeer({
      initiator,
      trickle: false,
      config: PEER_CONFIGS,
      stream,
    });
    peer.on('signal', (data) => {
      if (socketRef.current) {
        socketRef.current.emit('signal', {
          to: peerId,
          from: userData.id,
          signal: data,
          meetId,
        });
      }
    });
    peer.on('stream', (peerStream) => {
      const videoRef = peersVideoRefs.current.get(peerId);
      if (videoRef?.current) {
        videoRef.current.srcObject = peerStream;
      } else {
        const newRef = React.createRef<HTMLVideoElement>();
        peersVideoRefs.current.set(peerId, newRef);
        setTimeout(() => {
          if (newRef.current) {
            newRef.current.srcObject = peerStream;
            newRef.current.muted = false;
          }
        }, 0);
      }
    });
    peer.on('error', (err) => {
      console.error(`Peer error with ${peerId}:`, err);
      removePeerFromMeet(peerId);
      toast(`Connection error with ${peersData.get(peerId)?.name || 'user'}`, TOAST_DEFAULT_CONFIG);
    });
    peer.on('close', () => {
      removePeerFromMeet(peerId);
    });
    peerRefs.current.set(peerId, peer);
    return peer;
  };

  const acceptMeetRequest = (callerId: string) => {
    setMeetRequestAccepted(true);
    setIsReceivingMeetRequest(false);
    setCallingOtherUserData({} as TUser);
    router.push('/video-call/meet');
  };

  const rejectMeetRequest = (callerId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('reject-call', {
        to: callerId,
        from: userData,
      });
    }
    setIsReceivingMeetRequest(false);
    setCallingOtherUserData({} as TUser);
  };

  const cancelMeetRequest = () => {
    if (socketRef.current) {
      socketRef.current.emit('cancel-meet-request', { meetId });
    }
    clearMeetData();
    clearUserStream();
    router.replace('/video-call?stopStream=true');
  };

  const renameMeet = (newMeetName: string) => {
    if (socketRef.current) {
      socketRef.current.emit('meet-new-name', {
        meetId,
        newMeetName,
      });
    }
  };

  const removePeerFromMeet = (peerId: string) => {
    const peer = peerRefs.current.get(peerId);
    if (peer) {
      peer.destroy();
      peerRefs.current.delete(peerId);
    }
    peersVideoRefs.current.delete(peerId);
    setPeersData((prev) => {
      const newMap = new Map(prev);
      newMap.delete(peerId);
      return newMap;
    });
    setPeersMuted((prev) => {
      const newMap = new Map(prev);
      newMap.delete(peerId);
      return newMap;
    });
    setPeersVideoStopped((prev) => {
      const newMap = new Map(prev);
      newMap.delete(peerId);
      return newMap;
    });
    setPeersSharingScreen((prev) => {
      const newMap = new Map(prev);
      newMap.delete(peerId);
      return newMap;
    });
  };

  const leftMeet = () => {
    if (socketRef.current) {
      socketRef.current.emit('left-meet', {
        userId: userData.id,
        meetId,
      });
    }
    clearMeetData();
    clearUserStream();
    setUserData({} as TUser);
    setIsUsingVideo(false);
    setIsUsingMicrophone(false);
    setMeetId('');
    setMeetName('');
    router.replace('/video-call?stopStream=true');
  };

  const updateStreamAudio = async () => {
    const hasNoStream = await checkUserStream();
    if (hasNoStream) return;
    const newMicrophoneState = !isUsingMicrophone;
    setIsUsingMicrophone(newMicrophoneState);
    if (userStream) {
      const audioTracks = userStream.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = newMicrophoneState;
      });
    }
    if (socketRef.current) {
      socketRef.current.emit('update-user-audio', {
        userId: userData.id,
        meetId,
        status: newMicrophoneState,
      });
    }
  };

  const updateStreamVideo = async () => {
    const hasNoStream = await checkUserStream();
    if (hasNoStream) return;
    const newVideoState = !isUsingVideo;
    setIsUsingVideo(newVideoState);
    if (userStream) {
      const videoTracks = userStream.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = newVideoState;
      });
    }
    if (socketRef.current) {
      socketRef.current.emit('update-user-video', {
        userId: userData.id,
        meetId,
        status: newVideoState,
      });
    }
  };

  const updateScreenSharing = async () => {
    try {
      const hasNoStream = await checkUserStream();
      if (hasNoStream) return;
      let stream: MediaStream | undefined;
      if (isSharingScreen) {
        stream = userStream;
        setIsSharingScreen(false);
      } else {
        stream = await navigator.mediaDevices.getDisplayMedia();
        setIsSharingScreen(true);
      }
      if (stream && socketRef.current) {
        socketRef.current.emit('update-screen-sharing', {
          userId: userData.id,
          meetId,
          status: isSharingScreen,
        });
        peerRefs.current.forEach((peer, peerId) => {
          const [oldStream] = peer.streams;
          if (oldStream) {
            const [oldTrack] = oldStream.getVideoTracks();
            const newTrack = stream!.getVideoTracks()[0];
            newTrack.onended = () => {
              const userTrack = userStream?.getVideoTracks()[0];
              if (userTrack && peer) {
                peer.replaceTrack(oldTrack, userTrack, oldStream);
                setIsSharingScreen(false);
                socketRef.current?.emit('update-screen-sharing', {
                  userId: userData.id,
                  meetId,
                  status: false,
                });
              }
            };
            peer.replaceTrack(oldTrack, newTrack, oldStream);
          }
        });
      }
    } catch (error) {
      console.error('Error updating screen sharing:', error);
      toast(
        videoCallText.toastMessage.sharingScreenError,
        TOAST_DEFAULT_CONFIG,
      );
    }
  };

  useEffect(() => {
    const handleSocketConnection = async () => {
      try {
        socketRef.current = io(SOCKET_URL, SOCKET_OPTIONS);
        socketRef.current.on('connect', () => {
          console.log('Connected to video call server');
        });
        socketRef.current.on('connect_error', (error: Error) => {
          console.error('Socket connection error:', error.message);
          toast(
            'Connection error. Please check your internet connection.',
            TOAST_DEFAULT_CONFIG,
          );
        });
        socketRef.current.on('meet-joined', ({ meetId, meetName, users }: { meetId: string; meetName: string; users: TUser[] }) => {
          setMeetId(meetId);
          setMeetName(meetName);
          setMeetRequestAccepted(true);
          const stream = userStream;
          if (!stream) return;
          users.forEach((peerUser) => {
            if (peerUser.id !== userData.id) {
              setPeersData((prev) => new Map(prev).set(peerUser.id, peerUser));
              createPeer(peerUser.id, true, stream);
            }
          });
        });
        socketRef.current.on('new-user-joined', ({ user }: { user: TUser }) => {
          if (user.id !== userData.id) {
            setPeersData((prev) => new Map(prev).set(user.id, user));
            setIsReceivingMeetRequest(true);
            setCallingOtherUserData(user);
            if (userStream) {
              createPeer(user.id, true, userStream);
            }
          }
        });
        socketRef.current.on('signal', ({ from, signal, meetId: receivedMeetId }: { from: string; signal: any; meetId: string }) => {
          if (receivedMeetId !== meetId) return;
          let peer = peerRefs.current.get(from);
          if (!peer && userStream) {
            const newPeer = createPeer(from, false, userStream);
            if (newPeer) peer = newPeer;
          }
          if (peer) {
            try {
              peer.signal(signal);
            } catch (error) {
              console.error(`Error signaling peer ${from}:`, error);
            }
          }
        });
        socketRef.current.on('meet-name-updated', ({ name }: { name: string }) => {
          setMeetName(name);
          toast(
            videoCallText.toastMessage.meetNameUpdated,
            TOAST_DEFAULT_CONFIG,
          );
        });
        socketRef.current.on('other-user-left-meet', ({ userId }: { userId: string }) => {
          removePeerFromMeet(userId);
          toast(
            `${peersData.get(userId)?.name || 'User'} left the meet`,
            TOAST_DEFAULT_CONFIG,
          );
        });
        socketRef.current.on('removed-from-meet', () => {
          setMeetId('');
          setMeetName('');
          clearMeetData();
          clearUserStream();
          router.replace('/video-call?stopStream=true');
          toast(
            videoCallText.toastMessage.userRemovedFromMeet,
            TOAST_DEFAULT_CONFIG,
          );
        });
        socketRef.current.on('user-audio-update', ({ userId, status }: { userId: string; status: boolean }) => {
          setPeersMuted((prev) => new Map(prev).set(userId, !status));
          const videoRef = peersVideoRefs.current.get(userId);
          if (videoRef?.current) {
            videoRef.current.muted = !status;
          }
        });
        socketRef.current.on('user-video-update', ({ userId, status }: { userId: string; status: boolean }) => {
          setPeersVideoStopped((prev) => new Map(prev).set(userId, !status));
        });
        socketRef.current.on('screen-sharing-update', ({ userId, status }: { userId: string; status: boolean }) => {
          setPeersSharingScreen((prev) => new Map(prev).set(userId, status));
        });
        socketRef.current.on('call-rejected', ({ from }: { from: TUser }) => {
          clearMeetData();
          clearUserStream();
          toast(
            `${from.name} declined the call`,
            TOAST_DEFAULT_CONFIG,
          );
        });
        socketRef.current.on('call-canceled', () => {
          clearMeetData();
          clearUserStream();
          router.replace('/video-call?stopStream=true');
        });
        socketRef.current.on('meet-not-found', () => {
          cancelMeetRequest();
          toast(
            videoCallText.toastMessage.linkNotAvailable,
            TOAST_DEFAULT_CONFIG,
          );
        });
        socketRef.current.on('new-message', ({ from, message, timestamp }: { from: TUser; message: string; timestamp: string }) => {
          setPeersData((prev) => {
            if (!prev.has(from.id)) {
              return new Map(prev).set(from.id, from);
            }
            return prev;
          });
        });
      } catch (error) {
        console.error('Could not initialize socket connection:', error);
        toast(
          'Connection error. Please try again later.',
          TOAST_DEFAULT_CONFIG,
        );
      }
    };
    handleSocketConnection();
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.removeAllListeners();
      }
    };
  }, []);

  useEffect(() => {
    if (disconnectedPeerId) {
      removePeerFromMeet(disconnectedPeerId);
      setDisconnectedPeerId('');
    }
  }, [disconnectedPeerId]);

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
        ...testData,
      }}
    >
      {children}
    </MeetContext.Provider>
  );
};

const useMeetContext = () => useContext(MeetContext);
export default useMeetContext;