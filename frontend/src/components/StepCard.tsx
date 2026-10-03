'use client';

import { useState } from 'react';
import { Step } from '@/lib/types';
import StatusBadge from './StatusBadge';
import { cn } from '@/lib/utils';

export default function StepCard({ step }: { step: Step }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      id={`step-${step.index}`}
      className={cn(
        "glass rounded-xl overflow-hidden transition-all duration-200",
        open ? "border-slate-600" : "hover:border-slate-700"
      )}
    >
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-slate-800/30 transition-colors"
      >
        {/* Step index */}
        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400">
          {step.index}
        </span>

        {/* Step name */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-semibold text-white">{step.name}</span>
            <span className="px-2 py-0.5 text-xs rounded-md bg-slate-800 text-slate-400 font-mono border border-slate-700">
              {step.tool}
            </span>
            <StatusBadge status={step.status} />
          </div>
          {step.duration_ms !== null && (
            <div className="text-xs text-slate-500 mt-0.5">
              {step.duration_ms < 1000 ? `${step.duration_ms}ms` : `${(step.duration_ms / 1000).toFixed(2)}s`}
              {step.tokens.input > 0 && ` · ${step.tokens.input}↑ ${step.tokens.output}↓ tokens`}
            </div>
          )}
        </div>

        {/* Chevron */}
        <svg
          className={cn("w-4 h-4 text-slate-500 transition-transform flex-shrink-0", open && "rotate-180")}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded content */}
      {open && (
        <div className="border-t border-slate-800 divide-y divide-slate-800">
          <div className="px-5 py-4">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Input</div>
            <pre className="text-xs text-slate-300 bg-slate-900/60 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap font-mono">
              {step.input || '—'}
            </pre>
          </div>
          {step.output && (
            <div className="px-5 py-4">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Output</div>
              <pre className="text-xs text-slate-300 bg-slate-900/60 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap font-mono">
                {step.output}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
