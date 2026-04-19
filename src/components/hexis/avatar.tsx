import { cn } from "@/lib/utils";

const palettes: Record<string, { bg: string; ring: string; mark: string }> = {
  "obsidian-1": { bg: "var(--surface-raised)", ring: "var(--gold)", mark: "var(--gold)" },
  "obsidian-2": { bg: "var(--surface-raised)", ring: "var(--teal)", mark: "var(--teal)" },
  "obsidian-3": { bg: "var(--surface-raised)", ring: "var(--stone)", mark: "var(--gold)" },
  "obsidian-4": { bg: "var(--surface-raised)", ring: "var(--positive)", mark: "var(--positive)" },
  "obsidian-5": { bg: "var(--surface-raised)", ring: "var(--warning)", mark: "var(--warning)" },
  "obsidian-6": { bg: "var(--surface-raised)", ring: "var(--gold)", mark: "var(--teal)" },
};

export const avatarSeeds = Object.keys(palettes);

interface Props {
  seed?: string;
  initials?: string;
  size?: number;
  className?: string;
}

export function Avatar({ seed = "obsidian-3", initials, size = 40, className }: Props) {
  const palette = palettes[seed] ?? palettes["obsidian-3"];
  const id = `pat-${seed}`;
  return (
    <div
      className={cn("relative inline-flex items-center justify-center overflow-hidden rounded-full", className)}
      style={{
        width: size,
        height: size,
        background: palette.bg,
        boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${palette.ring} 60%, transparent)`,
      }}
    >
      <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
        <defs>
          <pattern id={id} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
            <path d="M0 7 L14 7" stroke={palette.mark} strokeOpacity="0.18" strokeWidth="0.6" />
          </pattern>
          <radialGradient id={`${id}-g`} cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor={palette.mark} stopOpacity="0.22" />
            <stop offset="100%" stopColor={palette.mark} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="64" height="64" fill={`url(#${id})`} />
        <rect width="64" height="64" fill={`url(#${id}-g)`} />
        <polygon
          points="32,12 50,22 50,42 32,52 14,42 14,22"
          fill="none"
          stroke={palette.ring}
          strokeOpacity="0.55"
          strokeWidth="0.8"
        />
      </svg>
      {initials ? (
        <span
          className="absolute font-display text-foreground"
          style={{ fontSize: size * 0.36, letterSpacing: "0.02em" }}
        >
          {initials}
        </span>
      ) : null}
    </div>
  );
}
