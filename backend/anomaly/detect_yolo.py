# detect_yolo.py
"""
YOLO shoplifting detector using ultralytics.YOLO
Expects model file at backend/python/models/best.pt by default.
If ultralytics is not installed or model not present, returns a stub response.
"""
import os
import logging
from typing import Dict, Any, List

log = logging.getLogger(__name__)

DEFAULT_MODEL_PATHS = [
    os.path.join(os.path.dirname(__file__), "..", "python", "models", "best.pt"),
    os.path.join(os.path.dirname(__file__), "models", "best.pt"),
]

try:
    from ultralytics import YOLO
    ULTRALYTICS_AVAILABLE = True
except Exception:
    YOLO = None
    ULTRALYTICS_AVAILABLE = False

_model = None
_model_path = None

def find_model_file() -> str:
    for p in DEFAULT_MODEL_PATHS:
        if os.path.exists(p):
            return p
    return None

def load_model():
    global _model, _model_path
    if _model is not None:
        return _model
    path = find_model_file()
    _model_path = path
    if not path:
        log.warning("YOLO model file not found; will run stub.")
        return None
    if not ULTRALYTICS_AVAILABLE:
        log.warning("ultralytics not installed; install `ultralytics` to enable YOLO inference.")
        return None
    try:
        model = YOLO(path)
        _model = model
        log.info("Loaded YOLO model from %s", path)
        return model
    except Exception as e:
        log.exception("Failed to load YOLO model: %s", e)
        _model = None
        return None

def predict(file_path: str, conf: float = 0.25, save_txt: bool = False) -> Dict[str, Any]:
    """
    Run YOLO inference and return JSON-friendly results.
    """
    model = load_model()
    if model is None:
        # stub: return no detections
        return {
            "model_loaded": False,
            "model_path": _model_path,
            "detections": [],
            "note": "YOLO model not available — returned stub"
        }
    try:
        results = model.predict(source=file_path, conf=conf, save=False, verbose=False)
        # results is a list (one per source). We'll only use the first
        out = []
        if results:
            r = results[0]
            # r.boxes, r.boxes.xyxy, r.boxes.conf, r.boxes.cls, r.names
            boxes = getattr(r, "boxes", None)
            if boxes is not None:
                for box in boxes:
                    try:
                        xyxy = box.xyxy.tolist()[0] if hasattr(box.xyxy, "tolist") else list(box.xyxy)
                        confv = float(box.conf[0]) if hasattr(box.conf, "__len__") else float(box.conf)
                        cls = int(box.cls[0]) if hasattr(box.cls, "__len__") else int(box.cls)
                        label = r.names.get(cls, str(cls)) if hasattr(r, "names") else str(cls)
                        out.append({
                            "xyxy": xyxy,
                            "confidence": confv,
                            "class": cls,
                            "label": label
                        })
                    except Exception:
                        # best-effort parse
                        pass
        return {
            "model_loaded": True,
            "model_path": _model_path,
            "detections": out
        }
    except Exception as e:
        log.exception("YOLO inference failed: %s", e)
        return {
            "model_loaded": True,
            "model_path": _model_path,
            "detections": [],
            "error": str(e)
        }
