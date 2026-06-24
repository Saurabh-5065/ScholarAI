"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Mail, LockKeyhole } from "lucide-react";

import { login } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { GoogleLoginButton } from "./GoogleLoginButton";
import { Button } from "@/components/ui/Button";

const schema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const form = useForm<LoginValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth"] });
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "Login failed");
    },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
    >
      <div>
        <label className="text-sm font-bold text-slate-700" htmlFor="email">
          Email
        </label>
        <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-100">
          <Mail className="h-4 w-4 text-slate-400" />
          <input
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            id="email"
            type="email"
            {...form.register("email")}
          />
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
          <input
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 focus:outline-none"
            id="password"
            type="password"
            {...form.register("password")}
          />
        </div>
        <p className="mt-1 text-xs text-red-600">
          {form.formState.errors.password?.message}
        </p>
      </div>
      <Button
        className="w-full"
        disabled={mutation.isPending}
        type="submit"
      >
        {mutation.isPending ? "Signing in..." : "Login"}
      </Button>
      <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        or
        <span className="h-px flex-1 bg-slate-200" />
      </div>
      <GoogleLoginButton />
    </form>
  );
}
