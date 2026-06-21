"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertCircle, Sparkles } from "lucide-react";

import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { me } from "@/lib/api/auth";

export default function OAuthSuccessPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    me()
      .then((user) => {
        queryClient.setQueryData(["auth", "me"], user);
        router.replace("/dashboard");
      })
      .catch(() => {
        setFailed(true);
        window.setTimeout(() => router.replace("/login?error=oauth_failed"), 1200);
      });
  }, [queryClient, router]);

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/70 bg-white/85 p-8 text-center shadow-xl shadow-indigo-500/10 backdrop-blur">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white">
          {failed ? <AlertCircle className="h-7 w-7" /> : <Sparkles className="h-7 w-7" />}
        </div>
        <h1 className="mt-6 text-2xl font-black text-slate-950">
          {failed ? "OAuth login failed. Please try again." : "Completing Google login..."}
        </h1>
        <div className="mt-5 flex justify-center">
          <LoadingSpinner label={failed ? "Redirecting to login" : "Verifying session"} />
        </div>
      </div>
    </main>
  );
}
