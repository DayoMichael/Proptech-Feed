"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { Story } from "@/types";

export interface StoryPlayer {
  userIndex: number;
  segIndex: number;
  progress: number;
  paused: boolean;
  story: Story;
  segmentCount: number;
  isVideo: boolean;
  next: () => void;
  prev: () => void;
  setPaused: (paused: boolean) => void;
  reportProgress: (value: number) => void;
}

export function useStoryPlayer(
  stories: Story[],
  start: number,
  onClose: () => void,
): StoryPlayer {
  const [userIndex, setUserIndex] = useState(start);
  const [segIndex, setSegIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);

  const progressRef = useRef(0);
  const story = stories[userIndex];
  const segment = story?.segments[segIndex];
  const isVideo = segment?.media.type === "video";

  const reset = useCallback(() => {
    progressRef.current = 0;
    setProgress(0);
  }, []);

  const next = useCallback(() => {
    reset();
    const current = stories[userIndex];
    if (segIndex < current.segments.length - 1) {
      setSegIndex(segIndex + 1);
    } else if (userIndex < stories.length - 1) {
      setUserIndex(userIndex + 1);
      setSegIndex(0);
    } else {
      onClose();
    }
  }, [reset, stories, userIndex, segIndex, onClose]);

  const prev = useCallback(() => {
    reset();
    if (segIndex > 0) {
      setSegIndex(segIndex - 1);
    } else if (userIndex > 0) {
      const u = userIndex - 1;
      setUserIndex(u);
      setSegIndex(stories[u].segments.length - 1);
    }
  }, [reset, segIndex, userIndex, stories]);

  useEffect(() => {
    if (isVideo || paused || !segment) return;
    const duration = segment.durationMs;
    let raf = 0;
    let startTs: number | null = null;

    const tick = (ts: number) => {
      if (startTs === null) startTs = ts - progressRef.current * duration;
      const p = Math.min(1, (ts - startTs) / duration);
      progressRef.current = p;
      setProgress(p);
      if (p >= 1) {
        next();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isVideo, paused, segment, userIndex, segIndex, next]);

  const reportProgress = useCallback(
    (value: number) => {
      progressRef.current = value;
      setProgress(value);
      if (value >= 1) next();
    },
    [next],
  );

  return {
    userIndex,
    segIndex,
    progress,
    paused,
    story,
    segmentCount: story?.segments.length ?? 0,
    isVideo: Boolean(isVideo),
    next,
    prev,
    setPaused,
    reportProgress,
  };
}
