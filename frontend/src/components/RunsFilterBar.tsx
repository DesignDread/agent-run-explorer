'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent } from 'react';

const STATUSES = ['succeeded', 'failed', 'cancelled', 'running'];
const AGENTS = ['contract-reviewer', 'email-drafter', 'invoice-extractor', 'kpi-analyst', 'support-router'];
const TOOLS = ['all', 'llm', 'sql', 'http', 'vector_search', 'none'];

const statusColors: Record<string, string> = {
  succeeded: 'border-emerald-500/40 text-emerald-400 peer-checked:bg-emerald-500/15 peer-checked:border-emerald-500',
  failed: 'border-red-500/40 text-red-400 peer-checked:bg-red-500/15 peer-checked:border-red-500',
  cancelled: 'border-amber-500/40 text-amber-400 peer-checked:bg-amber-500/15 peer-checked:border-amber-500',
  running: 'border-blue-500/40 text-blue-400 peer-checked:bg-blue-500/15 peer-checked:border-blue-500',
};

export default function RunsFilterBar() {
  const router = useRouter();
  const sp = useSearchParams();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const p = new URLSearchParams();

    fd.getAll('status').forEach(s => p.append('status', s as string));
    fd.getAll('agent').forEach(a => p.append('agent', a as string));

    const after = fd.get('started_after') as string;
    if (after) p.set('started_after', after);

    const before = fd.get('started_before') as string;
    if (before) p.set('started_before', before);

    const search = fd.get('search') as string;
    if (search) p.set('search', search);

    const sortBy = fd.get('sort_by') as string;
    if (sortBy) p.set('sort_by', sortBy);

    const sortOrder = fd.get('sort_order') as string;
    if (sortOrder) p.set('sort_order', sortOrder);

    const tool = fd.get('tool') as string;
    if (tool && tool !== 'all') p.set('tool', tool);

    p.set('page', '1');
    router.push(`/runs?${p.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 mb-6 space-y-5">
      {/* Row 1: Search + Dates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="md:col-span-1">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Search Prompt</label>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              name="search"
              defaultValue={sp.get('search') || ''}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 transition-colors"
              placeholder="pipeline, renewal, invoice..."
            />
          </div>
        </div>

        {/* Date range */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Started After</label>
          <input
            type="date"
            name="started_after"
            defaultValue={sp.get('started_after') || ''}
            className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500/60 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Started Before</label>
          <input
            type="date"
            name="started_before"
            defaultValue={sp.get('started_before') || ''}
            className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500/60 transition-colors"
          />
        </div>
      </div>

      {/* Row 2: Status checkboxes */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Status</label>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map(st => {
            const checked = sp.getAll('status').includes(st);
            return (
              <label key={st} className="relative cursor-pointer">
                <input type="checkbox" name="status" value={st} defaultChecked={checked} className="peer sr-only" />
                <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold capitalize transition-all ${statusColors[st]} cursor-pointer`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    st === 'succeeded' ? 'bg-emerald-400' :
                    st === 'failed' ? 'bg-red-400' :
                    st === 'cancelled' ? 'bg-amber-400' : 'bg-blue-400'
                  }`} />
                  {st}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Row 3: Agents */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Agent</label>
        <div className="flex flex-wrap gap-2">
          {AGENTS.map(ag => {
            const checked = sp.getAll('agent').includes(ag);
            return (
              <label key={ag} className="relative cursor-pointer">
                <input type="checkbox" name="agent" value={ag} defaultChecked={checked} className="peer sr-only" />
                <span className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-medium text-slate-400 peer-checked:bg-slate-700 peer-checked:border-slate-500 peer-checked:text-white transition-all cursor-pointer">
                  {ag}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Row 4: Sort + Tool + Buttons */}
      <div className="flex flex-wrap items-end gap-4 border-t border-slate-800 pt-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Sort By</label>
          <select name="sort_by" defaultValue={sp.get('sort_by') || 'started_at'} className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500/60">
            <option value="started_at">Started At</option>
            <option value="duration_ms">Duration</option>
            <option value="cost_usd">Cost</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Order</label>
          <select name="sort_order" defaultValue={sp.get('sort_order') || 'desc'} className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500/60">
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Tool</label>
          <select name="tool" defaultValue={sp.get('tool') || 'all'} className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500/60">
            {TOOLS.map(t => <option key={t} value={t}>{t === 'all' ? 'All Tools' : t.replace('_', ' ').toUpperCase()}</option>)}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 ml-auto">
          <button
            type="button"
            onClick={() => router.push('/runs')}
            className="px-4 py-2 text-sm text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 rounded-xl transition-all"
          >
            Clear
          </button>
          <button
            type="submit"
            className="px-6 py-2 text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </form>
  );
}
