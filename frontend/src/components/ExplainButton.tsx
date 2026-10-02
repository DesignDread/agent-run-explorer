'use client';
import { useState } from 'react';
import { explainRun } from '@/lib/api';

export default function ExplainButton({ runId }: { runId: string }) {
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [started, setStarted] = useState(false);

  const handleExplain = async () => {
    setStarted(true);
    setLoading(true);
    setError('');
    setExplanation('');
    
    try {
      await explainRun(runId, (text) => {
        setExplanation(text);
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 border-t border-gray-800 pt-8">
      {!started ? (
        <button 
          onClick={handleExplain}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-medium flex items-center gap-2 transition-colors"
        >
          Explain this run
        </button>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            AI Explanation
            {loading && <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>}
          </h3>
          {error ? (
            <p className="text-red-400 text-sm">{error}</p>
          ) : (
            <div className="prose prose-invert max-w-none text-sm text-gray-300">
              {explanation || 'Generating explanation...'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
