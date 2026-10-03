'use client';

import Link from 'next/link';
import StatusBadge from './StatusBadge';
import { RunSummary } from '@/lib/types';

function fmt(ms: number | null): string {
  if (ms === null || ms === undefined) return '—';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function fmtCost(c: number | null): string {
  if (c === null || c === undefined) return '—';
  return `$${c.toFixed(4)}`;
}

function fmtDate(s: string): string {
  return new Date(s).toLocaleString('en-IN', {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

const agentColors: Record<string, string> = {
  'contract-reviewer': 'text-violet-400 bg-violet-500/10',
  'email-drafter': 'text-cyan-400 bg-cyan-500/10',
  'invoice-extractor': 'text-emerald-400 bg-emerald-500/10',
  'kpi-analyst': 'text-amber-400 bg-amber-500/10',
  'support-router': 'text-rose-400 bg-rose-500/10',
};

export default function RunsTable({ items }: { items: RunSummary[] }) {
  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-lg font-semibold text-slate-300 mb-1">No runs match your filters</h3>
        <p className="text-slate-500 text-sm">Try adjusting your search or removing some filters.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-800 overflow-hidden">
      {/* Table header */}
      <div className="grid grid-cols-[1fr_140px_100px_1fr_80px_80px_130px] gap-4 px-5 py-3 bg-slate-900/60 border-b border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
        <div>Run ID</div>
        <div>Agent</div>
        <div>Status</div>
        <div>Prompt</div>
        <div>Duration</div>
        <div>Cost</div>
        <div>Started</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-slate-800/60">
        {items.map((run) => {
          const agentClass = agentColors[run.agent] ?? 'text-slate-400 bg-slate-800/40';
          return (
            <Link
              key={run.id}
              href={`/runs/${run.id}`}
              className="grid grid-cols-[1fr_140px_100px_1fr_80px_80px_130px] gap-4 px-5 py-4 bg-slate-950/40 hover:bg-slate-900/60 transition-all duration-150 group items-center"
            >
              {/* Run ID */}
              <div className="font-mono text-xs text-cyan-400 group-hover:text-cyan-300 transition-colors truncate">
                {run.id}
              </div>

              {/* Agent */}
              <div>
                <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium ${agentClass}`}>
                  {run.agent.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}
                </span>
              </div>

              {/* Status */}
              <div><StatusBadge status={run.status} /></div>

              {/* Prompt */}
              <div className="text-sm text-slate-400 truncate group-hover:text-slate-300 transition-colors">
                {run.prompt.length > 70 ? run.prompt.slice(0, 70) + '…' : run.prompt}
              </div>

              {/* Duration */}
              <div className="text-sm text-slate-400 font-mono">{fmt(run.duration_ms)}</div>

              {/* Cost */}
              <div className="text-sm text-slate-400 font-mono">{fmtCost(run.cost_usd)}</div>

              {/* Started */}
              <div className="text-xs text-slate-500">{fmtDate(run.started_at)}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
