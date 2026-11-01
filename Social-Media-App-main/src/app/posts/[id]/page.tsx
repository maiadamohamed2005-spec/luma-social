"use client";

import { useParams } from "next/navigation";
import Post from "@/components/post/Post";
import { usePost } from "@/hooks/posts/usePost";

const PostPage = () => {
  const params = useParams();
  const postId = Number(params.id);

  const { data: post, isLoading, isError } = usePost(postId);

  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-500">
        Loading post...
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="p-4 text-center text-red-500">
        Failed to load post.
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <Post post={post} />
    </div>
  );
};

export default PostPage;