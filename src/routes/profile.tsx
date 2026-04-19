import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/hexis/app-shell";
import { Avatar, avatarSeeds } from "@/components/hexis/avatar";
import { profile, attributes } from "@/lib/hexis-data";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Hexis" },
      { name: "description", content: "Your character sheet, emblem and personal details." },
      { property: "og:title", content: "Profile — Hexis" },
      { property: "og:description", content: "Your character sheet, emblem and personal details." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const [name, setName] = useState(profile.displayName);
  const [seed, setSeed] = useState(profile.avatarSeed);
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  const totals = {
    composite: (attributes.reduce((s, a) => s + a.current, 0) / attributes.length).toFixed(1),
    base: (attributes.reduce((s, a) => s + a.base, 0) / attributes.length).toFixed(1),
    potential: (attributes.reduce((s, a) => s + a.potential, 0) / attributes.length).toFixed(1),
  };

  return (
    <AppShell eyebrow="Account" title="Profile">
      <div className="grid gap-6 lg:grid-cols-12">
        <section className="lg:col-span-8 rounded-2xl border border-hairline bg-surface p-6 lg:p-8">
          <div className="flex items-center gap-5">
            <Avatar seed={seed} initials={initials} size={88} />
            <div>
              <p className="eyebrow">Character sheet</p>
              <h2 className="mt-1 font-display text-2xl text-foreground">{name}</h2>
              <p className="mt-1 text-xs text-muted-foreground">{profile.email}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <Field label="Display name">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-teal focus:outline-none"
              />
            </Field>
            <Field label="Email">
              <input
                disabled
                value={profile.email}
                className="w-full rounded-md border border-hairline bg-background/40 px-3.5 py-2.5 text-sm text-muted-foreground"
              />
            </Field>
          </div>

          <div className="mt-8">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Emblem</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Geometric. Quiet. Pick what feels right.
            </p>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {avatarSeeds.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSeed(s)}
                  className={cn(
                    "relative rounded-full p-0.5 transition-colors",
                    seed === s
                      ? "bg-gold/30 ring-1 ring-gold"
                      : "ring-1 ring-hairline hover:ring-border",
                  )}
                >
                  <Avatar seed={s} size={48} initials={initials} />
                  {seed === s && (
                    <span className="absolute -bottom-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-gold text-gold-foreground">
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button className="rounded-md border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
              Cancel
            </button>
            <button className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-stone">
              Save changes
            </button>
          </div>
        </section>

        <aside className="space-y-6 lg:col-span-4">
          <div className="rounded-2xl border border-hairline bg-surface p-6">
            <p className="eyebrow">At a glance</p>
            <dl className="mt-4 space-y-3 text-sm">
              <Row label="Composite" value={`${totals.composite} / 20`} />
              <Row label="Average base" value={`${totals.base} / 20`} />
              <Row label="Average potential" value={`${totals.potential} / 20`} />
              <Row label="Current streak" value={`${profile.currentStreak} days`} />
              <Row label="Longest streak" value={`${profile.longestStreak} days`} />
              <Row label="Weekly practice" value={`${profile.weeklyPractice}h`} />
            </dl>
          </div>

          <div className="rounded-2xl border border-hairline bg-surface p-6">
            <p className="eyebrow">Cultivated since</p>
            <p className="mt-2 font-display text-xl text-foreground">
              {new Date(profile.joined).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Hexis treats time as part of the practice. Patience compounds.
            </p>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-hairline pb-2 last:border-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-mono text-sm tabular-nums text-foreground">{value}</dd>
    </div>
  );
}
