'use client';

import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from 'recharts';
import { StatsResponse } from '@/lib/types';

const AGENT_COLORS = ['#22d3ee', '#818cf8', '#34d399', '#fbbf24', '#f87171'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-4 py-3 text-sm shadow-xl">
      <p className="text-slate-400 text-xs mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || p.fill }} className="font-semibold">
          {p.name}: {typeof p.value === 'number' && p.value < 1 ? `${(p.value * 100).toFixed(1)}%` : p.value}
        </p>
      ))}
    </div>
  );
};

export function RunsPerDayChart({ data }: { data: { date: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={d => d.slice(5)} />
        <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="count" stroke="#22d3ee" strokeWidth={2} dot={false} name="Runs" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function SuccessRateChart({ agents }: { agents: StatsResponse['agents'] }) {
  const data = agents.map(a => ({
    name: a.agent.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' '),
    rate: parseFloat((a.success_rate * 100).toFixed(1)),
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 5, bottom: 40, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} angle={-30} textAnchor="end" />
        <YAxis tick={{ fill: '#64748b', fontSize: 10 }} domain={[0, 100]} tickFormatter={v => `${v}%`} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="rate" name="Success Rate" radius={[4, 4, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={AGENT_COLORS[i % AGENT_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function CostChart({ agents }: { agents: StatsResponse['agents'] }) {
  const data = agents.map(a => ({
    name: a.agent.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' '),
    cost: parseFloat(a.total_cost.toFixed(4)),
    nullCount: a.null_cost_count,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 5, bottom: 40, left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} angle={-30} textAnchor="end" />
        <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={v => `$${v}`} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="cost" name="Total Cost ($)" radius={[4, 4, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={AGENT_COLORS[i % AGENT_COLORS.length]} fillOpacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
