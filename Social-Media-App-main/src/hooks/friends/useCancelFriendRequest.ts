import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelFriendRequest } from "@/api/friends";
import { useAuth } from "@/context/AuthContext";

type CancelFriendRequestPayload = {
  friendshipId: number;
  userId: number;
};

export const useCancelFriendRequest = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      friendshipId,
    }: CancelFriendRequestPayload) => {
      if (!token) {
        throw new Error("Authentication required.");
      }

      return cancelFriendRequest(token, friendshipId);
    },

    onSuccess: (_data, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: ["profile", userId],
      });
    },
  });
};