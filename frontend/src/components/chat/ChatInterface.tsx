"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BrainCircuit, FileText, MessageSquareText, Send, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { createChatSession, getChatSession, listChatSessions, sendChatMessage } from "@/lib/api/chat";
import { listDocuments } from "@/lib/api/documents";
import { ApiError } from "@/lib/api/client";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { MessageBubble } from "./MessageBubble";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const schema = z.object({
  message: z.string().min(1, "Message is required"),
});

type ChatValues = z.infer<typeof schema>;

const promptChips = [
  "What is the research gap?",
  "Summarize the methodology",
  "List the limitations",
  "Compare key findings",
];

export function ChatInterface({ projectId }: { projectId: string }) {
  const queryClient = useQueryClient();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const form = useForm<ChatValues>({
    resolver: zodResolver(schema),
    defaultValues: { message: "" },
  });
  const sessions = useQuery({
    queryKey: ["chatSessions", projectId],
    queryFn: () => listChatSessions(projectId),
  });
  const activeSessionId = sessionId ?? sessions.data?.items[0]?.id ?? null;
  const createSession = useMutation({
    mutationFn: () => createChatSession(projectId, { title: "New Chat" }),
    onSuccess: async (session) => {
      setSessionId(session.id);
      await queryClient.invalidateQueries({ queryKey: ["chatSessions", projectId] });
    },
  });

  useEffect(() => {
    if (!sessions.data) return;
    const first = sessions.data.items[0];
    if (!first && !createSession.isPending && !sessionId) createSession.mutate();
  }, [createSession, sessionId, sessions.data]);

  const session = useQuery({
    queryKey: ["chatSession", projectId, activeSessionId],
    queryFn: () => getChatSession(projectId, activeSessionId ?? ""),
    enabled: Boolean(activeSessionId),
  });
  const documents = useQuery({
    queryKey: ["documents", projectId],
    queryFn: () => listDocuments(projectId),
  });
  const readyDocuments = useMemo(
    () => (documents.data?.items ?? []).filter((doc) => doc.status === "READY"),
    [documents.data],
  );
  const sendMessage = useMutation({
    mutationFn: (values: ChatValues) =>
      sendChatMessage(projectId, activeSessionId ?? "", {
        message: values.message,
        documentIds: selectedDocuments,
        topK: 8,
      }),
    onSuccess: async () => {
      form.reset();
      await queryClient.invalidateQueries({ queryKey: ["chatSession", projectId, activeSessionId] });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "Message failed");
    },
  });

  if (sessions.isLoading || createSession.isPending) {
    return <LoadingSpinner label="Preparing chat" />;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[260px_1fr_300px]">
      <Card className="p-4">
        <h2 className="flex items-center gap-2 font-black text-slate-950">
          <MessageSquareText className="h-5 w-5 text-indigo-600" />
          Sessions
        </h2>
        <div className="mt-4 space-y-2">
          {(sessions.data?.items ?? []).map((item) => (
            <button
              className={`w-full rounded-xl px-3 py-2 text-left text-sm font-semibold transition ${
                item.id === activeSessionId
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-50 text-slate-700 hover:bg-indigo-50"
              }`}
              key={item.id}
              onClick={() => setSessionId(item.id)}
              type="button"
            >
              {item.title}
            </button>
          ))}
        </div>
      </Card>

      <Card className="flex min-h-[620px] flex-col overflow-hidden bg-slate-50/70 p-0">
        <div className="border-b border-white/80 bg-white/80 px-5 py-4">
          <h2 className="flex items-center gap-2 font-black text-slate-950">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            ScholarAI research chat
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Select documents to ground the answer.
          </p>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
          {session.isLoading ? (
            <LoadingSpinner label="Loading messages" />
          ) : (session.data?.messages ?? []).length ? (
            (session.data?.messages ?? []).map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))
          ) : (
            <div className="flex min-h-[360px] items-center justify-center">
              <div className="max-w-lg text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white">
                  <BrainCircuit className="h-8 w-8" />
                </div>
                <h3 className="mt-5 text-xl font-black text-slate-950">
                  Ask your first research question
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Use READY documents as sources, then ask about methodology,
                  findings, research gaps, or limitations.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {promptChips.map((prompt) => (
                    <button
                      className="rounded-full border border-indigo-100 bg-white px-3 py-2 text-xs font-bold text-indigo-700 shadow-sm hover:bg-indigo-50"
                      key={prompt}
                      onClick={() => form.setValue("message", prompt)}
                      type="button"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {sendMessage.isPending ? (
            <div className="flex items-center gap-2 text-sm font-semibold text-indigo-700">
              <Sparkles className="h-4 w-4 animate-pulse" />
              ScholarAI is thinking...
            </div>
          ) : null}
        </div>
        <form
          className="sticky bottom-0 border-t border-white/80 bg-white/90 p-4 backdrop-blur"
          onSubmit={form.handleSubmit((values) => sendMessage.mutate(values))}
        >
          <div className="flex gap-2">
            <textarea
              className="min-h-12 flex-1 resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-100"
              placeholder="Ask about methodology, gaps, findings..."
              rows={1}
              {...form.register("message")}
            />
            <Button
              disabled={!activeSessionId || sendMessage.isPending}
              type="submit"
            >
              <Send className="h-4 w-4" />
              Send
            </Button>
          </div>
          <p className="mt-1 text-xs text-red-600">{form.formState.errors.message?.message}</p>
        </form>
      </Card>

      <Card className="p-4">
        <h2 className="flex items-center gap-2 font-black text-slate-950">
          <FileText className="h-5 w-5 text-indigo-600" />
          Sources
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          {selectedDocuments.length} selected. Select documents to ground the answer.
        </p>
        <div className="mt-4 space-y-2">
          {readyDocuments.map((doc) => (
            <label
              className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm"
              key={doc.id}
            >
              <input
                checked={selectedDocuments.includes(doc.id)}
                className="mt-1 accent-indigo-600"
                onChange={(event) => {
                  setSelectedDocuments((current) =>
                    event.target.checked
                      ? [...current, doc.id]
                      : current.filter((id) => id !== doc.id),
                  );
                }}
                type="checkbox"
              />
              <span>{doc.originalFilename}</span>
            </label>
          ))}
          {!readyDocuments.length ? (
            <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
              No READY documents yet.
            </p>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
