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
import {
  TUser,
} from '../utils/types';
import {
  PEER_CONFIGS,
  TOAST_DEFAULT_CONFIG
} from '../utils/constants';
import { isEmpty } from '../utils/functions';
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
      
      // First save user data
      const user = {
        id: socketRef.current.id ?? '',
        name: userName,
        email: userEmail,
        isHost: true
      };
      
      // Save user data first
      socketRef.current.emit('save-user-data', user, (response: any) => {
        if (response?.success) {
          setUserData(user);
          
          // Create a new meeting with a unique ID
          const meetId = uuidv4();
          
          socketRef.current?.emit('create-meet', { 
            meetId, 
            meetName: meetDisplayName 
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
        isHost: false
      };
      
      console.log(`Attempting to join meeting: ${meetId}`);
      setMeetId(meetId);
      
      // First save user data
      socketRef.current.emit('save-user-data', user, (response: any) => {
        if (response?.success) {
          setUserData(user);
          setIsCallingUser(true);
          
          // Request to join the meeting - requires host approval
          socketRef.current?.emit('request-join-meet', { 
            meetId, 
            user 
          }, (response: any) => {
            if (!response?.success) {
              setIsCallingUser(false);
              toast(response?.error || 'Failed to join meeting', TOAST_DEFAULT_CONFIG);
              router.replace('/video-call');
              return;
            }
            
            // If direct join (e.g., user is host), navigate to meet page
            if (response.directJoin) {
              setIsCallingUser(false);
              router.push('/video-call/meet');
            }
            // Otherwise wait for host approval (handled by socket events)
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

  // Function to create a peer initiator (outgoing connection)
  const createPeer = (peerId: string, stream: MediaStream) => {
    try {
      const peer = new SimplePeer({
        initiator: true,
        trickle: false,
        stream,
        config: PEER_CONFIGS,
      });

      peer.on('signal', (signal) => {
        // Using the legacy BE-prefixed event pattern
        socketRef.current?.emit('BE-call-user', {
          userToCall: peerId,
          from: socketRef.current?.id,
          signal,
          info: {
            userName: userData.name,
            userEmail: userData.email,
            video: isUsingVideo,
            audio: isUsingMicrophone
          }
        });
      });

      peer.on('disconnect', () => {
        peer.destroy();
      });

      peer.on('close', () => {
        peer.destroy();
      });

      return peer;
    } catch (error) {
      console.error('Error creating peer:', error);
      return null;
    }
  };

  // Function to add a peer (incoming connection)
  const addPeer = (incomingSignal: SimplePeer.SignalData, callerId: string, stream: MediaStream) => {
    try {
      const peer = new SimplePeer({
        initiator: false,
        trickle: false,
        stream,
        config: PEER_CONFIGS,
      });

      peer.on('signal', (signal) => {
        // Using the legacy BE-prefixed event pattern
        socketRef.current?.emit('BE-accept-call', { 
          signal, 
          to: callerId,
          info: {
            userName: userData.name,
            userEmail: userData.email,
            video: isUsingVideo,
            audio: isUsingMicrophone
          }
        });
      });

      peer.on('disconnect', () => {
        peer.destroy();
      });

      peer.on('close', () => {
        peer.destroy();
      });

      peer.signal(incomingSignal);
      return peer;
    } catch (error) {
      console.error('Error adding peer:', error);
      return null;
    }
  };

  const acceptMeetRequest = (callerId: string) => {
    setIsReceivingMeetRequest(false);
    
    // Get the stored request ID
    const requestId = localStorage.getItem('pendingRequestId');
    if (!requestId) {
      console.error('No pending request ID found');
      toast('Error accepting request', TOAST_DEFAULT_CONFIG);
      return;
    }
    
    socketRef.current?.emit(
      'approve-join-request',
      { requestId, meetId, userId: callerId },
      (response: SocketResponse) => {
        if (!response.success) {
          console.error('Failed to accept meet request:', response.error);
          toast(response.error || 'Failed to accept meeting request', TOAST_DEFAULT_CONFIG);
        } else {
          // Clear the pending request ID
          localStorage.removeItem('pendingRequestId');
        }
      },
    );
  };

  const rejectMeetRequest = (callerId: string) => {
    setIsReceivingMeetRequest(false);
    
    // Get the stored request ID
    const requestId = localStorage.getItem('pendingRequestId');
    if (!requestId) {
      console.error('No pending request ID found');
      toast('Error rejecting request', TOAST_DEFAULT_CONFIG);
      return;
    }
    
    socketRef.current?.emit(
      'reject-join-request',
      { requestId, meetId, userId: callerId },
      (response: SocketResponse) => {
        if (!response.success) {
          console.error('Failed to reject meet request:', response.error);
        } else {
          // Clear the pending request ID
          localStorage.removeItem('pendingRequestId');
        }
      },
    );
  };

  const cancelMeetRequest = () => {
    setIsCallingUser(false);
    
    // Get the stored request ID
    const requestId = localStorage.getItem('pendingRequestId');
    if (requestId) {
      socketRef.current?.emit(
        'cancel-join-request',
        { requestId, meetId },
        (response: SocketResponse) => {
          if (!response.success) {
            console.error('Failed to cancel join request:', response.error);
          } else {
            // Clear the pending request ID
            localStorage.removeItem('pendingRequestId');
          }
        },
      );
    } else {
      console.log('No pending request to cancel');
    }
    
    router.replace('/video-call');
  };

  const renameMeet = (newMeetName: string) => {
    socketRef.current?.emit(
      'meet-new-name',
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
        'remove-from-meet',
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
    socketRef.current?.emit('left-meet', { 
      meetId, 
      userId: userData.id 
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
    
    // Update audio status using the NestJS event
    socketRef.current?.emit('update-user-audio', {
      meetId,
      userId: userData.id,
      status: newStatus
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
    
    // Update video status using the NestJS event
    socketRef.current?.emit('update-user-video', {
      meetId,
      userId: userData.id,
      status: newStatus
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

        // Replace video track in all peers
        peerRefs.current.forEach((peer) => {
          // Access the internal PeerConnection (may require type assertion)
          const peerWithPC = peer as unknown as { _pc: RTCPeerConnection };
          const sender = peerWithPC._pc
            .getSenders()
            .find((s: RTCRtpSender) => s.track?.kind === 'video');
          sender?.replaceTrack(screenTrack);
        });

        // Save original video track to restore later
        const originalVideoTrack = userStream?.getVideoTracks()[0];
        if (originalVideoTrack) {
          originalVideoTrack.enabled = false;
        }

        // Update user video
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = screenStream;
          userVideoRef.current.muted = true;
        }

        // Handle screen sharing stop
        screenTrack.onended = () => {
          updateScreenSharing();
        };

        setIsSharingScreen(true);
        // Update screen sharing status
        socketRef.current?.emit('update-screen-sharing', {
          meetId,
          userId: userData.id,
          status: true
        });
      } else {
        // Restore original video track
        if (userStream) {
          const videoTrack = userStream.getVideoTracks()[0];
          if (videoTrack) {
            videoTrack.enabled = true;

            // Replace screen track with video track in all peers
            peerRefs.current.forEach((peer) => {
              // Access the internal PeerConnection (may require type assertion)
              const peerWithPC = peer as unknown as { _pc: RTCPeerConnection };
              const sender = peerWithPC._pc
                .getSenders()
                .find((s: RTCRtpSender) => s.track?.kind === 'video');
              sender?.replaceTrack(videoTrack);
            });

            // Update user video
            if (userVideoRef.current) {
              userVideoRef.current.srcObject = userStream;
              userVideoRef.current.muted = true;
            }
          }
        }

        setIsSharingScreen(false);
        // Update screen sharing status
        socketRef.current?.emit('update-screen-sharing', {
          meetId,
          userId: userData.id,
          status: false
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
      
      console.log('Socket initialized, connected:', socket?.connected);
      
      // Socket connection handlers
      socketRef.current.on('connect', () => {
        console.log('Socket connected with ID:', socketRef.current?.id);
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        toast('Connection error. Please try again.', TOAST_DEFAULT_CONFIG);
      });
      
      // Handle both new-user-joined and FE-user-join events
      socketRef.current.on('new-user-joined', async ({user}: {user: TUser}) => {
        console.log('New user joined:', user);
        const stream = await getUserStream();
        if (!stream) return;
        
        if (user.id !== userData.id) {
          // Create a peer connection for the new user
          const peer = createPeer(user.id, stream);
          if (peer) {
            peerRefs.current.set(user.id, peer);
            setPeers(prevPeers => [...prevPeers, peer]);
            
            // Setup stream handlers for the new peer
            peer.on('stream', (peerStream) => {
              console.log(`Received stream from new peer ${user.id}`);
              // Get the video element for this peer
              const videoRef = peersVideoRefs.current.get(user.id)?.current;
              if (videoRef) {
                videoRef.srcObject = peerStream;
                videoRef.play().catch(err => console.error(`Error playing video for peer ${user.id}:`, err));
              }
            });
            
            // Create video ref for this peer
            const videoRef = React.createRef<HTMLVideoElement>();
            peersVideoRefs.current.set(user.id, videoRef);
            
            // Add user data
            setPeersData(prev => {
              const newMap = new Map(prev);
              newMap.set(user.id, user);
              return newMap;
            });
            
            // Set initial audio/video state
            setPeersMuted(prev => {
              const newMap = new Map(prev);
              newMap.set(user.id, false); // Assume unmuted initially
              return newMap;
            });
            
            setPeersVideoStopped(prev => {
              const newMap = new Map(prev);
              newMap.set(user.id, false); // Assume video on initially
              return newMap;
            });
          }
        }
      });
      
      // Handle legacy FE-user-join event
      socketRef.current.on('FE-user-join', async (users: Array<{userId: string, info: any}>) => {
        console.log('Users in meet:', users);
        const stream = await getUserStream();
        if (!stream) return;
        
        const newPeers: SimplePeer.Instance[] = [];
        const newPeersData = new Map(peersData);
        
        users.forEach(({userId, info}) => {
          if (userId !== socketRef.current?.id && !peerRefs.current.has(userId)) {
            const peer = createPeer(userId, stream);
            if (peer) {
              peerRefs.current.set(userId, peer);
              newPeers.push(peer);
              
              // Setup stream handlers for the new peer
              peer.on('stream', (peerStream) => {
                console.log(`Received stream from new peer ${userId}`);
                // Create video ref for this peer if needed
                const videoRef = peersVideoRefs.current.get(userId)?.current;
                if (videoRef) {
                  videoRef.srcObject = peerStream;
                  videoRef.play().catch(err => console.error(`Error playing video for peer ${userId}:`, err));
                }
              });
              
              // Create video ref for this peer
              const videoRef = React.createRef<HTMLVideoElement>();
              peersVideoRefs.current.set(userId, videoRef);
              
              // Add user data
              const userData = {
                id: userId,
                name: info.userName,
                email: info.userEmail || '',
                isHost: info.isHost || false
              };
              newPeersData.set(userId, userData);
              
              // Set initial audio/video state
              setPeersMuted(prev => {
                const newMap = new Map(prev);
                newMap.set(userId, !info.audio);
                return newMap;
              });
              
              setPeersVideoStopped(prev => {
                const newMap = new Map(prev);
                newMap.set(userId, !info.video);
                return newMap;
              });
            }
          }
        });
        
        setPeers(prevPeers => [...prevPeers, ...newPeers]);
        setPeersData(newPeersData);
      });
      
      // Handle meeting joined event
      socketRef.current.on('meet-joined', ({meetId, meetName, users, isHost}: {meetId: string, meetName: string, users: TUser[], isHost: boolean}) => {
        console.log('Joined meeting:', meetId, meetName, users);
        setMeetId(meetId);
        setMeetName(meetName);
        setIsCallingUser(false);
        setMeetRequestAccepted(true);
        
        // Initialize peer connections for existing users
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
                
                // Create video ref for this peer
                const videoRef = React.createRef<HTMLVideoElement>();
                peersVideoRefs.current.set(user.id, videoRef);
                
                // Add user data
                newPeersData.set(user.id, user);
                
                // Set initial audio/video state
                setPeersMuted(prev => {
                  const newMap = new Map(prev);
                  newMap.set(user.id, false); // Assume unmuted initially
                  return newMap;
                });
                
                setPeersVideoStopped(prev => {
                  const newMap = new Map(prev);
                  newMap.set(user.id, false); // Assume video on initially
                  return newMap;
                });
              }
            }
          });
          
          setPeers(newPeers);
          setPeersData(newPeersData);
        });
        
        // Navigate to meeting page if not already there
        if (!window.location.pathname.includes('/meet')) {
          router.push('/video-call/meet');
        }
      });
      
      // Handle join request events for host
      socketRef.current.on('join-request-received', ({requestId, meetId, meetName, user}) => {
        console.log('Join request received:', requestId, meetId, user);
        setCallingOtherUserData(user);
        setIsReceivingMeetRequest(true);
        
        // Store request ID for approval/rejection
        localStorage.setItem('pendingRequestId', requestId);
      });
      
      // Handle join request events for participant
      socketRef.current.on('join-request-sent', ({requestId, meetId, meetName}) => {
        console.log('Join request sent:', requestId, meetId);
        // Store request ID in case user wants to cancel
        localStorage.setItem('pendingRequestId', requestId);
      });
      
      // Handle join request approval
      socketRef.current.on('join-meet-approved', ({requestId, meetId, meetName}) => {
        console.log('Join request approved:', requestId, meetId);
        setIsCallingUser(false);
        setMeetRequestAccepted(true);
        
        // Join the meeting after approval
        socketRef.current?.emit('join-after-approval', {meetId, requestId}, (response: any) => {
          if (!response.success) {
            console.error('Failed to join after approval:', response.error);
            toast('Failed to join meeting', TOAST_DEFAULT_CONFIG);
            router.replace('/video-call');
          }
        });
      });
      
      // Handle join request rejection
      socketRef.current.on('join-request-rejected', ({requestId, meetId}) => {
        console.log('Join request rejected:', requestId, meetId);
        setIsCallingUser(false);
        toast('Your request to join the meeting was rejected', TOAST_DEFAULT_CONFIG);
        router.replace('/video-call');
      });
      
      // Handle join request timeout
      socketRef.current.on('join-request-timeout', ({meetId, requestId}) => {
        console.log('Join request timed out:', requestId, meetId);
        setIsCallingUser(false);
        toast('Your request to join the meeting timed out', TOAST_DEFAULT_CONFIG);
        router.replace('/video-call');
      });
      
      // Handle meeting not found
      socketRef.current.on('meet-not-found', () => {
        console.log('Meeting not found');
        setIsCallingUser(false);
        toast('Meeting not found', TOAST_DEFAULT_CONFIG);
        router.replace('/video-call');
      });
      
      // Handle receiving call from other user
      socketRef.current.on('FE-receive-call', async ({signal, from, info}) => {
        console.log('Received call from:', from, info);
        const stream = await getUserStream();
        if (!stream) return;
        
        // Check if we already have this peer
        if (!peerRefs.current.has(from)) {
          const peer = addPeer(signal, from, stream);
          if (peer) {
            peerRefs.current.set(from, peer);
            setPeers(prevPeers => [...prevPeers, peer]);
            
            // Setup stream handlers for the new peer
            peer.on('stream', (peerStream) => {
              console.log(`Received stream from new peer ${from}`);
              // Get the video element for this peer
              const videoRef = peersVideoRefs.current.get(from)?.current;
              if (videoRef) {
                videoRef.srcObject = peerStream;
                videoRef.play().catch(err => console.error(`Error playing video for peer ${from}:`, err));
              }
            });
            
            // Create video ref for this peer if it doesn't exist
            if (!peersVideoRefs.current.has(from)) {
              const videoRef = React.createRef<HTMLVideoElement>();
              peersVideoRefs.current.set(from, videoRef);
            }
            
            // Add user data if not already present
            if (!peersData.has(from)) {
              const userData = {
                id: from,
                name: info.userName,
                email: info.userEmail || '',
                isHost: info.isHost || false
              };
              
              setPeersData(prev => {
                const newMap = new Map(prev);
                newMap.set(from, userData);
                return newMap;
              });
              
              // Set initial audio/video state
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
      
      // Handle call acceptance
      socketRef.current.on('FE-call-accepted', ({signal, answerId}) => {
        console.log('Call accepted from:', answerId);
        const peerObj = peerRefs.current.get(answerId);
        if (peerObj) {
          peerObj.signal(signal);
        }
      });
      
      // Handle user leaving - support both events
      const handleUserLeave = (userId: string) => {
        console.log('User left:', userId);
        const peerObj = peerRefs.current.get(userId);
        if (peerObj) {
          peerObj.destroy();
          peerRefs.current.delete(userId);
          peersVideoRefs.current.delete(userId);
          
          setPeers(prevPeers => 
            prevPeers.filter(p => p !== peerObj)
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
      
      socketRef.current.on('other-user-left-meet', ({userId}) => {
        handleUserLeave(userId);
      });
      
      socketRef.current.on('FE-user-leave', ({userId}) => {
        handleUserLeave(userId);
      });
      
      // Handle user audio/video updates
      socketRef.current.on('user-audio-update', ({userId, status}) => {
        setPeersMuted(prev => {
          const newMap = new Map(prev);
          newMap.set(userId, !status);
          return newMap;
        });
      });
      
      socketRef.current.on('user-video-update', ({userId, status}) => {
        setPeersVideoStopped(prev => {
          const newMap = new Map(prev);
          newMap.set(userId, !status);
          return newMap;
        });
      });
      
      // Handle screen sharing updates
      socketRef.current.on('screen-sharing-update', ({userId, status}) => {
        console.log('Screen sharing update from user:', userId, status);
        setPeersSharingScreen(prev => {
          const newMap = new Map(prev);
          newMap.set(userId, status);
          return newMap;
        });
      });
      
      // Handle chat messages
      socketRef.current.on('new-message', ({message, from, timestamp}) => {
        console.log('Received message:', message, 'from:', from);
        // Chat component will handle this event
      });
      
      // Handle being removed from meeting
      socketRef.current.on('removed-from-meet', () => {
        console.log('You were removed from the meeting');
        toast('You have been removed from the meeting', TOAST_DEFAULT_CONFIG);
        clearMeetData();
        router.replace('/video-call?stopStream=true');
      });
      
      // Handle meeting name updates
      socketRef.current.on('meet-name-updated', ({name}) => {
        console.log('Meeting renamed to:', name);
        setMeetName(name);
      });
      
      // Handle meet rename
      socketRef.current.on('meet-renamed', (data: {newMeetName: string}) => {
        console.log('Meeting renamed to:', data.newMeetName);
        setMeetName(data.newMeetName);
      });
    };

    connectSocket();

    return () => {
      socketRef.current?.disconnect();
      clearUserStream();
      clearMeetData();
    };
  }, []);

  // Update video refs when peers change
  useEffect(() => {
    // Define a function to handle stream updates for a peer
    const setupPeerVideoHandlers = (peer: SimplePeer.Instance, peerId: string) => {
      peer.on('stream', stream => {
        console.log(`Received stream from peer ${peerId}`);
        const videoRef = peersVideoRefs.current.get(peerId)?.current;
        if (videoRef) {
          videoRef.srcObject = stream;
          // Ensure the video plays
          videoRef.play().catch(err => 
            console.error(`Error playing video for peer ${peerId}:`, err)
          );
        } else {
          console.log(`Video ref not found for peer ${peerId}`);
        }
      });
      
      // Additional event handlers for better debugging
      peer.on('connect', () => {
        console.log(`Peer ${peerId} connected`);
      });
      
      peer.on('error', (err) => {
        console.error(`Peer ${peerId} error:`, err);
      });
      
      peer.on('close', () => {
        console.log(`Peer ${peerId} connection closed`);
      });
    };

    // Setup handlers for all current peers
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