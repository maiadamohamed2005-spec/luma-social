"use client";

import Image from "next/image";
import Comments from "./Comments";
import { useState, useRef } from "react";
import type { PostType, PostsResponse } from "@/types/post";
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";

import { useAuth } from "@/context/AuthContext";

import {
  deletePost,
  updatePost,
} from "@/api/posts";

import {
  likePost,
  unlikePost,
} from "@/api/likes";

import Link from "next/link";


type PostProps = {
  post: PostType;
};

const Post = ({ post }: PostProps) => {
  const { user, token } = useAuth();

  const queryClient = useQueryClient();
  const commentInputRef = useRef<HTMLInputElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(post.content ?? "");

  const isOwner = user?.id === post.user_id;

  // Update post

  const updateMutation = useMutation({
    mutationFn: () => {
      if (!token) {
        throw new Error("Authentication required");
      }

      return updatePost(
        token,
        post.id,
        content.trim()
      );
    },

    onSuccess: () => {
      setIsEditing(false);

      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });

  // Delete post

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!token) {
        throw new Error("Authentication required");
      }

      return deletePost(token, post.id);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });

  // Like / unlike post

  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!token) {
        throw new Error("Authentication required");
      }

      if (post.is_liked) {
        return unlikePost(token, post.id);
      }

      return likePost(token, post.id);
    },

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["posts"],
      });

      const previousPosts =
        queryClient.getQueryData<InfiniteData<PostsResponse>>([
          "posts",
        ]);

      queryClient.setQueryData<InfiniteData<PostsResponse>>(
        ["posts"],
        (oldData) => {
          if (!oldData) {
            return oldData;
          }

          return {
            ...oldData,

            pages: oldData.pages.map((page) => ({
              ...page,

              data: page.data.map((currentPost) => {
                if (currentPost.id !== post.id) {
                  return currentPost;
                }

                const newIsLiked = !currentPost.is_liked;

                return {
                  ...currentPost,
                  is_liked: newIsLiked,
                  likes_count:
                    currentPost.likes_count +
                    (newIsLiked ? 1 : -1),
                };
              }),
            })),
          };
        }
      );

      return {
        previousPosts,
      };
    },

    onError: (
      _error,
      _variables,
      context
    ) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(
          ["posts"],
          context.previousPosts
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });

  // Handlers

  const handleUpdate = () => {
    const trimmedContent = content.trim();

    if (
      !trimmedContent ||
      updateMutation.isPending
    ) {
      return;
    }

    updateMutation.mutate();
  };

  const handleCancelEdit = () => {
    setContent(post.content ?? "");
    setIsEditing(false);
  };

  const imageUrl = post.image
    ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${post.image}`
    : null;

  const videoUrl = post.video
    ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${post.video}`
    : null;

  const avatarUrl = post.user.avatar
    ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${post.user.avatar}`
    : "/default-avatar.png";

  return (
    <div className="flex flex-col gap-4">

      {/* User */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-4">

          <Link
            href={`/profile/${post.user.id}`}
            className="flex cursor-pointer items-center gap-4"
          >
            <Image
              src={avatarUrl}
              alt={post.user.name}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />

            <span className="font-medium transition-colors hover:text-blue-500">
              {post.user.name}
            </span>
          </Link>

        </div>

        {/* Owner actionser */}

        {isOwner && (
          <div className="flex items-center gap-3 text-sm">

            {!isEditing && (
              <button
                type="button"
                onClick={() =>
                  setIsEditing(true)
                }
                className="cursor-pointer text-blue-500 hover:text-blue-700"
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
                deleteMutation.isPending ||
                updateMutation.isPending
              }
              className="cursor-pointer text-red-500 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleteMutation.isPending
                ? "Deleting..."
                : "Delete"}
            </button>

          </div>
        )}

      </div>

      {/* Content */}

      <div className="flex flex-col gap-4">


        {imageUrl && (
          <div className="relative h-96 w-full">

            <Image
              src={imageUrl}
              alt=""
              fill
              className="rounded-md object-cover"
            />

          </div>
        )}

        {videoUrl && (
          <video
            src={videoUrl}
            controls
            className="max-h-[500px] w-full rounded-md object-cover"
          />
        )}

        {/* Edit */}

        {isEditing ? (
          <div className="flex flex-col gap-3">

            <textarea
              value={content ?? ""}
              onChange={(event) =>
                setContent(event.target.value)
              }
              rows={4}
              disabled={
                updateMutation.isPending
              }
              className="w-full resize-none rounded-lg bg-slate-100 p-3 outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />

            <div className="flex items-center gap-4 text-sm">

              <button
                type="button"
                onClick={handleUpdate}
                disabled={
                  !content?.trim() ||
                  updateMutation.isPending
                }
                className="font-medium text-blue-500 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updateMutation.isPending
                  ? "Updating..."
                  : "Update"}
              </button>

              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={
                  updateMutation.isPending
                }
                className=" cursor-pointer text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

            </div>

          </div>
        ) : (
          <p>{post.content}</p>
        )}

      </div>

      {/* Interaction */}

      <div className="my-4 flex items-center justify-between text-sm">

        <div className="flex gap-8">

          {/* Like */}

          <button
            type="button"
            onClick={() => likeMutation.mutate()}
            disabled={likeMutation.isPending}
            className="flex cursor-pointer items-center gap-4 rounded-xl bg-slate-50 p-2 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Image
              src="/like.png"
              alt="Like"
              width={16}
              height={16}
            />

            <span className="text-gray-300">|</span>

            <span
              className={
                post.is_liked
                  ? "font-medium text-blue-500"
                  : "text-gray-500"
              }
            >
              {post.likes_count}{" "}
              <span className="hidden md:inline">
                Likes
              </span>
            </span>
          </button>

          {/* Comment */}

          <button
            type="button"
            onClick={() => commentInputRef.current?.focus()}
            className="flex cursor-pointer items-center gap-4 rounded-xl bg-slate-50 p-2 transition hover:bg-slate-100"
          >
            <Image
              src="/comment.png"
              alt="Comments"
              width={16}
              height={16}
            />

            <span className="text-gray-300">|</span>

            <span className="text-gray-500">
              {post.comments_count}{" "}
              <span className="hidden md:inline">
                Comments
              </span>
            </span>
          </button>

        </div>

        {/* Share */}

        <button
          type="button"
          onClick={() => {
            // Share logic
          }}
          className="flex cursor-pointer items-center gap-4 rounded-xl bg-slate-50 p-2 transition hover:bg-slate-100"
        >
          <Image
            src="/share.png"
            alt="Share"
            width={16}
            height={16}
          />

          <span className="text-gray-300">|</span>

          <span className="text-gray-500">
            4{" "}
            <span className="hidden md:inline">
              Shares
            </span>
          </span>
        </button>

      </div>

      {/* Comments */}

      <Comments postId={post.id} commentInputRef={commentInputRef} />

    </div>
  );
};

export default Post;

