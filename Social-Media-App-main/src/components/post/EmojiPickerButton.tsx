"use client";

import { useState } from "react";
import Image from "next/image";
import EmojiPicker from "emoji-picker-react";


type EmojiPickerButtonProps = {
  onEmojiClick: (emoji: string) => void;
};

const EmojiPickerButton = ({
  onEmojiClick,
}: EmojiPickerButtonProps) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="relative self-end">
      <button
        type="button"
        onClick={() => setShowPicker((prev) => !prev)}
        className="cursor-pointer"
        aria-label="Add emoji"
      >
        <Image
          src="/emoji.png"
          alt="Emoji"
          width={20}
          height={20}
          className="h-5 w-5"
        />
      </button>

      {showPicker && (
        <div className="absolute bottom-8 right-0 z-50">
          <EmojiPicker
            onEmojiClick={(emojiData) =>
              onEmojiClick(emojiData.emoji)
            }
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPickerButton;