import { useRef } from "react";

type TextInputElement =
  | HTMLInputElement
  | HTMLTextAreaElement;

export const useEmojiInput = (
  content: string,
  setContent: React.Dispatch<React.SetStateAction<string>>
) => {
  const inputRef = useRef<TextInputElement | null>(null);

  const handleEmojiClick = (emoji: string) => {
    const input = inputRef.current;

    if (!input) {
      setContent((prev) => prev + emoji);
      return;
    }

    const start = input.selectionStart ?? content.length;
    const end = input.selectionEnd ?? content.length;

    const newContent =
      content.slice(0, start) +
      emoji +
      content.slice(end);

    setContent(newContent);

    requestAnimationFrame(() => {
      input.focus();

      const cursorPosition = start + emoji.length;

      input.setSelectionRange(
        cursorPosition,
        cursorPosition
      );
    });
  };

  return {
    inputRef,
    handleEmojiClick,
  };
};