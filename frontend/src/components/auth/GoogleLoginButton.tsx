import { LogIn } from "lucide-react";

export function GoogleLoginButton() {
  return (
    <button
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50/40"
      onClick={() => {
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
      }}
      type="button"
    >
      <LogIn className="h-4 w-4" />
      Continue with Google
    </button>
  );
}
