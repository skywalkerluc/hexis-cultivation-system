import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Dumbbell, Repeat, Trophy, HeartPulse, BookOpen } from "lucide-react";
import { AppShell } from "@/components/hexis/app-shell";
import {
  attributes,
  type ActionType,
  type AttributeId,
  type Intensity,
} from "@/lib/hexis-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/log")({
  validateSearch: (s: Record<string, unknown>) => ({
    attr: typeof s.attr === "string" ? (s.attr as AttributeId) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Log action — Hexis" },
      { name: "description", content: "Record practice. Translate it into attribute change." },
      { property: "og:title", content: "Log action — Hexis" },
      { property: "og:description", content: "Record practice. Translate it into attribute change." },
    ],
  }),
  component: LogActionPage,
});

const actionTypes: { id: ActionType; label: string; icon: typeof Dumbbell; hint: string }[] = [
  { id: "training", label: "Training", icon: Dumbbell, hint: "Effortful work toward capacity" },
  { id: "practice", label: "Practice", icon: BookOpen, hint: "Deliberate skill repetition" },
  { id: "routine", label: "Routine", icon: Repeat, hint: "Held commitments, weekly review" },
  { id: "achievement", label: "Achievement", icon: Trophy, hint: "Difficult moment held well" },
  { id: "recovery", label: "Recovery", icon: HeartPulse, hint: "Sleep, walk, decompression" },
];

const intensities: { id: Intensity; label: string; multiplier: number }[] = [
  { id: "light", label: "Light", multiplier: 0.5 },
  { id: "moderate", label: "Moderate", multiplier: 1 },
  { id: "intense", label: "Intense", multiplier: 1.6 },
];

