import json
import os
import logging
from pathlib import Path
from typing import Dict, List
from .models import Run

logger = logging.getLogger(__name__)

class DataLoader:
    def __init__(self):
        self.runs: List[Run] = []
        self.runs_by_id: Dict[str, Run] = {}

    def _resolve_data_path(self) -> Path | None:
        """Try multiple locations to find runs.jsonl, for maximum deployment flexibility."""
        # 1. Explicit env var takes priority
        env_path = os.getenv("DATA_PATH")
        if env_path:
            p = Path(env_path)
            if not p.is_absolute():
                p = (Path(__file__).parent.parent / env_path).resolve()
            if p.exists():
                return p

        # 2. Standard locations relative to backend/ dir
        base_dir = Path(__file__).parent.parent  # backend/
        candidates = [
            base_dir / "data" / "runs.jsonl",        # backend/data/runs.jsonl (deployed)
            base_dir / ".." / "data" / "runs.jsonl",  # data/runs.jsonl (project root, local dev)
        ]

        for candidate in candidates:
            resolved = candidate.resolve()
            if resolved.exists():
                logger.info(f"Found data file at {resolved}")
                return resolved

        return None

    def load(self):
        data_path = self._resolve_data_path()
        if data_path is None:
            logger.warning("Data file runs.jsonl not found in any expected location")
            return

        logger.info(f"Loading data from {data_path}")
        with open(data_path, "r", encoding="utf-8") as f:
            for line in f:
                if not line.strip():
                    continue
                
                data = json.loads(line)
                
                run_id = data["id"]
                if run_id in self.runs_by_id:
                    data["id"] = f"{run_id}_dup"
                    logger.warning(f"Duplicate run ID found: {run_id}. Renamed to {data['id']}")
                    run_id = data["id"]

                data_warnings = []
                duration = data.get("duration_ms")
                if duration is not None and duration < 0:
                    data_warnings.append(f"Negative duration_ms: {duration}")
                    data["duration_ms"] = abs(duration)
                data["data_warnings"] = data_warnings
                
                try:
                    run = Run(**data)
                except Exception as e:
                    logger.error(f"Failed to parse run {run_id}: {e}")
                    continue
                    
                self.runs.append(run)
                self.runs_by_id[run.id] = run

        logger.info(f"Loaded {len(self.runs)} runs successfully")

data_store = DataLoader()
