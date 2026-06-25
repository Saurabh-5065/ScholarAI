"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { LockKeyhole, Mail, UserRound } from "lucide-react";

import { register } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/Button";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type RegisterValues = z.infer<typeof schema>;

export function RegisterForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const form = useForm<RegisterValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "" },
  });
  const mutation = useMutation({
    mutationFn: register,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth"] });
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "Registration failed");
    },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
    >
      <div>
        <label className="text-sm font-bold text-slate-700" htmlFor="name">
          Name
        </label>
        <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-100">
          <UserRound className="h-4 w-4 text-slate-400" />
          <input className="min-w-0 flex-1 bg-transparent text-sm focus:outline-none" id="name" {...form.register("name")} />
        </div>
        <p className="mt-1 text-xs text-red-600">
          {form.formState.errors.name?.message}
        </p>
      </div>
      <div>
        <label className="text-sm font-bold text-slate-700" htmlFor="email">
          Email
        </label>
        <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-100">
          <Mail className="h-4 w-4 text-slate-400" />
          <input className="min-w-0 flex-1 bg-transparent text-sm focus:outline-none" id="email" type="email" {...form.register("email")} />
        </div>
        <p className="mt-1 text-xs text-red-600">
          {form.formState.errors.email?.message}
        </p>
      </div>
      <div>
        <label className="text-sm font-bold text-slate-700" htmlFor="password">
          Password
        </label>
        <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-100">
          <LockKeyhole className="h-4 w-4 text-slate-400" />
          <input className="min-w-0 flex-1 bg-transparent text-sm focus:outline-none" id="password" type="password" {...form.register("password")} />
        </div>
        <p className="mt-1 text-xs text-slate-500">Use at least 8 characters.</p>
        <p className="mt-1 text-xs text-red-600">
          {form.formState.errors.password?.message}
        </p>
      </div>
      <Button className="w-full" disabled={mutation.isPending} type="submit">
        {mutation.isPending ? "Creating workspace..." : "Register"}
      </Button>
    </form>
  );
}
