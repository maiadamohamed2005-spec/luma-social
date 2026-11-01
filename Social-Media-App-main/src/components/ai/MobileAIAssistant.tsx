"use client";

import { useEffect, useState } from "react";

import AIPostAssistant from "./AIPostAssistant";

const MobileAIAssistant = () => {
  const [isOpen, setIsOpen] =
    useState(false);

  const closeAssistant = () => {
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

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isOpen]);

  return (
    <>
      {/* Floating AI Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() =>
            setIsOpen(true)
          }
          aria-label="Open AI Post Assistant"
          className="fixed bottom-6 right-5 z-40 flex h-13 w-13 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-purple-700 lg:hidden"
        >
          <SparklesIcon />
        </button>
      )}

      {/* Bottom Sheet */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-[2px] lg:hidden"
          onClick={closeAssistant}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="AI Post Assistant"
            className="max-h-[90vh] w-full overflow-y-auto overscroll-contain rounded-t-3xl bg-gray-50 shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* Drag Handle */}
            <div className="sticky top-0 z-10 bg-gray-50 pt-3">
              <div className="mx-auto h-1.5 w-10 rounded-full bg-gray-300" />

              <div className="flex items-center justify-between px-4 pb-3 pt-2">
                <p className="text-xs font-medium text-gray-400">
                  AI Assistant
                </p>

                <button
                  type="button"
                  onClick={
                    closeAssistant
                  }
                  aria-label="Close AI Assistant"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-gray-500 transition hover:bg-purple-50 hover:text-purple-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="px-4 pb-6">
              <AIPostAssistant />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const SparklesIcon = () => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3l1.3 3.7L17 8l-3.7 1.3L12 13l-1.3-3.7L7 8l3.7-1.3L12 3Z"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 13l.9 2.1L21 16l-2.1.9L18 19l-.9-2.1L15 16l2.1-.9L18 13Z"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 14l.8 1.7L7.5 16.5l-1.7.8L5 19l-.8-1.7-1.7-.8 1.7-.8L5 14Z"
      />
    </svg>
  );
};

export default MobileAIAssistant;