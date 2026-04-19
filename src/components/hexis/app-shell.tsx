import { Link, useLocation, useRouter } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Layers,
  PenLine,
  History as HistoryIcon,
  UserCircle2,
  Settings,
  LogOut,
  Hexagon,
} from "lucide-react";
import { Avatar } from "./avatar";
import { profile } from "@/lib/hexis-data";
import { cn } from "@/lib/utils";
import { useState, type ReactNode } from "react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/attributes", label: "Attributes", icon: Layers },
  { to: "/log", label: "Log action", icon: PenLine },
  { to: "/history", label: "History", icon: HistoryIcon },
] as const;

const accountItems = [
  { to: "/profile", label: "Profile", icon: UserCircle2 },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({
  children,
  title,
  eyebrow,
  actions,
}: {
  children: ReactNode;
  title?: string;
  eyebrow?: string;
  actions?: ReactNode;
}) {
  const location = useLocation();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const isActive = (to: string) =>
    location.pathname === to || (to !== "/dashboard" && location.pathname.startsWith(to));

  return (
    <div className="grain min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-hairline bg-sidebar transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center gap-2.5 border-b border-hairline px-5">
          <Hexagon className="h-5 w-5 text-gold" strokeWidth={1.5} />
          <span className="font-display text-lg tracking-tight">Hexis</span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="eyebrow px-3 pb-2">Practice</p>
          <ul className="flex flex-col gap-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-sidebar-accent text-foreground"
                        : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
                    )}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 h-5 w-px -translate-y-1/2 bg-gold" />
                    )}
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <p className="eyebrow px-3 pb-2 pt-6">Account</p>
          <ul className="flex flex-col gap-0.5">
            {accountItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-sidebar-accent text-foreground"
                        : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-hairline p-3">
          <div className="flex items-center gap-3 rounded-md px-2 py-2">
            <Avatar
              seed={profile.avatarSeed}
              initials={profile.displayName
                .split(" ")
                .map((p) => p[0])
                .slice(0, 2)
                .join("")}
              size={36}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-foreground">{profile.displayName}</p>
              <p className="truncate text-[11px] text-muted-foreground">{profile.email}</p>
            </div>
            <button
              onClick={() => router.navigate({ to: "/" })}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-background/70 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-hairline bg-background/85 px-5 backdrop-blur lg:px-10">
          <button
            className="rounded-md border border-hairline p-2 text-muted-foreground lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="min-w-0 flex-1">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && <h1 className="font-display text-xl text-foreground">{title}</h1>}
          </div>
          {actions}
        </header>

        <main className="px-5 py-8 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
