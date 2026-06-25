"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

import { ApiError } from "@/lib/api/client";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isLoading, error, data, refetch } = useCurrentUser();
  const [revalidating, setRevalidating] = useState(false);

  // Re-validate the session whenever the page is shown again — most importantly
  // when it is restored from the browser's back-forward cache (bfcache). The
  // bfcache restores a frozen snapshot (including the cached user) without
  // re-running queries, so without this a logged-out user could press "Back"
  // and momentarily land on an authenticated page. We gate rendering while the
  // check is in flight so stale content is never shown.
  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      setRevalidating(true);
      void refetch().finally(() => setRevalidating(false));
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [refetch]);

  // Redirect to login whenever the session is missing or invalid.
  const unauthenticated =
    (error instanceof ApiError && error.status === 401) ||
    (!isLoading && !data && error != null);

  useEffect(() => {
    if (unauthenticated) {
      router.replace("/login");
    }
  }, [unauthenticated, router]);

  if (isLoading || revalidating) {
    return (
      <main className="mx-auto flex max-w-6xl px-4 py-10">
        <LoadingSpinner label="Checking session" />
      </main>
    );
  }

  if (!data || unauthenticated) return null;

  return <>{children}</>;
}
