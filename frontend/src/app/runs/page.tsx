import { fetchRuns } from '@/lib/api';
import RunsTable from '@/components/RunsTable';
import Pagination from '@/components/Pagination';
import RunsFilterBar from '@/components/RunsFilterBar';

export default async function RunsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const urlParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) value.forEach(v => urlParams.append(key, v));
    else if (value !== undefined) urlParams.append(key, value);
  });

  if (!urlParams.has('page')) urlParams.set('page', '1');
  if (!urlParams.has('page_size')) urlParams.set('page_size', '25');

  try {
    const data = await fetchRuns(urlParams);
    const activeFilters = [...urlParams.entries()]
      .filter(([k]) => !['page', 'page_size', 'sort_by', 'sort_order'].includes(k)).length;

    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Runs Explorer</h1>
            <p className="text-slate-400 mt-1 text-sm">
              Browse, filter, and inspect every agent execution trace
            </p>
          </div>
          <div className="flex items-center gap-3">
            {activeFilters > 0 && (
              <span className="px-2.5 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-semibold rounded-full border border-cyan-500/20">
                {activeFilters} filter{activeFilters !== 1 ? 's' : ''} active
              </span>
            )}
            <div className="px-4 py-2 glass rounded-xl text-sm text-slate-400">
              <span className="text-white font-semibold">{data.total}</span> results
            </div>
          </div>
        </div>

        <RunsFilterBar />
        <RunsTable items={data.items} />
        <Pagination total={data.total} page={data.page} pageSize={data.page_size} />
      </div>
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-red-400 mb-2">Failed to load runs</h2>
        <p className="text-slate-500 text-sm max-w-md">{msg}</p>
        <p className="text-slate-600 text-xs mt-2">Make sure NEXT_PUBLIC_API_URL is set correctly in your environment.</p>
      </div>
    );
  }
}
