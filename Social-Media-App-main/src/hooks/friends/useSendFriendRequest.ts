import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendFriendRequest } from "@/api/friends";
import { useAuth } from "@/context/AuthContext";

export const useSendFriendRequest = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => {
      if (!token) {
        throw new Error("Authentication required.");
      }

      return sendFriendRequest(token, userId);
    },

    onSuccess: (_data, userId) => {
      queryClient.invalidateQueries({
        queryKey: ["profile", userId],
      });
    },
  });
};