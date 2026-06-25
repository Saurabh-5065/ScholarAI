"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, FileText, MessageSquare, PenLine, UploadCloud } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { PageHeader } from "@/components/ui/PageHeader";
import { getProject } from "@/lib/api/projects";

export default function ProjectPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const project = useQuery({
    queryKey: ["projects", projectId],
    queryFn: () => getProject(projectId),
  });

  return (
    <ProtectedRoute>
      <AppShell projectId={projectId}>
        {project.isLoading ? (
          <LoadingSpinner label="Loading project" />
        ) : (
          <div className="space-y-8">
            <Card className="overflow-hidden p-6 sm:p-8">
              <PageHeader
                eyebrow="Project workspace"
                title={project.data?.title ?? "Project"}
                description={project.data?.description ?? "No description"}
                actions={
                  <div className="flex flex-wrap gap-2">
                    <ButtonLink href={`/projects/${projectId}/documents`} size="sm">
                      <UploadCloud className="h-4 w-4" />
                      Upload Document
                    </ButtonLink>
                    <ButtonLink href={`/projects/${projectId}/chat`} size="sm" variant="secondary">
                      Open Chat
                    </ButtonLink>
                    <ButtonLink href={`/projects/${projectId}/writing`} size="sm" variant="secondary">
                      Writing Tools
                    </ButtonLink>
                  </div>
                }
              />
              {project.data ? (
                <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold text-slate-500">
                  <span>Created {new Date(project.data.createdAt).toLocaleDateString()}</span>
                  <span>Updated {new Date(project.data.updatedAt).toLocaleDateString()}</span>
                </div>
              ) : null}
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              <ProjectTool
                description="Upload PDFs, DOCX files, markdown, and notes for indexing."
                href={`/projects/${projectId}/documents`}
                icon={<FileText className="h-6 w-6" />}
                title="Documents"
              />
              <ProjectTool
                description="Ask grounded research questions against READY documents."
                href={`/projects/${projectId}/chat`}
                icon={<MessageSquare className="h-6 w-6" />}
                title="Chat"
              />
              <ProjectTool
                description="Generate outlines, abstracts, summaries, and citation formats."
                href={`/projects/${projectId}/writing`}
                icon={<PenLine className="h-6 w-6" />}
                title="Writing Tools"
              />
            </div>
          </div>
        )}
      </AppShell>
    </ProtectedRoute>
  );
}

function ProjectTool({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link className="group block" href={href}>
      <Card className="h-full p-6 transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-cyan-100 text-indigo-700">
          {icon}
        </div>
        <h2 className="mt-5 text-xl font-black text-slate-950">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-indigo-700">
          Open
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </span>
      </Card>
    </Link>
  );
}
