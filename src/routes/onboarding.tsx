import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Hexagon, ArrowRight } from "lucide-react";
import { useState } from "react";
import { attributes } from "@/lib/hexis-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Begin — Hexis" },
      { name: "description", content: "Choose your starting template and begin your practice." },
      { property: "og:title", content: "Begin — Hexis" },
      { property: "og:description", content: "Choose your starting template and begin your practice." },
    ],
  }),
  component: OnboardingPage,
});

const templates = [
  {
    id: "recommended",
    name: "Recommended",
    blurb: "Ten attributes covering cognitive, somatic and relational ground. A balanced foundation.",
    items: attributes.map((a) => a.name),
    accent: "gold",
  },
  {
    id: "deep-work",
    name: "Deep work",
    blurb: "Cognitive emphasis: Focus, Discipline, Memory, Creativity, Organization, Energy.",
    items: ["Focus", "Discipline", "Memory", "Creativity", "Organization", "Energy"],
    accent: "teal",
  },
  {
    id: "athletic",
    name: "Embodied practice",
    blurb: "Body-first emphasis: Physical Endurance, Energy, Discipline, Resilience, Emotional Control.",
    items: ["Physical Endurance", "Energy", "Discipline", "Resilience", "Emotional Control"],
    accent: "positive",
  },
] as const;

function OnboardingPage() {
  const router = useRouter();
  const [chosen, setChosen] = useState<string>("recommended");

  return (
    <div className="grain min-h-screen bg-background text-foreground">
      <header className="border-b border-hairline">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <Hexagon className="h-5 w-5 text-gold" strokeWidth={1.5} />
            <span className="font-display text-lg tracking-tight">Hexis</span>
          </Link>
          <p className="font-mono text-xs text-muted-foreground">Step 2 of 2 · Onboarding</p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-16">
        <p className="eyebrow">Begin</p>
        <h1 className="mt-3 font-display text-4xl leading-tight text-foreground">
          Choose a starting template.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          You can change attributes any time. We recommend starting from the full set —
          most people refine their list after the first month of practice.
        </p>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {templates.map((t) => {
            const active = chosen === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setChosen(t.id)}
                className={cn(
                  "group rounded-xl border bg-surface p-6 text-left transition-all",
                  active
                    ? "border-gold/60 bg-surface-raised shadow-[0_0_0_1px_var(--gold)]"
                    : "border-hairline hover:border-border hover:bg-surface-raised",
                )}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl text-foreground">{t.name}</h3>
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full",
                      active ? "bg-gold" : "bg-hairline",
                    )}
                  />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.blurb}</p>
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {t.items.slice(0, 8).map((i) => (
                    <li
                      key={i}
                      className="rounded-full border border-hairline bg-background px-2.5 py-1 text-[11px] text-muted-foreground"
                    >
                      {i}
                    </li>
                  ))}
                  {t.items.length > 8 && (
                    <li className="rounded-full px-2.5 py-1 text-[11px] text-muted-foreground">
                      +{t.items.length - 8}
                    </li>
                  )}
                </ul>
              </button>
            );
          })}
        </div>

        <section className="mt-14 rounded-xl border border-hairline bg-surface p-6">
          <p className="eyebrow">How it works</p>
          <ol className="mt-4 grid gap-6 md:grid-cols-3">
            {[
              {
                k: "01",
                t: "Log evidence",
                d: "Record actions, practice, routines, recovery, achievements. Tagged with intensity.",
              },
              {
                k: "02",
                t: "Hexis interprets",
                d: "Each event is translated into attribute changes with a written rationale.",
              },
              {
                k: "03",
                t: "Review and refine",
                d: "Weekly trends, decay warnings, and quietly useful recommendations.",
              },
            ].map((s) => (
              <li key={s.k} className="border-l border-hairline pl-4">
                <p className="font-mono text-[11px] text-gold">{s.k}</p>
                <p className="mt-1 font-display text-base text-foreground">{s.t}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.d}</p>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-10 flex justify-end">
          <button
            onClick={() => router.navigate({ to: "/dashboard" })}
            className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-stone"
          >
            Enter your dashboard <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </main>
    </div>
  );
}
