import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useAuth } from "@/context/AuthContext";

import {
  getMyProfile,
  getUserProfile,
  updateProfile,
  updateAvatar,
  updateCoverImage,
} from "@/api/profile";

export const useMyProfile = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["profile", "me"],
    queryFn: () => getMyProfile(token!),
    enabled: !!token,
  });
};

export const useUserProfile = (userId: number) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getUserProfile(token!, userId),
    enabled: !!token && !!userId,
  });
};

export const useUpdateProfile = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name: string;
      username: string;
      bio: string;
    }) => updateProfile(token!, data),

    onSuccess: (updatedUser) => {
      queryClient.setQueryData(
        ["profile", "me"],
        updatedUser
      );

      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
    },
  });
};

export const useUpdateAvatar = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (avatar: File) =>
      updateAvatar(token!, avatar),

    onSuccess: (updatedUser) => {
      queryClient.setQueryData(
        ["profile", "me"],
        updatedUser
      );

      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
    },
  });
};

export const useUpdateCoverImage = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (coverImage: File) =>
      updateCoverImage(token!, coverImage),

    onSuccess: (updatedUser) => {
      queryClient.setQueryData(
        ["profile", "me"],
        updatedUser
      );

      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
    },
  });
};