"use client";

import { useQuery } from "@tanstack/react-query";
import { BookOpen, FolderKanban, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { PageHeader } from "@/components/ui/PageHeader";
import { listProjects } from "@/lib/api/projects";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";

export default function DashboardPage() {
  const { data: user } = useCurrentUser();
  const projects = useQuery({
    queryKey: ["projects"],
    queryFn: () => listProjects(),
  });

  const totalProjects = projects.data?.totalItems ?? projects.data?.items.length ?? 0;
  const recentProjects = projects.data?.items.slice(0, 3).length ?? 0;

  return (
    // <ProtectedRoute>
      <AppShell>
        <div className="space-y-8">
          <PageHeader
            eyebrow="Dashboard"
            title={`Welcome back, ${user?.name ?? user?.email ?? "researcher"}`}
            description="Continue your research projects and academic writing workflows."
            actions={<CreateProjectDialog />}
          />

          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard
              icon={<FolderKanban className="h-5 w-5" />}
              label="Total projects"
              value={String(totalProjects)}
            />
            <MetricCard
              icon={<Sparkles className="h-5 w-5" />}
              label="Recent projects"
              value={String(recentProjects)}
            />
            <MetricCard
              icon={<BookOpen className="h-5 w-5" />}
              label="Documents and chats"
              value="Open a project"
            />
          </div>

          <Card className="overflow-hidden p-6 sm:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-950">Create a research workspace</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Set up a project for papers, notes, RAG conversations, and academic drafts.
                </p>
              </div>
              <CreateProjectDialog />
            </div>
          </Card>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-950">Research projects</h2>
            </div>
            {projects.isLoading ? (
              <LoadingSpinner label="Loading projects" />
            ) : projects.data?.items.length ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {projects.data.items.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <EmptyState
                action={<CreateProjectDialog />}
                description="Create your first workspace for papers, notes, and AI drafts."
                icon={<FolderKanban className="h-7 w-7" />}
                title="No research projects yet"
              />
            )}
          </section>
        </div>
      </AppShell>
    // </ProtectedRoute>
  );
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-100 to-cyan-100 text-indigo-700">
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-black text-slate-950">{value}</p>
        </div>
      </div>
    </Card>
  );
}
