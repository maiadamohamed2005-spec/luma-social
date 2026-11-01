"use client";

import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import {
    useEffect,
    useRef,
    useState,
} from "react";

import { useSearchUsers } from "@/hooks/profile/useSearchUsers";
import { useDebounce } from "@/hooks/shared/useDebounce";

type UserSearchProps = {
    variant?: "desktop" | "mobile";
    onSelect?: () => void;
};

const UserSearch = ({
    variant = "desktop",
    onSelect,
}: UserSearchProps) => {
    const [search, setSearch] =
        useState("");

    const [showResults, setShowResults] =
        useState(false);

    const searchRef =
        useRef<HTMLDivElement>(null);

    const debouncedSearch =
        useDebounce(search, 400);

    const {
        data,
        isLoading,
        isError,
    } = useSearchUsers(
        debouncedSearch
    );

    const results =
        data?.data ?? [];

    const hasSearch =
        search.trim().length >= 2;

    useEffect(() => {
        if (variant !== "desktop") {
            return;
        }

        const handleClickOutside = (
            event: MouseEvent
        ) => {
            const target =
                event.target as Node;

            if (
                searchRef.current &&
                !searchRef.current.contains(
                    target
                )
            ) {
                setShowResults(false);
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
    }, [variant]);

    const handleSelect = () => {
        setSearch("");
        setShowResults(false);

        onSelect?.();
    };

    return (
        <div
            ref={searchRef}
            className={
                variant === "desktop"
                    ? "relative"
                    : "w-full"
            }
        >
            {/* Search Input */}
            <div className="flex items-center rounded-xl bg-slate-100 px-3 py-2.5 transition focus-within:ring-2 focus-within:ring-purple-100">
                <input
                    type="text"
                    value={search}
                    onChange={(event) => {
                        setSearch(event.target.value);
                        setShowResults(true);
                    }}
                    onFocus={() => {
                        if (hasSearch) {
                            setShowResults(true);
                        }
                    }}
                    placeholder="Search users..."
                    className={`min-w-0 flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 ${variant === "desktop"
                            ? "w-28 xl:w-44"
                            : ""
                        }`}
                />

                <Search className="h-4 w-4 shrink-0 text-gray-500" />
            </div>

            {/* Results */}
            {showResults &&
                hasSearch && (
                    <div
                        className={
                            variant === "desktop"
                                ? "absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl"
                                : "mt-2 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                        }
                    >
                        {/* Loading */}
                        {isLoading && (
                            <div className="p-4 text-center text-sm text-gray-500">
                                Searching...
                            </div>
                        )}

                        {/* Error */}
                        {!isLoading &&
                            isError && (
                                <div className="p-4 text-center text-sm text-red-500">
                                    Unable to search users.
                                </div>
                            )}

                        {/* Empty */}
                        {!isLoading &&
                            !isError &&
                            results.length === 0 && (
                                <div className="p-4 text-center text-sm text-gray-500">
                                    No users found.
                                </div>
                            )}

                        {/* Users */}
                        {!isLoading &&
                            !isError &&
                            results.length > 0 && (
                                <div className="max-h-72 overflow-y-auto p-2">
                                    {results.map(
                                        (user) => (
                                            <Link
                                                key={user.id}
                                                href={`/profile/${user.id}`}
                                                onClick={
                                                    handleSelect
                                                }
                                                className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-purple-50"
                                            >
                                                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-100">
                                                    <Image
                                                        src={
                                                            user.avatar
                                                                ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${user.avatar}`
                                                                : "/default-avatar.png"
                                                        }
                                                        alt={
                                                            user.name
                                                        }
                                                        fill
                                                        sizes="40px"
                                                        className="object-cover"
                                                    />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold text-gray-800">
                                                        {user.name}
                                                    </p>

                                                    <p className="truncate text-xs text-gray-500">
                                                        @{user.username}
                                                    </p>
                                                </div>
                                            </Link>
                                        )
                                    )}
                                </div>
                            )}
                    </div>
                )}
        </div>
    );
};

export default UserSearch;