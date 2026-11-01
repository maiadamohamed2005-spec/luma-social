import Image from "next/image";
import Link from "next/link";
import type { User } from "@/types/user";
import { useSendFriendRequest } from "@/hooks/friends/useSendFriendRequest";
import { useCancelFriendRequest } from "@/hooks/friends/useCancelFriendRequest";
import { useRemoveFriend } from "@/hooks/friends/useRemoveFriend";


type UserInfoCardProps = {
    user: User;
    isOwnProfile: boolean;
};

const UserInfoCard = ({ user, isOwnProfile }: UserInfoCardProps) => {
    const { mutate: sendRequest, isPending } = useSendFriendRequest();
    const { mutate: cancelRequest, isPending: isCanceling, } = useCancelFriendRequest();
    const { mutate: removeFriend, isPending: isRemoving, } = useRemoveFriend();

    return (
        <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">

            {/* TOP */}
            <div className="flex items-center justify-between font-medium">
                <span className="text-gray-500">User Information</span>
                <Link href="/" className="text-blue-500 text-xs">See all</Link>
            </div>

            {/* Bottom */}
            <div className="flex flex-col gap-4 text-gray-500">
                <div className="flex items-center gap-2">
                    <span className="text-xl text-black">{user.name}</span>
                    <span className="text-sm">@{user.username}</span>
                </div>
                <p>{user.bio || " "}</p>


                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <Image src="/link.png" alt="" width={16} height={16} />
                        <Link href="https://mj.dev" className="text-blue-500 font-medium">
                            mj.dev
                        </Link>
                    </div>
                    <div className="flex items-center gap-1">
                        <Image src="/date.png" alt="" width={16} height={16} />
                        <span>Joined Jul 2023</span>
                    </div>
                </div>
                {!isOwnProfile && (
                    <>
                        {user.friendship?.status === "accepted" ? (
                            <button
                                onClick={() => {
                                    if (user.friendship) {
                                        removeFriend({
                                            friendshipId: user.friendship.id,
                                            userId: user.id,
                                        });
                                    }
                                }}
                                disabled={isRemoving}
                                className="cursor-pointer rounded-md bg-red-500 p-2 text-sm text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isRemoving ? "Removing..." : "Remove Friend"}
                            </button>
                        ) : user.friendship?.status === "pending" ? (
                            <button
                                onClick={() => {
                                    if (user.friendship) {
                                        cancelRequest({
                                            friendshipId: user.friendship.id,
                                            userId: user.id,
                                        });
                                    }
                                }}
                                disabled={isCanceling}
                                className="cursor-pointer rounded-md bg-gray-400 p-2 text-sm text-white transition hover:bg-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isCanceling ? "Canceling..." : "Cancel Request"}
                            </button>
                        ) : (
                            <button
                                onClick={() => sendRequest(user.id)}
                                disabled={isPending}
                                className="cursor-pointer rounded-md bg-purple-600 p-2 text-sm text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isPending ? "Sending..." : "Add Friend"}
                            </button>
                        )}
                    </>
                )}
                <span className="cursor-pointer self-end text-xs text-red-400 transition hover:text-red-600">
                    Block User
                </span>
            </div>

        </div>
    )
}

export default UserInfoCard;