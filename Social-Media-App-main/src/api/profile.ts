import { apiFetch } from "@/lib/api";
import type { User } from "@/types/user";

type UserResponse = {
  data: User;
};

export const getMyProfile = async (
  token: string
): Promise<User> => {
  const response = await apiFetch<UserResponse>(
    "/me",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getUserProfile = async (
  token: string,
  userId: number
): Promise<User> => {
  const response = await apiFetch<UserResponse>(
    `/users/${userId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const updateProfile = async (
  token: string,
  data: {
    name: string;
    username: string;
    bio: string;
  }
): Promise<User> => {
  const response = await apiFetch<UserResponse>(
    "/me",
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  return response.data;
};

export const updateAvatar = async (
  token: string,
  avatar: File
): Promise<User> => {
  const formData = new FormData();

  formData.append("avatar", avatar);

  const response = await apiFetch<UserResponse>(
    "/me/avatar",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  return response.data;
};

export const updateCoverImage = async (
  token: string,
  coverImage: File
): Promise<User> => {
  const formData = new FormData();

  formData.append("cover_image", coverImage);

  const response = await apiFetch<UserResponse>(
    "/me/cover",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  return response.data;
};