'use client';

import { motion } from 'framer-motion';
import { RunsPerDayChart, SuccessRateChart, CostChart } from '@/components/DashboardCharts';
import { StatsResponse } from '@/lib/types';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: "easeOut" as const },
  }),
};

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };

interface Props {
  stats: StatsResponse;
  successPct: string;
  medianSec: string;
  p95Sec: string;
  totalCost: string;
}

export default function DashboardAnimatedEntry({ stats, successPct, medianSec, p95Sec, totalCost }: Props) {
  const statCards = [
    { label: 'Total Runs', value: String(stats.total_runs), color: 'cyan' },
    { label: 'Success Rate', value: `${successPct}%`, color: 'green', sub: 'Excl. running runs' },
    { label: 'Median Duration', value: medianSec, color: 'purple' },
    { label: 'P95 Duration', value: p95Sec, color: 'amber', sub: 'Slowest 5%' },
    { label: 'Live Runs', value: String(stats.running_count), color: 'blue', sub: 'Currently in progress' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
        <p className="text-slate-400 mt-1 text-sm">
          Aggregated metrics across all {stats.total_runs} agent runs
        </p>
      </motion.div>

      {/* Stat Cards */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
      >
        {statCards.map((card, i) => {
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
            <motion.div
              key={card.label}
              variants={fadeUp}
              custom={i}
              className={`rounded-2xl border bg-gradient-to-br p-6 ${gradients[card.color]}`}
            >
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{card.label}</p>
              <p className={`text-3xl font-black ${textColors[card.color]}`}>{card.value}</p>
              {card.sub && <p className="text-xs text-slate-600 mt-1">{card.sub}</p>}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Second stat row */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="grid grid-cols-2 md:grid-cols-3 gap-4"
      >
        {[
          { label: 'Completed Runs', value: String(stats.completed_runs_count), color: 'green' },
          { label: 'Total Cost', value: `$${totalCost}`, color: 'amber', sub: '3 runs have null cost' },
          { label: 'Active Agents', value: String(stats.agents.length), color: 'purple' },
        ].map((card, i) => {
          const gradients: Record<string, string> = {
            green: 'from-emerald-500/10 to-emerald-600/5 border-emerald-500/20',
            amber: 'from-amber-500/10 to-amber-600/5 border-amber-500/20',
            purple: 'from-violet-500/10 to-violet-600/5 border-violet-500/20',
          };
          const textColors: Record<string, string> = {
            green: 'text-emerald-400', amber: 'text-amber-400', purple: 'text-violet-400',
          };
          return (
            <motion.div
              key={card.label}
              variants={fadeUp}
              custom={i}
              className={`rounded-2xl border bg-gradient-to-br p-6 ${gradients[card.color]}`}
            >
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{card.label}</p>
              <p className={`text-3xl font-black ${textColors[card.color]}`}>{card.value}</p>
              {card.sub && <p className="text-xs text-slate-600 mt-1">{card.sub}</p>}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-4">📅 Runs Per Day</h3>
          <RunsPerDayChart data={stats.runs_per_day} />
        </div>
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-4">✅ Success Rate by Agent</h3>
          <SuccessRateChart agents={stats.agents} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-semibold text-white">💰 Total Cost by Agent</h3>
          <span className="text-xs text-slate-600">3 runs have null cost — excluded</span>
        </div>
        <CostChart agents={stats.agents} />
      </motion.div>

      {/* Agent table */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="glass rounded-2xl overflow-hidden"
      >
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
              {stats.agents.map((a) => (
                <tr key={a.agent} className="hover:bg-slate-900/40 transition-colors">
                  <td className="px-5 py-4 font-medium text-slate-200">{a.agent}</td>
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
      </motion.div>
    </div>
  );
}
