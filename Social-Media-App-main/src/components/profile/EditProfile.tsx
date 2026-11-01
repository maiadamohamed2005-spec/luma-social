"use client";

import { useState } from "react";
import Image from "next/image";

import {
  useUpdateProfile,
  useUpdateAvatar,
  useUpdateCoverImage,
} from "@/hooks/profile/useProfile";

type EditProfileProps = {
  name: string;
  username: string;
  bio: string | null;
  avatar: string | null;
  coverImage: string | null;
  onClose: () => void;
};

const EditProfile = ({
  name,
  username,
  bio,
  avatar,
  coverImage,
  onClose,
}: EditProfileProps) => {
  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL;

  const currentAvatar = avatar
    ? `${storageUrl}/${avatar}`
    : "/default-avatar.png";

  const currentCover = coverImage
    ? `${storageUrl}/${coverImage}`
    : "/default-cover.jpg";

  const [formData, setFormData] = useState({
    name,
    username,
    bio: bio ?? "",
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [avatarPreview, setAvatarPreview] =
    useState<string>(currentAvatar);

  const [coverPreview, setCoverPreview] =
    useState<string>(currentCover);

  const [error, setError] = useState<string | null>(null);

  const {
    mutateAsync: updateProfile,
    isPending: isProfileUpdating,
  } = useUpdateProfile();

  const {
    mutateAsync: updateAvatar,
    isPending: isAvatarUpdating,
  } = useUpdateAvatar();

  const {
    mutateAsync: updateCoverImage,
    isPending: isCoverUpdating,
  } = useUpdateCoverImage();

  const isSaving =
    isProfileUpdating ||
    isAvatarUpdating ||
    isCoverUpdating;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError(null);
  };

  const handleAvatarChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setAvatarFile(file);

    const previewUrl = URL.createObjectURL(file);

    setAvatarPreview(previewUrl);

    setError(null);
  };

  const handleCoverChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setCoverFile(file);

    const previewUrl = URL.createObjectURL(file);

    setCoverPreview(previewUrl);

    setError(null);
  };

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    setError(null);

    try {
      await updateProfile(formData);

      if (avatarFile) {
        await updateAvatar(avatarFile);
      }

      if (coverFile) {
        await updateCoverImage(coverFile);
      }

      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Failed to update profile. Please try again.",
        );
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Edit Profile
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update your profile information
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Cover */}
          <div className="relative h-56 w-full">
            <Image
              src={coverPreview}
              alt="Cover preview"
              fill
              sizes="100vw"
              className="object-cover"
            />

            <label className="absolute bottom-4 right-4 cursor-pointer rounded-lg bg-black/60 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-black/75">
              Change Cover

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverChange}
                disabled={isSaving}
              />
            </label>

            {/* Avatar */}
            <div className="absolute -bottom-14 left-6">
              <div className="relative">
                <Image
                  src={avatarPreview}
                  alt={name}
                  width={112}
                  height={112}
                  className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md"
                />

                <label className="absolute bottom-1 right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-blue-500 text-white shadow-md transition hover:bg-blue-600">
                  📷

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                    disabled={isSaving}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="px-6 pb-6 pt-20">

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                <span className="font-medium">
                  Error:
                </span>

                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Name
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSaving}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                  placeholder="Your name"
                />
              </div>

              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Username
                </label>

                <input
                  id="username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={isSaving}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                  placeholder="Username"
                />
              </div>

              {/* Bio */}
              <div className="md:col-span-2">
                <label
                  htmlFor="bio"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Bio
                </label>

                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={isSaving}
                  rows={5}
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                  placeholder="Tell people something about yourself..."
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;