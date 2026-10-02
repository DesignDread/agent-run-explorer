import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.data_loader import data_store
from app.models import Run

@pytest_asyncio.fixture(autouse=True)
async def setup_data():
    """Provide deterministic test data without needing the real JSONL file."""
    data_store.runs = [
        Run(
            id="run_001", agent="kpi-analyst", model="gpt-4", status="failed",
            started_at="2026-07-20T10:00:00Z", duration_ms=1000,
            input_tokens=10, output_tokens=10, cost_usd=0.01,
            prompt="Test prompt sql", tenant_id="t1",
            steps=[{
                "index": 0, "name": "step1", "tool": "sql", "status": "succeeded",
                "started_at": "2026-07-20T10:00:00Z", "input": "q",
                "tokens": {"input": 1, "output": 1}
            }],
            error={"type": "SchemaMismatch", "message": "Missing field", "step_index": 0}
        ),
        Run(
            id="run_002", agent="kpi-analyst", model="gpt-4", status="succeeded",
            started_at="2026-07-21T10:00:00Z", ended_at="2026-07-21T10:00:02Z",
            duration_ms=2000, input_tokens=10, output_tokens=10, cost_usd=0.01,
            prompt="Another sql prompt", tenant_id="t1"
        ),
        Run(
            id="run_003", agent="email-drafter", model="gpt-4", status="succeeded",
            started_at="2026-07-22T10:00:00Z", ended_at="2026-07-22T10:00:01.5Z",
            duration_ms=1500, input_tokens=10, output_tokens=10, cost_usd=0.02,
            prompt="Draft an email for the client", tenant_id="t2"
        ),
        Run(
            id="run_0031", agent="contract-reviewer", model="gpt-4", status="running",
            started_at="2026-07-22T10:00:00Z",
            input_tokens=10, output_tokens=10, prompt="Search text",
            tenant_id="t1"
        ),
        Run(
            id="run_0031_dup", agent="contract-reviewer", model="gpt-4", status="succeeded",
            started_at="2026-07-23T10:00:00Z", ended_at="2026-07-23T10:00:01.5Z",
            duration_ms=1500, input_tokens=10, output_tokens=10, cost_usd=0.01,
            prompt="Search text dup", tenant_id="t1"
        ),
        Run(
            id="run_nullcost", agent="kpi-analyst", model="gpt-4", status="succeeded",
            started_at="2026-07-24T10:00:00Z", ended_at="2026-07-24T10:00:03Z",
            duration_ms=3000, input_tokens=10, output_tokens=10, cost_usd=None,
            prompt="Run with null cost", tenant_id="t1"
        ),
    ]
    data_store.runs_by_id = {r.id: r for r in data_store.runs}
    yield


@pytest_asyncio.fixture
async def client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac


@pytest.mark.asyncio
async def test_filters_compose(client: AsyncClient):
    """Two filters (agent + status) compose via AND logic."""
    resp = await client.get("/api/runs?agent=kpi-analyst&status=failed")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 1
    assert data["items"][0]["id"] == "run_001"


@pytest.mark.asyncio
async def test_pagination_total(client: AsyncClient):
    """Pagination returns correct total and respects page_size."""
    resp = await client.get("/api/runs?page=1&page_size=2")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 6
    assert len(data["items"]) == 2


@pytest.mark.asyncio
async def test_stats_success_rate(client: AsyncClient):
    """
    Hand-computed: 5 completed runs (run_001 failed, run_002/003/0031_dup/nullcost succeeded).
    1 running run excluded from denominator.
    Success rate = 4/5 = 0.8
    """
    resp = await client.get("/api/stats")
    assert resp.status_code == 200
    data = resp.json()
    assert data["completed_runs_count"] == 5
    assert data["running_count"] == 1
    assert abs(data["overall_success_rate"] - 4 / 5) < 1e-9


@pytest.mark.asyncio
async def test_stats_median_duration(client: AsyncClient):
    """
    Hand-computed: completed runs with positive duration: 1000, 1500, 1500, 2000, 3000
    Sorted: [1000, 1500, 1500, 2000, 3000]. Median (n=5, odd) = 1500.
    """
    resp = await client.get("/api/stats")
    assert resp.status_code == 200
    data = resp.json()
    assert data["median_duration_ms"] == 1500


@pytest.mark.asyncio
async def test_run_detail_404(client: AsyncClient):
    """Non-existent run returns 404."""
    resp = await client.get("/api/runs/nonexistent")
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_run_detail_includes_steps(client: AsyncClient):
    """Detail endpoint returns steps array."""
    resp = await client.get("/api/runs/run_001")
    assert resp.status_code == 200
    data = resp.json()
    assert "steps" in data
    assert len(data["steps"]) == 1
    assert data["steps"][0]["tool"] == "sql"


@pytest.mark.asyncio
async def test_sort_by_duration_asc(client: AsyncClient):
    """Sorting by duration ascending puts nulls last."""
    resp = await client.get("/api/runs?sort_by=duration_ms&sort_order=asc")
    assert resp.status_code == 200
    data = resp.json()
    durations = [item["duration_ms"] for item in data["items"]]
    non_null = [d for d in durations if d is not None]
    # Non-null durations should be ascending
    assert non_null == sorted(non_null)
    # Null should be last
    assert durations[-1] is None


@pytest.mark.asyncio
async def test_date_range_filter(client: AsyncClient):
    """Date range filter returns runs within the range."""
    resp = await client.get(
        "/api/runs?started_after=2026-07-21T00:00:00Z&started_before=2026-07-22T23:59:59Z"
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 3  # run_002, run_003, run_0031
    ids = {item["id"] for item in data["items"]}
    assert "run_002" in ids
    assert "run_003" in ids
    assert "run_0031" in ids


@pytest.mark.asyncio
async def test_text_search(client: AsyncClient):
    """Text search on prompt field (case-insensitive)."""
    resp = await client.get("/api/runs?search=Search text")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 2  # run_0031 and run_0031_dup


@pytest.mark.asyncio
async def test_tool_filter(client: AsyncClient):
    """Tool filter matches runs containing a step using that tool."""
    resp = await client.get("/api/runs?tool=sql")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 1
    assert data["items"][0]["id"] == "run_001"


@pytest.mark.asyncio
async def test_duplicate_id_handled(client: AsyncClient):
    """Both original and duplicate run IDs are accessible."""
    resp1 = await client.get("/api/runs/run_0031")
    assert resp1.status_code == 200
    resp2 = await client.get("/api/runs/run_0031_dup")
    assert resp2.status_code == 200
    # They should have different statuses
    assert resp1.json()["status"] != resp2.json()["status"]


@pytest.mark.asyncio
async def test_null_cost_tracked_in_stats(client: AsyncClient):
    """Stats should track null_cost_count per agent."""
    resp = await client.get("/api/stats")
    assert resp.status_code == 200
    data = resp.json()
    kpi_agent = next(a for a in data["agents"] if a["agent"] == "kpi-analyst")
    assert kpi_agent["null_cost_count"] == 1  # run_nullcost has null cost


@pytest.mark.asyncio
async def test_explain_streaming(client: AsyncClient):
    """Explain endpoint returns streaming SSE response."""
    resp = await client.post("/api/runs/run_001/explain")
    assert resp.status_code == 200
    assert resp.headers.get("content-type", "").startswith("text/event-stream")
    # Verify the response contains expected content
    body = resp.text
    assert "data:" in body
    assert "kpi-analyst" in body
