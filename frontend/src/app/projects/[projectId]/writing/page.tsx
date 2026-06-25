"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, PenTool } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { WritingToolPanel } from "@/components/writing/WritingToolPanel";

export default function WritingPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;

  return (
    <ProtectedRoute>
      <AppShell projectId={projectId}>
        <div className="space-y-6">
          <Link className="inline-flex items-center gap-2 text-sm font-bold text-indigo-700" href={`/projects/${projectId}`}>
            <ArrowLeft className="h-4 w-4" />
            Back to project
          </Link>
          <Card className="p-6 sm:p-8">
            <PageHeader
              eyebrow="Writing studio"
              title="Writing Tools"
              description="Improve, summarize, outline, and format academic writing with consistent, contract-safe Spring API calls."
              actions={
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white">
                  <PenTool className="h-7 w-7" />
                </div>
              }
            />
          </Card>
          <section>
          <WritingToolPanel />
        </section>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
