"use client";

export function CRTOverlay() {
  return (
    <>
      {/* Scanlines */}
      <div
        className="crt-scanlines fixed inset-0 z-[9998] pointer-events-none"
        aria-hidden="true"
      />
      {/* Vignette */}
      <div
        className="crt-vignette fixed inset-0 z-[9997] pointer-events-none"
        aria-hidden="true"
      />
      {/* Noise grain */}
      <div
        className="crt-noise fixed inset-0 z-[9996] pointer-events-none opacity-40"
        aria-hidden="true"
      />
    </>
  );
}
