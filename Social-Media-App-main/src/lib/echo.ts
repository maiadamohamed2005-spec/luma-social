import Echo from "laravel-echo";
import Pusher from "pusher-js";

declare global {
    interface Window {
        Pusher: typeof Pusher;
    }
}

export const createEcho = (token: string) => {
    if (typeof window !== "undefined") {
        window.Pusher = Pusher;
    }

    return new Echo({
        broadcaster: "reverb",

        key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,

        wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
        wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT),

        forceTLS:
            process.env.NEXT_PUBLIC_REVERB_SCHEME === "https",

        enabledTransports: ["ws", "wss"],

        authEndpoint:
            `${process.env.NEXT_PUBLIC_API_URL}/broadcasting/auth`,

        auth: {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        },
    });
};