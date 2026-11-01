import { apiFetch } from "@/lib/api";
import type { User } from "@/types/user";
import type { FriendRequest } from "@/types/friend";

interface FriendsResponse {
  data: User[];
}

interface IncomingFriendRequestsResponse {
  data: FriendRequest[];
}

interface FriendActionResponse {
  message: string;
}

export const getFriends = async (
  token: string
): Promise<User[]> => {
  const response = await apiFetch<FriendsResponse>(
    "/friends",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const sendFriendRequest = async (
  token: string,
  userId: number
): Promise<FriendActionResponse> => {
  return apiFetch<FriendActionResponse>(
    `/users/${userId}/friend`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const cancelFriendRequest = async (
  token: string,
  friendshipId: number
): Promise<FriendActionResponse> => {
  return apiFetch<FriendActionResponse>(
    `/friendships/${friendshipId}/cancel`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const removeFriend = async (
  token: string,
  friendshipId: number
): Promise<FriendActionResponse> => {
  return apiFetch<FriendActionResponse>(
    `/friendships/${friendshipId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getIncomingFriendRequests = async (
  token: string
): Promise<FriendRequest[]> => {
  const response =
    await apiFetch<IncomingFriendRequestsResponse>(
      "/friend-requests/incoming",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

  return response.data;
};

export const acceptFriendRequest = async (
  token: string,
  friendshipId: number
): Promise<FriendActionResponse> => {
  return apiFetch<FriendActionResponse>(
    `/friendships/${friendshipId}/accept`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const rejectFriendRequest = async (
  token: string,
  friendshipId: number
): Promise<FriendActionResponse> => {
  return apiFetch<FriendActionResponse>(
    `/friendships/${friendshipId}/reject`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};