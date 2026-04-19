import { cn } from "@/lib/utils";

interface Props {
  current: number;
  base: number;
  potential: number;
  max?: number;
  className?: string;
}

/**
 * 0–20 attribute scale. Shows base → current as filled bar,
 * current → potential as ghost bar, with base tick.
 */
export function AttributeScale({ current, base, potential, max = 20, className }: Props) {
  const basePct = (base / max) * 100;
  const currentPct = (current / max) * 100;
  const potentialPct = (potential / max) * 100;
  const fillStart = Math.min(basePct, currentPct);
  const fillEnd = Math.max(basePct, currentPct);

  return (
    <div className={cn("w-full", className)}>
      <div className="relative h-1.5 w-full rounded-full bg-surface-raised">
        {/* Potential ghost */}
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-stone/15"
          style={{ width: `${potentialPct}%` }}
        />
        {/* Base→current fill */}
        <div
          className="absolute inset-y-0 rounded-full"
          style={{
            left: `${fillStart}%`,
            width: `${fillEnd - fillStart}%`,
            background: "linear-gradient(90deg, color-mix(in oklab, var(--teal) 80%, transparent), var(--gold))",
          }}
        />
        {/* Base tick */}
        <div
          className="absolute -top-1 h-3.5 w-px bg-stone/60"
          style={{ left: `${basePct}%` }}
          aria-hidden="true"
        />
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] font-mono text-muted-foreground">
        <span>0</span>
        <span>5</span>
        <span>10</span>
        <span>15</span>
        <span>20</span>
      </div>
    </div>
  );
}
