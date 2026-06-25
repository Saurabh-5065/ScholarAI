"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FileText,
  FolderKanban,
  Home,
  LogOut,
  MessageSquareText,
  PenTool,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { logout } from "@/lib/api/auth";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";

export function AppShell({
  children,
  projectId,
}: {
  children: ReactNode;
  projectId?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Wipe every cached query (user, projects, documents, chats, ...) so no
      // previous-session data lingers in memory, then hard-replace the history
      // entry so "Back" cannot return to an authenticated page.
      queryClient.clear();
      router.replace("/login");
    },
    onError: () => toast.error("Logout failed"),
  });

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: Home, enabled: true },
    { label: "Projects", href: "/dashboard", icon: FolderKanban, enabled: true },
    {
      label: "Documents",
      href: projectId ? `/projects/${projectId}/documents` : "/dashboard",
      icon: FileText,
      enabled: Boolean(projectId),
    },
    {
      label: "Chat",
      href: projectId ? `/projects/${projectId}/chat` : "/dashboard",
      icon: MessageSquareText,
      enabled: Boolean(projectId),
    },
    {
      label: "Writing Tools",
      href: projectId ? `/projects/${projectId}/writing` : "/dashboard",
      icon: PenTool,
      enabled: Boolean(projectId),
    },
  ];

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] border-r border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur-xl lg:flex lg:flex-col">
        <Link className="flex items-center gap-2 px-2 py-3" href="/dashboard">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/25">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="text-xl font-black tracking-tight text-slate-950">
            Scholar<span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">AI</span>
          </span>
        </Link>

        <nav className="mt-8 space-y-1">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                aria-disabled={!item.enabled}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                  active
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                  !item.enabled && "cursor-not-allowed opacity-45 hover:bg-transparent hover:text-slate-600",
                )}
                href={item.href}
                key={item.label}
                onClick={(event) => {
                  if (!item.enabled) event.preventDefault();
                }}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-cyan-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
            Signed in
          </p>
          <p className="mt-2 truncate text-sm font-bold text-slate-950">
            {user?.name ?? "ScholarAI user"}
          </p>
          <p className="truncate text-xs text-slate-500">{user?.email}</p>
          <Button
            className="mt-4 w-full"
            disabled={logoutMutation.isPending}
            onClick={() => logoutMutation.mutate()}
            size="sm"
            type="button"
            variant="secondary"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      <header className="sticky top-0 z-20 border-b border-white/70 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <Link className="flex items-center gap-2" href="/dashboard">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="font-black text-slate-950">ScholarAI</span>
          </Link>
          <Button
            disabled={logoutMutation.isPending}
            onClick={() => logoutMutation.mutate()}
            size="sm"
            type="button"
            variant="secondary"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
        <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600",
                  pathname === item.href && "border-indigo-200 bg-indigo-50 text-indigo-700",
                  !item.enabled && "opacity-45",
                )}
                href={item.href}
                key={item.label}
                onClick={(event) => {
                  if (!item.enabled) event.preventDefault();
                }}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="px-4 py-7 sm:px-6 lg:ml-[260px] lg:px-8 lg:py-9">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
