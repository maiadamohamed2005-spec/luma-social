"use client";

import Image from "next/image";
import Link from "next/link";
import { useMyProfile } from "@/hooks/profile/useProfile";

const ProfileCard = () => {
  const { data: user, isLoading, isError } = useMyProfile();

  if (isLoading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md text-sm">
        Loading profile...
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md text-sm">
        Failed to load profile.
      </div>
    );
  }

  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL;

  const avatarUrl = user.avatar
    ? `${storageUrl}/${user.avatar}`
    : "/default-avatar.png";

  const coverUrl = user.cover_image
    ? `${storageUrl}/${user.cover_image}`
    : "/default-cover.jpg";

  return (
    <div className="flex flex-col gap-6 p-4 bg-white rounded-lg shadow-md text-sm">
      {/* COVER & AVATAR */}
      <div className="h-20 relative">
        <Image
          src={coverUrl}
          alt="Cover image"
          fill
          sizes="100%"
          className="rounded-md object-cover"
        />

        <Image
          src={avatarUrl}
          alt={user.name}
          width={48}
          height={48}
          className="rounded-full w-12 h-12 object-cover absolute left-0 right-0 m-auto -bottom-6 ring-1 ring-white z-10"
        />
      </div>

      {/* USER INFO */}
      <div className="h-24 flex flex-col gap-2 items-center">
        <span className="font-semibold">
          {user.name}
        </span>

        <span className="text-xs text-gray-500">
          @{user.username}
        </span>

        <span className="text-xs text-gray-500">
          {user.friends_count} Friends
        </span>

        <Link
          href={`/profile/${user.id}`}
          className="cursor-pointer rounded-md bg-purple-600 px-3 py-2 text-xs text-white transition hover:bg-purple-700"
        >
          My Profile
        </Link>
      </div>
    </div>
  );
};

export default ProfileCard;

