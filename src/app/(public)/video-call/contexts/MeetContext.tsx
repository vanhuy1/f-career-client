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
import {
  TCallAcceptedEventData,
  TRequestMeetConnectionEventData,
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
  otherUserVideoRef: React.RefObject<HTMLVideoElement | null>;
  meetName: string;
  userData: TUser;
  otherUserData: TUser;
  callingOtherUserData: TUser;
  isOtherUserMuted: boolean;
  isOtherUserVideoStopped: boolean;
  userStream?: MediaStream;
  isCallingUser: boolean;
  meetRequestAccepted: boolean;
  isReceivingMeetRequest: boolean;
  isSharingScreen: boolean;
  isUsingVideo: boolean;
  isUsingMicrophone: boolean;
  isOtherUserSharingScreen: boolean;
  getUserStream: () => Promise<MediaStream | undefined>;
  startNewMeet: (
    userName: string,
    userEmail: string,
    meetName: string,
  ) => boolean;
  joinMeet: (userName: string, userEmail: string, userToCallId: string) => void;
  acceptMeetRequest: () => void;
  rejectMeetRequest: () => void;
  cancelMeetRequest: () => void;
  renameMeet: (newMeetName: string) => void;
  removeOtherUserFromMeet: () => void;
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

interface AcceptCallResponse extends SocketResponse {
  meetId?: string;
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

  const peerRef = useRef<SimplePeer.Instance | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const userVideoRef = useRef<HTMLVideoElement | null>(null);
  const otherUserVideoRef = useRef<HTMLVideoElement | null>(null);

  const [meetName, setMeetName] = useState<string>('');
  const [userData, setUserData] = useState<TUser>({} as TUser);
  const [otherUserData, setOtherUserData] = useState<TUser>({} as TUser);
  const [callingOtherUserData, setCallingOtherUserData] = useState<TUser>(
    {} as TUser,
  );
  const [isOtherUserMuted, setIsOtherUserMuted] = useState<boolean>(false);
  const [isOtherUserVideoStopped, setIsOtherUserVideoStopped] =
    useState<boolean>(false);
  const [userStream, setUserStream] = useState<MediaStream>();
  const [otherUserSignal, setOtherUserSignal] =
    useState<SimplePeer.SignalData>();
  const [callingOtherUserSignal, setCallingOtherUserSignal] =
    useState<SimplePeer.SignalData>();
  const [isCallingUser, setIsCallingUser] = useState<boolean>(false);
  const [meetRequestAccepted, setMeetRequestAccepted] =
    useState<boolean>(false);
  const [isReceivingMeetRequest, setIsReceivingMeetRequest] =
    useState<boolean>(false);
  const [isSharingScreen, setIsSharingScreen] = useState<boolean>(false);
  const [isUsingVideo, setIsUsingVideo] = useState<boolean>(false);
  const [isUsingMicrophone, setIsUsingMicrophone] = useState<boolean>(false);
  const [isOtherUserSharingScreen, setIsOtherUserSharingScreen] =
    useState<boolean>(false);
  const [disconnectedOtherUserId, setDisconnectedOtherUserId] =
    useState<string>('');

  const clearMeetData = () => {
    setOtherUserData({} as TUser);
    setOtherUserSignal(undefined);
    setCallingOtherUserData({} as TUser);
    setCallingOtherUserSignal(undefined);
    setIsCallingUser(false);
    setMeetRequestAccepted(false);
    setIsReceivingMeetRequest(false);
    setIsSharingScreen(false);
    setIsOtherUserSharingScreen(false);
  };

  const clearUserStream = () => {
    setUserStream(undefined);
  };

  const getUserStream = async () => {
    try {
      const stream = userStream
        ? userStream
        : await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
      if (userVideoRef.current) userVideoRef.current.srcObject = stream;
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

  const startNewMeet = (userName: string, userEmail: string, meet: string) => {
    try {
      if (socketRef.current) {
        const user = {
          id: socketRef.current.id ?? '',
          name: userName,
          email: userEmail,
        };
        socketRef.current.emit(
          'save-user-data',
          user,
          (response: SocketResponse) => {
            if (response && response.success) {
              console.log('User data saved successfully');
            } else {
              console.error('Failed to save user data:', response?.error);
            }
          },
        );
        setUserData(user);
        setMeetName(meet);
        return true;
      } else {
        console.error('Socket is not initialized');
        return false;
      }
    } catch (error) {
      console.log('Error starting new meet:', error);
      return false;
    }
  };

  const joinMeet = async (
    userName: string,
    userEmail: string,
    userToCallId: string,
  ) => {
    try {
      const stream = await getUserStream();
      if (!socketRef.current) {
        console.error('Socket is not initialized');
        return;
      }
      setIsCallingUser(true);
      const peer = new SimplePeer({
        initiator: true,
        trickle: false,
        config: PEER_CONFIGS,
        stream,
      });
      const user = {
        id: socketRef.current.id ?? '',
        name: userName,
        email: userEmail,
      };
      socketRef.current.emit(
        'save-user-data',
        user,
        (response: SocketResponse) => {
          if (!response || !response.success) {
            console.error('Failed to save user data:', response?.error);
          }
        },
      );
      socketRef.current.emit('check-meet-link', userToCallId);
      setUserData(user);
      setCallingOtherUserData({ id: userToCallId } as TUser);
      peer.on('signal', (data) => {
        if (socketRef.current) {
          socketRef.current.emit(
            'call-user',
            {
              to: userToCallId,
              from: user,
              signal: data,
            },
            (response: SocketResponse) => {
              if (!response || !response.success) {
                console.error('Call failed:', response?.error);
              }
            },
          );
        }
      });
      peer.on('stream', (stream) => {
        if (otherUserVideoRef.current)
          otherUserVideoRef.current.srcObject = stream;
      });
      peerRef.current = peer;
      router.push('/video-call/meet');
    } catch (error) {
      console.error('Error joining meet:', error);
    }
  };

  const acceptMeetRequest = () => {
    setMeetRequestAccepted(true);
    setIsReceivingMeetRequest(false);
    const otherUser = {
      data: callingOtherUserData,
      signal: callingOtherUserSignal,
    };
    setOtherUserData(otherUser.data);
    setOtherUserSignal(otherUser.signal);
    setCallingOtherUserData({} as TUser);
    setCallingOtherUserSignal(undefined);
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream: userStream,
    });
    peer.on('signal', (data) => {
      if (socketRef.current) {
        socketRef.current.emit(
          'accept-call',
          {
            to: otherUser.data.id,
            from: userData,
            signal: data,
            meetName,
          },
          (response: AcceptCallResponse) => {
            if (response && response.success) {
              if (response.meetId) {
                console.log('Joined meeting with ID:', response.meetId);
              }
            } else {
              console.error('Failed to accept call:', response?.error);
            }
          },
        );
      }
    });
    peer.on('stream', (stream) => {
      if (otherUserVideoRef.current)
        otherUserVideoRef.current.srcObject = stream;
    });
    setIsUsingVideo(true);
    setIsUsingMicrophone(true);
    peerRef.current = peer;
    if (otherUser.signal && peerRef.current) {
      peerRef.current.signal(otherUser.signal);
    }
  };

  const rejectMeetRequest = () => {
    if (socketRef.current) {
      socketRef.current.emit('reject-call', {
        to: callingOtherUserData.id,
        from: userData,
      });
    }
    clearMeetData();
  };

  const cancelMeetRequest = () => {
    if (socketRef.current) {
      socketRef.current.emit('cancel-meet-request', callingOtherUserData.id);
    }
    if (peerRef.current) {
      peerRef.current.destroy();
    }
    clearMeetData();
  };

  const renameMeet = (newMeetName: string) => {
    if (socketRef.current) {
      socketRef.current.emit('meet-new-name', {
        to: otherUserData.id,
        newMeetName,
      });
    }
    setMeetName(newMeetName);
  };

  const removeOtherUserFromMeet = () => {
    if (socketRef.current) {
      socketRef.current.emit('remove-from-meet', otherUserData.id);
    }
    clearMeetData();
  };

  const leftMeet = () => {
    const clearUserData = () => {
      setUserData({} as TUser);
      setIsUsingVideo(false);
      setIsUsingMicrophone(false);
      setMeetName('');
    };
    if (socketRef.current) {
      socketRef.current.emit('left-meet', {
        userId: userData.id,
        meetId: meetName,
      });
    }
    if (peerRef.current) {
      peerRef.current.destroy();
    }
    userVideoRef.current?.remove();
    clearUserData();
    clearMeetData();
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
        meetId: meetName,
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
        meetId: meetName,
        status: newVideoState,
      });
    }
  };

  const updateScreenSharing = async () => {
    try {
      if (isEmpty(otherUserData))
        return toast(
          videoCallText.toastMessage.canNotshareScreen,
          TOAST_DEFAULT_CONFIG,
        );
      const hasNoStream = await checkUserStream();
      if (hasNoStream) return;
      let stream;
      if (isSharingScreen) {
        stream = userStream;
        setIsSharingScreen(false);
        if (socketRef.current) {
          socketRef.current.emit('update-screen-sharing', {
            userId: userData.id,
            meetId: meetName,
            status: false,
          });
        }
      } else {
        stream = await navigator.mediaDevices.getDisplayMedia();
        setIsSharingScreen(true);
        if (socketRef.current) {
          socketRef.current.emit('update-screen-sharing', {
            userId: userData.id,
            meetId: meetName,
            status: true,
          });
        }
      }
      if (peerRef.current) {
        const [oldStream] = peerRef.current.streams;
        const [oldTrack] = oldStream.getVideoTracks();
        const newTrack = stream?.getVideoTracks()?.[0];
        if (!newTrack) {
          console.error('No video track available for screen sharing');
          return;
        }
        newTrack.onended = () => {
          const userTrack = userStream?.getVideoTracks()?.[0];
          if (!userTrack) {
            console.error('No user video track available');
            return;
          }
          if (peerRef.current) {
            peerRef.current.replaceTrack(oldTrack, userTrack, oldStream);
          }
          setIsSharingScreen(false);
        };
        peerRef.current.replaceTrack(oldTrack, newTrack, oldStream);
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
        socketRef.current.on('link-not-available', () => {
          cancelMeetRequest();
          const tracks = userStream?.getTracks();
          tracks?.forEach((track) => track.stop());
          router.replace('/video-call?stopStream=true');
          toast(
            videoCallText.toastMessage.linkNotAvailable,
            TOAST_DEFAULT_CONFIG,
          );
        });
        socketRef.current.on(
          'meet-name-updated',
          ({ name }: { name: string }) => {
            setMeetName(name);
            toast(
              videoCallText.toastMessage.meetNameUpdated,
              TOAST_DEFAULT_CONFIG,
            );
          },
        );
        socketRef.current.on('user-left', ({ userId }: { userId: string }) => {
          setDisconnectedOtherUserId(userId);
        });
        socketRef.current.on('removed-from-meet', () => {
          setMeetName('');
          clearMeetData();
          if (peerRef.current) {
            peerRef.current.destroy();
          }
          router.replace('/video-call?stopStream=true');
          toast(
            videoCallText.toastMessage.userRemovedFromMeet,
            TOAST_DEFAULT_CONFIG,
          );
        });
        socketRef.current.on('other-user-left-meet', () => {
          setMeetName('');
          clearMeetData();
          if (peerRef.current) {
            peerRef.current.destroy();
          }
          toast(
            videoCallText.toastMessage.otherUserLeftMeet,
            TOAST_DEFAULT_CONFIG,
          );
        });
        socketRef.current.on(
          'user-audio-update',
          ({ userId, status }: { userId: string; status: boolean }) => {
            if (userId === otherUserData.id && otherUserVideoRef.current) {
              otherUserVideoRef.current.muted = !status;
              setIsOtherUserMuted(!status);
            }
          },
        );
        socketRef.current.on(
          'user-video-update',
          ({ userId, status }: { userId: string; status: boolean }) => {
            if (userId === otherUserData.id) {
              setIsOtherUserVideoStopped(!status);
            }
          },
        );
        socketRef.current.on(
          'screen-sharing-update',
          ({ userId, status }: { userId: string; status: boolean }) => {
            if (userId === otherUserData.id) {
              setIsOtherUserSharingScreen(status);
            }
          },
        );
        socketRef.current.on(
          'incoming-call',
          (data: TRequestMeetConnectionEventData) => {
            setIsReceivingMeetRequest(true);
            setCallingOtherUserData(data.from);
            setCallingOtherUserSignal(data.signal);
          },
        );
        socketRef.current.on(
          'call-accepted',
          (data: TCallAcceptedEventData) => {
            setIsCallingUser(false);
            setMeetRequestAccepted(true);
            setMeetName(data.meetName);
            setOtherUserData(data.from);
            if (peerRef.current) {
              peerRef.current.signal(data.signal);
            }
          },
        );
        socketRef.current.on('call-rejected', () => {
          clearMeetData();
          if (peerRef.current) {
            peerRef.current.destroy();
          }
          toast(
            videoCallText.toastMessage.requestDeclined,
            TOAST_DEFAULT_CONFIG,
          );
        });
        socketRef.current.on('call-canceled', () => {
          clearMeetData();
        });
        socketRef.current.on('other-user-already-in-meet', () => {
          cancelMeetRequest();
          toast(
            videoCallText.toastMessage.otherUserInMeet,
            TOAST_DEFAULT_CONFIG,
          );
        });
        socketRef.current.on(
          'new-message',
          ({
            from,
            message,
          }: {
            from: TUser;
            message: string;
            timestamp: string;
          }) => {
            console.log(`Message from ${from.name}: ${message}`);
          },
        );
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
        socketRef.current.off('connect');
        socketRef.current.off('connect_error');
        socketRef.current.off('link-not-available');
        socketRef.current.off('meet-name-updated');
        socketRef.current.off('user-left');
        socketRef.current.off('removed-from-meet');
        socketRef.current.off('other-user-left-meet');
        socketRef.current.off('user-audio-update');
        socketRef.current.off('user-video-update');
        socketRef.current.off('screen-sharing-update');
        socketRef.current.off('incoming-call');
        socketRef.current.off('call-accepted');
        socketRef.current.off('call-rejected');
        socketRef.current.off('call-canceled');
        socketRef.current.off('other-user-already-in-meet');
        socketRef.current.off('new-message');
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isReceivingMeetRequest) {
      const alreadyInMeet = otherUserSignal || !isEmpty(otherUserData);
      if (alreadyInMeet && socketRef.current) {
        socketRef.current.emit('already-in-meet', callingOtherUserData.id);
      }
    }
  }, [
    isReceivingMeetRequest,
    callingOtherUserData.id,
    otherUserData,
    otherUserSignal,
  ]);

  useEffect(() => {
    if (disconnectedOtherUserId) {
      if (disconnectedOtherUserId === otherUserData.id) {
        clearMeetData();
        if (peerRef.current) {
          peerRef.current.destroy();
        }
        toast(
          videoCallText.toastMessage.otherUserLeftMeet,
          TOAST_DEFAULT_CONFIG,
        );
      } else {
        setDisconnectedOtherUserId('');
      }
    }
  }, [disconnectedOtherUserId, otherUserData.id]);

  return (
    <MeetContext.Provider
      value={{
        socketRef,
        userVideoRef,
        otherUserVideoRef,
        meetName,
        userData,
        otherUserData,
        callingOtherUserData,
        isOtherUserMuted,
        isOtherUserVideoStopped,
        userStream,
        isCallingUser,
        meetRequestAccepted,
        isReceivingMeetRequest,
        isSharingScreen,
        isUsingVideo,
        isUsingMicrophone,
        isOtherUserSharingScreen,
        getUserStream,
        startNewMeet,
        joinMeet,
        acceptMeetRequest,
        rejectMeetRequest,
        cancelMeetRequest,
        renameMeet,
        removeOtherUserFromMeet,
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
