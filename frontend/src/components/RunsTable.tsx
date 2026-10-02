'use client';

import { RunSummary } from '@/lib/types';
import Link from 'next/link';
import StatusBadge from './StatusBadge';

export default function RunsTable({ items }: { items: RunSummary[] }) {
  if (items.length === 0) {
    return <div className="text-center py-10 text-gray-400">No runs match your filters.</div>;
  }

  return (
    <div className="overflow-x-auto border border-gray-800 rounded-lg">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-gray-900 border-b border-gray-800">
          <tr>
            <th className="p-4 font-medium">ID</th>
            <th className="p-4 font-medium">Agent</th>
            <th className="p-4 font-medium">Status</th>
            <th className="p-4 font-medium">Prompt</th>
            <th className="p-4 font-medium">Duration</th>
            <th className="p-4 font-medium">Cost</th>
            <th className="p-4 font-medium">Started At</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800 bg-gray-950">
          {items.map((run) => (
            <tr key={run.id} className="hover:bg-gray-900 transition-colors">
              <td className="p-4"><Link href={`/runs/${run.id}`} className="text-blue-400 hover:underline font-mono">{run.id}</Link></td>
              <td className="p-4">{run.agent}</td>
              <td className="p-4"><StatusBadge status={run.status} /></td>
              <td className="p-4 max-w-xs truncate" title={run.prompt}>
                {run.prompt.length > 80 ? run.prompt.substring(0, 80) + '...' : run.prompt}
              </td>
              <td className="p-4">{run.duration_ms !== null ? `${(run.duration_ms / 1000).toFixed(2)}s` : '-'}</td>
              <td className="p-4">{run.cost_usd !== null ? `$${run.cost_usd.toFixed(4)}` : '-'}</td>
              <td className="p-4">{new Date(run.started_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
