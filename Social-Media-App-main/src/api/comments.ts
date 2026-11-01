import { apiFetch } from "@/lib/api";

import type {
  CommentResponse,
  CommentsResponse,
} from "@/types/comment";


export const getComments = async (
  token: string,
  postId: number,
): Promise<CommentsResponse> => {
  return apiFetch(`/posts/${postId}/comments`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createComment = async (
  token: string,
  postId: number,
  content: string,
  parentId?: number,
): Promise<CommentResponse> => {
  return apiFetch(`/posts/${postId}/comments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      content,
      parent_id: parentId ?? null,
    }),
  });
};

export const updateComment = async (
  token: string,
  commentId: number,
  content: string,
): Promise<CommentResponse> => {
  return apiFetch(`/comments/${commentId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
};

export const deleteComment = async (
  token: string,
  commentId: number,
): Promise<{ message: string }> => {
  return apiFetch(`/comments/${commentId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
