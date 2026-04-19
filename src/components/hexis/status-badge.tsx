import { cn } from "@/lib/utils";
import type { AttributeStatus } from "@/lib/hexis-data";

const styles: Record<AttributeStatus | "neutral", { label: string; cls: string; dot: string }> = {
  improving: {
    label: "Improving",
    cls: "text-positive border-positive/30 bg-positive/10",
    dot: "bg-positive",
  },
  stable: {
    label: "Stable",
    cls: "text-stone border-hairline bg-surface-raised/60",
    dot: "bg-stone",
  },
  decaying: {
    label: "Decaying",
    cls: "text-warning border-warning/30 bg-warning/10",
    dot: "bg-warning",
  },
  "at-risk": {
    label: "At risk",
    cls: "text-critical border-critical/30 bg-critical/10",
    dot: "bg-critical",
  },
  neutral: {
    label: "—",
    cls: "text-muted-foreground border-hairline bg-surface-raised/40",
    dot: "bg-muted-foreground",
  },
};

export function StatusBadge({
  status,
  className,
}: {
  status: AttributeStatus | "neutral";
  className?: string;
}) {
  const s = styles[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase",
        s.cls,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}
