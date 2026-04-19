import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Plus, Sparkles, AlertTriangle } from "lucide-react";
import { AppShell } from "@/components/hexis/app-shell";
import { AttributeCard } from "@/components/hexis/attribute-card";
import { StatusBadge } from "@/components/hexis/status-badge";
import { Avatar } from "@/components/hexis/avatar";
import {
  attributes,
  events,
  recommendations,
  profile,
  formatDelta,
  getAttribute,
} from "@/lib/hexis-data";
import { formatDistanceToNowStrict } from "date-fns";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Hexis" },
      { name: "description", content: "Your personal control room. Attributes, signals, recommendations." },
      { property: "og:title", content: "Dashboard — Hexis" },
      { property: "og:description", content: "Your personal control room." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const initials = profile.displayName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
  const improving = attributes.filter((a) => a.status === "improving").length;
  const decaying = attributes.filter((a) => a.status === "decaying" || a.status === "at-risk");
  const composite = attributes.reduce((s, a) => s + a.current, 0) / attributes.length;
  const recentEvents = events.slice(0, 5);

  return (
    <AppShell
      eyebrow="Today · Personal control room"
      title={`Good evening, ${profile.displayName.split(" ")[0]}.`}
      actions={
        <Link
          to="/log"
          className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-3.5 py-2 text-sm font-medium text-background transition-colors hover:bg-stone"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
          Log action
        </Link>
      }
    >
      {/* Character overview */}
      <section className="rounded-2xl border border-hairline bg-surface p-6 lg:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-center gap-5">
            <Avatar seed={profile.avatarSeed} initials={initials} size={72} />
            <div>
              <p className="eyebrow">Character sheet</p>
              <h2 className="mt-1 font-display text-2xl text-foreground">{profile.displayName}</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Practising for{" "}
                {formatDistanceToNowStrict(new Date(profile.joined))} · Current streak{" "}
                <span className="text-foreground/80">{profile.currentStreak} days</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 lg:gap-12">
            <Stat label="Composite" value={composite.toFixed(1)} suffix="/ 20" tone="gold" />
            <Stat label="Improving" value={String(improving)} suffix="of 10" tone="positive" />
            <Stat
              label="Needs care"
              value={String(decaying.length)}
              suffix="attributes"
              tone={decaying.length > 0 ? "warning" : "muted"}
            />
          </div>
        </div>
      </section>

      {/* Maintenance warnings */}
      {decaying.length > 0 && (
        <section className="mt-6 rounded-xl border border-warning/30 bg-warning/5 p-5">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-warning/15 text-warning">
              <AlertTriangle className="h-3.5 w-3.5" strokeWidth={2} />
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                Maintenance needed for {decaying.length}{" "}
                {decaying.length === 1 ? "attribute" : "attributes"}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {decaying.map((d) => d.name).join(" and ")} {decaying.length === 1 ? "has" : "have"} dropped
                below maintenance pace this week. A short, deliberate session would restore most of the loss.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {decaying.map((d) => (
                  <Link
                    key={d.id}
                    to="/attributes/$id"
                    params={{ id: d.id }}
                    className="inline-flex items-center gap-1 rounded-full border border-warning/30 bg-background px-3 py-1 text-xs text-foreground transition-colors hover:bg-surface-raised"
                  >
                    {d.name} <ArrowUpRight className="h-3 w-3" strokeWidth={2} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="mt-8 grid gap-6 xl:grid-cols-12">
        {/* Attributes grid */}
        <section className="xl:col-span-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow">Core attributes</p>
              <h3 className="mt-1 font-display text-lg text-foreground">Current state</h3>
            </div>
            <Link
              to="/attributes"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              View all →
            </Link>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {attributes.slice(0, 6).map((a) => (
              <AttributeCard key={a.id} attribute={a} />
            ))}
          </div>
        </section>

        {/* Sidebar column */}
        <aside className="space-y-6 xl:col-span-4">
          {/* Recommendations */}
          <div className="rounded-xl border border-hairline bg-surface p-5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-gold" strokeWidth={1.5} />
              <p className="eyebrow">Recommendations</p>
            </div>
            <ul className="mt-4 space-y-4">
              {recommendations.map((r) => {
                const a = getAttribute(r.attribute);
                return (
                  <li key={r.id} className="border-l border-gold/40 pl-4">
                    <p className="font-display text-sm text-foreground">{r.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{r.rationale}</p>
                    <p className="mt-1.5 font-mono text-[11px] text-gold">
                      Est. {formatDelta(r.estimatedGain)} · {a?.name}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Recent activity */}
          <div className="rounded-xl border border-hairline bg-surface p-5">
            <div className="flex items-center justify-between">
              <p className="eyebrow">Recent activity</p>
              <Link
                to="/history"
                className="text-[11px] text-muted-foreground transition-colors hover:text-foreground"
              >
                History →
              </Link>
            </div>
            <ul className="mt-4 space-y-4">
              {recentEvents.map((e) => (
                <li key={e.id} className="border-b border-hairline pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-foreground">{e.title}</p>
                    <span className="font-mono text-[10px] uppercase text-muted-foreground">
                      {e.type}
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {e.effects.map((f, i) => {
                      const positive = f.delta >= 0;
                      return (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 rounded-full border border-hairline bg-background px-2 py-0.5 font-mono text-[10px]"
                          style={{ color: positive ? "var(--positive)" : "var(--warning)" }}
                        >
                          {getAttribute(f.attribute)?.short}{" "}
                          <span className="text-foreground/80">{formatDelta(f.delta)}</span>
                        </span>
                      );
                    })}
                  </div>
                  <p className="mt-1.5 text-[11px] text-muted-foreground">
                    {formatDistanceToNowStrict(new Date(e.date), { addSuffix: true })}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Weekly trend */}
          <div className="rounded-xl border border-hairline bg-surface p-5">
            <p className="eyebrow">This week</p>
            <ul className="mt-4 space-y-3">
              {attributes.slice(0, 5).map((a) => (
                <li key={a.id} className="flex items-center justify-between text-xs">
                  <span className="text-foreground/85">{a.name}</span>
                  <span className="flex items-center gap-2">
                    <StatusBadge status={a.status} />
                    <span
                      className="w-12 text-right font-mono"
                      style={{
                        color:
                          a.trend7 > 0
                            ? "var(--positive)"
                            : a.trend7 < 0
                            ? "var(--warning)"
                            : "var(--muted-foreground)",
                      }}
                    >
                      {formatDelta(a.trend7)}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

function Stat({
  label,
  value,
  suffix,
  tone,
}: {
  label: string;
  value: string;
  suffix?: string;
  tone: "gold" | "positive" | "warning" | "muted";
}) {
  const color =
    tone === "gold"
      ? "var(--gold)"
      : tone === "positive"
      ? "var(--positive)"
      : tone === "warning"
      ? "var(--warning)"
      : "var(--muted-foreground)";
  return (
    <div>
      <p className="eyebrow">{label}</p>
      <div className="mt-1.5 flex items-baseline gap-1.5">
        <span className="font-display text-3xl tabular-nums" style={{ color }}>
          {value}
        </span>
        {suffix && <span className="font-mono text-[11px] text-muted-foreground">{suffix}</span>}
      </div>
    </div>
  );
}
