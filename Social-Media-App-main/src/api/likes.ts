import { apiFetch } from "@/lib/api";

// POST LIKE
export const likePost = async (token: string, postId: number) => {
  return apiFetch(`/posts/${postId}/like`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const unlikePost = async (token: string, postId: number) => {
  return apiFetch(`/posts/${postId}/like`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// COMMENT LIKE

export const likeComment = async (token: string, commentId: number) => {
  return apiFetch(`/comments/${commentId}/like`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const unlikeComment = async (token: string, commentId: number) => {
  return apiFetch(`/comments/${commentId}/like`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
