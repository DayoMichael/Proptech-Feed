type Pauser = () => void;

let active: Pauser | null = null;

/** Register the now-playing video, pausing any other that was playing. */
export function setActiveVideo(pause: Pauser): void {
  if (active && active !== pause) active();
  active = pause;
}

/** Clear the active registration when a video pauses or unmounts. */
export function clearActiveVideo(pause: Pauser): void {
  if (active === pause) active = null;
}
