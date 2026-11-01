"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useFriends } from "@/hooks/friends/useFriends";
import Feed from "@/components/post/Feed";
import LeftMenu from "@/components/layout/LeftMenu";
import RightMenu from "@/components/layout/RightMenu";
import Image from "next/image";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { useUserProfile } from "@/hooks/profile/useProfile";
import FriendsList from "@/components/profile/FriendsList";
import FriendRequests from "@/components/common/FriendRequests";
import UserInfoCard from "@/components/profile/UserInfoCard";
import UserMediaCard from "@/components/profile/UserMediaCard";
import EditProfile from "@/components/profile/EditProfile";
import { useState } from "react";

const ProfilePage = () => {


  const params = useParams();
  const id = Number(params.id);

  const { user: currentUser } = useAuth();

  const isOwnProfile = currentUser?.id === id;
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const { data: friends = [], isLoading: isFriendsLoading, } = useFriends({
    enabled: isOwnProfile,
  });

  const { data: user, isLoading, isError, } = useUserProfile(id);


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        User not found
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
    <ProtectedRoute>
      <div className="flex gap-6 pt-6">

        {/* LEFT */}
        <div className="hidden xl:block w-[20%]">
          <LeftMenu type="profile" />
        </div>

        {/* CENTER */}
        <div className="w-full lg:w-[70%] xl:w-[50%]">
          <div className="flex flex-col gap-6">

            <div className="flex flex-col items-center justify-center">

              {/* COVER */}
              <div className="w-full h-64 relative">

                <Image
                  src={coverUrl}
                  alt="Cover image"
                  fill
                  sizes="100vw"
                  className="rounded-md object-cover"
                />

                {/* PROFILE IMAGE */}
                <Image
                  src={avatarUrl}
                  alt={user.name}
                  width={128}
                  height={128}
                  className="w-32 h-32 rounded-full absolute left-0 right-0 m-auto -bottom-16 ring-4 ring-white object-cover"
                />

              </div>

              {/* NAME */}
              <h1 className="mt-20 mb-4 text-2xl font-medium">
                {user.name}
              </h1>

              {isOwnProfile && (
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(true)}
                  className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                >
                  Edit Profile
                </button>
              )}

              {isEditProfileOpen && isOwnProfile && (
                <EditProfile
                  name={user.name}
                  username={user.username}
                  bio={user.bio}
                  avatar={user.avatar}
                  coverImage={user.cover_image}
                  onClose={() => setIsEditProfileOpen(false)}
                />
              )}

              {/* STATS */}
              <div className="flex items-center justify-center gap-12 mb-4">

                <div className="flex flex-col items-center">
                  <span className="font-medium">{user.posts_count}</span>
                  <span className="text-sm">Posts</span>
                </div>

                <div className="flex flex-col items-center">
                  <span className="font-medium">{user.friends_count}</span>
                  <span className="text-sm">Friends</span>
                </div>

              </div>

            </div>

            {isOwnProfile && (
              <FriendsList
                friends={friends}
                isLoading={isFriendsLoading}
              />
            )}

            {/* MOBILE / TABLET */}


            <div className="lg:hidden">
              <UserInfoCard
                user={user}
                isOwnProfile={isOwnProfile}
              />

              <UserMediaCard userId={String(user.id)} />
            </div>

            {isOwnProfile && (
              <div className="lg:hidden">
                <FriendRequests />
              </div>
            )}



            <Feed userId={user.id} />

          </div>
        </div>

        {/* RIGHT */}
        <div className="hidden lg:block w-[30%]">
          <RightMenu userId={String(user.id)} isOwnProfile={isOwnProfile} />
        </div>

      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;