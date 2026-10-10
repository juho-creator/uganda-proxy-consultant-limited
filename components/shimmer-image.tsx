"use client";

import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";

/** Image that shows a shimmering placeholder until it has loaded, then fades in. */
export function ShimmerImage({
  src,
  alt,
  className,
  imgClassName = "h-full w-full object-cover",
}: {
  src: string;
  alt: string;
  /** Classes for the wrapper; give it a size or aspect ratio so the placeholder has room to show. */
  className?: string;
  imgClassName?: string;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // A cached image can finish loading before hydration, in which case onLoad never fires.
    if (imgRef.current?.complete) setLoaded(true);
  }, [src]);

  return (
    <div className={clsx("relative overflow-hidden bg-ink-50", className)}>
      {!loaded && <div className="image-shimmer absolute inset-0" aria-hidden="true" />}
      {/* eslint-disable-next-line @next/next/no-img-element -- uploaded images are served by our own /api/images route */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={clsx(imgClassName, "transition-opacity duration-500", loaded ? "opacity-100" : "opacity-0")}
      />
    </div>
  );
}
