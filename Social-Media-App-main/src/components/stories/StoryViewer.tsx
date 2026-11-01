"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useDeleteStory } from "@/hooks/stories/useDeleteStory";
import { useStoryViewers } from "@/hooks/stories/useStoryViewers";
import { useViewStory } from "@/hooks/stories/useViewStory";

import type {
  Story,
  StoryGroup,
  StoryViewersResponse,
} from "@/types/story";

type StoryViewerProps = {
  groups: StoryGroup[];
  initialGroupIndex: number;
  onClose: () => void;
};

const IMAGE_DURATION = 5000;

const storageUrl =
  process.env.NEXT_PUBLIC_STORAGE_URL;

const StoryViewer = ({
  groups,
  initialGroupIndex,
  onClose,
}: StoryViewerProps) => {
  const {
    deleteStory,
    isDeleting,
  } = useDeleteStory();

  const { viewStory } = useViewStory();

  const [groupIndex, setGroupIndex] =
    useState(initialGroupIndex);

  const [storyIndex, setStoryIndex] =
    useState(0);

  const [progress, setProgress] =
    useState(0);

  const [isPaused, setIsPaused] =
    useState(false);

  const [
    isMediaLoading,
    setIsMediaLoading,
  ] = useState(true);

  const [
    hasMediaError,
    setHasMediaError,
  ] = useState(false);

  const [
    isDeleteModalOpen,
    setIsDeleteModalOpen,
  ] = useState(false);

  const [
    isViewersOpen,
    setIsViewersOpen,
  ] = useState(false);

  const [
    deleteError,
    setDeleteError,
  ] = useState<string | null>(null);

  const videoRef =
    useRef<HTMLVideoElement | null>(null);

  const imageElapsedRef = useRef(0);

  const currentGroup =
    groups[groupIndex];

  const currentStory =
    currentGroup?.stories[storyIndex];

  const canDeleteStory =
    currentGroup?.is_current_user ?? false;

  const canViewViewers =
    currentGroup?.is_current_user ?? false;

  const {
    data: viewersData,
    isLoading: isViewersLoading,
    isError: isViewersError,
  } = useStoryViewers(
    currentStory?.id ?? null,
    isViewersOpen &&
      canViewViewers
  );

  const isOverlayOpen =
    isDeleteModalOpen ||
    isViewersOpen;

  const resetStoryState =
    useCallback(() => {
      setProgress(0);
      setIsPaused(false);
      setIsMediaLoading(true);
      setHasMediaError(false);

      imageElapsedRef.current = 0;
    }, []);

  const goToNext =
    useCallback(() => {
      if (!currentGroup) {
        return;
      }

      resetStoryState();

      const hasNextStory =
        storyIndex <
        currentGroup.stories.length - 1;

      if (hasNextStory) {
        setStoryIndex(
          (current) => current + 1
        );

        return;
      }

      const hasNextGroup =
        groupIndex <
        groups.length - 1;

      if (hasNextGroup) {
        setGroupIndex(
          (current) => current + 1
        );

        setStoryIndex(0);

        return;
      }

      onClose();
    }, [
      currentGroup,
      storyIndex,
      groupIndex,
      groups.length,
      onClose,
      resetStoryState,
    ]);

  const goToPrevious =
    useCallback(() => {
      resetStoryState();

      if (storyIndex > 0) {
        setStoryIndex(
          (current) => current - 1
        );

        return;
      }

      if (groupIndex > 0) {
        const previousGroupIndex =
          groupIndex - 1;

        const previousGroup =
          groups[
            previousGroupIndex
          ];

        setGroupIndex(
          previousGroupIndex
        );

        setStoryIndex(
          Math.max(
            previousGroup.stories
              .length - 1,
            0
          )
        );
      }
    }, [
      storyIndex,
      groupIndex,
      groups,
      resetStoryState,
    ]);

  const openDeleteModal = () => {
    if (!canDeleteStory) {
      return;
    }

    setDeleteError(null);
    setIsPaused(true);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (isDeleting) {
      return;
    }

    setIsDeleteModalOpen(false);
    setDeleteError(null);
    setIsPaused(false);
  };

  const handleDeleteStory =
    async () => {
      if (
        !currentStory ||
        !canDeleteStory ||
        isDeleting
      ) {
        return;
      }

      setDeleteError(null);

      try {
        await deleteStory(
          currentStory.id
        );

        setIsDeleteModalOpen(false);

        onClose();
      } catch (error) {
        setDeleteError(
          error instanceof Error
            ? error.message
            : "Unable to delete story."
        );
      }
    };

  const openViewersPanel = () => {
    if (!canViewViewers) {
      return;
    }

    setIsPaused(true);
    setIsViewersOpen(true);
  };

  const closeViewersPanel = () => {
    setIsViewersOpen(false);
    setIsPaused(false);
  };

  useEffect(() => {
    if (
      !currentStory ||
      currentGroup?.is_current_user ||
      currentStory.is_viewed
    ) {
      return;
    }

    void viewStory(
      currentStory.id
    ).catch((error) => {
      console.error(
        "Failed to mark story as viewed:",
        error
      );
    });
  }, [
    currentStory,
    currentGroup?.is_current_user,
    viewStory,
  ]);

  useEffect(() => {
    if (
      !currentStory ||
      currentStory.media.type !==
        "image" ||
      isPaused ||
      isMediaLoading
    ) {
      return;
    }

    let lastTimestamp =
      performance.now();

    const interval =
      window.setInterval(() => {
        const now =
          performance.now();

        imageElapsedRef.current +=
          now - lastTimestamp;

        lastTimestamp = now;

        const nextProgress =
          Math.min(
            (imageElapsedRef.current /
              IMAGE_DURATION) *
              100,
            100
          );

        setProgress(nextProgress);

        if (nextProgress >= 100) {
          window.clearInterval(
            interval
          );

          goToNext();
        }
      }, 50);

    return () => {
      window.clearInterval(
        interval
      );
    };
  }, [
    currentStory,
    isPaused,
    isMediaLoading,
    goToNext,
  ]);

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (isDeleteModalOpen) {
        if (
          event.key === "Escape" &&
          !isDeleting
        ) {
          setIsDeleteModalOpen(
            false
          );

          setDeleteError(null);
          setIsPaused(false);
        }

        return;
      }

      if (isViewersOpen) {
        if (
          event.key === "Escape"
        ) {
          setIsViewersOpen(false);
          setIsPaused(false);
        }

        return;
      }

      if (
        event.key === "Escape"
      ) {
        onClose();
        return;
      }

      if (
        event.key ===
        "ArrowRight"
      ) {
        goToNext();
        return;
      }

      if (
        event.key ===
        "ArrowLeft"
      ) {
        goToPrevious();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    goToNext,
    goToPrevious,
    onClose,
    isDeleteModalOpen,
    isDeleting,
    isViewersOpen,
  ]);

  useEffect(() => {
    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, []);

  if (
    !currentGroup ||
    !currentStory
  ) {
    return null;
  }

  const avatarUrl =
    currentGroup.user.avatar
      ? `${storageUrl}/${currentGroup.user.avatar}`
      : "/default-avatar.png";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      role="dialog"
      aria-modal="true"
      aria-label="Story viewer"
    >
      <div className="relative flex h-full w-full items-center justify-center md:h-[95vh] md:max-w-[500px]">
        <div
          className="relative h-full w-full overflow-hidden bg-black md:rounded-xl"
          onPointerDown={() => {
            if (!isOverlayOpen) {
              setIsPaused(true);
            }
          }}
          onPointerUp={() => {
            if (!isOverlayOpen) {
              setIsPaused(false);
            }
          }}
          onPointerCancel={() => {
            if (!isOverlayOpen) {
              setIsPaused(false);
            }
          }}
          onPointerLeave={() => {
            if (!isOverlayOpen) {
              setIsPaused(false);
            }
          }}
        >
          <StoryProgress
            stories={
              currentGroup.stories
            }
            currentIndex={
              storyIndex
            }
            progress={progress}
          />

          {/* Header */}
          <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-4 pb-4 pt-8">
            <div className="flex min-w-0 items-center gap-3">
              <Image
                src={avatarUrl}
                alt={
                  currentGroup.user
                    .name
                }
                width={40}
                height={40}
                className="h-10 w-10 shrink-0 rounded-full object-cover"
              />

              <div className="min-w-0 text-white">
                <p className="truncate text-sm font-semibold">
                  {
                    currentGroup
                      .user.name
                  }
                </p>

                <p className="text-xs text-white/70">
                  {formatStoryTime(
                    currentStory.created_at
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {canViewViewers && (
                <button
                  type="button"
                  onClick={
                    openViewersPanel
                  }
                  aria-label="View story viewers"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-purple-500/20 hover:text-purple-300"
                >
                  <EyeIcon />
                </button>
              )}

              {canDeleteStory && (
                <button
                  type="button"
                  onClick={
                    openDeleteModal
                  }
                  aria-label="Delete story"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-red-500/20 hover:text-red-400"
                >
                  <TrashIcon />
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                aria-label="Close stories"
                className="flex h-10 w-10 items-center justify-center rounded-full text-2xl text-white transition hover:bg-white/10"
              >
                ×
              </button>
            </div>
          </div>

          {/* Media */}
          <StoryMedia
            story={currentStory}
            videoRef={videoRef}
            isPaused={isPaused}
            onProgress={
              setProgress
            }
            onEnded={goToNext}
            onMediaReady={() =>
              setIsMediaLoading(
                false
              )
            }
            onMediaError={() => {
              setIsMediaLoading(
                false
              );

              setHasMediaError(
                true
              );
            }}
          />

          {/* Loading */}
          {isMediaLoading && (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
              <div
                className="h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white"
                role="status"
                aria-label="Loading story"
              />
            </div>
          )}

          {/* Media error */}
          {hasMediaError && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black">
              <div className="px-6 text-center text-white">
                <p className="text-lg font-semibold">
                  Unable to load story
                </p>

                <p className="mt-2 text-sm text-white/60">
                  This media could
                  not be displayed.
                </p>

                <button
                  type="button"
                  onClick={
                    goToNext
                  }
                  className="mt-5 rounded-lg bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-gray-200"
                >
                  Next story
                </button>
              </div>
            </div>
          )}

          {/* Caption */}
          {currentStory.caption && (
            <div className="absolute bottom-8 left-4 right-4 z-20">
              <p className="rounded-lg bg-black/40 px-4 py-3 text-center text-sm text-white backdrop-blur-sm">
                {
                  currentStory.caption
                }
              </p>
            </div>
          )}

          {/* Previous */}
          <button
            type="button"
            onClick={goToPrevious}
            disabled={
              isOverlayOpen ||
              (groupIndex === 0 &&
                storyIndex === 0)
            }
            aria-label="Previous story"
            className="absolute bottom-0 left-0 top-24 z-10 w-1/3 disabled:cursor-default"
          />

          {/* Next */}
          <button
            type="button"
            onClick={goToNext}
            disabled={isOverlayOpen}
            aria-label="Next story"
            className="absolute bottom-0 right-0 top-24 z-10 w-1/3 disabled:cursor-default"
          />

          {/* Viewers Panel */}
          {isViewersOpen && (
            <StoryViewersPanel
              data={viewersData}
              isLoading={
                isViewersLoading
              }
              isError={
                isViewersError
              }
              onClose={
                closeViewersPanel
              }
            />
          )}

          {/* Delete Dialog */}
          {isDeleteModalOpen && (
            <DeleteStoryDialog
              isDeleting={
                isDeleting
              }
              error={
                deleteError
              }
              onCancel={
                closeDeleteModal
              }
              onConfirm={
                handleDeleteStory
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

/* ========================================
   STORY VIEWERS PANEL
======================================== */

type StoryViewersPanelProps = {
  data:
    | StoryViewersResponse
    | undefined;
  isLoading: boolean;
  isError: boolean;
  onClose: () => void;
};

const StoryViewersPanel = ({
  data,
  isLoading,
  isError,
  onClose,
}: StoryViewersPanelProps) => {
  const viewsCount =
    data?.views_count ?? 0;

  return (
    <div
      className="absolute inset-0 z-40 flex items-end bg-black/40 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="w-full overflow-hidden rounded-t-3xl bg-white shadow-2xl"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* Handle */}
        <div className="flex justify-center pt-3">
          <div className="h-1.5 w-10 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Story viewers
            </h3>

            <p className="mt-0.5 text-xs text-gray-500">
              {viewsCount}{" "}
              {viewsCount === 1
                ? "view"
                : "views"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close viewers"
            className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-gray-500 transition hover:bg-purple-50 hover:text-purple-600"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[55vh] overflow-y-auto overscroll-contain px-5 py-3">
          {isLoading && (
            <ViewersSkeleton />
          )}

          {isError && (
            <div className="py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
                <span className="text-xl">
                  !
                </span>
              </div>

              <p className="mt-3 text-sm font-semibold text-gray-700">
                Unable to load viewers
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Please try again
                later.
              </p>
            </div>
          )}

          {!isLoading &&
            !isError &&
            data?.viewers.length ===
              0 && (
              <div className="py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                  <EyeIcon />
                </div>

                <p className="mt-3 text-sm font-semibold text-gray-700">
                  No viewers yet
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Views will appear
                  here.
                </p>
              </div>
            )}

          {!isLoading &&
            !isError &&
            data?.viewers.map(
              (viewer) => {
                const avatarUrl =
                  viewer.avatar
                    ? `${storageUrl}/${viewer.avatar}`
                    : "/default-avatar.png";

                return (
                  <div
                    key={
                      viewer.id
                    }
                    className="flex items-center gap-3 border-b border-gray-100 py-3 last:border-none"
                  >
                    <Image
                      src={
                        avatarUrl
                      }
                      alt={
                        viewer.name
                      }
                      width={44}
                      height={44}
                      className="h-11 w-11 shrink-0 rounded-full object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {
                          viewer.name
                        }
                      </p>

                      <p className="truncate text-xs text-gray-500">
                        @
                        {
                          viewer.username
                        }
                      </p>
                    </div>

                    <span className="shrink-0 text-xs text-gray-400">
                      {formatViewedTime(
                        viewer.viewed_at
                      )}
                    </span>
                  </div>
                );
              }
            )}
        </div>
      </div>
    </div>
  );
};

/* ========================================
   VIEWERS SKELETON
======================================== */

const ViewersSkeleton = () => {
  return (
    <div className="space-y-2">
      {Array.from({
        length: 4,
      }).map((_, index) => (
        <div
          key={index}
          className="flex animate-pulse items-center gap-3 py-2"
        >
          <div className="h-11 w-11 shrink-0 rounded-full bg-gray-200" />

          <div className="flex-1 space-y-2">
            <div className="h-3 w-28 rounded bg-gray-200" />

            <div className="h-3 w-20 rounded bg-gray-100" />
          </div>

          <div className="h-3 w-8 rounded bg-gray-100" />
        </div>
      ))}
    </div>
  );
};

/* ========================================
   DELETE STORY DIALOG
======================================== */

type DeleteStoryDialogProps = {
  isDeleting: boolean;
  error: string | null;
  onCancel: () => void;
  onConfirm: () => void;
};

const DeleteStoryDialog = ({
  isDeleting,
  error,
  onCancel,
  onConfirm,
}: DeleteStoryDialogProps) => {
  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 px-5 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-story-title"
        aria-describedby="delete-story-description"
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
          <TrashIcon />
        </div>

        <div className="mt-4 text-center">
          <h3
            id="delete-story-title"
            className="text-lg font-semibold text-gray-900"
          >
            Delete story?
          </h3>

          <p
            id="delete-story-description"
            className="mt-2 text-sm leading-6 text-gray-500"
          >
            This story will be
            permanently deleted.
            This action cannot be
            undone.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            )}

            {isDeleting
              ? "Deleting..."
              : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ========================================
   STORY PROGRESS
======================================== */

type StoryProgressProps = {
  stories: Story[];
  currentIndex: number;
  progress: number;
};

const StoryProgress = ({
  stories,
  currentIndex,
  progress,
}: StoryProgressProps) => {
  return (
    <div className="absolute left-3 right-3 top-3 z-30 flex gap-1">
      {stories.map(
        (story, index) => {
          let width = 0;

          if (
            index < currentIndex
          ) {
            width = 100;
          }

          if (
            index === currentIndex
          ) {
            width = progress;
          }

          return (
            <div
              key={story.id}
              className="h-1 flex-1 overflow-hidden rounded-full bg-white/30"
            >
              <div
                className="h-full bg-white"
                style={{
                  width: `${width}%`,
                }}
              />
            </div>
          );
        }
      )}
    </div>
  );
};

/* ========================================
   STORY MEDIA
======================================== */

type StoryMediaProps = {
  story: Story;
  videoRef: React.RefObject<
    HTMLVideoElement | null
  >;
  isPaused: boolean;
  onProgress: (
    progress: number
  ) => void;
  onEnded: () => void;
  onMediaReady: () => void;
  onMediaError: () => void;
};

const StoryMedia = ({
  story,
  videoRef,
  isPaused,
  onProgress,
  onMediaReady,
  onEnded,
  onMediaError,
}: StoryMediaProps) => {
  useEffect(() => {
    const video =
      videoRef.current;

    if (!video) {
      return;
    }

    if (isPaused) {
      video.pause();
      return;
    }

    void video
      .play()
      .catch(() => {
        // Autoplay may be blocked.
      });
  }, [
    isPaused,
    videoRef,
  ]);

  if (
    story.media.type === "video"
  ) {
    return (
      <video
        ref={videoRef}
        src={story.media.url}
        autoPlay
        playsInline
        className="h-full w-full object-contain"
        onCanPlay={
          onMediaReady
        }
        onError={
          onMediaError
        }
        onTimeUpdate={(
          event
        ) => {
          const video =
            event.currentTarget;

          if (
            !video.duration
          ) {
            return;
          }

          onProgress(
            Math.min(
              (video.currentTime /
                video.duration) *
                100,
              100
            )
          );
        }}
        onEnded={onEnded}
      />
    );
  }

  return (
    <Image
      src={story.media.url}
      alt="Story"
      fill
      priority
      sizes="(max-width: 768px) 100vw, 500px"
      className="object-contain"
      onLoad={onMediaReady}
      onError={
        onMediaError
      }
    />
  );
};

/* ========================================
   EYE ICON
======================================== */

const EyeIcon = () => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
      />

      <circle
        cx="12"
        cy="12"
        r="2.5"
      />
    </svg>
  );
};

/* ========================================
   TRASH ICON
======================================== */

const TrashIcon = () => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5"
      />
    </svg>
  );
};

/* ========================================
   FORMAT STORY TIME
======================================== */

const formatStoryTime = (
  createdAt: string
) => {
  const created =
    new Date(createdAt);

  const now = new Date();

  const difference =
    now.getTime() -
    created.getTime();

  const minutes =
    Math.floor(
      difference / 60_000
    );

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours =
    Math.floor(
      minutes / 60
    );

  return `${hours}h`;
};

/* ========================================
   FORMAT VIEWED TIME
======================================== */

const formatViewedTime = (
  viewedAt: string
) => {
  const viewed =
    new Date(viewedAt);

  const now = new Date();

  const difference =
    now.getTime() -
    viewed.getTime();

  const minutes =
    Math.floor(
      difference / 60_000
    );

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours =
    Math.floor(
      minutes / 60
    );

  if (hours < 24) {
    return `${hours}h`;
  }

  const days =
    Math.floor(
      hours / 24
    );

  return `${days}d`;
};

export default StoryViewer;