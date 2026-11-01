import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeFriend } from "@/api/friends";
import { useAuth } from "@/context/AuthContext";

type RemoveFriendPayload = {
  friendshipId: number;
  userId: number;
};

export const useRemoveFriend = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      friendshipId,
    }: RemoveFriendPayload) => {
      if (!token) {
        throw new Error("Authentication required.");
      }

      return removeFriend(token, friendshipId);
    },

    onSuccess: (_data, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: ["profile", userId],
      });

      queryClient.invalidateQueries({
        queryKey: ["friends"],
      });
    },
  });
};