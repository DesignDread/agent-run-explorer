'use client';
import { useState } from 'react';
import { Step } from '@/lib/types';
import StatusBadge from './StatusBadge';

export default function StepCard({ step }: { step: Step }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div id={`step-${step.index}`} className="border border-gray-800 rounded-lg overflow-hidden bg-gray-900 mb-4">
      <button 
        onClick={() => setExpanded(!expanded)} 
        className="w-full flex items-center justify-between p-4 bg-gray-900 hover:bg-gray-800 transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <span className="font-mono text-gray-500 text-sm">#{step.index}</span>
          <span className="font-medium text-gray-200">{step.name}</span>
          <span className="text-xs text-gray-400 px-2 py-0.5 rounded-full bg-gray-800 border border-gray-700">{step.tool}</span>
          <StatusBadge status={step.status} />
        </div>
        <div className="flex gap-4 text-sm text-gray-400">
          <span>{step.duration_ms !== null ? `${step.duration_ms}ms` : '-'}</span>
          <span>{step.tokens.input + step.tokens.output} tokens</span>
        </div>
      </button>
      {expanded && (
        <div className="p-4 border-t border-gray-800 bg-gray-950">
          <div className="mb-4">
            <h4 className="text-xs font-semibold uppercase text-gray-500 mb-2">Input</h4>
            <pre className="text-xs text-gray-300 bg-gray-900 p-3 rounded overflow-x-auto border border-gray-800 whitespace-pre-wrap">{step.input}</pre>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase text-gray-500 mb-2">Output</h4>
            {step.output ? (
              <pre className="text-xs text-gray-300 bg-gray-900 p-3 rounded overflow-x-auto border border-gray-800 whitespace-pre-wrap">{step.output}</pre>
            ) : (
              <p className="text-sm text-gray-500 italic">No output</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
