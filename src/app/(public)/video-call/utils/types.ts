import type SimplePeer from 'simple-peer';
import { Socket } from 'socket.io-client';

export type TBreakpoint = 'xsm' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export interface PeerData {
  id: string;
  name: string;
  email: string;
  stream?: MediaStream;
  connection?: RTCPeerConnection;
  lastMessage?: Message;
}

export interface Message {
  sender: string;
  content: string;
  timestamp: number;
}

export interface AppContextProps {
  socket: Socket | null;
  user: TUser | null;
  setUser: (user: TUser | null) => void;
}

export type TUser = {
  id: string;
  name: string;
  email: string;
  isHost?: boolean;
};

export type TSendMessageEventData = {
  to: string;
  message: string;
};

export type TNewMeetNameEventData = {
  to: string;
  newMeetName: string;
};

export type TUpdateUserAudioEventData = {
  to: string;
  shouldMute: boolean;
};

export type TUpdateUserVideoEventData = {
  to: string;
  shouldStop: boolean;
};

export type TUpdateScreenSharingEventData = {
  to: string;
  isSharing: boolean;
};

export type TCallUserEventData = {
  to: string;
  from: TUser;
  signal: SimplePeer.SignalData;
};

export type TAcceptCallEventData = {
  to: string;
  from: TUser;
  signal: SimplePeer.SignalData;
  meetName: string;
};

export type TRequestMeetConnectionEventData = {
  from: TUser;
  signal: SimplePeer.SignalData;
};

export type TCallAcceptedEventData = {
  from: TUser;
  signal: SimplePeer.SignalData;
  meetName: string;
};

export interface TSocketResponse {
  success: boolean;
  error?: string;
  meetId?: string;
}
