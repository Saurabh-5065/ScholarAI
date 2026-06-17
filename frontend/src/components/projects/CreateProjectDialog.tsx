"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { createProject } from "@/lib/api/projects";
import { ApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

type ProjectValues = z.infer<typeof schema>;

export function CreateProjectDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm<ProjectValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", description: "" },
  });
  const mutation = useMutation({
    mutationFn: createProject,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
      form.reset();
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "Project creation failed");
    },
  });

  return (
    <div>
      <Button
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <Plus className="h-4 w-4" />
        New project
      </Button>
      {open ? (
        <form
          className="mt-4"
          onSubmit={form.handleSubmit((values) =>
            mutation.mutate({
              title: values.title,
              description: values.description || null,
            }),
          )}
        >
          <Card className="w-full min-w-[min(90vw,360px)] p-5">
            <label className="text-sm font-bold text-slate-700" htmlFor="title">
              Title
            </label>
            <input
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-100"
              id="title"
              {...form.register("title")}
            />
            <p className="mt-1 text-xs text-red-600">
              {form.formState.errors.title?.message}
            </p>
            <label className="mt-4 block text-sm font-bold text-slate-700" htmlFor="description">
              Description
            </label>
            <textarea
              className="mt-2 min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-100"
              id="description"
              {...form.register("description")}
            />
            <div className="mt-4 flex gap-2">
              <Button disabled={mutation.isPending} size="sm" type="submit">
                {mutation.isPending ? "Creating..." : "Create"}
              </Button>
              <Button
                onClick={() => setOpen(false)}
                size="sm"
                type="button"
                variant="secondary"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </form>
      ) : null}
    </div>
  );
}
