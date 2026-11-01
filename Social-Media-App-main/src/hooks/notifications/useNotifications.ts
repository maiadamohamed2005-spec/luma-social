import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import {
  getNotifications,
  markNotificationAsRead,
  getUnreadNotificationsCount,
} from "@/api/notifications";

export const useNotifications = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications(token!),
    enabled: !!token,
  });
};

export const useMarkNotificationAsRead = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number) =>
      markNotificationAsRead(token!, notificationId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });

      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
    },
  });
};

export const useUnreadNotificationsCount = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: () => getUnreadNotificationsCount(token!),
    enabled: !!token,
    refetchInterval: 30000,
  });
};