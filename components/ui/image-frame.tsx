"use client";

/**
 * A placeholder frame for a photo that hasn't been uploaded yet.
 *
 * Drop these in wherever a page needs a picture — the frame keeps the
 * layout looking finished today, and later swapping in the real photo
 * is a one-line change: pass `src` (and drop `label`/`icon`) once the
 * image exists, everything else about the frame stays the same.
 *
 * Once a real photo is set, the frame no longer forces it into a crop —
 * it shows the image at its own size (capped to the available width) and
 * centers it if it doesn't fill that width.
 *
 * Usage once a real photo is ready:
 *   <ImageFrame src="/images/campus-gate.jpg" alt="School main gate" ratio="landscape" />
 */

import { useEffect, useState } from "react";

type ImageFrameProps = {
  /** Real image URL. Omit to render the placeholder state. */
  src?: string;
  alt?: string;
  /** Short caption shown under the placeholder icon, e.g. "Front facade, 2024". */
  label?: string;
  /** Placeholder-only aspect ratio, used before an image is uploaded. */
  ratio?: "landscape" | "portrait" | "square" | "wide";
  /** Material Symbols icon name for the placeholder glyph. */
  icon?: string;
  className?: string;
};

const RATIO_CLASS: Record<NonNullable<ImageFrameProps["ratio"]>, string> = {
  landscape: "aspect-[4/3]",
  portrait: "aspect-[3/4]",
  square: "aspect-square",
  wide: "aspect-[16/9]",
};

// A freshly-uploaded Supabase Storage object can 404 for a moment while it
// propagates to the CDN edge. Right after a save, the admin preview swaps
// in the new URL immediately and can hit that window, and the browser then
// sits on the failed image instead of trying again — leaving the frame
// blank even though the file is fine seconds later. Retry a few times with
// a short backoff and a cache-busting query param before giving up.
const RETRY_DELAYS_MS = [400, 900, 1600, 2600];

function SelfHealingImage({ src, alt, className }: { src: string; alt: string; className: string }) {
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);

  // Reset retry state whenever the underlying image URL actually changes.
  useEffect(() => {
    setAttempt(0);
    setFailed(false);
  }, [src]);

  if (failed) {
    return (
      <div className="w-full aspect-[4/3] flex items-center justify-center bg-surface-container-low text-on-surface-variant/70 rounded-xl">
        <span className="material-symbols-outlined text-3xl">broken_image</span>
      </div>
    );
  }

  const resolvedSrc = attempt === 0 ? src : `${src}${src.includes("?") ? "&" : "?"}retry=${attempt}`;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={resolvedSrc}
      src={resolvedSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (attempt >= RETRY_DELAYS_MS.length) {
          setFailed(true);
          return;
        }
        const delay = RETRY_DELAYS_MS[attempt];
        setTimeout(() => setAttempt((a) => a + 1), delay);
      }}
    />
  );
}

export default function ImageFrame({
  src,
  alt = "",
  label,
  ratio = "landscape",
  icon = "add_photo_alternate",
  className = "",
}: ImageFrameProps) {
  if (src) {
    // Real image: no forced crop/aspect-ratio. Show it at its natural size,
    // capped to the available width, and center it — matters most for
    // portrait or narrower uploads that shouldn't be stretched to fill.
    return (
      <div className={`w-full flex justify-center ${className}`}>
        <SelfHealingImage
          src={src}
          alt={alt}
          className="max-w-full h-auto rounded-xl border border-outline-variant object-contain"
        />
      </div>
    );
  }

  const shapeClass = `${RATIO_CLASS[ratio]} rounded-xl overflow-hidden ${className}`;

  return (
    <div
      className={`${shapeClass} border-2 border-dashed border-outline-variant bg-surface-container-low flex flex-col items-center justify-center gap-2 text-on-surface-variant/70`}
    >
      <span className="material-symbols-outlined text-4xl">{icon}</span>
      {label && (
        <span className="font-label-sm text-label-sm text-center px-4 leading-snug">
          {label}
        </span>
      )}
    </div>
  );
}
