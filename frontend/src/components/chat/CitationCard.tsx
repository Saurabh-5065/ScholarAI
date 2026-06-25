import { FileText, Quote } from "lucide-react";

import type { Citation } from "@/lib/api/types";

export function CitationCard({ citation }: { citation: Citation }) {
  return (
    <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
        <span className="inline-flex items-center gap-2 font-bold text-slate-900">
          <FileText className="h-4 w-4 text-indigo-600" />
          {citation.documentName}
        </span>
        <span className="rounded-full bg-white px-2.5 py-1 font-bold text-indigo-700">
          Score {citation.score.toFixed(2)}
        </span>
      </div>
      <div className="mt-3 rounded-xl border border-indigo-100 bg-white p-3">
        <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-indigo-600">
          <Quote className="h-3.5 w-3.5" />
          Source
        </div>
        <p className="text-sm leading-6 text-slate-700">{citation.quote}</p>
      </div>
      <p className="mt-3 text-xs font-semibold text-slate-500">
        {citation.pageNumber ? `Page ${citation.pageNumber}` : "Page unavailable"}
      </p>
    </div>
  );
}
