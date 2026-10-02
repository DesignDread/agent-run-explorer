from __future__ import annotations
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field

class StepTokens(BaseModel):
    input: int
    output: int

class Step(BaseModel):
    index: int
    name: str
    tool: str
    status: str
    started_at: str
    duration_ms: Optional[int] = None
    input: Any
    output: Optional[str] = None
    tokens: StepTokens

class RunError(BaseModel):
    type: str
    message: str
    step_index: Optional[int] = None

class Run(BaseModel):
    id: str
    agent: str
    model: str
    status: str
    started_at: str
    ended_at: Optional[str] = None
    duration_ms: Optional[int] = None
    input_tokens: int
    output_tokens: int
    cost_usd: Optional[float] = None
    prompt: str
    error: Optional[RunError] = None
    tenant_id: str
    steps: List[Step] = Field(default_factory=list)
    data_warnings: List[str] = Field(default_factory=list)

class RunSummary(BaseModel):
    id: str
    agent: str
    model: str
    status: str
    started_at: str
    ended_at: Optional[str] = None
    duration_ms: Optional[int] = None
    input_tokens: int
    output_tokens: int
    cost_usd: Optional[float] = None
    prompt: str
    error: Optional[RunError] = None
    tenant_id: str
    data_warnings: List[str] = Field(default_factory=list)

class PaginatedResponse(BaseModel):
    items: List[RunSummary]
    total: int
    page: int
    page_size: int

class AgentStats(BaseModel):
    agent: str
    run_count: int
    success_count: int
    success_rate: float
    total_cost: float
    null_cost_count: int

class StatsResponse(BaseModel):
    total_runs: int
    overall_success_rate: float
    agents: List[AgentStats]
    median_duration_ms: Optional[float] = None
    p95_duration_ms: Optional[float] = None
    runs_per_day: List[Dict[str, Any]]
    completed_runs_count: int
    running_count: int
