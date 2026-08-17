"use client";

import { useEffect, useRef, useState } from "react";
import EditableImage from "./editable-image";
import ImageFrame from "@/components/ui/image-frame";
import { usePageContent } from "./page-content-context";

const SLOTS = [
  { id: "hero_image_1", label: "Hero image 1" },
  { id: "hero_image_2", label: "Hero image 2" },
  { id: "hero_image_3", label: "Hero image 3" },
  { id: "hero_image_4", label: "Hero image 4" },
];

const AUTOPLAY_MS = 5000;

/**
 * Left side of the home hero: up to 4 admin-uploaded photos that
 * interchange automatically and on swipe. In the Page Configuration
 * admin view, this instead shows all 4 slots as individually
 * clickable tiles (same click-to-edit affordance as any other
 * EditableImage) rather than actually auto-playing — an admin needs
 * to see and reach every slot, not just whichever one is showing.
 */
export default function HeroImageCarousel() {
  const { content, editable } = usePageContent();

  if (editable) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {SLOTS.map((slot) => (
          <EditableImage
            key={slot.id}
            id={slot.id}
            label={slot.label}
            ratio="square"
            placeholderLabel={slot.label}
          />
        ))}
      </div>
    );
  }

  const images = SLOTS.map((s) => content[s.id]).filter((src): src is string => Boolean(src));
  return <PublicCarousel images={images} />;
}

function PublicCarousel({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (images.length < 2) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [images.length]);

  // Clamp in case the slot count shrinks (e.g. an admin removes an image).
  useEffect(() => {
    if (index >= images.length) setIndex(0);
  }, [images.length, index]);

  if (images.length === 0) {
    return (
      <ImageFrame
        ratio="square"
        label="School photos"
        className="w-full shadow-lg"
      />
    );
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      setIndex((i) =>
        delta < 0 ? (i + 1) % images.length : (i - 1 + images.length) % images.length
      );
    }
    touchStartX.current = null;
  }

  return (
    <div
      className="relative aspect-square w-full rounded-2xl overflow-hidden border border-outline-variant shadow-lg bg-surface-container-low select-none touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {images.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${src}-${i}`}
          src={src}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={() => setIndex((i) => (i + 1) % images.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Show image ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-6 bg-white" : "w-2 bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
