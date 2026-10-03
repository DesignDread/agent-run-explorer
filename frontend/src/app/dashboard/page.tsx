import { fetchStats } from '@/lib/api';
import { RunsPerDayChart, SuccessRateChart, CostChart } from '@/components/DashboardCharts';

function StatCard({
  label, value, sub, color = 'cyan'
}: {
  label: string; value: string; sub?: string; color?: string;
}) {
  const gradients: Record<string, string> = {
    cyan: 'from-cyan-500/20 to-cyan-600/5 border-cyan-500/20',
    green: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/20',
    purple: 'from-violet-500/20 to-violet-600/5 border-violet-500/20',
    amber: 'from-amber-500/20 to-amber-600/5 border-amber-500/20',
    blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/20',
  };
  const textColors: Record<string, string> = {
    cyan: 'text-cyan-400', green: 'text-emerald-400',
    purple: 'text-violet-400', amber: 'text-amber-400', blue: 'text-blue-400',
  };

  return (
    <div className={`rounded-2xl border bg-gradient-to-br p-6 ${gradients[color]}`}>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{label}</p>
      <p className={`text-3xl font-black ${textColors[color]}`}>{value}</p>
      {sub && <p className="text-xs text-slate-600 mt-1">{sub}</p>}
    </div>
  );
}

function ChartCard({ title, children, note }: { title: string; children: React.ReactNode; note?: string }) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-semibold text-white">{title}</h3>
        {note && <span className="text-xs text-slate-600">{note}</span>}
      </div>
      {children}
    </div>
  );
}

export default async function DashboardPage() {
  let stats;
  try {
    stats = await fetchStats();
  } catch (e) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-red-400 mb-2">Failed to load dashboard</h2>
        <p className="text-slate-500 text-sm">Make sure the backend is running and NEXT_PUBLIC_API_URL is correct.</p>
      </div>
    );
  }

  const successPct = (stats.overall_success_rate * 100).toFixed(1);
  const medianSec = stats.median_duration_ms != null
    ? (stats.median_duration_ms / 1000).toFixed(1) + 's'
    : '—';
  const p95Sec = stats.p95_duration_ms != null
    ? (stats.p95_duration_ms / 1000).toFixed(1) + 's'
    : '—';
  const totalCost = stats.agents.reduce((s, a) => s + a.total_cost, 0).toFixed(3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
        <p className="text-slate-400 mt-1 text-sm">Aggregated metrics across all 201 agent runs</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard label="Total Runs" value={String(stats.total_runs)} color="cyan" />
        <StatCard label="Success Rate" value={`${successPct}%`} color="green" sub="Excl. running runs" />
        <StatCard label="Median Duration" value={medianSec} color="purple" />
        <StatCard label="P95 Duration" value={p95Sec} color="amber" sub="Slowest 5% threshold" />
        <StatCard label="Live Runs" value={String(stats.running_count)} color="blue" sub="Currently in progress" />
      </div>

      {/* Second row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="Completed Runs" value={String(stats.completed_runs_count)} color="green" />
        <StatCard label="Total Cost" value={`$${totalCost}`} color="amber" sub="Some runs have null cost" />
        <StatCard label="Active Agents" value={String(stats.agents.length)} color="purple" />
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="📅 Runs Per Day">
          <RunsPerDayChart data={stats.runs_per_day} />
        </ChartCard>
        <ChartCard title="✅ Success Rate by Agent">
          <SuccessRateChart agents={stats.agents} />
        </ChartCard>
      </div>

      <ChartCard title="💰 Total Cost by Agent" note="3 runs have null cost — excluded from totals">
        <CostChart agents={stats.agents} />
      </ChartCard>

      {/* ── Per-Agent Table ── */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800">
          <h3 className="font-semibold text-white">Agent Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/40">
                {['Agent', 'Runs', 'Succeeded', 'Success Rate', 'Total Cost', 'Null Costs'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {stats.agents.map((a, i) => (
                <tr key={a.agent} className="hover:bg-slate-900/40 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-medium text-slate-200">{a.agent}</span>
                  </td>
                  <td className="px-5 py-4 text-slate-400 font-mono">{a.run_count}</td>
                  <td className="px-5 py-4 text-emerald-400 font-mono">{a.success_count}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-800 rounded-full h-1.5 max-w-[80px]">
                        <div
                          className="h-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                          style={{ width: `${(a.success_rate * 100).toFixed(0)}%` }}
                        />
                      </div>
                      <span className="text-slate-300 font-mono text-xs">{(a.success_rate * 100).toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-amber-400 font-mono">${a.total_cost.toFixed(3)}</td>
                  <td className="px-5 py-4">
                    {a.null_cost_count > 0
                      ? <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-xs rounded-md">{a.null_cost_count} missing</span>
                      : <span className="text-slate-600 text-xs">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
