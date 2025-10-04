# backend/python/utils.py
import os
from pathlib import Path
import time
import json

def make_job_outdir(base_dir: str = None, prefix: str = "job"):
    """
    Create a unique output directory for a run and return the absolute Path.

    Resolution order for base_dir:
      1) explicit base_dir argument (if provided)
      2) environment variable BACKEND_OUTPUTS (if set)
      3) default: backend/backend_storage/outputs_custom (project-root/backend/backend_storage/outputs_custom)
         computed relative to this file location.
    """
    if base_dir is None:
        base_dir = os.environ.get("BACKEND_OUTPUTS")
    if not base_dir:
        # default to project-root/backend/backend_storage/outputs_custom
        # this file is backend/python/utils.py -> parent.parent is backend/
        base_dir = Path(__file__).resolve().parent.parent / "backend_storage" / "outputs_custom"
    out_base = Path(base_dir).resolve()
    t = int(time.time())
    rand = os.getpid() % 10000
    outdir = out_base / f"{prefix}-{t}-{rand}"
    outdir.mkdir(parents=True, exist_ok=True)
    return outdir

def write_summary(outdir: Path, summary: dict):
    summary_path = outdir / "summary.json"
    with open(summary_path, "w") as f:
        json.dump(summary, f, indent=2)
    return summary_path
