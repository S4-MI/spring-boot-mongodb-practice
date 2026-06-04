import { tokenStorage } from "@/features/auth/token-storage";
import {
    activateStompClient,
    getStompClient,
} from "@/features/socket/client";
import { useEffect, useState } from "react";

export const useSocket = () => {
    const [connected, setConnected] = useState(() => getStompClient().connected);

    useEffect(() => {
        const token = tokenStorage.getAccessToken();
        if (!token) return;

        const client = getStompClient();

        const prevOnConnect = client.onConnect;
        const prevOnDisconnect = client.onDisconnect;
        const prevOnWebSocketClose = client.onWebSocketClose;

        client.onConnect = (frame) => {
            setConnected(true);
            prevOnConnect?.(frame);
        };
        client.onDisconnect = (frame) => {
            setConnected(false);
            prevOnDisconnect?.(frame);
        };
        client.onWebSocketClose = (evt) => {
            setConnected(false);
            prevOnWebSocketClose?.(evt);
        };

        activateStompClient();

        return () => {
            client.onConnect = prevOnConnect;
            client.onDisconnect = prevOnDisconnect;
            client.onWebSocketClose = prevOnWebSocketClose;
        };
    }, []);

    return connected;
};
