import { apiFetch } from "@/lib/api";
import type {
  Notification,
  NotificationsResponse,
} from "@/types/notification";

export const getNotifications = async (
  token: string,
  page: number = 1,
): Promise<NotificationsResponse> => {
  return apiFetch(`/notifications?page=${page}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const markNotificationAsRead = async (
  token: string,
  notificationId: number,
): Promise<{ message: string }> => {
  return apiFetch(`/notifications/${notificationId}/read`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getUnreadNotificationsCount = async (
  token: string,
): Promise<{ count: number }> => {
  return apiFetch("/notifications/unread-count", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};