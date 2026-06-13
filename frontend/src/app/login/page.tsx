import Link from "next/link";
import { CheckCircle2, Sparkles } from "lucide-react";

import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
      <section className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -left-20 top-16 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute bottom-10 right-0 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
        <Link className="relative flex items-center gap-3" href="/">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="text-xl font-black">ScholarAI</span>
        </Link>
        <div className="relative max-w-xl">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyan-300">
            Academic AI workspace
          </p>
          <h1 className="mt-5 text-5xl font-black tracking-tight">
            Return to your research command center.
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            Continue grounded document Q&A, structured writing work, and
            project-based academic workflows.
          </p>
          <div className="mt-8 space-y-3 text-sm text-slate-200">
            {["Cookie-secured sessions", "Google OAuth support", "Citation-aware AI responses"].map((item) => (
              <div className="flex items-center gap-3" key={item}>
                <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-white/70 bg-white/85 p-6 shadow-xl shadow-indigo-500/10 backdrop-blur sm:p-8">
          <Link className="mb-8 flex items-center gap-2 lg:hidden" href="/">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="text-lg font-black text-slate-950">ScholarAI</span>
          </Link>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">
            Welcome back
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Continue your academic writing workspace
          </p>
          <div className="mt-7">
            <LoginForm />
          </div>
          <p className="mt-6 text-center text-sm text-slate-600">
          No account?{" "}
          <Link className="font-bold text-indigo-700 hover:text-indigo-900" href="/register">
            Register
          </Link>
        </p>
        </div>
      </section>
    </main>
  );
}
