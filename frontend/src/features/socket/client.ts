import { Client } from "@stomp/stompjs";
import { tokenStorage } from "@/features/auth/token-storage";

const WS_URL =
    process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8080/api/v1/ws";

let client: Client | null = null;

export const getStompClient = (): Client => {
    if (client) return client;

    client = new Client({
        brokerURL: WS_URL,
        reconnectDelay: 5000,
        beforeConnect(client) {
            const token = tokenStorage.getAccessToken();
            client.connectHeaders = token
                ? { Authorization: `Bearer ${token}` }
                : {};
        },
        debug: (msg) => {
            if (process.env.NODE_ENV === "development") {
                console.debug("[STOMP]:", msg);
            }
        },
    });

    return client;
};

export const activateStompClient = () => {
    const client = getStompClient();
    if (!client.active) {
        client.activate();
    }
};

export const deactivateStompClient = () => {
    const client = getStompClient();
    if (client.active) {
        client.deactivate();
    }
};
