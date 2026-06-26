"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, FileText, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteDocument, listDocuments, reprocessDocument } from "@/lib/api/documents";
import { ApiError } from "@/lib/api/client";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { DocumentStatusBadge } from "./DocumentStatusBadge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

function formatFileSize(size: number | null) {
  if (!size) return "Size unavailable";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentList({ projectId }: { projectId: string }) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["documents", projectId],
    queryFn: () => listDocuments(projectId),
    refetchInterval: (queryResult) => {
      const docs = queryResult.state.data?.items ?? [];
      return docs.some((doc) => doc.status === "PROCESSING") ? 3000 : false;
    },
  });
  const remove = useMutation({
    mutationFn: (documentId: string) => deleteDocument(projectId, documentId),
    onSuccess: async () => queryClient.invalidateQueries({ queryKey: ["documents", projectId] }),
    onError: (error) => toast.error(error instanceof ApiError ? error.message : "Delete failed"),
  });
  const reprocess = useMutation({
    mutationFn: (documentId: string) => reprocessDocument(projectId, documentId),
    onSuccess: async () => queryClient.invalidateQueries({ queryKey: ["documents", projectId] }),
    onError: (error) => toast.error(error instanceof ApiError ? error.message : "Reprocess failed"),
  });

  if (query.isLoading) return <LoadingSpinner label="Loading documents" />;
  const documents = query.data?.items ?? [];
  if (!documents.length) {
    return (
      <EmptyState
        description="Upload papers, reports, or notes to build your research knowledge base."
        icon={<FileText className="h-7 w-7" />}
        title="No documents uploaded"
      />
    );
  }

  return (
    <div className="space-y-3">
      {documents.map((doc) => (
        <Card key={doc.id} className="p-4 transition hover:border-indigo-200 hover:shadow-md">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-cyan-100 text-indigo-700">
                <FileText className="h-6 w-6" />
              </div>
              <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate font-black text-slate-950">{doc.originalFilename}</h3>
                <DocumentStatusBadge status={doc.status} />
              </div>
              <p className="mt-1 text-sm text-slate-600">
                {formatFileSize(doc.fileSize)} | {doc.pageCount ? `${doc.pageCount} pages` : "Page count unavailable"} | Uploaded {new Date(doc.createdAt).toLocaleDateString()}
              </p>
              {doc.status === "PROCESSING" ? (
                <p className="mt-2 text-sm font-medium text-indigo-700">
                  AI is reading and indexing this document...
                </p>
              ) : null}
              {doc.status === "FAILED" && doc.failureReason ? (
                <div className="mt-3 flex gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <p>{doc.failureReason}</p>
                </div>
              ) : null}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => reprocess.mutate(doc.id)}
                size="icon"
                title="Reprocess"
                type="button"
                variant="secondary"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => remove.mutate(doc.id)}
                size="icon"
                title="Delete"
                type="button"
                variant="destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
