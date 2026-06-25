"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  Clipboard,
  FileText,
  Lightbulb,
  ListTree,
  PenLine,
  Quote,
  Sparkles,
  Wand2,
} from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { ApiError } from "@/lib/api/client";
import {
  extractPaperInsights,
  formatCitation,
  generateAbstract,
  generateOutline,
  improveWriting,
  summarize,
} from "@/lib/api/writing";
import type { TargetLength, WritingGenericResponse, WritingImproveRequest, WritingTone } from "@/lib/api/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

const schema = z.object({
  tool: z.enum(["improve", "outline", "abstract", "summarize", "extract", "citation"]),
  inputText: z.string().min(5, "Input text must be at least 5 characters"),
  tone: z.enum(["ACADEMIC", "SIMPLE", "FORMAL", "CONCISE"]),
  targetLength: z.enum(["SHORT", "MEDIUM", "LONG"]),
});

type WritingValues = z.infer<typeof schema>;

const tools: Record<WritingValues["tool"], (data: WritingImproveRequest) => Promise<WritingGenericResponse>> = {
  improve: improveWriting,
  outline: generateOutline,
  abstract: generateAbstract,
  summarize,
  extract: extractPaperInsights,
  citation: formatCitation,
};

const toolOptions: Array<{
  value: WritingValues["tool"];
  title: string;
  description: string;
  icon: typeof Wand2;
}> = [
  {
    value: "improve",
    title: "Improve Academic Tone",
    description: "Refine wording while preserving meaning.",
    icon: Wand2,
  },
  {
    value: "outline",
    title: "Generate Outline",
    description: "Turn notes or a topic into a structured paper outline.",
    icon: ListTree,
  },
  {
    value: "abstract",
    title: "Generate Abstract",
    description: "Draft a concise academic abstract.",
    icon: FileText,
  },
  {
    value: "summarize",
    title: "Summarize",
    description: "Compress text into a clear academic summary.",
    icon: PenLine,
  },
  {
    value: "extract",
    title: "Extract Paper Insights",
    description: "Identify problem, methods, findings, limits, and future scope.",
    icon: Lightbulb,
  },
  {
    value: "citation",
    title: "Format Citation",
    description: "Format citation-like metadata in APA, IEEE, and MLA.",
    icon: Quote,
  },
];

export function WritingToolPanel() {
  const form = useForm<WritingValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      tool: "improve",
      inputText: "",
      tone: "ACADEMIC",
      targetLength: "MEDIUM",
    },
  });
  const selectedTool = useWatch({ control: form.control, name: "tool" });
  const mutation = useMutation({
    mutationFn: (values: WritingValues) =>
      tools[values.tool]({
        inputText: values.inputText,
        tone: values.tone as WritingTone,
        targetLength: values.targetLength as TargetLength,
      }),
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "Writing request failed");
    },
  });

  const currentTool = toolOptions.find((tool) => tool.value === selectedTool) ?? toolOptions[0];

  function copyOutput() {
    if (!mutation.data?.outputText || typeof navigator === "undefined") return;
    navigator.clipboard.writeText(mutation.data.outputText).then(() => {
      toast.success("Output copied");
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[330px_1fr]">
      <Card className="p-4">
        <h2 className="text-sm font-black uppercase tracking-[0.18em] text-indigo-600">
          Tool selector
        </h2>
        <div className="mt-4 grid gap-3">
          {toolOptions.map((tool) => {
            const Icon = tool.icon;
            const active = selectedTool === tool.value;
            return (
              <button
                className={cn(
                  "rounded-2xl border p-4 text-left transition hover:-translate-y-0.5",
                  active
                    ? "border-indigo-300 bg-gradient-to-br from-indigo-50 to-cyan-50 shadow-lg shadow-indigo-500/10"
                    : "border-slate-200 bg-white hover:border-indigo-200",
                )}
                key={tool.value}
                onClick={() => form.setValue("tool", tool.value)}
                type="button"
              >
                <div className="flex items-start gap-3">
                  <span className={cn("rounded-xl p-2", active ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600")}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-black text-slate-950">{tool.title}</span>
                    <span className="mt-1 block text-xs leading-5 text-slate-600">{tool.description}</span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <form
          className="space-y-5"
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white">
                <currentTool.icon className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-xl font-black text-slate-950">{currentTool.title}</h2>
                <p className="text-sm text-slate-600">{currentTool.description}</p>
              </div>
            </div>

            <label className="mt-6 block text-sm font-bold text-slate-700" htmlFor="inputText">
              Input text
            </label>
            <textarea
              className="mt-2 min-h-80 w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 shadow-sm focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-100"
              id="inputText"
              placeholder="Paste a paragraph, notes, citation metadata, or paper excerpt..."
              {...form.register("inputText")}
            />
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.inputText?.message}</p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-sm font-bold text-slate-700" htmlFor="tone">
                  Tone
                </label>
                <select
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                  id="tone"
                  {...form.register("tone")}
                >
                  <option value="ACADEMIC">Academic</option>
                  <option value="SIMPLE">Simple</option>
                  <option value="FORMAL">Formal</option>
                  <option value="CONCISE">Concise</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700" htmlFor="targetLength">
                  Target length
                </label>
                <select
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                  id="targetLength"
                  {...form.register("targetLength")}
                >
                  <option value="SHORT">Short</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LONG">Long</option>
                </select>
              </div>
            </div>

            <Button className="mt-6 w-full sm:w-auto" disabled={mutation.isPending} type="submit">
              <Sparkles className="h-4 w-4" />
              {mutation.isPending ? "Generating..." : "Generate"}
            </Button>
          </Card>
        </form>

        <Card className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-950">Output</h2>
              <p className="mt-1 text-sm text-slate-600">Generated academic writing result.</p>
            </div>
            <Button
              disabled={!mutation.data?.outputText}
              onClick={copyOutput}
              size="sm"
              type="button"
              variant="secondary"
            >
              <Clipboard className="h-4 w-4" />
              Copy
            </Button>
          </div>

          <div className="mt-5 min-h-96 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            {mutation.isPending ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/5" />
              </div>
            ) : (
              <div className="whitespace-pre-wrap text-sm leading-7 text-slate-800">
                {mutation.data?.outputText ?? "Output will appear here."}
              </div>
            )}
          </div>

          {mutation.data?.warnings.length ? (
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-900">
              {mutation.data.warnings.map((warning) => (
                <p key={warning}>{warning}</p>
              ))}
            </div>
          ) : null}

          {mutation.data?.usage ? (
            <div className="mt-4 grid gap-2 text-xs font-semibold text-slate-600 sm:grid-cols-3">
              <div className="rounded-xl bg-white p-3">Model: {mutation.data.usage.model}</div>
              <div className="rounded-xl bg-white p-3">Input: {mutation.data.usage.inputTokens}</div>
              <div className="rounded-xl bg-white p-3">Output: {mutation.data.usage.outputTokens}</div>
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
