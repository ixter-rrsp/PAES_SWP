import type { GalleryWithFrames } from "@/types";

function cellKey(row: number, col: number) {
  return `${row}-${col}`;
}

/**
 * Renders one saved gallery layout, read-only: the same row/column
 * grid + merged image frames the admin editor produces, just without
 * any selection or editing behavior. Empty (unmerged) cells render as
 * plain placeholder squares so the modular pattern stays visible even
 * where no image has been set yet.
 */
export default function GalleryGrid({ gallery }: { gallery: GalleryWithFrames }) {
  const occupied = new Set<string>();
  for (const f of gallery.frames) {
    for (let r = f.row_start; r < f.row_start + f.row_span; r++) {
      for (let c = f.column_start; c < f.column_start + f.column_span; c++) {
        occupied.add(cellKey(r, c));
      }
    }
  }

  const cells: { row: number; col: number }[] = [];
  for (let r = 1; r <= gallery.rows; r++) {
    for (let c = 1; c <= gallery.columns; c++) {
      cells.push({ row: r, col: c });
    }
  }

  return (
    <section className="mb-14">
      <div className="flex items-center gap-4 mb-5">
        <h2 className="font-headline-lg text-headline-lg text-on-surface whitespace-nowrap">
          {gallery.title}
        </h2>
        <div className="h-px flex-1 bg-outline-variant" />
      </div>

      <div className="overflow-x-auto rounded-lg border border-outline-variant bg-surface-bright p-2">
        <div
          className="grid gap-1 min-w-fit"
          style={{
            gridTemplateColumns: `repeat(${gallery.columns}, minmax(64px, 1fr))`,
            gridTemplateRows: `repeat(${gallery.rows}, 64px)`,
          }}
        >
          {cells.map(({ row, col }) => {
            const key = cellKey(row, col);
            if (occupied.has(key)) return null;
            return (
              <div
                key={key}
                style={{ gridColumn: col, gridRow: row }}
                className="rounded-[2px] bg-surface-container-high"
              />
            );
          })}

          {gallery.frames.map((f) => (
            <div
              key={f.id}
              style={{
                gridColumn: `${f.column_start} / span ${f.column_span}`,
                gridRow: `${f.row_start} / span ${f.row_span}`,
              }}
              className="relative rounded-[3px] overflow-hidden bg-surface-container-high"
            >
              {f.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={f.image_url}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
