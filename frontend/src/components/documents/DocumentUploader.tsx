"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UploadCloud } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";

import { uploadDocument } from "@/lib/api/documents";
import { ApiError } from "@/lib/api/client";

export function DocumentUploader({ projectId }: { projectId: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (file: File) => uploadDocument(projectId, file),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["documents", projectId] });
      toast.success("Upload started");
      setSelectedFile(null);
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "Upload failed");
    },
  });

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file.name);
      mutation.mutate(file);
    }
    event.target.value = "";
  }

  return (
    <div className="min-w-[min(100%,320px)] rounded-2xl border border-dashed border-indigo-300 bg-gradient-to-br from-white to-indigo-50/60 p-4 shadow-sm">
      <input
        accept=".pdf,.docx,.txt,.md,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown"
        className="hidden"
        onChange={onChange}
        ref={inputRef}
        type="file"
      />
      <button
        className="flex w-full flex-col items-center justify-center rounded-xl px-5 py-5 text-center transition hover:bg-white/70 disabled:opacity-60"
        disabled={mutation.isPending}
        onClick={() => inputRef.current?.click()}
        type="button"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/20">
          <UploadCloud className="h-6 w-6" />
        </span>
        <span className="mt-3 text-sm font-black text-slate-950">
          {mutation.isPending ? "Uploading..." : "Upload document"}
        </span>
        <span className="mt-1 text-xs text-slate-500">PDF, DOCX, TXT, MD</span>
        {selectedFile ? (
          <span className="mt-2 max-w-56 truncate rounded-full bg-white px-3 py-1 text-xs font-semibold text-indigo-700">
            {selectedFile}
          </span>
        ) : null}
      </button>
    </div>
  );
}
