"use client";

import Image from "next/image";
import { useState } from "react";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { useAuth } from "@/context/AuthContext";

import {
  createComment,
  updateComment,
  deleteComment,
} from "@/api/comments";

import type { Comment } from "@/types/comment"

import {
  likeComment,
  unlikeComment,
} from "@/api/likes";

import Link from "next/link";

import { useEmojiInput } from "@/hooks/shared/useEmojiInput";
import EmojiPickerButton from "@/components/post/EmojiPickerButton";

type CommentItemProps = {
  comment: Comment;
  postId: number;
};

const CommentItem = ({
  comment,
  postId,
}: CommentItemProps) => {
  const { user, token } = useAuth();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);

  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const {
    inputRef: replyInputRef,
    handleEmojiClick: handleReplyEmojiClick,
  } = useEmojiInput(
    replyContent,
    setReplyContent
  );
  const isOwner = user?.id === comment.user_id;

  const avatarUrl = comment.user.avatar
    ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${comment.user.avatar}`
    : "/default-avatar.png";

  const refreshComments = () => {
    queryClient.invalidateQueries({
      queryKey: ["comments", postId],
    });
  };

  // LIKE
  const likeMutation = useMutation({
    mutationFn: () => {
      if (!token) {
        throw new Error("Authentication required");
      }

      return comment.is_liked
        ? unlikeComment(token, comment.id)
        : likeComment(token, comment.id);
    },

    onSuccess: refreshComments,
  });

  // UPDATE
  const updateMutation = useMutation({
    mutationFn: () => {
      if (!token) {
        throw new Error("Authentication required");
      }

      return updateComment(
        token,
        comment.id,
        content.trim()
      );
    },

    onSuccess: () => {
      setIsEditing(false);
      refreshComments();
    },
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!token) {
        throw new Error("Authentication required");
      }

      return deleteComment(
        token,
        comment.id
      );
    },

    onSuccess: () => {
      refreshComments();

      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    }
  });

  // REPLY
  const replyMutation = useMutation({
    mutationFn: () => {
      if (!token) {
        throw new Error("Authentication required");
      }

      return createComment(
        token,
        postId,
        replyContent.trim(),
        comment.id
      );
    },

    onSuccess: () => {
      setReplyContent("");
      setShowReplyInput(false);
      refreshComments();
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });

  const handleUpdate = () => {
    if (!content.trim()) {
      return;
    }

    updateMutation.mutate();
  };

  const handleReply = () => {
    if (!replyContent.trim()) {
      return;
    }

    replyMutation.mutate();
  };

  return (
    <div className="flex flex-col gap-4">

      {/* COMMENT */}

      <div className="flex gap-4">

        <Link
          href={`/profile/${comment.user.id}`}
          className="flex shrink-0 items-start"
        >
          <Image
            src={avatarUrl}
            alt={`${comment.user.name}'s profile`}
            width={40}
            height={40}
            className="h-10 w-10 cursor-pointer rounded-full object-cover"
          />
        </Link>

        <div className="flex-1">

          {/* HEADER */}

          <div className="flex items-center justify-between">

            <Link
              href={`/profile/${comment.user.id}`}
              className="font-medium transition-colors hover:text-blue-500"
            >
              {comment.user.name}
            </Link>

            {isOwner && (
              <div className="flex gap-3 text-xs">

                {!isEditing && (
                  <button
                    type="button"
                    onClick={() =>
                      setIsEditing(true)
                    }
                    className="cursor-pointer text-blue-500 transition-colors hover:text-blue-700"
                  >
                    Edit
                  </button>
                )}

                <button
                  type="button"
                  onClick={() =>
                    deleteMutation.mutate()
                  }
                  disabled={
                    deleteMutation.isPending
                  }
                  className="cursor-pointer text-red-500 transition-colors hover:text-red-700"
                >
                  {deleteMutation.isPending
                    ? "Deleting..."
                    : "Delete"}
                </button>

              </div>
            )}

          </div>

          {/* CONTENT */}

          {isEditing ? (
            <div className="mt-2">

              <textarea
                value={content}
                onChange={(e) =>
                  setContent(e.target.value)
                }
                rows={3}
                className="w-full rounded-lg bg-slate-100 p-3 outline-none"
              />

              <div className="mt-2 flex gap-3 text-xs">

                <button
                  type="button"
                  onClick={handleUpdate}
                  disabled={
                    updateMutation.isPending
                  }
                  className="text-blue-500 disabled:opacity-50"
                >
                  {updateMutation.isPending
                    ? "Updating..."
                    : "Update"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setContent(comment.content);
                    setIsEditing(false);
                  }}
                  className="text-gray-500"
                >
                  Cancel
                </button>

              </div>

            </div>
          ) : (
            <p className="mt-2">
              {comment.content}
            </p>
          )}

          {/* INTERACTION */}

          <div className="mt-3 flex items-center gap-6 text-xs text-gray-500">

            {/* LIKE */}

            <button
              type="button"
              onClick={() => likeMutation.mutate()}
              disabled={likeMutation.isPending}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Image
                src="/like.png"
                alt="Like"
                width={16}
                height={16}
              />

              <span
                className={
                  comment.is_liked
                    ? "text-blue-500"
                    : "text-gray-500"
                }
              >
                {comment.likes_count} Likes
              </span>
            </button>

            {/* REPLY */}

            <button
              type="button"
              onClick={() =>
                setShowReplyInput(
                  !showReplyInput
                )
              }
              className="cursor-pointer text-gray-500 transition-colors hover:text-blue-500"
            >
              Reply
            </button>

          </div>

          {/* REPLY INPUT */}

          {showReplyInput && (
            <div className="flex flex-1 items-center rounded-xl bg-slate-100 px-4 py-2 text-sm">

              <input
                ref={(element) => {
                  replyInputRef.current = element;
                }}
                type="text"
                value={replyContent}
                onChange={(e) =>
                  setReplyContent(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleReply();
                  }
                }}
                placeholder="Write a reply..."
                disabled={replyMutation.isPending}
                className="flex-1 bg-transparent outline-none disabled:cursor-not-allowed"
              />

              <EmojiPickerButton
                onEmojiClick={handleReplyEmojiClick}
              />

              <button
                type="button"
                onClick={handleReply}
                disabled={
                  !replyContent.trim() ||
                  replyMutation.isPending
                }
                className="ml-3 text-sm font-medium text-blue-500 transition hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {replyMutation.isPending
                  ? "Sending..."
                  : "Send"}
              </button>

            </div>
          )}

        </div>

      </div>

      {/* REPLIES */}

      {comment.replies &&
        comment.replies.length > 0 && (
          <div className="ml-12 flex flex-col gap-5">

            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                postId={postId}
              />
            ))}

          </div>
        )}

    </div>
  );
};

export default CommentItem;

