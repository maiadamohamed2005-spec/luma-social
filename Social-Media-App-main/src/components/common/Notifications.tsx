"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  useMarkNotificationAsRead,
  useNotifications,
  useUnreadNotificationsCount,
} from "@/hooks/notifications/useNotifications";

type NotificationsProps = {
  onClose: () => void;
};

const Notifications = ({ onClose }: NotificationsProps) => {
  const router = useRouter();

  const { data, isLoading, isError } = useNotifications();
  const { data: unreadData } = useUnreadNotificationsCount();
  const { mutate: markAsRead } = useMarkNotificationAsRead();

  const notifications = data?.data ?? [];
  const unreadCount = unreadData?.count ?? 0;

  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL;

  const handleNotificationClick = (
    notificationId: number,
    readAt: string | null,
    postId: number | null,
  ) => {
    if (!readAt) {
      markAsRead(notificationId);
    }

    if (postId) {
      onClose();
      router.push(`/posts/${postId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-gray-500">
        Loading notifications...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-sm text-red-500">
        Failed to load notifications.
      </div>
    );
  }

  return (
    <div className="flex max-h-[70vh] flex-col overflow-hidden rounded-lg bg-white text-sm shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <span className="font-medium text-gray-700">
          Notifications
        </span>

        {unreadCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </div>

      {/* Notifications List */}
      <div className="overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm font-medium text-gray-700">
              No notifications
            </p>

            <p className="mt-1 text-xs text-gray-400">
              You are all caught up!
            </p>
          </div>
        ) : (
          notifications.map((notification) => {
            const postId =
              notification.notifiable_type === "App\\Models\\Post"
                ? notification.notifiable_id
                : notification.post_id;

            const avatarUrl = notification.actor?.avatar
              ? `${storageUrl}/${notification.actor.avatar}`
              : "/default-avatar.png";

            return (
              <div
                key={notification.id}
                className={`border-b px-4 py-3 transition hover:bg-purple-50 ${!notification.read_at
                    ? "bg-purple-50/60"
                    : "bg-white"
                  }`}
              >
                <div className="flex items-start gap-3">
                  {/* Actor */}
                  <Link
                    href={`/profile/${notification.actor?.id}`}
                    onClick={onClose}
                    className="group shrink-0"
                  >
                    <Image
                      src={avatarUrl}
                      alt={notification.actor?.name ?? "User"}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover transition group-hover:opacity-80"
                    />
                  </Link>

                  {/* Notification Content */}
                  <button
                    type="button"
                    onClick={() =>
                      handleNotificationClick(
                        notification.id,
                        notification.read_at,
                        postId,
                      )
                    }
                    className="min-w-0 flex-1 text-left"
                  >
                    <p className="text-sm text-gray-800">
                      {notification.message}
                    </p>

                    <span className="mt-1 block text-xs text-gray-400">
                      {new Date(
                        notification.created_at,
                      ).toLocaleString()}
                    </span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Notifications;