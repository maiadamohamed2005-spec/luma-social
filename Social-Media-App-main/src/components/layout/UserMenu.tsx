"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  LogOut,
  Settings,
  UserRound,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

const UserMenu = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [isOpen, setIsOpen] =
    useState(false);

  const menuRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node
        )
      ) {
        setIsOpen(false);
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

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    setIsOpen(false);

    await logout();

    router.push("/login");
  };

  return (
    <div
      ref={menuRef}
      className="relative hidden lg:block"
    >
      <button
        type="button"
        onClick={() =>
          setIsOpen((prev) => !prev)
        }
        className="flex cursor-pointer items-center gap-2 rounded-full px-2 py-1 transition hover:bg-purple-50"
        aria-label="Open user menu"
        aria-expanded={isOpen}
      >
        <div className="relative h-8 w-8 overflow-hidden rounded-full">
          <Image
            src={
              user.avatar
                ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${user.avatar}`
                : "/default-avatar.png"
            }
            alt={user.name}
            fill
            sizes="32px"
            className="object-cover"
          />
        </div>

        <span className="hidden max-w-28 truncate text-sm font-medium text-gray-700 xl:block">
          {user.name}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-52 overflow-hidden rounded-xl border border-gray-100 bg-white py-2 shadow-lg">
          <Link
            href={`/profile/${user.id}`}
            onClick={() =>
              setIsOpen(false)
            }
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition hover:bg-purple-50 hover:text-purple-600"
          >
            <UserRound className="h-4 w-4" />

            Profile
          </Link>

          <Link
            href="/settings"
            onClick={() =>
              setIsOpen(false)
            }
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition hover:bg-purple-50 hover:text-purple-600"
          >
            <Settings className="h-4 w-4" />

            Settings
          </Link>

          <div className="my-1 border-t border-gray-100" />

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-sm text-red-500 transition hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />

            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;