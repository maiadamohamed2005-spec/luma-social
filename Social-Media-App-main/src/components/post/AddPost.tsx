"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { createPost } from "@/api/posts";
import PostActions from "./PostActions";
import EmojiPickerButton from "./EmojiPickerButton";
import ImagePreview from "./ImagePreview";
import VideoPreview from "./VideoPreview";

const AddPost = () => {
  const { token, user } = useAuth();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL;

  const avatarUrl = user?.avatar
    ? `${storageUrl}/${user.avatar}`
    : "/default-avatar.png";

  const showMessage = (message: string, success: boolean) => {
    setMessage(message);
    setIsSuccess(success);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };


  const handleVideoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setVideo(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleRemoveVideo = () => {
    setVideo(null);
    setVideoPreview(null);

    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  const handleEmojiClick = (emoji: string) => {
    const textarea = textareaRef.current;

    if (!textarea) {
      setContent((prev) => prev + emoji);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const newContent =
      content.slice(0, start) +
      emoji +
      content.slice(end);

    setContent(newContent);

    requestAnimationFrame(() => {
      textarea.focus();

      const cursorPosition = start + emoji.length;

      textarea.setSelectionRange(
        cursorPosition,
        cursorPosition
      );
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() && !image && !video) {
      showMessage("Please write something or select an image", false);
      return;
    }

    if (!token) {
      showMessage("You must be logged in", false);
      return;
    }

    setLoading(true);

    try {
      await createPost(token, content, image, video);


      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });

      setContent("");
      setImage(null);
      setImagePreview(null);
      setVideo(null);
      setVideoPreview(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      if (videoInputRef.current) {
        videoInputRef.current.value = "";
      }

      showMessage("Post created successfully!", true);

    } catch (error) {
      console.error("Create post error:", error);

      showMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong",
        false
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg flex gap-4 justify-between text-sm">

      {/* AVATAR */}
      <Image
        src={avatarUrl}
        alt={user?.name ?? "User avatar"}
        width={48}
        height={48}
        className="h-12 w-12 rounded-full object-cover"
      />

      <div className="flex-1">

        <form onSubmit={handleSubmit}>

          {/* TEXT */}
          <div className="flex gap-4">

            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              rows={3}
              className="flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-purple-200 focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100"
            />

            <EmojiPickerButton
              onEmojiClick={handleEmojiClick}
            />

          </div>

          {/* SELECTED IMAGE */}
          {imagePreview && (
            <ImagePreview
              src={imagePreview}
              onRemove={handleRemoveImage}
            />
          )}

          {/* SELECTED VIDEO */}
          {videoPreview && (
            <VideoPreview
              src={videoPreview}
              onRemove={handleRemoveVideo}
            />
          )}

          {/* OPTIONS */}

          <PostActions
            fileInputRef={fileInputRef}
            videoInputRef={videoInputRef}
            onImageChange={handleImageChange}
            onVideoChange={handleVideoChange}
            loading={loading}
          />

        </form>

        {/* MESSAGE */}
        {message && (
          <div
            className={`mt-4 px-4 py-3 rounded-lg text-sm font-medium text-center border ${isSuccess
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
              }`}
          >
            {message}
          </div>
        )}

      </div>
    </div>
  );
};

export default AddPost;

