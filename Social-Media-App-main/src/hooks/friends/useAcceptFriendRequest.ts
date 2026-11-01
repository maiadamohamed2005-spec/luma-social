import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest } from "@/api/friends";
import { useAuth } from "@/context/AuthContext";

export const useAcceptFriendRequest = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (friendshipId: number) => {
      if (!token) {
        throw new Error("Authentication required.");
      }

      return acceptFriendRequest(token, friendshipId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["friend-requests", "incoming"],
      });

      queryClient.invalidateQueries({
        queryKey: ["friends"],
      });
    },
  });
};