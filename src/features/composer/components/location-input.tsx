"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, MapPin, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { usePlaceSearch } from "@/features/composer/hooks/use-place-search";

export function LocationInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);

  const { suggestions, loading, clear } = usePlaceSearch(open ? query : "");

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  // Clamp during render so stale indices never point past the list.
  const activeIndex = active < suggestions.length ? active : -1;

  function commit(label: string) {
    onChange(label);
    setQuery(label);
    setOpen(false);
    clear();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      commit(suggestions[activeIndex].label);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const showMenu = open && (loading || suggestions.length > 0);

  return (
    <div ref={wrapRef} className="relative">
      <div className="flex items-center gap-2 rounded-lg border bg-surface-sunken px-3 py-2">
        <MapPin className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Add location (e.g. Lekki Phase 1, Lagos)"
          aria-label="Location"
          role="combobox"
          aria-expanded={showMenu}
          aria-autocomplete="list"
          aria-controls="location-suggestions"
          autoComplete="off"
          className="h-5 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        {loading ? (
          <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" aria-hidden />
        ) : query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              onChange("");
              setOpen(false);
              clear();
            }}
            aria-label="Clear location"
            className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>

      {showMenu && (
        <ul
          id="location-suggestions"
          role="listbox"
          className="absolute z-20 mt-1.5 max-h-60 w-full overflow-y-auto overscroll-contain rounded-xl border bg-popover p-1 shadow-lg shadow-black/30 ring-1 ring-border"
        >
          {loading && suggestions.length === 0 && (
            <li className="px-3 py-2 text-sm text-muted-foreground">Searching…</li>
          )}
          {suggestions.map((s, i) => (
            <li key={s.id} role="option" aria-selected={i === activeIndex}>
              <button
                type="button"
                onClick={() => commit(s.label)}
                onPointerEnter={() => setActive(i)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  i === activeIndex ? "bg-secondary" : "hover:bg-secondary/60",
                )}
              >
                <MapPin className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                <span className="truncate">{s.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
