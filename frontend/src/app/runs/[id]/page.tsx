import { fetchRun } from '@/lib/api';
import StatusBadge from '@/components/StatusBadge';
import StepCard from '@/components/StepCard';
import ExplainButton from '@/components/ExplainButton';

export default async function RunDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    const run = await fetchRun(id);
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-4">
              Run Details <span className="text-gray-500 font-normal text-lg">#{run.id}</span>
            </h1>
            <p className="text-gray-400 mt-2">Agent: <span className="text-white">{run.agent}</span> | Model: <span className="text-white">{run.model}</span></p>
          </div>
          <StatusBadge status={run.status} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Duration</p>
            <p className="text-xl font-medium">{run.duration_ms !== null ? `${(run.duration_ms / 1000).toFixed(2)}s` : '-'}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Cost</p>
            <p className="text-xl font-medium">{run.cost_usd !== null ? `$${run.cost_usd.toFixed(4)}` : '-'}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Tokens</p>
            <p className="text-xl font-medium">{run.input_tokens + run.output_tokens} <span className="text-sm text-gray-500 font-normal">({run.input_tokens} in / {run.output_tokens} out)</span></p>
          </div>
        </div>

        {run.error && (
          <div className="mb-8 p-4 bg-red-950/50 border border-red-900 rounded-lg text-red-200">
            <h3 className="font-bold text-red-400 mb-2">Error: {run.error.type}</h3>
            <p className="font-mono text-sm">{run.error.message}</p>
            <p className="text-sm mt-2 opacity-75">Occurred at step index: {run.error.step_index}</p>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">Prompt</h2>
          <pre className="p-4 bg-gray-900 border border-gray-800 rounded-lg text-sm whitespace-pre-wrap font-mono text-gray-300">
            {run.prompt}
          </pre>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-4">Steps Timeline ({run.steps.length})</h2>
          <div className="space-y-4">
            {run.steps.map(step => (
              <StepCard key={step.index} step={step} />
            ))}
            {run.steps.length === 0 && <p className="text-gray-500">No steps recorded.</p>}
          </div>
        </div>

        <ExplainButton runId={run.id} />
      </div>
    );
  } catch (err: any) {
    return <div className="p-6 text-red-400">Error loading run: {err.message}</div>;
  }
}
