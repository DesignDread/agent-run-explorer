"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Boxes } from "@/components/ui/background-boxes";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Agent Runs", value: "201", suffix: "" },
  { label: "Success Rate", value: "71", suffix: "%" },
  { label: "Active Agents", value: "5", suffix: "" },
  { label: "Avg Duration", value: "24", suffix: "s" },
];

const features = [
  {
    icon: "🔍",
    title: "Deep Run Inspection",
    desc: "Drill into every step of an agent run — inputs, outputs, tokens, timings, and errors at a glance.",
  },
  {
    icon: "📊",
    title: "Analytics Dashboard",
    desc: "Visual breakdown of success rates, cost per agent, daily run volume, and P95 latency trends.",
  },
  {
    icon: "⚡",
    title: "Smart Filtering",
    desc: "Filter by agent, status, date range, tool, and full-text prompt search — all composed in real-time.",
  },
  {
    icon: "🤖",
    title: "AI Explanations",
    desc: "Streaming natural-language summaries of each run — what happened, why it failed, and what it cost.",
  },
];

const agents = [
  { name: "contract-reviewer", color: "from-violet-500 to-purple-700", icon: "📋" },
  { name: "email-drafter", color: "from-cyan-500 to-blue-700", icon: "✉️" },
  { name: "invoice-extractor", color: "from-emerald-500 to-teal-700", icon: "🧾" },
  { name: "kpi-analyst", color: "from-amber-500 to-orange-700", icon: "📈" },
  { name: "support-router", color: "from-rose-500 to-pink-700", icon: "🎯" },
];

function AnimatedCounter({ target, suffix }: { target: string; suffix: string }) {
  const [count, setCount] = useState(0);
  const end = parseInt(target);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const step = (end / duration) * 16;
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [end]);

  return <span>{count}{suffix}</span>;
}

export default function HeroPage() {
  return (
    <div className="min-h-screen bg-slate-950 overflow-x-hidden">
      {/* ═══ HERO SECTION ═══ */}
      <section className="relative h-[92vh] w-full overflow-hidden bg-slate-950 flex flex-col items-center justify-center">
        {/* Dark vignette overlay */}
        <div className="absolute inset-0 w-full h-full bg-slate-950 z-20 [mask-image:radial-gradient(60%_60%_at_50%_50%,transparent,white)] pointer-events-none" />

        {/* Background Boxes Animation */}
        <Boxes />

        {/* Hero content */}
        <div className="relative z-30 flex flex-col items-center text-center px-4 max-w-5xl mx-auto">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            AI Agent Observability Platform
          </div>

          {/* Logo + Title */}
          <div className="flex items-center gap-5 mb-6">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-cyan-500/40 shadow-2xl shadow-cyan-500/20">
              <Image src="/logo.png" alt="logo" fill className="object-cover" />
            </div>
            <div className="text-left">
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-none">
                Agent Run
              </h1>
              <h1 className="text-5xl md:text-7xl font-black gradient-text tracking-tight leading-none">
                Explorer
              </h1>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
            Debug AI agents at the speed of thought. Inspect every step, track costs,
            monitor success rates, and understand exactly why a run succeeded or failed.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/runs"
              className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-base rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105"
            >
              <span>Explore Runs</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-8 py-4 bg-slate-800/80 hover:bg-slate-700/80 text-white font-semibold text-base rounded-xl border border-slate-700 hover:border-slate-500 transition-all duration-300 backdrop-blur-sm"
            >
              <span>📊</span>
              <span>View Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 text-slate-500">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section className="border-y border-slate-800/60 bg-slate-900/40 backdrop-blur-sm py-10">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col gap-1">
              <div className="text-4xl font-black gradient-text">
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </div>
              <div className="text-sm text-slate-500 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything you need to understand your agents
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Built for developers who ship AI features and need real observability.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="glass rounded-2xl p-8 hover:border-cyan-500/20 transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:gradient-text transition-all">{f.title}</h3>
              <p className="text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ AGENTS SHOWCASE ═══ */}
      <section className="py-20 px-6 bg-slate-900/30 border-y border-slate-800/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">5 Agents, One Explorer</h2>
            <p className="text-slate-400">Monitor all your AI agents from a single place.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {agents.map((a) => (
              <Link
                key={a.name}
                href={`/runs?agent=${a.name}`}
                className="group flex items-center gap-3 px-6 py-3 glass rounded-xl hover:border-slate-600 transition-all duration-200 hover:-translate-y-0.5"
              >
                <span className="text-xl">{a.icon}</span>
                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{a.name}</span>
                <svg className="w-3 h-3 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA FOOTER ═══ */}
      <section className="py-24 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to explore?
        </h2>
        <p className="text-slate-400 mb-10 max-w-xl mx-auto">
          Dive into 201 real agent run traces with filtering, sorting, and AI-powered explanations.
        </p>
        <Link
          href="/runs"
          className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-lg rounded-xl shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all duration-300 hover:scale-105"
        >
          Get Started →
        </Link>
      </section>
    </div>
  );
}
