"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";

import { DocumentList } from "@/components/documents/DocumentList";
import { DocumentUploader } from "@/components/documents/DocumentUploader";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";

export default function DocumentsPage() {
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
              eyebrow="Knowledge base"
              title="Documents"
              description="Upload papers, reports, or notes. ScholarAI will process them for grounded research Q&A."
              actions={<DocumentUploader projectId={projectId} />}
            />
          </Card>
          <section>
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-700">
              <FileText className="h-4 w-4 text-indigo-600" />
              Project documents
            </div>
          <DocumentList projectId={projectId} />
        </section>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
