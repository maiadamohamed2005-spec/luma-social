"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "@/api/posts";
import { useAuth } from "@/context/AuthContext";
import type { PostsResponse } from "@/types/post";

type UserMediaCardProps = {
  userId: string;
};

const UserMediaCard = ({ userId }: UserMediaCardProps) => {
  const { token } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user-media", userId],
    queryFn: () =>
      getPosts(token!, 1, Number(userId)) as Promise<PostsResponse>,
    enabled: !!token && !!userId,
  });

  const postsWithImages =
    data?.data.filter((post) => post.image) ?? [];

  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
      <div className="flex items-center justify-between font-medium">
        <span className="text-gray-500">User Media</span>

        <Link
          href={`/profile/${userId}`}
          className="text-blue-500 text-xs"
        >
          See all
        </Link>
      </div>

      {isLoading && (
        <p className="text-gray-500">
          Loading media...
        </p>
      )}

      {isError && (
        <p className="text-red-500">
          Failed to load media.
        </p>
      )}

      {!isLoading &&
        !isError &&
        postsWithImages.length === 0 && (
          <p className="text-gray-500">
            No media yet.
          </p>
        )}

      <div className="flex gap-4  flex-wrap">
        {postsWithImages.map((post) => {
          const imageUrl = `${storageUrl}/${post.image}`;

          return (
            <div
              key={post.id}
              className="relative w-[30%] h-24"
            >
              <Image
                src={imageUrl}
                alt="Post image"
                fill
                className="object-cover rounded-md"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserMediaCard;