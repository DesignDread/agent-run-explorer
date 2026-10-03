import os
import asyncio
from typing import List, Optional
from fastapi import APIRouter, Query, HTTPException
from fastapi.responses import StreamingResponse
from .models import Run, RunSummary, PaginatedResponse, StatsResponse, AgentStats
from .data_loader import data_store
from collections import defaultdict
import datetime

router = APIRouter(prefix="/api")

@router.get("/health")
def health_check():
    return {"status": "ok", "runs_loaded": len(data_store.runs)}

@router.get("/debug")
def debug_info():
    import os
    from pathlib import Path
    base = Path(__file__).parent.parent
    data_dir = base / "data"
    
    return {
        "cwd": os.getcwd(),
        "base_dir": str(base),
        "data_dir_exists": data_dir.exists(),
        "data_dir_files": os.listdir(data_dir) if data_dir.exists() else [],
        "runs_count": len(data_store.runs),
        "data_path_env": os.getenv("DATA_PATH")
    }

def filter_runs(
    runs: List[Run],
    status: Optional[List[str]] = None,
    agent: Optional[List[str]] = None,
    started_after: Optional[str] = None,
    started_before: Optional[str] = None,
    search: Optional[str] = None,
    tool: Optional[List[str]] = None
) -> List[Run]:
    filtered = []
    for r in runs:
        if status and r.status not in status:
            continue
        if agent and r.agent not in agent:
            continue
        if started_after and r.started_at < started_after:
            continue
        if started_before and r.started_at > started_before:
            continue
        if search and search.lower() not in r.prompt.lower():
            continue
        if tool:
            run_tools = {step.tool for step in r.steps}
            if not any(t in run_tools for t in tool):
                continue
        filtered.append(r)
    return filtered

def sort_runs(runs: List[Run], sort_by: Optional[str], sort_order: str) -> List[Run]:
    if not sort_by:
        return runs
    reverse = (sort_order.lower() == "desc")
    def get_key(r: Run):
        val = getattr(r, sort_by, None)
        if val is None:
            return float('-inf') if reverse else float('inf')
        return val
    return sorted(runs, key=get_key, reverse=reverse)

@router.get("/runs", response_model=PaginatedResponse)
def get_runs(
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    status: Optional[List[str]] = Query(None),
    agent: Optional[List[str]] = Query(None),
    started_after: Optional[str] = Query(None),
    started_before: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    sort_by: Optional[str] = Query(None),
    sort_order: str = Query("desc"),
    tool: Optional[List[str]] = Query(None)
):
    filtered = filter_runs(data_store.runs, status, agent, started_after, started_before, search, tool)
    sorted_filtered = sort_runs(filtered, sort_by, sort_order)
    
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    items = [RunSummary(**r.model_dump(exclude={'steps'})) for r in sorted_filtered[start_idx:end_idx]]
    
    return PaginatedResponse(
        items=items,
        total=len(filtered),
        page=page,
        page_size=page_size
    )

@router.get("/runs/{run_id}", response_model=Run)
def get_run(run_id: str):
    if run_id not in data_store.runs_by_id:
        raise HTTPException(status_code=404, detail="Run not found")
    return data_store.runs_by_id[run_id]

@router.get("/stats", response_model=StatsResponse)
def get_stats(
    status: Optional[List[str]] = Query(None),
    agent: Optional[List[str]] = Query(None),
    started_after: Optional[str] = Query(None),
    started_before: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    tool: Optional[List[str]] = Query(None)
):
    filtered = filter_runs(data_store.runs, status, agent, started_after, started_before, search, tool)
    
    total_runs = len(filtered)
    completed_runs_count = sum(1 for r in filtered if r.status != "running")
    running_count = total_runs - completed_runs_count
    
    succeeded = sum(1 for r in filtered if r.status == "succeeded")
    overall_success_rate = (succeeded / completed_runs_count) if completed_runs_count > 0 else 0.0
    
    agent_stats_map = defaultdict(lambda: {"runs": 0, "success": 0, "completed": 0, "cost": 0.0, "null_cost": 0})
    durations = []
    runs_per_day_map = defaultdict(int)
    
    for r in filtered:
        astat = agent_stats_map[r.agent]
        astat["runs"] += 1
        if r.status != "running":
            astat["completed"] += 1
            if r.status == "succeeded":
                astat["success"] += 1
        
        if r.cost_usd is not None:
            astat["cost"] += r.cost_usd
        else:
            astat["null_cost"] += 1
            
        if r.status != "running" and r.duration_ms is not None and r.duration_ms > 0:
            durations.append(r.duration_ms)
            
        date_str = r.started_at[:10]
        runs_per_day_map[date_str] += 1

    agents = []
    for ag, st in agent_stats_map.items():
        rate = (st["success"] / st["completed"]) if st["completed"] > 0 else 0.0
        agents.append(AgentStats(
            agent=ag,
            run_count=st["runs"],
            success_count=st["success"],
            success_rate=rate,
            total_cost=st["cost"],
            null_cost_count=st["null_cost"]
        ))
        
    durations.sort()
    median_dur = None
    p95_dur = None
    if durations:
        n = len(durations)
        mid = n // 2
        median_dur = durations[mid] if n % 2 != 0 else (durations[mid-1] + durations[mid]) / 2.0
        p95_idx = int(n * 0.95)
        p95_dur = float(durations[min(p95_idx, n-1)])
        
    runs_per_day = [{"date": k, "count": v} for k, v in sorted(runs_per_day_map.items())]

    return StatsResponse(
        total_runs=total_runs,
        overall_success_rate=overall_success_rate,
        agents=agents,
        median_duration_ms=median_dur,
        p95_duration_ms=p95_dur,
        runs_per_day=runs_per_day,
        completed_runs_count=completed_runs_count,
        running_count=running_count
    )

@router.post("/runs/{run_id}/explain")
async def explain_run(run_id: str):
    if run_id not in data_store.runs_by_id:
        raise HTTPException(status_code=404, detail="Run not found")
        
    run = data_store.runs_by_id[run_id]
    
    if run.status == "succeeded":
        step_names = ", ".join([s.name for s in run.steps])
        cost_str = f"${run.cost_usd:.4f}" if run.cost_usd is not None else "unknown (no cost data)"
        text = f"This run used the {run.agent} agent to process: '{run.prompt[:80]}'. It completed successfully in {run.duration_ms}ms across {len(run.steps)} steps. The steps were: {step_names}. Total tokens used: {run.input_tokens} input, {run.output_tokens} output. Cost: {cost_str}."
    elif run.status == "failed":
        err_msg = ""
        err_idx = ""
        if run.error:
            err_msg = f"{run.error.type} - {run.error.message}"
            err_idx = str(run.error.step_index)
        step_name = run.steps[run.error.step_index].name if run.error and run.error.step_index is not None and run.error.step_index < len(run.steps) else "Unknown"
        text = f"This run used the {run.agent} agent to process: '{run.prompt[:80]}'. It FAILED at step {err_idx} ({step_name}) with error: {err_msg}. The run executed {len(run.steps)} steps before failing."
    elif run.status == "running":
        step_names = ", ".join([s.name for s in run.steps]) if run.steps else "none yet"
        text = f"This run is still in progress. It is using the {run.agent} agent to process: '{run.prompt[:80]}'. So far it has executed {len(run.steps)} steps: {step_names}. It has consumed {run.input_tokens} input tokens and {run.output_tokens} output tokens."
    elif run.status == "cancelled":
        text = f"This run was cancelled. It was using the {run.agent} agent to process: '{run.prompt[:80]}'. It had executed {len(run.steps)} steps before cancellation."
    else:
        text = f"This run has an unknown status: {run.status}."

    async def event_generator():
        words = text.split()
        for word in words:
            yield f"data: {word}\n\n"
            await asyncio.sleep(0.05)
            
    return StreamingResponse(event_generator(), media_type="text/event-stream")

