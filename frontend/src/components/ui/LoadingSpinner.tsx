import { Loader2 } from "lucide-react";

export function LoadingSpinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
      <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
      <span>{label}</span>
    </div>
  );
}
