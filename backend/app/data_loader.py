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

    def load(self):
        data_path_str = os.getenv("DATA_PATH", "../data/runs.jsonl")
        base_dir = Path(__file__).parent.parent
        data_path = (base_dir / data_path_str).resolve()
        
        if not data_path.exists():
            logger.warning(f"Data file not found at {data_path}")
            return

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

data_store = DataLoader()
