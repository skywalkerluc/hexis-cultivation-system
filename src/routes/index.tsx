import { createFileRoute, Link } from "@tanstack/react-router";
import { Hexagon, ArrowUpRight } from "lucide-react";
import { attributes } from "@/lib/hexis-data";
import { AttributeScale } from "@/components/hexis/attribute-scale";
import { StatusBadge } from "@/components/hexis/status-badge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hexis — Cultivate the attributes that shape who you become" },
      {
        name: "description",
        content:
          "A premium self-development system. Track Focus, Discipline, Energy and more on a 0–20 scale and understand exactly what changed and why.",
      },
      { property: "og:title", content: "Hexis — A system for cultivated attributes" },
      {
        property: "og:description",
        content:
          "Treat personal growth as the cultivation of durable attributes, not the collection of habits.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const featured = attributes.slice(0, 4);

  return (
    <div className="grain min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="border-b border-hairline">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <Hexagon className="h-5 w-5 text-gold" strokeWidth={1.5} />
            <span className="font-display text-lg tracking-tight">Hexis</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#system" className="transition-colors hover:text-foreground">The system</a>
            <a href="#attributes" className="transition-colors hover:text-foreground">Attributes</a>
            <a href="#principles" className="transition-colors hover:text-foreground">Principles</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="hidden rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-stone"
            >
              Begin <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-hairline">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-12 lg:gap-16 lg:py-32">
          <div className="lg:col-span-7">
            <p className="eyebrow">Hexis · A system for deliberate practice</p>
            <h1 className="mt-6 font-display text-5xl leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl">
              Cultivate the attributes
              <br />
              that shape{" "}
              <span className="text-gold">who you become.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Hexis is a refined operating system for personal evolution. It treats growth as
              the slow cultivation of durable attributes — Focus, Discipline, Energy, Resilience —
              not the accumulation of habits. Every change is explained.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-stone"
              >
                Create your character sheet
                <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center rounded-md border border-border px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface"
              >
                I already have an account
              </Link>
            </div>

            <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-hairline pt-8">
              {[
                { k: "0–20", v: "Visible scale" },
                { k: "10", v: "Core attributes" },
                { k: "5", v: "Action types" },
              ].map((s) => (
                <div key={s.k}>
                  <dt className="font-display text-2xl text-foreground">{s.k}</dt>
                  <dd className="mt-1 text-xs text-muted-foreground">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border border-hairline bg-surface p-6 shadow-2xl shadow-background">
              <div className="flex items-center justify-between">
                <p className="eyebrow">Live preview</p>
                <span className="font-mono text-[11px] text-muted-foreground">/dashboard</span>
              </div>
              <div className="mt-5 space-y-4">
                {featured.map((a) => (
                  <div key={a.id} className="rounded-xl border border-hairline bg-surface-raised p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="font-display text-base text-foreground">{a.name}</span>
                        <span className="font-mono text-[10px] text-muted-foreground">{a.short}</span>
                      </div>
                      <StatusBadge status={a.status} />
                    </div>
                    <div className="mt-3 flex items-end justify-between gap-4">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-display text-3xl tabular-nums text-foreground">
                          {a.current.toFixed(1)}
                        </span>
                        <span className="font-mono text-[11px] text-muted-foreground">/ 20</span>
                      </div>
                      <div className="flex-1">
                        <AttributeScale current={a.current} base={a.base} potential={a.potential} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* System */}
      <section id="system" className="border-b border-hairline">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="eyebrow">The system</p>
            <h2 className="mt-4 font-display text-4xl leading-tight text-foreground">
              Three states. One honest picture.
            </h2>
          </div>
          <div className="grid gap-px bg-hairline lg:col-span-8 lg:grid-cols-3">
            {[
              {
                k: "Current",
                d: "Where the attribute stands today, given recent practice and recovery.",
                color: "var(--gold)",
              },
              {
                k: "Base",
                d: "The level you have consolidated. Stable ground that does not erode quickly.",
                color: "var(--teal)",
              },
              {
                k: "Potential",
                d: "What deliberate practice could plausibly bring within reach over months.",
                color: "var(--stone)",
              },
            ].map((c) => (
              <div key={c.k} className="bg-background p-7">
                <span
                  className="inline-block h-1.5 w-8 rounded-full"
                  style={{ background: c.color }}
                />
                <h3 className="mt-4 font-display text-xl text-foreground">{c.k}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Attributes */}
      <section id="attributes" className="border-b border-hairline bg-surface/40">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="eyebrow">Core attributes</p>
              <h2 className="mt-4 font-display text-4xl leading-tight text-foreground">
                Ten attributes worth cultivating.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Begin from the recommended template and refine it over time. Each attribute has
                its own logic of growth, maintenance and decay.
              </p>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-hairline bg-hairline md:grid-cols-3 lg:grid-cols-5">
            {attributes.map((a) => (
              <div key={a.id} className="bg-background p-5">
                <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground">
                  {a.short}
                </p>
                <p className="mt-2 font-display text-base text-foreground">{a.name}</p>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                  Decay {a.decayRatePerWeek.toFixed(1)}/wk
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section id="principles" className="border-b border-hairline">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <p className="eyebrow text-center">Principles</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-center font-display text-4xl leading-tight text-foreground">
            Built on the conviction that{" "}
            <span className="text-gold">repeated practice becomes character.</span>
          </h2>
          <div className="mx-auto mt-14 grid max-w-5xl gap-8 md:grid-cols-3">
            {[
              {
                t: "Insight, not arbitration",
                d: "Every change comes with a human-readable reason. No scores move silently.",
              },
              {
                t: "Fair decay",
                d: "Attributes decay at honest rates. Pressure without punishment.",
              },
              {
                t: "Quiet motivation",
                d: "No streaks weaponised against you. No noise. Just signal.",
              },
            ].map((p) => (
              <div key={p.t} className="rounded-xl border border-hairline bg-surface p-6">
                <h3 className="font-display text-lg text-foreground">{p.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="mx-auto max-w-7xl px-6 py-24 text-center">
          <h2 className="mx-auto max-w-3xl font-display text-4xl leading-tight md:text-5xl">
            Begin the practice.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Create a profile, choose a character template, and log your first action. The system
            will explain its first observation within a week.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/signup"
              className="inline-flex items-center gap-1.5 rounded-md bg-gold px-6 py-3 text-sm font-medium text-gold-foreground transition-colors hover:bg-gold/90"
            >
              Create your account
              <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center rounded-md border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface"
            >
              Preview the dashboard
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-hairline">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-xs text-muted-foreground">
          <div className="flex items-center gap-2.5">
            <Hexagon className="h-4 w-4 text-gold" strokeWidth={1.5} />
            <span className="font-display text-sm text-foreground">Hexis</span>
            <span>· A system for cultivated attributes</span>
          </div>
          <p className="font-mono">© {new Date().getFullYear()} Hexis</p>
        </div>
      </footer>
    </div>
  );
}
