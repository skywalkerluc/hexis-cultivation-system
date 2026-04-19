import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Hexagon, Check } from "lucide-react";
import { useState } from "react";
import { Avatar, avatarSeeds } from "@/components/hexis/avatar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your account — Hexis" },
      {
        name: "description",
        content: "Open your Hexis character sheet. A premium system for deliberate self-development.",
      },
      { property: "og:title", content: "Create your account — Hexis" },
      {
        property: "og:description",
        content: "A short, considered sign-up. Your character sheet awaits.",
      },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const router = useRouter();
  const [seed, setSeed] = useState(avatarSeeds[2]);
  const [name, setName] = useState("");

  return (
    <div className="grain min-h-screen bg-background text-foreground">
      <div className="mx-auto grid min-h-screen max-w-6xl lg:grid-cols-2">
        <div className="hidden flex-col justify-between border-r border-hairline p-12 lg:flex">
          <Link to="/" className="flex items-center gap-2.5">
            <Hexagon className="h-5 w-5 text-gold" strokeWidth={1.5} />
            <span className="font-display text-lg tracking-tight">Hexis</span>
          </Link>
          <div>
            <p className="eyebrow">A note before you begin</p>
            <p className="mt-6 font-display text-3xl leading-snug text-foreground">
              Hexis assumes you are not here to collect badges, but to become
              <span className="text-gold"> someone different over time.</span>
            </p>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              The system will track your practice with care and explain every
              change in plain language. There are no streaks weaponised against you.
            </p>
          </div>
          <p className="font-mono text-xs text-muted-foreground">
            Estimated time · two minutes
          </p>
        </div>

        <div className="flex items-center justify-center px-6 py-12 lg:p-12">
          <form
            className="w-full max-w-md"
            onSubmit={(e) => {
              e.preventDefault();
              router.navigate({ to: "/onboarding" });
            }}
          >
            <p className="eyebrow">Step 1 of 2</p>
            <h1 className="mt-3 font-display text-3xl text-foreground">Create your account</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Already cultivating?{" "}
              <Link to="/login" className="text-foreground underline-offset-4 hover:underline">
                Sign in
              </Link>
              .
            </p>

            <div className="mt-8 space-y-5">
              <Field label="Display name" hint="Shown on your character sheet.">
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Adrien Marchand"
                  className="w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-teal focus:outline-none"
                />
              </Field>
              <Field label="Email">
                <input
                  required
                  type="email"
                  placeholder="you@domain.com"
                  className="w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-teal focus:outline-none"
                />
              </Field>
              <Field label="Password" hint="Minimum twelve characters.">
                <input
                  required
                  type="password"
                  minLength={12}
                  placeholder="••••••••••••"
                  className="w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground focus:border-teal focus:outline-none"
                />
              </Field>

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Choose an emblem
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Geometric, abstract. You can change it any time.
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
                      aria-label={`Avatar ${s}`}
                    >
                      <Avatar
                        seed={s}
                        size={48}
                        initials={
                          name
                            ? name
                                .split(" ")
                                .map((p) => p[0])
                                .slice(0, 2)
                                .join("")
                            : undefined
                        }
                      />
                      {seed === s && (
                        <span className="absolute -bottom-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-gold text-gold-foreground">
                          <Check className="h-2.5 w-2.5" strokeWidth={3} />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="mt-8 inline-flex w-full items-center justify-center rounded-md bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-stone"
            >
              Continue to onboarding
            </button>
            <p className="mt-4 text-center text-[11px] text-muted-foreground">
              By continuing you accept our quiet, plain-language terms.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
      {hint ? <span className="mt-1 block text-[11px] text-muted-foreground">{hint}</span> : null}
    </label>
  );
}
