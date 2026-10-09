import { BACKEND_URL } from "@/app/apis/request";
import { useAuthStore } from "@/app/stores/useAuthStore";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (socket) return socket;

  socket = io(BACKEND_URL, {
    autoConnect: false,
    withCredentials: true,
    transports: ["websocket"],
  });

  return socket;
};

export const connectSocket = (): Socket => {
  const s = getSocket();

  const user = useAuthStore.getState().currentUser;

  if (!user) {
    console.warn("Socket connection blocked: no authenticated user");
    return s;
  }

  if (!s.connected) {
    s.connect();

    s.on("connect", () => {
      console.log("✅ SOCKET CONNECTED", s.id);
    });

    s.on("connect_error", (err) => {
      console.log("❌ SOCKET ERROR", err.message);
    });
  }

  return s;
};

export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
  }

  socket = null;
};

export default getSocket;
