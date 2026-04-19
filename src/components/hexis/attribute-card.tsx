import { Link } from "@tanstack/react-router";
import type { Attribute } from "@/lib/hexis-data";
import { StatusBadge } from "./status-badge";
import { Sparkline } from "./sparkline";
import { AttributeScale } from "./attribute-scale";
import { formatDelta } from "@/lib/hexis-data";
import { formatDistanceToNowStrict } from "date-fns";

const trendColor = (status: Attribute["status"]) => {
  switch (status) {
    case "improving":
      return "var(--positive)";
    case "decaying":
      return "var(--warning)";
    case "at-risk":
      return "var(--critical)";
    default:
      return "var(--teal)";
  }
};

export function AttributeCard({ attribute }: { attribute: Attribute }) {
  const color = trendColor(attribute.status);
  return (
    <Link
      to="/attributes/$id"
      params={{ id: attribute.id }}
      className="group block rounded-xl border border-hairline bg-surface p-5 transition-colors hover:border-border hover:bg-surface-raised"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground">
            {attribute.short}
          </p>
          <h3 className="mt-1 font-display text-lg text-foreground">{attribute.name}</h3>
        </div>
        <StatusBadge status={attribute.status} />
      </div>

      <div className="mt-5 flex items-end justify-between">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-4xl tabular-nums text-foreground">
            {attribute.current.toFixed(1)}
          </span>
          <span className="font-mono text-xs text-muted-foreground">/ 20</span>
        </div>
        <Sparkline data={attribute.history} color={color} width={96} height={32} />
      </div>

      <div className="mt-4">
        <AttributeScale
          current={attribute.current}
          base={attribute.base}
          potential={attribute.potential}
        />
      </div>

      <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>
          Base <span className="font-mono text-foreground/80">{attribute.base.toFixed(1)}</span> ·
          Potential <span className="font-mono text-foreground/80">{attribute.potential.toFixed(1)}</span>
        </span>
        <span
          className="font-mono"
          style={{ color: attribute.trend7 === 0 ? "var(--muted-foreground)" : color }}
        >
          {formatDelta(attribute.trend7)} 7d
        </span>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Last maintained{" "}
        <span className="text-foreground/80">
          {formatDistanceToNowStrict(new Date(attribute.lastMaintained), { addSuffix: true })}
        </span>
      </p>
    </Link>
  );
}
