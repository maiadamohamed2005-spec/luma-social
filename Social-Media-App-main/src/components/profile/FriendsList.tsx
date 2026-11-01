"use client";

import Image from "next/image";
import Link from "next/link";
import type { User } from "@/types/user";

type FriendsListProps = {
    friends: User[];
    isLoading: boolean;
};

const FriendsList = ({
    friends,
    isLoading,
}: FriendsListProps) => {
    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="font-semibold mb-4">
                    Friends
                </h2>

                <p className="text-sm text-gray-500">
                    Loading friends...
                </p>
            </div>
        );
    }

    const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL;
    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">
                    Friends
                </h2>

                <span className="text-sm text-gray-500">
                    {friends.length}
                </span>
            </div>

            {friends.length === 0 ? (
                <p className="text-sm text-gray-500">
                    No friends yet.
                </p>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    {friends.map((friend) => {
                        const avatarUrl = friend.avatar
                            ? `${storageUrl}/${friend.avatar}`
                            : "/default-avatar.png";

                        return (
                            <Link
                                key={friend.id}
                                href={`/profile/${friend.id}`}
                                className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition"
                            >
                                <Image
                                    src={avatarUrl}
                                    alt={friend.name}
                                    width={48}
                                    height={48}
                                    className="w-12 h-12 rounded-full object-cover"
                                />

                                <div>
                                    <p className="font-medium text-sm">
                                        {friend.name}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        @{friend.username}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default FriendsList;