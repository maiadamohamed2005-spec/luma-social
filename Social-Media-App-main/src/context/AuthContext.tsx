"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getCurrentUserRequest,
  logoutRequest,
} from "@/api/auth";

import type { AuthUser } from "@/types/auth";

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [token, setToken] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const storedToken =
        localStorage.getItem("token");

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const data =
          await getCurrentUserRequest(storedToken);

        setToken(storedToken);
        setUser(data.user);
      } catch (error) {
        console.error(
          "Authentication error:",
          error
        );

        localStorage.removeItem("token");

        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = (
    authToken: string,
    authenticatedUser: AuthUser
  ) => {
    localStorage.setItem(
      "token",
      authToken
    );

    setToken(authToken);
    setUser(authenticatedUser);
  };

  const logout = async () => {
    if (token) {
      try {
        await logoutRequest(token);
      } catch (error) {
        console.error(
          "Logout error:",
          error
        );
      }
    }

    localStorage.removeItem("token");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};