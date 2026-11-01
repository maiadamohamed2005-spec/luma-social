import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectFriendRequest } from "@/api/friends";
import { useAuth } from "@/context/AuthContext";

export const useRejectFriendRequest = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (friendshipId: number) => {
      if (!token) {
        throw new Error("Authentication required.");
      }

      return rejectFriendRequest(token, friendshipId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["friend-requests", "incoming"],
      });
    },
  });
};