'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
  total: number;
  page: number;
  pageSize: number;
}

export default function Pagination({ total, page, pageSize }: Props) {
  const router = useRouter();
  const sp = useSearchParams();
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const go = (p: number) => {
    const params = new URLSearchParams(sp.toString());
    params.set('page', String(p));
    router.push(`/runs?${params.toString()}`);
  };

  if (total === 0) return null;

  return (
    <div className="flex items-center justify-between mt-6 px-1">
      <p className="text-sm text-slate-500">
        Showing <span className="text-slate-300 font-medium">{start}–{end}</span> of{' '}
        <span className="text-slate-300 font-medium">{total}</span> runs
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => go(page - 1)}
          disabled={page <= 1}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:text-white border border-slate-700 hover:border-slate-500 rounded-xl transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Prev
        </button>

        <span className="px-4 py-2 text-sm text-slate-400 border border-slate-800 rounded-xl bg-slate-900/50">
          {page} / {totalPages}
        </span>

        <button
          onClick={() => go(page + 1)}
          disabled={page >= totalPages}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:text-white border border-slate-700 hover:border-slate-500 rounded-xl transition-all"
        >
          Next
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
