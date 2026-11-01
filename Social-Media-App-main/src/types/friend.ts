import type { User } from "@/types/user";

export type FriendRequest = {
  id: number;
  user: User;
  status: "pending";
  created_at: string;
};