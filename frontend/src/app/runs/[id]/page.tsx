import { fetchRun } from '@/lib/api';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';
import StepCard from '@/components/StepCard';
import ExplainButton from '@/components/ExplainButton';

function MetaCard({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</div>
      <div className={`text-sm text-slate-200 break-all ${mono ? 'font-mono' : 'font-medium'}`}>{value}</div>
    </div>
  );
}

export default async function RunDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let run;
  try {
    run = await fetchRun(id);
  } catch {
    notFound();
  }

  const durationFmt = run.duration_ms != null
    ? run.duration_ms < 1000 ? `${run.duration_ms}ms` : `${(run.duration_ms / 1000).toFixed(2)}s`
    : '—';

  const costFmt = run.cost_usd != null ? `$${run.cost_usd.toFixed(4)}` : '—';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">

      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/runs" className="hover:text-cyan-400 transition-colors">Runs</Link>
        <span>/</span>
        <span className="font-mono text-slate-300">{run.id}</span>
      </div>

      {/* ── Header ── */}
      <div className="glass rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between mb-5">
          <div>
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h1 className="text-2xl font-bold text-white font-mono">{run.id}</h1>
              <StatusBadge status={run.status} />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">{run.prompt}</p>
          </div>
          <div className="flex-shrink-0">
            <ExplainButton runId={run.id} />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-800">
          {[
            { label: 'Duration', value: durationFmt },
            { label: 'Cost', value: costFmt },
            { label: 'Input Tokens', value: run.input_tokens.toLocaleString() },
            { label: 'Output Tokens', value: run.output_tokens.toLocaleString() },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-xl font-bold gradient-text">{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Error banner ── */}
      {run.error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🚨</span>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-red-400">Error at step {run.error.step_index}</span>
                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-md font-mono">{run.error.type}</span>
              </div>
              <p className="text-sm text-slate-300">{run.error.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Data warnings ── */}
      {run.data_warnings?.length > 0 && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">⚠️ Data Quality Warnings</div>
          {run.data_warnings.map((w, i) => (
            <p key={i} className="text-sm text-slate-400 font-mono">{w}</p>
          ))}
        </div>
      )}

      {/* ── Metadata grid ── */}
      <div>
        <h2 className="text-base font-semibold text-slate-300 mb-3">Run Metadata</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <MetaCard label="Agent" value={run.agent} />
          <MetaCard label="Model" value={run.model} />
          <MetaCard label="Tenant" value={run.tenant_id} />
          <MetaCard label="Status" value={run.status} />
          <MetaCard label="Started At" value={new Date(run.started_at).toLocaleString()} />
          {run.ended_at && <MetaCard label="Ended At" value={new Date(run.ended_at).toLocaleString()} />}
          <MetaCard label="Steps" value={`${run.steps.length} step${run.steps.length !== 1 ? 's' : ''}`} />
          <MetaCard label="Cost" value={costFmt} mono />
        </div>
      </div>

      {/* ── Steps timeline ── */}
      <div>
        <h2 className="text-base font-semibold text-slate-300 mb-3">
          Execution Timeline
          <span className="ml-2 text-xs text-slate-600 font-normal">Click a step to expand</span>
        </h2>

        {run.steps.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center text-slate-500">
            <div className="text-4xl mb-2">📭</div>
            <p>No steps recorded for this run.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-4 bottom-4 w-px bg-gradient-to-b from-cyan-500/20 via-slate-700/40 to-slate-800/20 z-0" />
            <div className="space-y-3 relative z-10">
              {run.steps.map(step => (
                <StepCard key={step.index} step={step} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Back button ── */}
      <div className="pb-8">
        <Link
          href="/runs"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-cyan-400 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Runs
        </Link>
      </div>
    </div>
  );
}
