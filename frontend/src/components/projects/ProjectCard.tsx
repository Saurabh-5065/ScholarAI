import { ArrowRight, FolderKanban } from "lucide-react";
import Link from "next/link";

import type { ProjectResponse } from "@/lib/api/types";
import { Card } from "@/components/ui/Card";

export function ProjectCard({ project }: { project: ProjectResponse }) {
  return (
    <Link
      className="group block"
      href={`/projects/${project.id}`}
    >
      <Card className="h-full p-5 transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-indigo-100 to-cyan-100 p-3 text-indigo-700">
            <FolderKanban className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 font-bold text-slate-950">{project.title}</h3>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
              {project.description ?? "No description"}
            </p>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
          <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
          <span className="inline-flex items-center gap-1 font-bold text-indigo-700">
            Open Project
            <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
          </span>
        </div>
      </Card>
    </Link>
  );
}
