import React from 'react';

export default function StatusBadge({ status }: { status: string }) {
  let color = 'bg-gray-500/20 text-gray-400';
  let pulse = false;

  switch (status.toLowerCase()) {
    case 'succeeded':
      color = 'bg-green-500/20 text-green-400 border border-green-500/30';
      break;
    case 'failed':
      color = 'bg-red-500/20 text-red-400 border border-red-500/30';
      break;
    case 'cancelled':
      color = 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      break;
    case 'running':
      color = 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      pulse = true;
      break;
  }

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${color} ${pulse ? 'animate-pulse' : ''}`}>
      {status}
    </span>
  );
}
