"use client";

import Image from "next/image";

type PostActionsProps = {
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    videoInputRef: React.RefObject<HTMLInputElement | null>;
    onImageChange: (
        e: React.ChangeEvent<HTMLInputElement>
    ) => void;
    onVideoChange: (
        e: React.ChangeEvent<HTMLInputElement>
    ) => void;
    loading: boolean;
};

const PostActions = ({
    fileInputRef,
    videoInputRef,
    onImageChange,
    onVideoChange,
    loading,
}: PostActionsProps) => {
    return (
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            {/* PHOTO */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={onImageChange}
                className="hidden"
            />

            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-gray-600 transition hover:bg-purple-50 hover:text-purple-600"
            >
                <Image
                    src="/addimage.png"
                    alt="Photo"
                    width={20}
                    height={20}
                    className="opacity-80 transition hover:opacity-100"
                />
                <span className="font-medium">
                    Photo
                </span>
            </button>

            {/* VIDEO */}
            <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/quicktime,video/webm"
                onChange={onVideoChange}
                className="hidden"
            />

            <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                className="flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-gray-600 transition hover:bg-purple-50 hover:text-purple-600"
            >
                <Image
                    src="/addVideo.png"
                    alt="Video"
                    width={20}
                    height={20}
                    className="opacity-80 transition hover:opacity-100"
                />
                <span className="font-medium">
                    Video
                </span>
            </button>

            {/* POLL */}
            <button
                type="button"
                className="flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-gray-600 transition hover:bg-purple-50 hover:text-purple-600"
            >
                <Image
                    src="/poll.png"
                    alt="Poll"
                    width={20}
                    height={20}
                    className="opacity-80 transition hover:opacity-100"
                />
                <span className="font-medium">
                    Poll
                </span>
            </button>

            {/* EVENT */}
            <button
                type="button"
                className="flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-gray-600 transition hover:bg-purple-50 hover:text-purple-600"
            >
                <Image
                    src="/addevent.png"
                    alt="Event"
                    width={20}
                    height={20}
                    className="opacity-80 transition hover:opacity-100"
                />
                <span className="font-medium">
                    Event
                </span>
            </button>

            {/* POST */}
            <button
                type="submit"
                disabled={loading}
                className="ml-auto cursor-pointer rounded-xl bg-purple-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-purple-300"
            >
                {loading ? "Posting..." : "Post"}
            </button>
        </div>
    );
};

export default PostActions;