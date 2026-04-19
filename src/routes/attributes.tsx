import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/hexis/app-shell";
import { AttributeCard } from "@/components/hexis/attribute-card";
import { attributes, type AttributeStatus } from "@/lib/hexis-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/attributes")({
  head: () => ({
    meta: [
      { title: "Attributes — Hexis" },
      { name: "description", content: "All cultivated attributes. Compare current, base and potential." },
      { property: "og:title", content: "Attributes — Hexis" },
      { property: "og:description", content: "All cultivated attributes." },
    ],
  }),
  component: AttributesPage,
});

const filters: { id: AttributeStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "improving", label: "Improving" },
  { id: "stable", label: "Stable" },
  { id: "decaying", label: "Decaying" },
  { id: "at-risk", label: "At risk" },
];

function AttributesPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const list = filter === "all" ? attributes : attributes.filter((a) => a.status === filter);

  return (
    <AppShell eyebrow="Library" title="Attributes">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-xl text-sm text-muted-foreground">
          Each attribute follows its own logic of growth, maintenance and decay. Compare current
          state against your base and potential.
        </p>
        <div className="flex flex-wrap gap-1 rounded-full border border-hairline bg-surface p-1">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs transition-colors",
                filter === f.id
                  ? "bg-surface-raised text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <div className="mt-12 rounded-xl border border-dashed border-hairline bg-surface/40 p-12 text-center">
          <p className="font-display text-lg text-foreground">No attributes match this filter</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a broader view, or log an action to change attribute states.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((a) => (
            <AttributeCard key={a.id} attribute={a} />
          ))}
        </div>
      )}
    </AppShell>
  );
}
