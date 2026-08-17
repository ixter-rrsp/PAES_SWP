/**
 * A placeholder frame for a photo that hasn't been uploaded yet.
 *
 * Drop these in wherever a page needs a picture — the frame keeps the
 * layout looking finished today, and later swapping in the real photo
 * is a one-line change: pass `src` (and drop `label`/`icon`) once the
 * image exists, everything else about the frame stays the same.
 *
 * Usage once a real photo is ready:
 *   <ImageFrame src="/images/campus-gate.jpg" alt="School main gate" ratio="landscape" />
 */

type ImageFrameProps = {
  /** Real image URL. Omit to render the placeholder state. */
  src?: string;
  alt?: string;
  /** Short caption shown under the placeholder icon, e.g. "Front facade, 2024". */
  label?: string;
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

export default function ImageFrame({
  src,
  alt = "",
  label,
  ratio = "landscape",
  icon = "add_photo_alternate",
  className = "",
}: ImageFrameProps) {
  const shapeClass = `${RATIO_CLASS[ratio]} rounded-xl overflow-hidden ${className}`;

  if (src) {
    return (
      <div className={`${shapeClass} border border-outline-variant bg-surface-container-low`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      </div>
    );
  }

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
