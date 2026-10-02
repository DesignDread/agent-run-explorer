'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function Pagination({ total, page, pageSize }: { total: number, page: number, pageSize: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const totalPages = Math.ceil(total / pageSize);

  const goToPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', p.toString());
    router.push(`/runs?${params.toString()}`);
  };

  if (total === 0) return null;

  return (
    <div className="flex items-center justify-between mt-4 text-sm text-gray-400">
      <div>
        Showing <span className="font-medium text-gray-200">{start}</span> to <span className="font-medium text-gray-200">{end}</span> of <span className="font-medium text-gray-200">{total}</span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => goToPage(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => goToPage(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
