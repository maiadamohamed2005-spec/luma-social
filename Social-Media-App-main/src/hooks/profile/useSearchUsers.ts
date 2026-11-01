"use client";

import { useQuery } from "@tanstack/react-query";

import { searchUsers } from "@/api/users";
import { useAuth } from "@/context/AuthContext";

export const useSearchUsers = (
  query: string
) => {
  const { token } = useAuth();

  const searchQuery = query.trim();

  return useQuery({
    queryKey: [
      "users",
      "search",
      searchQuery,
    ],

    queryFn: () => {
      if (!token) {
        throw new Error(
          "Authentication required."
        );
      }

      return searchUsers(
        token,
        searchQuery
      );
    },

    enabled:
      Boolean(token) &&
      searchQuery.length >= 2,

    staleTime: 30_000,
  });
};