"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteSearchResult } from "@/app/api/search/route";

const DEBOUNCE_MS = 250;

export default function SiteSearch({
  variant = "desktop",
  onNavigate,
  placeholder = "Search...",
}: {
  /** "desktop" = compact pill that expands on focus. "mobile"/"hero" = full-width, static. */
  variant?: "desktop" | "mobile" | "hero";
  /** Called right before navigating away, e.g. to close a mobile menu. */
  onNavigate?: () => void;
  placeholder?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SiteSearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setIsLoading(false);
      setActiveIndex(-1);
      return;
    }

    setIsLoading(true);
    const thisRequestId = ++requestIdRef.current;

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
        if (thisRequestId !== requestIdRef.current) return; // stale response
        const data = await res.json();
        setResults(data.results ?? []);
        setActiveIndex(-1);
      } catch {
        if (thisRequestId === requestIdRef.current) setResults([]);
      } finally {
        if (thisRequestId === requestIdRef.current) setIsLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // Close the dropdown on outside click.
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function goToResult(result: SiteSearchResult) {
    setIsOpen(false);
    setQuery("");
    setResults([]);
    onNavigate?.();
    router.push(result.url);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen || results.length === 0) {
      if (e.key === "Escape") {
        setIsOpen(false);
        (e.target as HTMLInputElement).blur();
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      // Enter jumps to the highlighted result, or the closest (top) match
      // if the user hasn't arrowed to anything yet.
      const target = results[activeIndex >= 0 ? activeIndex : 0];
      if (target) goToResult(target);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      (e.target as HTMLInputElement).blur();
    }
  }

  const showDropdown = isOpen && query.trim().length >= 2;
  const inputBaseClasses =
    "bg-transparent border-none outline-none text-on-surface font-body-md text-body-md";

  return (
    <div ref={containerRef} className={variant === "desktop" ? "relative" : "relative w-full"}>
      <div
        className={
          variant === "desktop"
            ? "flex items-center bg-surface-container-low rounded-full px-3 py-2 border border-outline-variant focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all"
            : variant === "hero"
              ? "flex items-center bg-white rounded-full px-5 py-3.5 border border-outline-variant shadow-sm focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all"
              : "flex items-center bg-surface-container-low rounded-full px-4 py-2.5 border border-outline-variant"
        }
      >
        <span className="material-symbols-outlined text-on-surface-variant mr-2 text-[20px] shrink-0">
          search
        </span>
        <input
          className={
            variant === "desktop"
              ? `${inputBaseClasses} w-24 focus:w-56 transition-all`
              : `${inputBaseClasses} w-full`
          }
          placeholder={placeholder}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          aria-autocomplete="list"
          aria-expanded={showDropdown}
          role="combobox"
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            className="text-on-surface-variant hover:text-on-surface p-0.5 rounded-full shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>

      {showDropdown && (
        <div
          className={
            variant === "desktop"
              ? "absolute right-0 top-full mt-2 w-80 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg overflow-hidden z-50"
              : "relative mt-2 w-full bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg overflow-hidden"
          }
        >
          {isLoading && results.length === 0 && (
            <div className="px-4 py-3 font-body-sm text-body-sm text-on-surface-variant">
              Searching...
            </div>
          )}

          {!isLoading && results.length === 0 && (
            <div className="px-4 py-3 font-body-sm text-body-sm text-on-surface-variant">
              No matches for &quot;{query.trim()}&quot;.
            </div>
          )}

          {results.length > 0 && (
            <ul className="max-h-80 overflow-y-auto py-1">
              {results.map((result, index) => (
                <li key={`${result.type}-${result.id}`}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => goToResult(result)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      index === activeIndex
                        ? "bg-primary-container/10"
                        : "hover:bg-surface-container-low"
                    }`}
                  >
                    <span className="material-symbols-outlined text-on-surface-variant text-[20px] shrink-0">
                      {result.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-label-md text-label-md text-on-surface truncate">
                        {result.title}
                      </span>
                      <span className="block font-label-sm text-label-sm text-on-surface-variant truncate">
                        {result.subtitle}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
