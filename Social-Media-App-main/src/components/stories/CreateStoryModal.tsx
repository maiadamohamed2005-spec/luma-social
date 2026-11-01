"use client";

import Image from "next/image";
import {
    ChangeEvent,
    useEffect,
    useState,
} from "react";

import { useCreateStory } from "@/hooks/stories/useCreateStory";

import { ApiError } from "@/lib/api";

type CreateStoryModalProps = {
    onClose: () => void;
};

const CreateStoryModal = ({
    onClose,
}: CreateStoryModalProps) => {
    const [media, setMedia] =
        useState<File | null>(null);

    const [previewUrl, setPreviewUrl] =
        useState<string | null>(null);

    const [caption, setCaption] =
        useState("");

    const [visibility, setVisibility] =
        useState<"public" | "friends">("friends");

    const {
        createStory,
        isCreating,
        error
    } = useCreateStory();

    const handleMediaChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        setMedia(file);

        const url = URL.createObjectURL(file);

        setPreviewUrl(url);
    };

    const handleSubmit = async () => {
        if (!media || isCreating) {
            return;
        }

        try {
            await createStory({
                media,
                caption,
                visibility,
            });

            onClose();
        } catch {
            // The mutation error is displayed in the UI.
        }
    };

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const isVideo =
        media?.type.startsWith("video/");

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    const errorMessage =
        error instanceof ApiError
            ? error.errors.media?.[0] ??
            error.errors.caption?.[0] ??
            error.errors.visibility?.[0] ??
            error.message
            : error instanceof Error
                ? error.message
                : null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={onClose}
        >
            <div
                className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl"
                onClick={(event) => event.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b px-5 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Create story
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-2xl text-gray-500 transition hover:bg-gray-100"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="p-5">
                    {!previewUrl ? (
                        <label className="group flex min-h-80 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-purple-300 bg-purple-50/40 p-6 text-center transition hover:border-purple-500 hover:bg-purple-50">
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-purple-600 transition group-hover:bg-purple-200">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="h-7 w-7"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 5v14M5 12h14"
                                    />
                                </svg>
                            </div>

                            <p className="font-semibold text-gray-800">
                                Add photo or video
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                                Choose media for your story
                            </p>

                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
                                onChange={handleMediaChange}
                                className="hidden"
                            />
                        </label>
                    ) : (
                        <div className="space-y-4">
                            <div className="relative flex h-[350px] items-center justify-center overflow-hidden rounded-xl bg-black sm:h-[400px]">
                                {isVideo ? (
                                    <video
                                        src={previewUrl}
                                        controls
                                        playsInline
                                        className="h-full w-full object-contain"
                                    />
                                ) : (
                                    <Image
                                        src={previewUrl}
                                        alt="Story preview"
                                        fill
                                        unoptimized
                                        className="object-contain"
                                    />
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="story-caption"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Caption
                                </label>

                                <textarea
                                    id="story-caption"
                                    value={caption}
                                    onChange={(event) =>
                                        setCaption(event.target.value)
                                    }
                                    maxLength={500}
                                    rows={3}
                                    placeholder="Write something about your story..."
                                    className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                                />

                                <p className="mt-1 text-right text-xs text-gray-400">
                                    {caption.length}/500
                                </p>
                            </div>

                            <div>
                                <label
                                    htmlFor="story-visibility"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Who can see your story?
                                </label>

                                <select
                                    id="story-visibility"
                                    value={visibility}
                                    onChange={(event) =>
                                        setVisibility(
                                            event.target.value as
                                            | "public"
                                            | "friends"
                                        )
                                    }
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                                >
                                    <option value="friends">
                                        Friends
                                    </option>

                                    <option value="public">
                                        Public
                                    </option>
                                </select>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setMedia(null);
                                    setPreviewUrl(null);
                                }}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                            >
                                Choose another file
                            </button>
                            {errorMessage && (
                                <div
                                    role="alert"
                                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                                >
                                    {errorMessage}
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={!media || isCreating}
                                className="w-full rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isCreating
                                    ? "Sharing..."
                                    : "Share story"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateStoryModal;