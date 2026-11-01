"use client";

import Image from "next/image";
import { useState } from "react";

import CreateStoryModal from "./CreateStoryModal";
import StoryViewer from "./StoryViewer";

import { useAuth } from "@/context/AuthContext";
import { useStories } from "@/hooks/stories/useStories";

import type { StoryGroup } from "@/types/story";

const storageUrl =
  process.env.NEXT_PUBLIC_STORAGE_URL;

const Stories = () => {
  const { user } = useAuth();

  const {
    data: storyGroups = [],
    isLoading,
    isError,
  } = useStories();

  const [
    selectedGroupIndex,
    setSelectedGroupIndex,
  ] = useState<number | null>(null);

  const [
    isCreateModalOpen,
    setIsCreateModalOpen,
  ] = useState(false);

  const currentUserGroupIndex =
    storyGroups.findIndex(
      (group) => group.is_current_user
    );

  const currentUserAvatar = user?.avatar
    ? `${storageUrl}/${user.avatar}`
    : "/default-avatar.png";

  if (isLoading) {
    return <StoriesSkeleton />;
  }

  if (isError) {
    return (
      <div className="w-full rounded-lg bg-white p-4 shadow-md">
        <p className="text-sm text-gray-500">
          Unable to load stories.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full min-w-0 overflow-x-auto rounded-lg bg-white p-4 shadow-md scrollbar-hide">
        <div className="flex w-max gap-6">
          {/* Create story when user has no story */}
          {currentUserGroupIndex === -1 && (
            <CreateStoryItem
              avatarUrl={currentUserAvatar}
              userName={
                user?.name ?? "Your profile"
              }
              onCreate={() =>
                setIsCreateModalOpen(true)
              }
            />
          )}

          {/* Stories */}
          {storyGroups.map(
            (group, index) =>
              group.is_current_user ? (
                <YourStoryItem
                  key={group.user.id}
                  group={group}
                  onView={() =>
                    setSelectedGroupIndex(
                      index
                    )
                  }
                  onCreate={() =>
                    setIsCreateModalOpen(true)
                  }
                />
              ) : (
                <StoryItem
                  key={group.user.id}
                  group={group}
                  onClick={() =>
                    setSelectedGroupIndex(
                      index
                    )
                  }
                />
              )
          )}
        </div>
      </div>

      {/* Story viewer */}
      {selectedGroupIndex !== null && (
        <StoryViewer
          groups={storyGroups}
          initialGroupIndex={
            selectedGroupIndex
          }
          onClose={() =>
            setSelectedGroupIndex(null)
          }
        />
      )}

      {/* Create story modal */}
      {isCreateModalOpen && (
        <CreateStoryModal
          onClose={() =>
            setIsCreateModalOpen(false)
          }
        />
      )}
    </>
  );
};

/* ========================================
   CREATE STORY
======================================== */

type CreateStoryItemProps = {
  avatarUrl: string;
  userName: string;
  onCreate: () => void;
};

const CreateStoryItem = ({
  avatarUrl,
  userName,
  onCreate,
}: CreateStoryItemProps) => {
  return (
    <button
      type="button"
      onClick={onCreate}
      className="group flex w-20 shrink-0 flex-col items-center gap-2"
      aria-label="Create story"
    >
      <div className="relative">
        <div className="rounded-full border-2 border-gray-200 p-[2px] transition-colors duration-200 group-hover:border-purple-400">
          <Image
            src={avatarUrl}
            alt={userName}
            width={80}
            height={80}
            className="h-20 w-20 rounded-full object-cover"
          />
        </div>

        <AddStoryBadge />
      </div>

      <span className="w-full truncate text-center text-xs font-medium text-gray-700 transition-colors group-hover:text-purple-600">
        Create story
      </span>
    </button>
  );
};

/* ========================================
   CURRENT USER STORY
======================================== */

type YourStoryItemProps = {
  group: StoryGroup;
  onView: () => void;
  onCreate: () => void;
};

const YourStoryItem = ({
  group,
  onView,
  onCreate,
}: YourStoryItemProps) => {
  const avatarUrl = group.user.avatar
    ? `${storageUrl}/${group.user.avatar}`
    : "/default-avatar.png";

  return (
    <div className="flex w-20 shrink-0 flex-col items-center gap-2">
      <div className="relative">
        {/* Avatar opens story */}
        <button
          type="button"
          onClick={onView}
          className="block rounded-full"
          aria-label="View your story"
        >
          <div className="rounded-full bg-gradient-to-tr from-purple-400 to-purple-700 p-[3px] transition-transform duration-200 hover:scale-[1.03]">
            <div className="rounded-full bg-white p-[2px]">
              <Image
                src={avatarUrl}
                alt={group.user.name}
                width={80}
                height={80}
                className="h-20 w-20 rounded-full object-cover"
              />
            </div>
          </div>
        </button>

        {/* Plus creates another story */}
        <button
          type="button"
          onClick={onCreate}
          aria-label="Add another story"
          className="absolute bottom-0 right-0 z-10 flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-white bg-purple-600 text-white shadow-sm transition-all duration-200 hover:scale-110 hover:bg-purple-700"
        >
          <PlusIcon />
        </button>
      </div>

      <button
        type="button"
        onClick={onView}
        className="w-full truncate text-center text-xs font-medium text-gray-700 transition-colors hover:text-purple-600"
      >
        Your story
      </button>
    </div>
  );
};

/* ========================================
   OTHER USERS STORIES
======================================== */

type StoryItemProps = {
  group: StoryGroup;
  onClick: () => void;
};

const StoryItem = ({
  group,
  onClick,
}: StoryItemProps) => {
  const {
    user,
    has_unseen_stories,
  } = group;

  const avatarUrl = user.avatar
    ? `${storageUrl}/${user.avatar}`
    : "/default-avatar.png";

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-20 shrink-0 flex-col items-center gap-2"
      aria-label={`View ${user.name}'s story`}
    >
      <div
        className={[
          "rounded-full p-[3px] transition-transform duration-200 group-hover:scale-[1.03]",
          has_unseen_stories
            ? "bg-gradient-to-tr from-purple-400 to-purple-700"
            : "bg-gray-300",
        ].join(" ")}
      >
        <div className="rounded-full bg-white p-[2px]">
          <Image
            src={avatarUrl}
            alt={user.name}
            width={80}
            height={80}
            className="h-20 w-20 rounded-full object-cover"
          />
        </div>
      </div>

      <span className="w-full truncate text-center text-xs font-medium text-gray-700 transition-colors group-hover:text-purple-600">
        {user.name}
      </span>
    </button>
  );
};

/* ========================================
   ADD STORY BADGE
======================================== */

const AddStoryBadge = () => {
  return (
    <div className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-white bg-purple-600 text-white shadow-sm transition-all duration-200 group-hover:scale-110 group-hover:bg-purple-700">
      <PlusIcon />
    </div>
  );
};

/* ========================================
   PLUS ICON
======================================== */

const PlusIcon = () => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        d="M12 5v14M5 12h14"
      />
    </svg>
  );
};

/* ========================================
   SKELETON
======================================== */

const StoriesSkeleton = () => {
  return (
    <div className="w-full min-w-0 overflow-hidden rounded-lg bg-white p-4 shadow-md">
      <div className="flex gap-6">
        {Array.from({ length: 6 }).map(
          (_, index) => (
            <div
              key={index}
              className="flex w-20 shrink-0 animate-pulse flex-col items-center gap-2"
            >
              <div className="h-[86px] w-[86px] rounded-full bg-gray-200" />

              <div className="h-3 w-14 rounded bg-gray-200" />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Stories;