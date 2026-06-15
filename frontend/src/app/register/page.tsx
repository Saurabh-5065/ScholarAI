import Link from "next/link";
import { BookOpen, Sparkles } from "lucide-react";

import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
      <section className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -left-20 top-16 h-72 w-72 rounded-full bg-violet-500/30 blur-3xl" />
        <div className="absolute bottom-10 right-0 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
        <Link className="relative flex items-center gap-3" href="/">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="text-xl font-black">ScholarAI</span>
        </Link>
        <div className="relative max-w-xl">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-cyan-300">
            <BookOpen className="h-7 w-7" />
          </div>
          <h1 className="mt-6 text-5xl font-black tracking-tight">
            Build a workspace for every research direction.
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            Upload papers, organize ideas, and use grounded AI tools without
            leaving your ScholarAI research flow.
          </p>
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
            Create your ScholarAI workspace
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Start organizing papers, notes, and AI-assisted academic drafts.
          </p>
          <div className="mt-7">
            <RegisterForm />
          </div>
          <p className="mt-6 text-center text-sm text-slate-600">
          Already registered?{" "}
          <Link className="font-bold text-indigo-700 hover:text-indigo-900" href="/login">
            Login
          </Link>
        </p>
        </div>
      </section>
    </main>
  );
}
