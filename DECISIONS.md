# Decisions

## 1. Handling `cost_usd: null`

Three runs (`run_0008`, `run_0042`, `run_0153`) have `cost_usd: null`. For "total cost per agent," I sum only the non-null values and separately track `null_cost_count` per agent. The UI displays the total with a footnote like _"3 runs excluded (no cost data)"_ so the viewer knows the sum is a lower bound, not an exact total. This avoids inventing a number while remaining transparent.

## 2. Running runs: sorting and success rate

Nine runs have `status: running` with no `ended_at` or `duration_ms`.

- **Success rate**: Running runs are excluded from the denominator entirely. Success rate = `succeeded / (succeeded + failed + cancelled)`. Including them would deflate the rate misleadingly since they haven't resolved yet.
- **Sorting**: When sorting by `duration_ms` or `cost_usd`, null values sort last regardless of direction. When sorting by `started_at`, running runs sort normally since they have a start time.

## 3. Broken record: duplicate ID `run_0031`

`run_0031` appears twice in the dataset with different `status` values. A naive dict-keyed-by-id loader would silently drop one. I keep both records: the first is stored as `run_0031` and the duplicate is stored as `run_0031_dup`. A data-quality warning is attached. The API returns both, and the UI shows the warning. This preserves all data for investigation rather than making an arbitrary choice about which is "correct."

## 4. Negative `duration_ms` on `run_0064`

`ended_at` precedes `started_at`, yielding a negative duration. I take the absolute value for display and stats but attach a `data_quality` warning so engineers can investigate the clock-skew or timestamp swap. The original timestamps are preserved.

## 5. `/api/stats` and filters

Stats are **global by default**. The `/api/stats` endpoint accepts the same filter parameters as `/api/runs`, so the dashboard _could_ show filtered stats, but the default dashboard view shows global aggregates. I chose global because the dashboard is a landing page for "how are we doing overall?" Filtered stats are available for power users who construct the URL.

## 6. Empty steps array on `run_0089`

This is a failed run with zero steps. It likely crashed before any step executed. I keep it as-is: it counts toward the failure rate and appears in the list. The detail page simply shows "No steps recorded."

## Other data observations

- One prompt is in French (`run_0074`?): text search is case-insensitive and works on any UTF-8 content.
- One prompt has leading/trailing whitespace: I do _not_ strip it on ingest (the data stays faithful), but search uses `in` matching which handles this naturally.

## What I would do with another day

1. **Cursor-based pagination** alongside offset pagination for stable iteration over large datasets.
2. **Virtual scrolling** on the step list for runs with hundreds of steps.
3. **Docker Compose** to bring both services up in one command.
4. **More frontend tests**: component tests for filters, integration tests for URL-param round-tripping.
5. **Caching**: Add ETags or `Cache-Control` headers on the stats endpoint.

## What I would change at 20 million records

- Move from in-memory JSONL to PostgreSQL with proper indexes on `status`, `agent`, `started_at`, and a GIN index on `prompt` for full-text search.
- Use cursor-based pagination (keyset pagination on `started_at` + `id`) instead of offset, which degrades at high page numbers.
- Pre-compute stats asynchronously or use materialized views instead of scanning on every request.
- Stream the JSONL import in batches rather than loading everything into memory.

## Parts I am least happy with

- The explain endpoint mock is simplistic. With more time, I would template richer explanations and vary them based on step patterns.
- Frontend test coverage is minimal; I would add filter-composition and URL-param round-trip tests.
