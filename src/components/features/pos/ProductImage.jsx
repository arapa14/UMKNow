import { useState } from "react";
import { ImageOff } from "lucide-react";

export default function ProductImage({ src, alt, className, iconSize = 32 }) {
  const [failedSource, setFailedSource] = useState(null);
  const isUnavailable = !src || failedSource === src;

  if (isUnavailable) {
    return (
      <div
        className="flex h-full w-full items-center justify-center bg-neutral-50 text-neutral-300"
        role="img"
        aria-label={`Gambar ${alt} tidak tersedia`}
        title="Gambar produk tidak tersedia"
      >
        <ImageOff size={iconSize} strokeWidth={1.5} aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailedSource(src)}
    />
  );
}
