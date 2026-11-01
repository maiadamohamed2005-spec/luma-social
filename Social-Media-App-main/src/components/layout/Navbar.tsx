"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  BellRing,
  CirclePlay,
  House,
  MessagesSquare,
  UserRoundPlus,
  UsersRound,
} from "lucide-react";

import MobileMenu from "./MobileMenu";
import { useAuth } from "@/context/AuthContext";
import Notifications from "../common/Notifications";
import FriendRequests from "../common/FriendRequests";
import { useUnreadNotificationsCount } from "@/hooks/notifications/useNotifications";
import { useUnreadMessagesCount } from "@/hooks/messages/useUnreadMessagesCount";
import { useIncomingFriendRequests } from "@/hooks/friends/useIncomingFriendRequests";
import UserSearch from "../common/UserSearch";
import UserMenu from "./UserMenu";


const Navbar = () => {
 
  const { user, loading } = useAuth();

  const { data: unreadData } = useUnreadNotificationsCount();
  const { count: unreadMessagesCount } = useUnreadMessagesCount();

  const { data: friendRequests = [] } = useIncomingFriendRequests();

  const friendRequestsCount = friendRequests.length;

  const unreadCount = unreadData?.count ?? 0;

  const [showNotifications, setShowNotifications] = useState(false);

  const [showFriendRequests, setShowFriendRequests] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const friendRequestsRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      const target =
        event.target as Node;

      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          target
        )
      ) {
        setShowNotifications(false);
      }

      if (
        friendRequestsRef.current &&
        !friendRequestsRef.current.contains(
          target
        )
      ) {
        setShowFriendRequests(false);
      }

    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <div className="flex h-24 items-center justify-between gap-6">
      {/* LEFT */}
      <div className="shrink-0">
        <Link
          href="/"
          className="whitespace-nowrap text-xl font-bold text-purple-600 transition hover:text-purple-700"
        >
          MJSOCIAL
        </Link>
      </div>

      {/* CENTER */}
      <div className="hidden min-w-0 flex-1 items-center justify-between md:flex">
        {/* LINKS */}
        <div className="flex gap-5 text-sm text-gray-600 lg:gap-6">
          {/* HOME */}
          <Link
            href="/"
            className="group flex items-center gap-2 whitespace-nowrap transition hover:text-purple-600"
          >
            <House className="h-4 w-4 text-gray-500 transition group-hover:text-purple-600" />

            <span>Homepage</span>
          </Link>

          {/* FRIENDS */}
          <Link
            href="/"
            className="group flex items-center gap-2 whitespace-nowrap transition hover:text-purple-600"
          >
            <UsersRound className="h-4 w-4 text-gray-500 transition group-hover:text-purple-600" />

            <span>Friends</span>
          </Link>

          {/* STORIES */}
          <Link
            href="/"
            className="group flex items-center gap-2 whitespace-nowrap transition hover:text-purple-600"
          >
            <CirclePlay className="h-4 w-4 text-gray-500 transition group-hover:text-purple-600" />

            <span>Stories</span>
          </Link>
        </div>

        {/* SEARCH */}
        <div className="hidden lg:block">
          <UserSearch variant="desktop" />
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex shrink-0 items-center gap-3 lg:gap-5">
        {/* FRIEND REQUESTS */}
        <div
          ref={friendRequestsRef}
          className="relative"
        >
          <button
            type="button"
            onClick={() =>
              setShowFriendRequests((prev) => !prev)
            }
            className="group relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition hover:bg-purple-50"
          >
            <UserRoundPlus
              className="h-5 w-5 text-gray-600 transition group-hover:text-purple-600"
            />

            {friendRequestsCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {friendRequestsCount > 99
                  ? "99+"
                  : friendRequestsCount}
              </span>
            )}
          </button>

          {showFriendRequests && (
            <div
              className="
      fixed
      left-2
      right-2
      top-20
      z-50
      sm:absolute
      sm:left-auto
      sm:right-0
      sm:top-11
      sm:w-80
    "
            >
              <FriendRequests />
            </div>
          )}
        </div>

        {/* MESSAGES */}
        <Link
          href="/chat"
          className="group relative flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-purple-50"
        >
          <MessagesSquare className="h-5 w-5 text-gray-600 transition group-hover:text-purple-600" />

          {unreadMessagesCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unreadMessagesCount > 99
                ? "99+"
                : unreadMessagesCount}
            </span>
          )}
        </Link>

        {/* NOTIFICATIONS */}
        <div
          ref={notificationRef}
          className="relative"
        >
          <button
            type="button"
            onClick={() =>
              setShowNotifications((prev) => !prev)
            }
            className="group relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition hover:bg-purple-50"
          >
            <BellRing className="h-5 w-5 text-gray-600 transition group-hover:text-purple-600" />

            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unreadCount > 99
                  ? "99+"
                  : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              className="
      fixed
      left-2
      right-2
      top-20
      z-50
      sm:absolute
      sm:left-auto
      sm:right-0
      sm:top-10
      sm:w-96
    "
            >
              <Notifications
                onClose={() => setShowNotifications(false)}
              />
            </div>
          )}
        </div>

        {/* USER MENU */}
        {!loading && user && <UserMenu />}

        {/* MOBILE MENU */}
        <MobileMenu />
      </div>
    </div>
  );
};

export default Navbar;