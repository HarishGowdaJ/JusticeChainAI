# backend/python/detect_ucf_i3d.py
import json
from pathlib import Path
from utils import write_summary

def classify_video_stub(video_path: str):
    return ("normal", 0.90, {"normal": 0.90, "fight": 0.05, "stealing": 0.03})

def detect(video_path: str, model_path: str, outdir: str, threshold: float = 0.3, save_video: bool = False):
    video_path = Path(video_path)
    model_path = Path(model_path) if model_path else None
    outdir = Path(outdir)
    outdir.mkdir(parents=True, exist_ok=True)

    if not video_path.exists():
        raise FileNotFoundError(f"Video not found: {video_path}")

    pred_label, conf, probs = classify_video_stub(str(video_path))
    detected = conf >= threshold
    summary = {
        "script": "detect_ucf_i3d",
        "input_video": str(video_path),
        "model_path": str(model_path) if model_path else None,
        "predicted_label": pred_label,
        "confidence": float(conf),
        "probs": probs,
        "detected_above_threshold": bool(detected),
        "threshold_used": float(threshold)
    }

    write_summary(outdir, summary)
    return summary
