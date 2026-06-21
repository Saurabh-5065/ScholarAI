"use client";

import { useQuery } from "@tanstack/react-query";

import { me } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: me,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 401) return false;
      return failureCount < 1;
    },
  });
}
