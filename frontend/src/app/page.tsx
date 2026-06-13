import {
  BookOpen,
  BrainCircuit,
  FileText,
  LockKeyhole,
  MessageSquareQuote,
  Sparkles,
} from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { GradientBackground } from "@/components/ui/GradientBackground";

const features = [
  {
    title: "Document RAG Q&A",
    description: "Ask focused questions over uploaded papers and research notes.",
    icon: BrainCircuit,
  },
  {
    title: "Academic Writing Assistant",
    description: "Improve tone, summarize papers, create outlines, and draft abstracts.",
    icon: Sparkles,
  },
  {
    title: "Citation-Aware Answers",
    description: "Review grounded citations with quotes, pages, scores, and sources.",
    icon: MessageSquareQuote,
  },
  {
    title: "Project-Based Workspace",
    description: "Keep papers, chats, and writing work organized by research topic.",
    icon: BookOpen,
  },
  {
    title: "Secure Cookie-Based Auth",
    description: "HttpOnly cookie sessions with CSRF protection through Spring Boot.",
    icon: LockKeyhole,
  },
  {
    title: "Google OAuth Login",
    description: "Start quickly with the Google OAuth flow managed by the API gateway.",
    icon: FileText,
  },
];

const workflow = ["Upload Papers", "Process Knowledge Base", "Ask Questions", "Generate Drafts"];

export default function Home() {
  return (
    <GradientBackground>
      <main>
        <section className="mx-auto grid min-h-[92vh] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/70 px-3 py-1.5 text-sm font-semibold text-indigo-700 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4" />
              AI research writing workspace
            </div>
            <h1 className="mt-7 max-w-4xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
                ScholarAI:
              </span>{" "}
              Your AI Research Writing Workspace
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Upload papers, ask grounded questions, generate academic drafts,
              and manage research projects in one intelligent workspace.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/register" size="lg">
                Get Started
              </ButtonLink>
              <ButtonLink href="/login" size="lg" variant="secondary">
                Login
              </ButtonLink>
            </div>
          </div>

          <Card className="relative overflow-hidden p-4 sm:p-6">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-300/30 blur-3xl" />
            <div className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-indigo-400/25 blur-3xl" />
            <div className="relative rounded-2xl border border-slate-200 bg-slate-950 p-4 text-white shadow-2xl shadow-indigo-500/20">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-bold">Fake News Detection Review</p>
                    <p className="text-xs text-slate-400">4 papers indexed</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                  READY
                </span>
              </div>
              <div className="mt-5 grid gap-3">
                <div className="rounded-xl bg-white/8 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                    Research question
                  </p>
                  <p className="mt-2 text-sm text-slate-200">
                    What is the main research gap across the uploaded papers?
                  </p>
                </div>
                <div className="rounded-xl bg-white p-4 text-slate-900">
                  <div className="flex items-center gap-2 text-sm font-bold text-indigo-700">
                    <BrainCircuit className="h-4 w-4" />
                    ScholarAI answer
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    The uploaded documents indicate a gap in robust
                    cross-domain evaluation and explainability for transformer
                    based fake news detection systems.
                  </p>
                  <div className="mt-4 rounded-lg border border-indigo-100 bg-indigo-50 p-3 text-xs text-indigo-900">
                    Source: paper.pdf, page 4, score 0.82
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  className="group p-6 transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10"
                  key={feature.title}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-cyan-100 text-indigo-700">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="mt-5 text-lg font-bold text-slate-950">{feature.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <Card className="p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-indigo-600">
                  Workflow
                </p>
                <h2 className="mt-3 text-3xl font-black text-slate-950">
                  From papers to grounded drafts
                </h2>
              </div>
              <div className="grid flex-1 gap-3 sm:grid-cols-4">
                {workflow.map((step, index) => (
                  <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4" key={step}>
                    <span className="text-xs font-black text-indigo-600">0{index + 1}</span>
                    <p className="mt-2 text-sm font-bold text-slate-900">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-20 text-center sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black tracking-tight text-slate-950">
            Start building your research workspace
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Organize your papers, ask better questions, and move academic writing
            forward with one focused workspace.
          </p>
          <div className="mt-7">
            <ButtonLink href="/register" size="lg">
              Get Started
            </ButtonLink>
          </div>
        </section>
      </main>
    </GradientBackground>
  );
}
