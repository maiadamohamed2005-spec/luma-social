"use client";

type VideoPreviewProps = {
  src: string;
  onRemove: () => void;
};

const VideoPreview = ({
  src,
  onRemove,
}: VideoPreviewProps) => {
  return (
    <div className="relative mt-3 overflow-hidden rounded-lg">
      <video
        src={src}
        controls
        className="max-h-96 w-full rounded-lg object-cover"
      />

      <button
        type="button"
        onClick={onRemove}
        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
        aria-label="Remove video"
      >
        ×
      </button>
    </div>
  );
};

export default VideoPreview;