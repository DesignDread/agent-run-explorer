'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent } from 'react';

export default function RunsFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    
    // Statuses
    const statuses = formData.getAll('status');
    statuses.forEach(s => params.append('status', s as string));
    
    // Agents
    const agents = formData.getAll('agent');
    agents.forEach(a => params.append('agent', a as string));

    const started_after = formData.get('started_after') as string;
    if (started_after) params.set('started_after', started_after);

    const started_before = formData.get('started_before') as string;
    if (started_before) params.set('started_before', started_before);

    const search = formData.get('search') as string;
    if (search) params.set('search', search);

    const sort_by = formData.get('sort_by') as string;
    if (sort_by) params.set('sort_by', sort_by);

    const sort_order = formData.get('sort_order') as string;
    if (sort_order) params.set('sort_order', sort_order);

    const tool = formData.get('tool') as string;
    if (tool && tool !== 'all') params.set('tool', tool);

    params.set('page', '1');
    
    router.push(`/runs?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 p-4 rounded-lg border border-gray-800 space-y-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
        <div>
          <label className="block mb-1 text-gray-400">Search Prompt</label>
          <input name="search" defaultValue={searchParams.get('search') || ''} className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white" placeholder="Search text..." />
        </div>
        <div>
          <label className="block mb-1 text-gray-400">Status</label>
          <div className="flex flex-wrap gap-2">
            {['succeeded', 'failed', 'cancelled', 'running'].map(st => (
              <label key={st} className="flex items-center gap-1">
                <input type="checkbox" name="status" value={st} defaultChecked={searchParams.getAll('status').includes(st)} className="bg-gray-800 border-gray-700" />
                <span className="capitalize">{st}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block mb-1 text-gray-400">Agent</label>
          <div className="flex flex-wrap gap-2">
            {['contract-reviewer', 'email-drafter', 'invoice-extractor', 'kpi-analyst', 'support-router'].map(ag => (
              <label key={ag} className="flex items-center gap-1">
                <input type="checkbox" name="agent" value={ag} defaultChecked={searchParams.getAll('agent').includes(ag)} className="bg-gray-800 border-gray-700" />
                <span>{ag}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
             <label className="block mb-1 text-gray-400">Started After</label>
             <input type="date" name="started_after" defaultValue={searchParams.get('started_after') || ''} className="w-full bg-gray-950 border border-gray-700 rounded px-2 py-1 text-white" />
          </div>
          <div className="flex-1">
             <label className="block mb-1 text-gray-400">Started Before</label>
             <input type="date" name="started_before" defaultValue={searchParams.get('started_before') || ''} className="w-full bg-gray-950 border border-gray-700 rounded px-2 py-1 text-white" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm border-t border-gray-800 pt-4">
        <div>
           <label className="mr-2 text-gray-400">Sort By</label>
           <select name="sort_by" defaultValue={searchParams.get('sort_by') || 'started_at'} className="bg-gray-950 border border-gray-700 rounded px-2 py-1">
             <option value="started_at">Started At</option>
             <option value="duration_ms">Duration</option>
             <option value="cost_usd">Cost</option>
           </select>
        </div>
        <div>
           <label className="mr-2 text-gray-400">Order</label>
           <select name="sort_order" defaultValue={searchParams.get('sort_order') || 'desc'} className="bg-gray-950 border border-gray-700 rounded px-2 py-1">
             <option value="desc">Descending</option>
             <option value="asc">Ascending</option>
           </select>
        </div>
        <div>
           <label className="mr-2 text-gray-400">Tool</label>
           <select name="tool" defaultValue={searchParams.get('tool') || 'all'} className="bg-gray-950 border border-gray-700 rounded px-2 py-1">
             <option value="all">All</option>
             <option value="llm">LLM</option>
             <option value="sql">SQL</option>
             <option value="http">HTTP</option>
             <option value="vector_search">Vector Search</option>
             <option value="none">None</option>
           </select>
        </div>
        <div className="ml-auto flex gap-2">
           <button type="button" onClick={() => router.push('/runs')} className="px-4 py-2 border border-gray-700 rounded hover:bg-gray-800">Clear</button>
           <button type="submit" className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">Apply Filters</button>
        </div>
      </div>
    </form>
  )
}
