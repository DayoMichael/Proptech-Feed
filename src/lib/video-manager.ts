type Pauser = () => void;

let active: Pauser | null = null;

export function setActiveVideo(pause: Pauser): void {
  if (active && active !== pause) active();
  active = pause;
}

export function clearActiveVideo(pause: Pauser): void {
  if (active === pause) active = null;
}
