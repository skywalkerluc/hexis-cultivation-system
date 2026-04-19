import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Hexagon } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Hexis" },
      { name: "description", content: "Return to your Hexis character sheet." },
      { property: "og:title", content: "Sign in — Hexis" },
      { property: "og:description", content: "Return to your Hexis character sheet." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const router = useRouter();
  return (
    <div className="grain flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <form
        className="w-full max-w-sm"
        onSubmit={(e) => {
          e.preventDefault();
          router.navigate({ to: "/dashboard" });
        }}
      >
        <Link to="/" className="inline-flex items-center gap-2.5">
          <Hexagon className="h-5 w-5 text-gold" strokeWidth={1.5} />
          <span className="font-display text-lg tracking-tight">Hexis</span>
        </Link>
        <h1 className="mt-10 font-display text-3xl text-foreground">Welcome back.</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to resume your practice.
        </p>

        <div className="mt-8 space-y-4">
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</span>
            <input
              required
              type="email"
              defaultValue="adrien@hexis.app"
              className="mt-1.5 w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground focus:border-teal focus:outline-none"
            />
          </label>
          <label className="block">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Password</span>
              <a href="#" className="text-[11px] text-muted-foreground hover:text-foreground">
                Forgot
              </a>
            </div>
            <input
              required
              type="password"
              defaultValue="••••••••••••"
              className="mt-1.5 w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground focus:border-teal focus:outline-none"
            />
          </label>
        </div>

        <button
          type="submit"
          className="mt-7 inline-flex w-full items-center justify-center rounded-md bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-stone"
        >
          Sign in
        </button>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          New here?{" "}
          <Link to="/signup" className="text-foreground underline-offset-4 hover:underline">
            Create an account
          </Link>
          .
        </p>
      </form>
    </div>
  );
}
