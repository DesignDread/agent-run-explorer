"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Boxes } from "@/components/ui/background-boxes";
import { BorderBeam } from "@/components/ui/border-beam";

// ─── Real data from the actual dataset ───────────────────────────────────────
const REAL_STATS = [
  { label: "Total Runs", value: "201", note: "exact count" },
  { label: "Agents Monitored", value: "5", note: "across all runs" },
  { label: "Date Range", value: "43", note: "days of data" },
  { label: "Trace Steps", value: "1,200+", note: "individual steps" },
];

const REAL_FEATURES = [
  {
    icon: "🔍",
    title: "Step-by-Step Trace Inspection",
    desc: "Every agent run stores each step with its tool, inputs, outputs, token counts, duration, and status — expandable in one click.",
  },
  {
    icon: "📊",
    title: "Live Analytics Dashboard",
    desc: "Charts for runs per day, success rate by agent, and total cost by agent — computed live from the 201-run dataset.",
  },
  {
    icon: "⚡",
    title: "Composable Filters",
    desc: "Filter by agent, status, date range, tool used, and free-text search on prompts — all filters compose with AND logic.",
  },
  {
    icon: "🤖",
    title: "Streaming AI Explanation",
    desc: "POST /api/runs/{id}/explain streams a natural-language explanation word by word — shows what happened and why it failed.",
  },
  {
    icon: "🛡️",
    title: "Data Irregularity Handling",
    desc: "Duplicate run_0031, negative duration on run_0064, null cost on 3 runs, empty steps on run_0089 — all handled gracefully.",
  },
  {
    icon: "📡",
    title: "Server-Sent Events",
    desc: "The explain endpoint uses FastAPI StreamingResponse with asyncio.sleep(0.05) between words — real SSE, not polling.",
  },
];

const AGENTS = [
  { name: "contract-reviewer", icon: "📋", color: "text-violet-400 border-violet-500/30 hover:border-violet-400" },
  { name: "email-drafter", icon: "✉️", color: "text-cyan-400 border-cyan-500/30 hover:border-cyan-400" },
  { name: "invoice-extractor", icon: "🧾", color: "text-emerald-400 border-emerald-500/30 hover:border-emerald-400" },
  { name: "kpi-analyst", icon: "📈", color: "text-amber-400 border-amber-500/30 hover:border-amber-400" },
  { name: "support-router", icon: "🎯", color: "text-rose-400 border-rose-500/30 hover:border-rose-400" },
];

