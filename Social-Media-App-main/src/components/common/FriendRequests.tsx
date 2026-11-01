"use client";

import Link from "next/link";
import Image from "next/image";
import { useIncomingFriendRequests } from "@/hooks/friends/useIncomingFriendRequests";
import { useAcceptFriendRequest } from "@/hooks/friends/useAcceptFriendRequest";
import { useRejectFriendRequest } from "@/hooks/friends/useRejectFriendRequest";
import { Check, X } from "lucide-react";

const FriendRequests = () => {
  const { data: requests = [], isLoading, isError, } = useIncomingFriendRequests();
  const { mutate: acceptRequest, variables: acceptingRequestId, isPending: isAccepting, } = useAcceptFriendRequest();
  const { mutate: rejectRequest, variables: rejectingRequestId, isPending: isRejecting, } = useRejectFriendRequest();

  return (
    <div className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto rounded-lg bg-white p-4 text-sm shadow-md">

      {/* TOP */}
      <div className="font-medium">
        <span className="text-gray-500">
          Friend Requests
        </span>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-6">
          <p className="text-sm text-gray-500">
            Loading requests...
          </p>
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <p className="text-sm font-medium text-red-500">
            Failed to load friend requests
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Please try again later.
          </p>
        </div>
      )}

      {!isLoading &&
        !isError &&
        requests.length === 0 && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-sm font-medium text-gray-700">
              No friend requests
            </p>

            <p className="mt-1 text-xs text-gray-400">
              You are all caught up!
            </p>
          </div>
        )}

      {!isLoading &&
        !isError &&
        requests.map((request) => {
          const storageUrl =
            process.env.NEXT_PUBLIC_STORAGE_URL;

          const avatarUrl = request.user.avatar
            ? `${storageUrl}/${request.user.avatar}`
            : "/default-avatar.png";

          return (
            <div
              key={request.id}
              className="flex items-center justify-between"
            >
              {/* USER */}
              <Link
                href={`/profile/${request.user.id}`}
                className="group flex min-w-0 items-center gap-3"
              >
                <Image
                  src={avatarUrl}
                  alt={request.user.name}
                  width={40}
                  height={40}
                  className="h-10 w-10 shrink-0 rounded-full object-cover transition group-hover:opacity-90"
                />

                <span className="truncate font-semibold transition group-hover:text-purple-600">
                  {request.user.name}
                </span>
              </Link>

              {/* ACTIONS */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => acceptRequest(request.id)}
                  disabled={
                    isAccepting &&
                    acceptingRequestId === request.id
                  }
                  title="Accept friend request"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 text-sky-600 transition hover:bg-sky-100"
                >
                  <Check className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => rejectRequest(request.id)}
                  disabled={
                    isRejecting &&
                    rejectingRequestId === request.id
                  }
                  title="Reject friend request"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-rose-500 transition hover:bg-rose-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default FriendRequests;