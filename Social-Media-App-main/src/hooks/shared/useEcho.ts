"use client";

import { useEffect, useState } from "react";
import { createEcho } from "@/lib/echo";
import type Echo from "laravel-echo";
import { useAuth } from "@/context/AuthContext";

export const useEcho = () => {
    const { token } = useAuth();

    const [echo, setEcho] = useState<Echo<any> | null>(null);

    useEffect(() => {
        if (!token) {
            setEcho(null);
            return;
        }

        const newEcho = createEcho(token);

        setEcho(newEcho);

        return () => {
            newEcho.disconnect();
            setEcho(null);
        };
    }, [token]);

    return echo;
};