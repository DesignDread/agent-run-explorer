'use client';

import { useState } from 'react';
import { explainRun } from '@/lib/api';
import { cn } from '@/lib/utils';

export default function ExplainButton({ runId }: { runId: string }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleExplain = async () => {
    if (loading || done) return;
    setLoading(true);
    setError('');
    try {
      await explainRun(runId, (chunk) => setText(chunk));
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to explain run');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleExplain}
        disabled={loading || done}
        className={cn(
          "flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl border transition-all duration-200",
          done
            ? "bg-slate-800 border-slate-700 text-slate-500 cursor-default"
            : "bg-gradient-to-r from-violet-500/10 to-purple-600/10 border-violet-500/30 text-violet-400 hover:from-violet-500/20 hover:to-purple-600/20 hover:border-violet-500/50"
        )}
      >
        {loading ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-violet-400/40 border-t-violet-400 rounded-full animate-spin" />
            Generating explanation…
          </>
        ) : done ? (
          <>✅ Explanation ready</>
        ) : (
          <>🤖 Explain this run</>
        )}
      </button>

      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>
      )}

      {text && (
        <div className="glass rounded-xl p-5 border-violet-500/20">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">AI Explanation</span>
            {loading && <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />}
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">{text}</p>
        </div>
      )}
    </div>
  );
}
