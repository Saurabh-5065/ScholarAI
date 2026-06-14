"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

import { ApiError } from "@/lib/api/client";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isLoading, error, data } = useCurrentUser();

  useEffect(() => {
    if (error instanceof ApiError && error.status === 401) {
      router.replace("/login");
    }
  }, [error, router]);

  if (isLoading) {
    return (
      <main className="mx-auto flex max-w-6xl px-4 py-10">
        <LoadingSpinner label="Checking session" />
      </main>
    );
  }

  if (!data) return null;

  return <>{children}</>;
}
