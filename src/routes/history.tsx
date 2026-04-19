import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { AppShell } from "@/components/hexis/app-shell";
import {
  attributes,
  events,
  formatDelta,
  getAttribute,
  type ActionType,
  type AttributeId,
} from "@/lib/hexis-data";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History — Hexis" },
      { name: "description", content: "Chronological evidence of your practice. Filter by attribute or type." },
      { property: "og:title", content: "History — Hexis" },
      { property: "og:description", content: "Chronological evidence of your practice." },
    ],
  }),
  component: HistoryPage,
});

const types: ("all" | ActionType)[] = ["all", "training", "practice", "routine", "achievement", "recovery"];

function HistoryPage() {
  const [attr, setAttr] = useState<"all" | AttributeId>("all");
  const [type, setType] = useState<(typeof types)[number]>("all");

  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (type !== "all" && e.type !== type) return false;
      if (attr !== "all" && !e.effects.some((f) => f.attribute === attr)) return false;
      return true;
    });
  }, [attr, type]);

  // Group by day
  const groups = useMemo(() => {
    const map = new Map<string, typeof events>();
    filtered.forEach((e) => {
      const key = format(new Date(e.date), "yyyy-MM-dd");
      const list = map.get(key) ?? [];
      list.push(e);
      map.set(key, list);
    });
    return Array.from(map.entries()).sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [filtered]);

  return (
    <AppShell eyebrow="Evidence" title="History">
      <p className="max-w-2xl text-sm text-muted-foreground">
        A chronological record of your practice and its consequences. Every change is explained.
      </p>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Filter label="Attribute">
          <select
            value={attr}
            onChange={(e) => setAttr(e.target.value as AttributeId | "all")}
            className="bg-transparent text-sm text-foreground focus:outline-none"
          >
            <option value="all">All</option>
            {attributes.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </Filter>
        <div className="flex flex-wrap gap-1 rounded-full border border-hairline bg-surface p-1">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs capitalize transition-colors",
                type === t
                  ? "bg-surface-raised text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      {groups.length === 0 ? (
        <div className="mt-12 rounded-xl border border-dashed border-hairline bg-surface/40 p-12 text-center">
          <p className="font-display text-lg text-foreground">No matching evidence</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a wider filter, or log a new action to start populating your history.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-10">
          {groups.map(([day, items]) => (
            <section key={day}>
              <div className="flex items-center gap-3">
                <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  {format(new Date(day), "EEEE · MMM d")}
                </p>
                <span className="h-px flex-1 bg-hairline" />
              </div>
              <ol className="mt-4 space-y-3">
                {items.map((e) => (
                  <li
                    key={e.id}
                    className="grid gap-4 rounded-xl border border-hairline bg-surface p-5 lg:grid-cols-12"
                  >
                    <div className="lg:col-span-2">
                      <span className="inline-flex rounded-full border border-hairline bg-background px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        {e.type}
                      </span>
                      <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                        {format(new Date(e.date), "HH:mm")}
                      </p>
                    </div>
                    <div className="lg:col-span-7">
                      <p className="text-sm text-foreground">{e.title}</p>
                      {e.notes && (
                        <p className="mt-1 text-xs italic text-muted-foreground">"{e.notes}"</p>
                      )}
                      <ul className="mt-3 space-y-1.5">
                        {e.effects.map((f, i) => {
                          const a = getAttribute(f.attribute)!;
                          const positive = f.delta >= 0;
                          return (
                            <li key={i} className="flex items-start gap-2 text-xs">
                              <span
                                className="mt-0.5 inline-flex h-1.5 w-1.5 shrink-0 rounded-full"
                                style={{
                                  background: positive ? "var(--positive)" : "var(--warning)",
                                }}
                              />
                              <span className="text-muted-foreground">
                                <span className="text-foreground/85">{a.name}</span>{" "}
                                <span
                                  className="font-mono"
                                  style={{ color: positive ? "var(--positive)" : "var(--warning)" }}
                                >
                                  {formatDelta(f.delta)}
                                </span>{" "}
                                — {f.reason}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <div className="flex items-start gap-2 lg:col-span-3 lg:justify-end">
                      <span className="rounded-full border border-hairline bg-background px-2.5 py-0.5 text-[10px] capitalize text-muted-foreground">
                        {e.intensity} intensity
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      )}
    </AppShell>
  );
}

function Filter({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="inline-flex items-center gap-2 rounded-md border border-hairline bg-surface px-3 py-1.5">
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
