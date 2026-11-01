"use client";

import { useState } from "react";

import { useGeneratePost } from "@/hooks/ai/useGeneratePost";

import type { GeneratePostData } from "@/api/ai";

const AIPostAssistant = () => {
  const [topic, setTopic] = useState("");

  const [tone, setTone] =
    useState<GeneratePostData["tone"]>(
      "professional"
    );

  const [language, setLanguage] =
    useState<GeneratePostData["language"]>(
      "english"
    );

  const {
    generatePost,
    generatedPost,
    isGenerating,
    error,
    reset,
  } = useGeneratePost();

  const handleGenerate = async () => {
    if (!topic.trim() || isGenerating) {
      return;
    }

    try {
      await generatePost({
        topic: topic.trim(),
        tone,
        language,
      });
    } catch {
      // Mutation error is displayed below.
    }
  };

  const handleClear = () => {
    setTopic("");
    reset();
  };

  return (
    <div className="rounded-xl bg-white p-4 shadow-md">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
          <SparklesIcon />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-900">
            AI Post Assistant
          </h2>

          <p className="text-xs text-gray-500">
            Turn your idea into a post
          </p>
        </div>
      </div>

      {/* Topic */}
      <div>
        <label
          htmlFor="ai-post-topic"
          className="mb-2 block text-xs font-medium text-gray-700"
        >
          What do you want to post about?
        </label>

        <textarea
          id="ai-post-topic"
          value={topic}
          onChange={(event) =>
            setTopic(event.target.value)
          }
          rows={4}
          maxLength={500}
          placeholder="Describe the post you want to create..."
          className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-purple-200 focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100"
        />

        <p className="mt-1 text-right text-[11px] text-gray-400">
          {topic.length}/500
        </p>
      </div>

      {/* Options */}
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="ai-tone"
            className="mb-1.5 block text-xs font-medium text-gray-700"
          >
            Tone
          </label>

          <select
            id="ai-tone"
            value={tone}
            onChange={(event) =>
              setTone(
                event.target
                  .value as GeneratePostData["tone"]
              )
            }
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
          >
            <option value="professional">
              Professional
            </option>

            <option value="casual">
              Casual
            </option>

            <option value="friendly">
              Friendly
            </option>

            <option value="educational">
              Educational
            </option>
          </select>
        </div>

        <div>
          <label
            htmlFor="ai-language"
            className="mb-1.5 block text-xs font-medium text-gray-700"
          >
            Language
          </label>

          <select
            id="ai-language"
            value={language}
            onChange={(event) =>
              setLanguage(
                event.target
                  .value as GeneratePostData["language"]
              )
            }
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
          >
            <option value="english">
              English
            </option>

            <option value="arabic">
              Arabic
            </option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
        >
          {error instanceof Error
            ? error.message
            : "Unable to generate post."}
        </div>
      )}

      {/* Generate */}
      <button
        type="button"
        onClick={handleGenerate}
        disabled={
          !topic.trim() ||
          isGenerating
        }
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-purple-300"
      >
        {isGenerating ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Generating...
          </>
        ) : (
          <>
            <SparklesIcon />
            Generate post
          </>
        )}
      </button>

      {/* Result */}
      {generatedPost && (
        <div className="mt-4 border-t border-gray-100 pt-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-700">
              Generated post
            </p>

            <button
              type="button"
              onClick={handleClear}
              className="text-xs font-medium text-gray-400 transition hover:text-purple-600"
            >
              Clear
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto whitespace-pre-wrap rounded-xl border border-purple-100 bg-purple-50/50 p-3 text-sm leading-6 text-gray-700">
            {generatedPost}
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="mt-3 w-full rounded-lg border border-purple-200 px-4 py-2 text-xs font-semibold text-purple-600 transition hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Regenerate
          </button>
        </div>
      )}
    </div>
  );
};

const SparklesIcon = () => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
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

export default AIPostAssistant;