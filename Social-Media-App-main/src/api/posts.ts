import { apiFetch } from "@/lib/api";

import type { PostType, PostsResponse } from "@/types/post";

type GetPostsResponse = {
  posts: PostsResponse;
};

type GetPostResponse = {
  post: PostType;
};

export const getPosts = async (
  token: string,
  page: number = 1,
  userId?: number,
): Promise<PostsResponse> => {
  const params = new URLSearchParams({
    page: String(page),
  });

  if (userId) {
    params.set("user_id", String(userId));
  }

  const data = await apiFetch<GetPostsResponse>(`/posts?${params.toString()}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data.posts;
};

export const getPost = async (
  token: string,
  postId: number,
): Promise<PostType> => {
  const data = await apiFetch<GetPostResponse>(`/posts/${postId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data.post;
};

export const createPost = async (
  token: string,
  content: string,
  image: File | null,
  video: File | null,
) => {
  const formData = new FormData();

  if (content.trim()) {
    formData.append("content", content);
  }

  if (image) {
    formData.append("image", image);
  }

  if (video) {
    formData.append("video", video);
  }

  return apiFetch("/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
};

export const updatePost = async (
  token: string,
  postId: number,
  content: string,
) => {
  return apiFetch(`/posts/${postId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
};

export const deletePost = async (token: string, postId: number) => {
  return apiFetch(`/posts/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
