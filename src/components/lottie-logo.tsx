"use client";

import Lottie from "lottie-react";

import animationData from "@/assets/logo-lottie.json";

export default function LottieLogo({
  className,
  onComplete,
}: {
  className?: string;
  onComplete?: () => void;
}) {
  return (
    <Lottie
      animationData={animationData}
      loop={false}
      autoplay
      onComplete={onComplete}
      className={className}
      aria-hidden
    />
  );
}
