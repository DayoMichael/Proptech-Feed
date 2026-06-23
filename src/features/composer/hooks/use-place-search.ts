"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface PlaceSuggestion {
  id: string;
  label: string;
}

interface PhotonProps {
  osm_id?: number;
  osm_type?: string;
  name?: string;
  street?: string;
  city?: string;
  district?: string;
  county?: string;
  state?: string;
  country?: string;
}

interface PhotonFeature {
  properties: PhotonProps;
}

// Centre of Nigeria  biases Photon results toward local places first.
const NG_LAT = 9.082;
const NG_LON = 8.6753;
const ENDPOINT = "https://photon.komoot.io/api/";
const DEBOUNCE_MS = 300;
const MIN_CHARS = 2;

function formatPlace(p: PhotonProps): string {
  const parts = [
    p.name,
    p.street,
    p.district,
    p.city,
    p.county,
    p.state,
    p.country,
  ].filter((v): v is string => Boolean(v));
  return [...new Set(parts)].slice(0, 4).join(", ");
}

export function usePlaceSearch(query: string) {
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const cache = useRef(new Map<string, PlaceSuggestion[]>());

  useEffect(() => {
    const q = query.trim();
    let cancelled = false;

    if (q.length < MIN_CHARS) {
      queueMicrotask(() => {
        if (cancelled) return;
        setSuggestions([]);
        setLoading(false);
      });
      return () => {
        cancelled = true;
      };
    }

    const cached = cache.current.get(q);
    if (cached) {
      queueMicrotask(() => {
        if (cancelled) return;
        setSuggestions(cached);
        setLoading(false);
      });
      return () => {
        cancelled = true;
      };
    }

    const controller = new AbortController();
    queueMicrotask(() => {
      if (!cancelled) setLoading(true);
    });

    const timer = setTimeout(async () => {
      try {
        const url = `${ENDPOINT}?q=${encodeURIComponent(
          q,
        )}&limit=5&lang=en&lat=${NG_LAT}&lon=${NG_LON}`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`Photon ${res.status}`);
        const data = (await res.json()) as { features?: PhotonFeature[] };

        const seen = new Set<string>();
        const next: PlaceSuggestion[] = [];
        for (const f of data.features ?? []) {
          const label = formatPlace(f.properties);
          if (!label || seen.has(label)) continue;
          seen.add(label);
          next.push({
            id: `${f.properties.osm_type ?? "n"}${f.properties.osm_id ?? label}`,
            label,
          });
        }

        cache.current.set(q, next);
        setSuggestions(next);
      } catch (err) {
        if ((err as Error).name !== "AbortError") setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const clear = useCallback(() => setSuggestions([]), []);

  return { suggestions, loading, clear };
}
