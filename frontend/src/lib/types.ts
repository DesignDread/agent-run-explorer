export interface StepTokens { input: number; output: number; }
export interface Step {
  index: number; name: string; tool: string; status: string;
  started_at: string; duration_ms: number | null;
  input: string; output: string | null; tokens: StepTokens;
}
export interface RunError { type: string; message: string; step_index: number; }
export interface Run {
  id: string; agent: string; model: string; status: string;
  started_at: string; ended_at: string | null; duration_ms: number | null;
  input_tokens: number; output_tokens: number; cost_usd: number | null;
  prompt: string; error: RunError | null; tenant_id: string;
  steps: Step[];
  data_warnings: string[];
}
export interface RunSummary extends Omit<Run, 'steps'> {}
export interface PaginatedResponse {
  items: RunSummary[]; total: number; page: number; page_size: number;
}
export interface AgentStats {
  agent: string; run_count: number; success_count: number;
  success_rate: number; total_cost: number; null_cost_count: number;
}
export interface StatsResponse {
  total_runs: number; overall_success_rate: number;
  agents: AgentStats[]; median_duration_ms: number | null;
  p95_duration_ms: number | null; runs_per_day: {date: string; count: number}[];
  completed_runs_count: number; running_count: number;
}
