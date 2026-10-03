import { fetchStats } from '@/lib/api';
import { RunsPerDayChart, SuccessRateChart, CostChart } from '@/components/DashboardCharts';
import DashboardAnimatedEntry from '@/components/DashboardAnimatedEntry';

function StatCard({
  label, value, sub, color = 'cyan', delay = 0,
}: {
  label: string; value: string; sub?: string; color?: string; delay?: number;
}) {
  const gradients: Record<string, string> = {
    cyan: 'from-cyan-500/10 to-cyan-600/5 border-cyan-500/20',
    green: 'from-emerald-500/10 to-emerald-600/5 border-emerald-500/20',
    purple: 'from-violet-500/10 to-violet-600/5 border-violet-500/20',
    amber: 'from-amber-500/10 to-amber-600/5 border-amber-500/20',
    blue: 'from-blue-500/10 to-blue-600/5 border-blue-500/20',
  };
  const textColors: Record<string, string> = {
    cyan: 'text-cyan-400', green: 'text-emerald-400',
    purple: 'text-violet-400', amber: 'text-amber-400', blue: 'text-blue-400',
  };

  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br p-6 ${gradients[color]}`}
      style={{ animationDelay: `${delay}ms` }}
    >
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
  } catch {
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
    ? (stats.median_duration_ms / 1000).toFixed(1) + 's' : '—';
  const p95Sec = stats.p95_duration_ms != null
    ? (stats.p95_duration_ms / 1000).toFixed(1) + 's' : '—';
  const totalCost = stats.agents.reduce((s, a) => s + a.total_cost, 0).toFixed(3);

  return (
    <DashboardAnimatedEntry stats={stats} successPct={successPct} medianSec={medianSec} p95Sec={p95Sec} totalCost={totalCost} />
  );
}
