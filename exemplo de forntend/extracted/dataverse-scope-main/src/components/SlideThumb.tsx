import type { Stain } from "@/lib/datapath";

const palette: Record<Stain, [string, string, string]> = {
  HE: ["#f0c8dd", "#b3559b", "#5b1f57"],
  "Ki-67": ["#f6dcc0", "#c07a3a", "#5c3313"],
  HER2: ["#c9e4f6", "#3d8fbd", "#173d5c"],
  PAS: ["#f7d6f0", "#a44fb0", "#4a1a55"],
};

/** Deterministic pseudo-random cell field mimicking a gigapixel WSI thumbnail. */
export function SlideThumb({
  stain,
  seed,
  className = "",
  cells = 26,
}: {
  stain: Stain;
  seed: string;
  className?: string;
  cells?: number;
}) {
  const [light, mid, dark] = palette[stain];
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) % 100000;
  const rnd = () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648);

  const blobs = Array.from({ length: cells }, () => ({
    cx: rnd() * 100,
    cy: rnd() * 100,
    r: 2 + rnd() * 7,
    o: 0.25 + rnd() * 0.6,
  }));

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={className} role="img" aria-label={`Lâmina ${stain}`}>
      <rect width="100" height="100" fill={light} />
      {blobs.map((b, i) => (
        <circle key={i} cx={b.cx} cy={b.cy} r={b.r} fill={i % 3 === 0 ? dark : mid} opacity={b.o} />
      ))}
      {blobs.slice(0, 10).map((b, i) => (
        <circle key={`n${i}`} cx={b.cx + 1} cy={b.cy - 1} r={b.r / 3} fill={dark} opacity={0.75} />
      ))}
    </svg>
  );
}
