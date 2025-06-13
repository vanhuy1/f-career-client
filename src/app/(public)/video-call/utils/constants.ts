import type { ToastOptions } from "react-toastify"

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

export const TOAST_DEFAULT_CONFIG: ToastOptions = {
  theme: "dark",
  bodyStyle: {
    fontFamily: "var(--font-sans)",
    fontSize: "0.875rem",
    fontWeight: 500,
    textAlign: "center",
  },
  progressStyle: {
    backgroundColor: "hsl(var(--primary))",
  },
}

export const LOTTIE_OPTIONS = {
  loop: true,
  autoplay: true,
  animationData: "",
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
}
