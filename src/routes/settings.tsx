import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/hexis/app-shell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Hexis" },
      { name: "description", content: "Theme, notifications, privacy and account." },
      { property: "og:title", content: "Settings — Hexis" },
      { property: "og:description", content: "Theme, notifications, privacy and account." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [theme, setTheme] = useState<"obsidian" | "graphite" | "ivory">("obsidian");
  const [reflective, setReflective] = useState(true);
  const [decay, setDecay] = useState(true);
  const [weekly, setWeekly] = useState(true);
  const [achievements, setAchievements] = useState(false);
  const [discoverable, setDiscoverable] = useState(false);

  return (
    <AppShell eyebrow="Account" title="Settings">
      <div className="space-y-6">
        <Card title="Appearance" caption="Choose the surface palette. Hexis is dark by design.">
          <div className="grid gap-3 sm:grid-cols-3">
            {(
              [
                { id: "obsidian", label: "Obsidian", swatch: "var(--background)" },
                { id: "graphite", label: "Graphite", swatch: "var(--surface-raised)" },
                { id: "ivory", label: "Ivory (preview)", swatch: "var(--stone)" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-4 text-left transition-colors",
                  theme === t.id
                    ? "border-gold/60 bg-surface-raised"
                    : "border-hairline bg-surface hover:border-border",
                )}
              >
                <span
                  className="h-8 w-8 rounded-md border border-hairline"
                  style={{ background: t.swatch }}
                />
                <span className="text-sm text-foreground">{t.label}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card title="Notifications" caption="Quiet by default. Hexis will not interrupt without reason.">
          <Toggle
            label="Reflective prompts"
            hint="A short, optional question at the end of each day."
            checked={reflective}
            onChange={setReflective}
          />
          <Toggle
            label="Decay warnings"
            hint="When an attribute begins to drift below maintenance pace."
            checked={decay}
            onChange={setDecay}
          />
          <Toggle
            label="Weekly review"
            hint="A summary of trends every Sunday morning."
            checked={weekly}
            onChange={setWeekly}
          />
          <Toggle
            label="Achievement notifications"
            hint="When a base score consolidates upward."
            checked={achievements}
            onChange={setAchievements}
          />
        </Card>

        <Card title="Privacy" caption="Hexis does not share or sell your evidence. Ever.">
          <Toggle
            label="Discoverable profile"
            hint="Allow other Hexis users to find your character sheet by display name."
            checked={discoverable}
            onChange={setDiscoverable}
          />
          <div className="flex items-center justify-between border-t border-hairline pt-4">
            <div>
              <p className="text-sm text-foreground">Export your data</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Download all attributes, evidence and history in a portable JSON file.
              </p>
            </div>
            <button className="rounded-md border border-border px-4 py-2 text-sm text-foreground hover:bg-surface-raised">
              Request export
            </button>
          </div>
        </Card>

        <Card title="Account" caption="Sensitive controls. Handle with intention.">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">Change password</p>
              <p className="mt-1 text-xs text-muted-foreground">
                You'll be sent a secure link to your registered email.
              </p>
            </div>
            <button className="rounded-md border border-border px-4 py-2 text-sm text-foreground hover:bg-surface-raised">
              Send link
            </button>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-hairline pt-4">
            <div>
              <p className="text-sm text-critical">Delete account</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Removes your character sheet, evidence and history. This cannot be undone.
              </p>
            </div>
            <button className="rounded-md border border-critical/40 px-4 py-2 text-sm text-critical hover:bg-critical/10">
              Delete
            </button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

function Card({
  title,
  caption,
  children,
}: {
  title: string;
  caption?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-hairline bg-surface p-6">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-lg text-foreground">{title}</h2>
        {caption && <p className="text-xs text-muted-foreground">{caption}</p>}
      </div>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-hairline pb-4 last:border-0 last:pb-0">
      <div>
        <p className="text-sm text-foreground">{label}</p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full border transition-colors",
          checked ? "border-gold/40 bg-gold/30" : "border-hairline bg-background",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4.5 w-4.5 rounded-full transition-all",
            checked ? "left-[22px] bg-gold" : "left-0.5 bg-muted-foreground",
          )}
          style={{ height: 18, width: 18 }}
        />
      </button>
    </div>
  );
}
