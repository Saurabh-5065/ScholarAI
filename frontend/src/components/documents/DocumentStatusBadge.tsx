import type { DocumentStatus } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const styles: Record<DocumentStatus, string> = {
  UPLOADED: "border-slate-200 bg-slate-100 text-slate-700",
  PROCESSING: "border-indigo-200 bg-indigo-100 text-indigo-800 animate-pulse",
  READY: "border-emerald-200 bg-emerald-100 text-emerald-800",
  FAILED: "border-rose-200 bg-rose-100 text-rose-800",
};

export function DocumentStatusBadge({ status }: { status: DocumentStatus }) {
  return (
    <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-xs font-bold", styles[status])}>
      {status}
    </span>
  );
}
