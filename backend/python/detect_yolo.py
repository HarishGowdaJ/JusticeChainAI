# backend/python/detect_yolo.py
import json
from pathlib import Path
from ultralytics import YOLO
import cv2
from utils import write_summary

def detect(video_path: str, model_path: str, outdir: str, conf_threshold: float = 0.25, save_txt: bool = False):
    """
    Run YOLOv8 (Ultralytics) model on a video. Writes results to outdir and returns summary dict.
    """
    video_path = Path(video_path)
    model_path = Path(model_path)
    outdir = Path(outdir)
    outdir.mkdir(parents=True, exist_ok=True)

    if not video_path.exists():
        raise FileNotFoundError(f"Video not found: {video_path}")
    if not model_path.exists():
        raise FileNotFoundError(f"Model not found: {model_path}")

    try:
        model = YOLO(str(model_path))
    except Exception as e:
        raise RuntimeError(f"Failed to load YOLO model at {model_path}: {e}")

    class_names = getattr(model, "names", {})

    # Use project=outdir so YOLO saves the annotated video inside outdir/<name>/...
    try:
        results = model.predict(
            source=str(video_path),
            imgsz=640,
            conf=conf_threshold,
            save=True,
            project=str(outdir),
            name="predict",
            exist_ok=True,
            save_txt=save_txt,
            save_conf=save_txt,
            vid_stride=1,
            stream=True,
            verbose=False
        )
    except Exception as e:
        raise RuntimeError(f"YOLO prediction failed: {e}")

    frame_count = 0
    total_detections = 0
    confidence_sum = 0.0
    all_confidences = []
    detection_classes = {}

    for result in results:
        frame_count += 1
        try:
            if result.boxes is not None and len(result.boxes) > 0:
                frame_detections = len(result.boxes)
                total_detections += frame_detections
                for box in result.boxes:
                    cls_id = int(box.cls[0])
                    conf = float(box.conf[0])
                    confidence_sum += conf
                    all_confidences.append(conf)
                    class_name = class_names.get(cls_id, f"class_{cls_id}")
                    if class_name not in detection_classes:
                        detection_classes[class_name] = {'count': 0, 'conf_sum': 0.0}
                    detection_classes[class_name]['count'] += 1
                    detection_classes[class_name]['conf_sum'] += conf
        except Exception:
            # non-fatal for per-frame processing
            continue

    # YOLO may save outputs under outdir/predict/* or outdir/predict/predict/*
    candidate_videos = list(outdir.rglob("*.mp4")) + list(outdir.rglob("*.avi"))
    out_video_path = candidate_videos[0] if candidate_videos else None

    average_confidence = (confidence_sum / total_detections) if total_detections > 0 else 0.0

    summary = {
        "script": "detect_yolo",
        "input_video": str(video_path),
        "output_video": str(out_video_path) if out_video_path else None,
        "total_frames": frame_count,
        "total_detections": int(total_detections),
        "average_confidence": float(average_confidence),
        "detections_by_class": detection_classes
    }

    # write summary.json
    try:
        write_summary(outdir, summary)
    except Exception:
        try:
            with open(outdir / "summary.json", "w") as f:
                json.dump(summary, f, indent=2)
        except Exception:
            pass

    return summary
