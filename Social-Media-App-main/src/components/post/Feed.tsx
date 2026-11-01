"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import Post from "./Post";
import { useAuth } from "@/context/AuthContext";
import { getPosts } from "@/api/posts";
import type { PostType, PostsResponse } from "@/types/post";
import { useEffect, useRef } from "react";


type FeedProps = {
  userId?: number;
};

const Feed = ({ userId }: FeedProps) => {
  const { token } = useAuth();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts", userId],

    queryFn: ({ pageParam }) =>
      getPosts(token!, pageParam, userId),

    initialPageParam: 1,

    getNextPageParam: (lastPage: PostsResponse) => {
      if (lastPage.current_page >= lastPage.last_page) {
        return undefined;
      }

      return lastPage.current_page + 1;
    },

    enabled: !!token,
  });

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  if (isLoading) {
    return (
      <div className="text-center py-6 text-gray-500">
        Loading posts...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-6 text-red-500">
        {error instanceof Error
          ? error.message
          : "Failed to load posts"}
      </div>
    );
  }

  const posts: PostType[] =
    data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="flex flex-col gap-6">

      {posts.length === 0 ? (
        <p className="rounded-lg bg-white p-6 text-center text-gray-500 shadow-md">
          No posts yet.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="rounded-lg bg-white p-4 shadow-md"
            >
              <Post post={post} />
            </div>
          ))}
        </div>
      )}

      {isFetchingNextPage && (
        <div className="text-center py-4 text-gray-500">
          Loading more posts...
        </div>
      )}

      <div ref={loadMoreRef} className="h-10" />

    </div>
  );
};

export default Feed;