import { Sparkles } from "lucide-react";

import type { ChatMessageResponse } from "@/lib/api/types";
import { CitationCard } from "./CitationCard";

export function MessageBubble({ message }: { message: ChatMessageResponse }) {
  const assistant = message.role === "ASSISTANT";
  return (
    <div className={`flex ${assistant ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-3xl rounded-3xl px-4 py-3 shadow-sm ${
          assistant
            ? "border border-white/70 bg-white/90 text-slate-900"
            : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
        }`}
      >
        {assistant ? (
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-indigo-600">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            ScholarAI
          </div>
        ) : null}
        <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
        {assistant && message.citations.length ? (
          <div className="mt-4 space-y-3">
            {message.citations.map((citation) => (
              <CitationCard key={citation.chunkId} citation={citation} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
