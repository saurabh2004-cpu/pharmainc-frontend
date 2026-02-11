
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (token: string) => {
    if (socket?.connected) return socket;

    // Use env var or default to backend URL. 
    // Assuming standard local backend port 8000 based on common practices, 
    // but this should match the backend structure.
    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL!;

    socket = io(SOCKET_URL, {
        auth: {
            token,
        },
        transports: ["websocket"],
        reconnection: true,
    });

    socket.on("connect", () => {
        console.log("Socket connected:", socket?.id);
    });

    socket.on("disconnect", () => {
        console.log("Socket disconnected");
    });

    socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
    });

    return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
