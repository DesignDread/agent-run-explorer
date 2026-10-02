import { fetchRuns } from '@/lib/api';
import RunsTable from '@/components/RunsTable';
import Pagination from '@/components/Pagination';
import RunsFilterBar from '@/components/RunsFilterBar';

export default async function RunsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  
  // Convert searchParams to URLSearchParams format for API call
  const urlParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => urlParams.append(key, v));
    } else if (value !== undefined) {
      urlParams.append(key, value);
    }
  });
  
  if (!urlParams.has('page')) urlParams.set('page', '1');
  if (!urlParams.has('page_size')) urlParams.set('page_size', '25');

  try {
    const data = await fetchRuns(urlParams);
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Runs Explorer</h1>
        <RunsFilterBar />
        <RunsTable items={data.items} />
        <Pagination total={data.total} page={data.page} pageSize={data.page_size} />
      </div>
    );
  } catch (err: any) {
    return <div className="p-6 text-red-400">Error loading runs: {err.message}</div>;
  }
}
