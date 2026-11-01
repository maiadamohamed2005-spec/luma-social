export type NotificationActor = {
  id: number;
  name: string;
  avatar: string | null;
};

export type Notification = {
  id: number;
  type: string;
  message: string;
  read_at: string | null;
  actor: NotificationActor | null;
  notifiable_type: string | null;
  notifiable_id: number | null;
  post_id: number | null;
  created_at: string;
};

export type NotificationsResponse = {
  data: Notification[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};