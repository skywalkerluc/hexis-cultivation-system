import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Plus } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/hexis/app-shell";
import { AttributeScale } from "@/components/hexis/attribute-scale";
import { StatusBadge } from "@/components/hexis/status-badge";
import {
  events,
  formatDelta,
  getAttribute,
  type AttributeId,
} from "@/lib/hexis-data";
import { format, formatDistanceToNowStrict } from "date-fns";

export const Route = createFileRoute("/attributes/$id")({
  loader: ({ params }) => {
    const attribute = getAttribute(params.id);
    if (!attribute) throw notFound();
    return { attribute } as { attribute: NonNullable<ReturnType<typeof getAttribute>> };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.attribute.name} — Hexis` },
          { name: "description", content: loaderData.attribute.description },
          { property: "og:title", content: `${loaderData.attribute.name} — Hexis` },
          { property: "og:description", content: loaderData.attribute.description },
        ]
      : [{ title: "Attribute — Hexis" }],
  }),
  notFoundComponent: () => (
    <AppShell eyebrow="Not found" title="Attribute not found">
      <p className="text-sm text-muted-foreground">
        That attribute does not exist in your library.{" "}
        <Link to="/attributes" className="text-foreground underline-offset-4 hover:underline">
          Back to attributes
        </Link>
        .
      </p>
    </AppShell>
  ),
  component: AttributeDetailPage,
});

function AttributeDetailPage() {
  const { attribute } = Route.useLoaderData() as { attribute: NonNullable<ReturnType<typeof getAttribute>> };
  const related = events.filter((e) => e.effects.some((f) => f.attribute === attribute.id));
  const color =
    attribute.status === "improving"
      ? "var(--positive)"
      : attribute.status === "decaying"
      ? "var(--warning)"
      : attribute.status === "at-risk"
      ? "var(--critical)"
      : "var(--teal)";

  return (
    <AppShell
      eyebrow={attribute.short}
      title={attribute.name}
      actions={
        <Link
          to="/log"
          search={{ attr: attribute.id as AttributeId }}
          className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-3.5 py-2 text-sm font-medium text-background transition-colors hover:bg-stone"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} /> Log practice
        </Link>
      }
    >
      <Link
        to="/attributes"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3" /> All attributes
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Header card */}
        <section className="lg:col-span-8 rounded-2xl border border-hairline bg-surface p-6 lg:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl text-foreground">{attribute.name}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {attribute.description}
              </p>
            </div>
            <StatusBadge status={attribute.status} />
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <ScoreBlock label="Current" value={attribute.current} accent="gold" />
            <ScoreBlock label="Base" value={attribute.base} accent="teal" />
            <ScoreBlock label="Potential" value={attribute.potential} accent="stone" />
          </div>

          <div className="mt-8">
            <AttributeScale
              current={attribute.current}
              base={attribute.base}
              potential={attribute.potential}
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span>
              7-day trend{" "}
              <span
                className="font-mono"
                style={{
                  color:
                    attribute.trend7 > 0
                      ? "var(--positive)"
                      : attribute.trend7 < 0
                      ? "var(--warning)"
                      : "var(--muted-foreground)",
                }}
              >
                {formatDelta(attribute.trend7)}
              </span>
            </span>
            <span>
              Decay rate{" "}
              <span className="font-mono text-foreground/80">
                {attribute.decayRatePerWeek.toFixed(1)}/wk
              </span>
            </span>
            <span>
              Last maintained{" "}
              <span className="font-mono text-foreground/80">
                {formatDistanceToNowStrict(new Date(attribute.lastMaintained), { addSuffix: true })}
              </span>
            </span>
          </div>
        </section>

        {/* Recommended actions */}
        <section className="lg:col-span-4 rounded-2xl border border-hairline bg-surface p-6">
          <p className="eyebrow">Recommended actions</p>
          <ul className="mt-4 space-y-3">
            {attribute.recommendedActions.map((a, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-lg border border-hairline bg-background/50 p-3"
              >
                <span className="mt-0.5 font-mono text-[10px] text-gold">{String(i + 1).padStart(2, "0")}</span>
                <p className="text-sm leading-snug text-foreground/90">{a}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Chart */}
        <section className="lg:col-span-8 rounded-2xl border border-hairline bg-surface p-6">
          <div className="flex items-center justify-between">
            <p className="eyebrow">14-day history</p>
            <span className="font-mono text-[11px] text-muted-foreground">0–20 scale</span>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={attribute.history.map((h) => ({
                  date: format(new Date(h.date), "MMM d"),
                  value: h.value,
                }))}
                margin={{ top: 10, right: 8, left: -16, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="g-attr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--hairline)" strokeDasharray="0" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="var(--muted-foreground)"
                  tick={{ fontSize: 10, fontFamily: "JetBrains Mono" }}
                  axisLine={{ stroke: "var(--hairline)" }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 20]}
                  stroke="var(--muted-foreground)"
                  tick={{ fontSize: 10, fontFamily: "JetBrains Mono" }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "var(--foreground)",
                  }}
                  labelStyle={{ color: "var(--muted-foreground)", fontSize: 10 }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={1.5}
                  fill="url(#g-attr)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Logic */}
        <section className="lg:col-span-4 space-y-4">
          <LogicCard title="Maintenance" body={attribute.maintenance} accent="var(--teal)" />
          <LogicCard title="Growth" body={attribute.growthLogic} accent="var(--positive)" />
          <LogicCard title="Decay" body={attribute.decayLogic} accent="var(--warning)" />
        </section>

        {/* Recent evidence */}
        <section className="lg:col-span-12 rounded-2xl border border-hairline bg-surface p-6">
          <p className="eyebrow">Recent evidence</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Every change is explained. No score moves silently.
          </p>
          {related.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">
              No evidence logged yet. Begin with one of the recommended actions above.
            </p>
          ) : (
            <ul className="mt-5 divide-y divide-hairline">
              {related.map((e) => {
                const effect = e.effects.find((f) => f.attribute === attribute.id)!;
                const positive = effect.delta >= 0;
                return (
                  <li key={e.id} className="grid gap-3 py-4 lg:grid-cols-12">
                    <div className="lg:col-span-3">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        {e.type}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {format(new Date(e.date), "MMM d, HH:mm")}
                      </p>
                    </div>
                    <div className="lg:col-span-7">
                      <p className="text-sm text-foreground">{e.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {effect.reason}
                      </p>
                    </div>
                    <div className="flex items-start lg:col-span-2 lg:justify-end">
                      <span
                        className="font-mono text-sm tabular-nums"
                        style={{ color: positive ? "var(--positive)" : "var(--warning)" }}
                      >
                        {formatDelta(effect.delta)}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </AppShell>
  );
}

function ScoreBlock({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: "gold" | "teal" | "stone";
}) {
  const color =
    accent === "gold" ? "var(--gold)" : accent === "teal" ? "var(--teal)" : "var(--stone)";
  return (
    <div className="rounded-xl border border-hairline bg-background/40 p-4">
      <p className="eyebrow">{label}</p>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="font-display text-3xl tabular-nums" style={{ color }}>
          {value.toFixed(1)}
        </span>
        <span className="font-mono text-[11px] text-muted-foreground">/ 20</span>
      </div>
    </div>
  );
}

function LogicCard({ title, body, accent }: { title: string; body: string; accent: string }) {
  return (
    <div className="rounded-xl border border-hairline bg-surface p-5">
      <div className="flex items-center gap-2">
        <span className="h-1 w-6 rounded-full" style={{ background: accent }} />
        <p className="eyebrow">{title}</p>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
