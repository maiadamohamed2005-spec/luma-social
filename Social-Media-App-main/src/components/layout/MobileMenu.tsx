"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import UserSearch from "../common/UserSearch";

const MobileMenu = () => {
  const [isOpen, setIsOpen] =
    useState(false);

  const router = useRouter();

  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();

    setIsOpen(false);

    router.push("/login");
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [isOpen]);

  const menuItems = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Profile",
      href: user
        ? `/profile/${user.id}`
        : "/",
    },
    {
      label: "Friends",
      href: "/friends",
    },
    {
      label: "Settings",
      href: "/settings",
    },
  ];

  return (
    <div className="lg:hidden">
      {/* MENU BUTTON */}
      <button
        type="button"
        onClick={() =>
          setIsOpen(
            (prev) => !prev
          )
        }
        aria-label="Toggle menu"
        className="flex flex-col gap-[4.5px]"
      >
        <div
          className={`h-1 w-6 origin-left rounded-sm bg-purple-600 transition duration-500 ease-in-out ${
            isOpen
              ? "rotate-45"
              : ""
          }`}
        />

        <div
          className={`h-1 w-6 rounded-sm bg-purple-600 transition duration-500 ease-in-out ${
            isOpen
              ? "opacity-0"
              : ""
          }`}
        />

        <div
          className={`h-1 w-6 origin-left rounded-sm bg-purple-600 transition duration-500 ease-in-out ${
            isOpen
              ? "-rotate-45"
              : ""
          }`}
        />
      </button>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="fixed inset-x-0 bottom-0 top-24 z-40 overflow-y-auto bg-white px-5 pb-8">
          <div className="mx-auto flex w-full max-w-md flex-col gap-8 pt-6">
            {/* SEARCH */}
            <UserSearch
              variant="mobile"
              onSelect={closeMenu}
            />

            {/* LINKS */}
            <div className="flex flex-col items-center gap-7 text-lg font-medium">
              {menuItems.map(
                (item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={closeMenu}
                    className="transition hover:text-purple-600"
                  >
                    {item.label}
                  </Link>
                )
              )}

              <button
                type="button"
                onClick={
                  handleLogout
                }
                className="text-red-500 transition hover:text-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;