function LogActionPage() {
  const search = Route.useSearch();
  const [type, setType] = useState<ActionType>("training");
  const [intensity, setIntensity] = useState<Intensity>("moderate");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [selected, setSelected] = useState<AttributeId[]>(
    search.attr ? [search.attr] : ["focus"],
  );
  const [submitted, setSubmitted] = useState(false);

  const toggle = (id: AttributeId) =>
    setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  const baseGain = type === "recovery" ? 0.15 : type === "routine" ? 0.1 : 0.2;
  const mult = intensities.find((i) => i.id === intensity)!.multiplier;
  const perAttr = (baseGain * mult).toFixed(2);

  if (submitted) {
    return (
      <AppShell eyebrow="Logged" title="Action recorded">
        <div className="mx-auto max-w-xl rounded-2xl border border-positive/30 bg-positive/5 p-8 text-center">
          <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-positive/15 text-positive">
            <Check className="h-5 w-5" strokeWidth={2} />
          </span>
          <h2 className="mt-5 font-display text-2xl text-foreground">Recorded</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Your practice has been added to today's evidence. Your attribute scores will reflect this
            change at the next nightly recompute. You can see the rationale on each attribute page.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {selected.map((id) => {
              const a = attributes.find((x) => x.id === id)!;
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-background px-3 py-1 text-xs text-foreground"
                >
                  {a.name}
                  <span className="font-mono text-positive">+{perAttr}</span>
                </span>
              );
            })}
          </div>
          <div className="mt-8 flex justify-center gap-3">
            <button
              onClick={() => {
                setSubmitted(false);
                setTitle("");
                setNotes("");
              }}
              className="rounded-md border border-border px-4 py-2 text-sm text-foreground hover:bg-surface"
            >
              Log another
            </button>
            <a
              href="/dashboard"
              className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-stone"
            >
              Return to dashboard
            </a>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell eyebrow="Evidence" title="Log an action">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="grid gap-6 lg:grid-cols-12"
      >
        <div className="space-y-6 lg:col-span-8">
          {/* Type */}
          <Section label="Type of action">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {actionTypes.map((t) => {
                const Icon = t.icon;
                const active = type === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setType(t.id)}
                    className={cn(
                      "rounded-xl border p-4 text-left transition-colors",
                      active
                        ? "border-gold/60 bg-surface-raised"
                        : "border-hairline bg-surface hover:border-border",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4",
                        active ? "text-gold" : "text-muted-foreground",
                      )}
                      strokeWidth={1.5}
                    />
                    <p className="mt-3 text-sm font-medium text-foreground">{t.label}</p>
                    <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{t.hint}</p>
                  </button>
                );
              })}
            </div>
          </Section>

          {/* Title */}
          <Section label="What did you do?">
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 90-minute deep work block on the Q3 plan"
              className="w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-teal focus:outline-none"
            />
          </Section>

          {/* Intensity */}
          <Section label="Intensity">
            <div className="flex flex-wrap gap-2">
              {intensities.map((i) => (
                <button
                  key={i.id}
                  type="button"
                  onClick={() => setIntensity(i.id)}
                  className={cn(
                    "rounded-md border px-4 py-2 text-sm transition-colors",
                    intensity === i.id
                      ? "border-gold/60 bg-surface-raised text-foreground"
                      : "border-hairline bg-surface text-muted-foreground hover:text-foreground",
                  )}
                >
                  {i.label}
                </button>
              ))}
            </div>
          </Section>

          {/* Affected attributes */}
          <Section label="Affected attributes" hint="Choose any that apply.">
            <div className="grid gap-2 sm:grid-cols-2">
              {attributes.map((a) => {
                const active = selected.includes(a.id);
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => toggle(a.id)}
                    className={cn(
                      "flex items-center justify-between rounded-md border px-3 py-2.5 text-left transition-colors",
                      active
                        ? "border-gold/50 bg-surface-raised"
                        : "border-hairline bg-surface hover:border-border",
                    )}
                  >
                    <div>
                      <p className="text-sm text-foreground">{a.name}</p>
                      <p className="font-mono text-[10px] text-muted-foreground">{a.short}</p>
                    </div>
                    <span
                      className={cn(
                        "inline-flex h-4 w-4 items-center justify-center rounded-sm border",
                        active ? "border-gold bg-gold text-gold-foreground" : "border-hairline",
                      )}
                    >
                      {active && <Check className="h-3 w-3" strokeWidth={3} />}
                    </span>
                  </button>
                );
              })}
            </div>
          </Section>

          {/* Notes */}
          <Section label="Notes" hint="Optional. Useful for your own reflection later.">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Anything worth remembering about this session"
              className="w-full resize-none rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-teal focus:outline-none"
            />
          </Section>
        </div>

        {/* Impact summary */}
        <aside className="lg:col-span-4">
          <div className="sticky top-24 rounded-xl border border-hairline bg-surface p-6">
            <p className="eyebrow">Impact summary</p>
            <p className="mt-1 text-xs text-muted-foreground">
              An estimate, before nightly recompute.
            </p>

            <div className="mt-5 flex items-baseline justify-between border-b border-hairline pb-4">
              <span className="text-xs text-muted-foreground">Per attribute</span>
              <span className="font-mono text-xl tabular-nums text-positive">+{perAttr}</span>
            </div>

            <ul className="mt-4 space-y-2.5">
              {selected.length === 0 ? (
                <li className="text-xs text-muted-foreground">
                  Choose at least one attribute to estimate impact.
                </li>
              ) : (
                selected.map((id) => {
                  const a = attributes.find((x) => x.id === id)!;
                  return (
                    <li key={id} className="flex items-center justify-between text-xs">
                      <span className="text-foreground/85">{a.name}</span>
                      <span className="font-mono tabular-nums text-positive">+{perAttr}</span>
                    </li>
                  );
                })
              )}
            </ul>

            <button
              type="submit"
              disabled={selected.length === 0 || !title}
              className="mt-7 inline-flex w-full items-center justify-center rounded-md bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-stone disabled:cursor-not-allowed disabled:opacity-50"
            >
              Record action
            </button>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              You can edit or remove this entry from History.
            </p>
          </div>
        </aside>
      </form>
    </AppShell>
  );
}

function Section({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-hairline bg-surface/60 p-5">
      <div className="flex items-baseline justify-between">
        <p className="eyebrow">{label}</p>
        {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}
