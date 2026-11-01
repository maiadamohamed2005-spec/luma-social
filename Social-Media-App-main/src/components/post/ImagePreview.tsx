import Image from "next/image";

type ImagePreviewProps = {
  src: string;
  onRemove: () => void;
};

const ImagePreview = ({
  src,
  onRemove,
}: ImagePreviewProps) => {
  return (
    <div className="relative mt-3 overflow-hidden rounded-lg">
      <Image
        src={src}
        alt="Selected image"
        width={600}
        height={400}
        className="max-h-96 w-full object-cover"
      />

      <button
        type="button"
        onClick={onRemove}
        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
        aria-label="Remove image"
      >
        ×
      </button>
    </div>
  );
};

export default ImagePreview;