// ─── Animation variants ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function HeroPage() {
  return (
    <div className="min-h-screen bg-slate-950 overflow-x-hidden">

      {/* ═══ HERO ═══════════════════════════════════════════════════════════ */}
      <section className="relative h-screen w-full overflow-hidden bg-slate-950 flex flex-col items-center justify-center">

        {/* Background boxes */}
        <Boxes />

        {/* Vignette */}
        <div className="absolute inset-0 z-20 [mask-image:radial-gradient(55%_55%_at_50%_50%,transparent,white)] bg-slate-950 pointer-events-none" />

        {/* Hero content */}
        <div className="relative z-30 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold tracking-widest uppercase"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Full-Stack Observability Platform
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-6xl md:text-8xl font-black text-white tracking-tight leading-[1.05] mb-6"
          >
            Agent Run
            <span className="block gradient-text">Explorer</span>
          </motion.h1>

          {/* Subtitle — only real facts */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed mb-12"
          >
            Inspect, filter, and understand{" "}
            <span className="text-white font-semibold">201 real agent run traces</span>{" "}
            across 5 agents — from raw step-level data to streaming AI explanations.
          </motion.p>

          {/* CTA Buttons with BorderBeam */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            {/* Primary button */}
            <Link href="/runs" className="relative group">
              <div className="relative overflow-hidden rounded-xl px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-base shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105">
                Explore 201 Runs
                <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform">→</span>
              </div>
              <BorderBeam size={120} duration={6} colorFrom="#38bdf8" colorTo="#818cf8" />
            </Link>

            {/* Secondary button */}
            <Link href="/dashboard" className="relative group">
              <div className="relative overflow-hidden rounded-xl px-8 py-4 bg-slate-900/80 text-white font-semibold text-base border border-slate-700 hover:border-slate-500 backdrop-blur-sm transition-all duration-300">
                <span className="mr-2">📊</span>View Analytics
              </div>
              <BorderBeam size={100} duration={9} delay={4} colorFrom="#818cf8" colorTo="#c084fc" />
            </Link>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 text-slate-600"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ REAL STATS BAR ════════════════════════════════════════════════ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={stagger}
        className="border-y border-slate-800/60 bg-slate-900/30 backdrop-blur-sm py-12"
      >
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {REAL_STATS.map((s, i) => (
            <motion.div key={s.label} variants={fadeUp} custom={i} className="flex flex-col gap-1">
              <div className="text-4xl font-black gradient-text">{s.value}</div>
              <div className="text-sm font-semibold text-slate-300">{s.label}</div>
              <div className="text-xs text-slate-600">{s.note}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ═══ FEATURES ══════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What you can actually do
          </h2>
          <p className="text-slate-500 text-base max-w-xl mx-auto">
            Everything below is real, built, deployed, and working on the live dataset.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {REAL_FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="glass rounded-2xl p-6 group cursor-default"
            >
              <div className="text-3xl mb-3 animate-float" style={{ animationDelay: `${i * 0.3}s` }}>{f.icon}</div>
              <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══ AGENTS ════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6 border-y border-slate-800/40 bg-slate-900/20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl font-bold text-white mb-2">5 Agents in the Dataset</h2>
            <p className="text-slate-500 text-sm">Click any agent to filter runs instantly.</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="flex flex-wrap justify-center gap-3"
          >
            {AGENTS.map((a, i) => (
              <motion.div key={a.name} variants={fadeUp} custom={i}>
                <Link
                  href={`/runs?agent=${a.name}`}
                  className={`relative flex items-center gap-2.5 px-5 py-3 glass rounded-xl border transition-all duration-200 ${a.color}`}
                >
                  <span>{a.icon}</span>
                  <span className="text-sm font-medium">{a.name}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ ENDPOINTS ═════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-2">4 Live API Endpoints</h2>
          <p className="text-slate-500 text-sm">Built with FastAPI + Pydantic v2. Auto-documented at /docs.</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="space-y-3"
        >
          {[
            { method: "GET", path: "/api/runs", desc: "Paginated list with 8 filter params + sort + search" },
            { method: "GET", path: "/api/runs/{id}", desc: "Full run detail with all steps included" },
            { method: "GET", path: "/api/stats", desc: "Aggregated stats: success rate, cost, duration percentiles" },
            { method: "POST", path: "/api/runs/{id}/explain", desc: "SSE streaming explanation, word-by-word" },
          ].map((ep, i) => (
            <motion.div
              key={ep.path}
              variants={fadeUp}
              custom={i}
              className="flex items-center gap-4 glass rounded-xl px-5 py-4"
            >
              <span className={`flex-shrink-0 px-2.5 py-1 text-xs font-black rounded-md font-mono ${
                ep.method === "GET"
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-violet-500/15 text-violet-400"
              }`}>
                {ep.method}
              </span>
              <span className="text-sm font-mono text-cyan-400 flex-shrink-0">{ep.path}</span>
              <span className="text-sm text-slate-500 hidden sm:block">{ep.desc}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══ BOTTOM CTA ════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Ready to explore?</h2>
          <p className="text-slate-500 mb-10 max-w-md mx-auto text-sm">
            201 real traces. 5 agents. Step-by-step breakdowns. Live right now.
          </p>
          <Link href="/runs" className="relative inline-block">
            <div className="relative rounded-xl px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg shadow-2xl shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all duration-300 hover:scale-105">
              Open Runs Explorer
            </div>
            <BorderBeam size={200} duration={8} colorFrom="#38bdf8" colorTo="#c084fc" />
          </Link>
        </motion.div>
      </section>

    </div>
  );
}
