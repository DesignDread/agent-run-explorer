import { fetchStats } from '@/lib/api';
import DashboardCharts from '@/components/DashboardCharts';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  try {
    const stats = await fetchStats();

    return (
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Total Runs</p>
            <p className="text-2xl font-semibold">{stats.total_runs}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Overall Success Rate</p>
            <p className="text-2xl font-semibold">{(stats.overall_success_rate * 100).toFixed(1)}%</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Median Duration</p>
            <p className="text-2xl font-semibold">{stats.median_duration_ms !== null ? `${(stats.median_duration_ms / 1000).toFixed(2)}s` : '-'}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">P95 Duration</p>
            <p className="text-2xl font-semibold">{stats.p95_duration_ms !== null ? `${(stats.p95_duration_ms / 1000).toFixed(2)}s` : '-'}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Currently Running</p>
            <p className="text-2xl font-semibold text-blue-400">{stats.running_count}</p>
          </div>
        </div>

        <DashboardCharts stats={stats} />
      </div>
    );
  } catch (err: any) {
    return <div className="p-6 text-red-400">Error loading stats: {err.message}</div>;
  }
}
