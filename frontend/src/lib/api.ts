import { PaginatedResponse, Run, StatsResponse } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://agent-run-explorer-backend.vercel.app';

export async function fetchRuns(params: URLSearchParams): Promise<PaginatedResponse> {
  const res = await fetch(`${API_BASE}/api/runs?${params.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch runs');
  return res.json();
}

export async function fetchRun(id: string): Promise<Run> {
  const res = await fetch(`${API_BASE}/api/runs/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    if (res.status === 404) throw new Error(`Run "${id}" not found`);
    throw new Error('Failed to fetch run');
  }
  return res.json();
}

export async function fetchStats(): Promise<StatsResponse> {
  const res = await fetch(`${API_BASE}/api/stats`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

export async function explainRun(id: string, onChunk: (text: string) => void): Promise<void> {
  const res = await fetch(`${API_BASE}/api/runs/${id}/explain`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to explain run');
  if (!res.body) return;

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  const words: string[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // Parse SSE: each message is "data: <word>\n\n"
    const lines = buffer.split('\n');
    buffer = '';
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        words.push(line.slice(6));
        onChunk(words.join(' '));
      } else if (line.length > 0) {
        // Incomplete line, put back in buffer
        buffer += line;
      }
    }
  }
}
