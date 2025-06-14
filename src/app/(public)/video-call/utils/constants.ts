import type { ToastOptions } from "react-toastify"

// Backend connection configuration
export const BACKEND_URL = 'http://localhost:8000';
export const SOCKET_NAMESPACE = '/video-call';
export const SOCKET_URL = `${BACKEND_URL}${SOCKET_NAMESPACE}`;

// WebRTC peer configuration
export const PEER_CONFIGS = {
  iceServers: [
    {
      urls: "stun:openrelay.metered.ca:80",
    },
    {
      urls: "turn:openrelay.metered.ca:80",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
    {
      urls: "turn:openrelay.metered.ca:443",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
    {
      urls: "turn:openrelay.metered.ca:443?transport=tcp",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
  ],
}

// Socket.IO configuration
export const SOCKET_OPTIONS = {
  withCredentials: true,
  transports: ['websocket']
};

export const TOAST_DEFAULT_CONFIG: ToastOptions = {
  theme: "dark",
  style: {
    fontFamily: "var(--font-sans)",
    fontSize: "0.875rem",
    fontWeight: 500,
    textAlign: "center",
  },
  progressClassName: "bg-primary",
}

export const LOTTIE_OPTIONS = {
  loop: true,
  autoplay: true,
  animationData: "",
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
}
