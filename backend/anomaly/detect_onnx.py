# detect_onnx.py
"""
ONNX Runtime wrapper for weapon detection model (best.onnx).
This will try to run onnxruntime inference (simple image-level or frame-level).
If onnxruntime is not present or model missing, returns a stub.

Expectation: best.onnx is an object-detection model that accepts an image tensor.
You may need to adapt preprocessing and output parsing depending on model.
"""
import os
import logging
from typing import Dict, Any, List

log = logging.getLogger(__name__)

DEFAULT_MODEL_PATHS = [
    os.path.join(os.path.dirname(__file__), "..", "python", "models", "best.onnx"),
    os.path.join(os.path.dirname(__file__), "models", "best.onnx"),
]

try:
    import onnxruntime as ort
    ORT_AVAILABLE = True
except Exception:
    ort = None
    ORT_AVAILABLE = False

_model_sess = None
_model_path = None

def find_model_file() -> str:
    for p in DEFAULT_MODEL_PATHS:
        if os.path.exists(p):
            return p
    return None

def load_model():
    global _model_sess, _model_path
    if _model_sess is not None:
        return _model_sess
    path = find_model_file()
    _model_path = path
    if not path:
        log.warning("ONNX model file not found; will run stub.")
        return None
    if not ORT_AVAILABLE:
        log.warning("onnxruntime not installed; install onnxruntime to enable ONNX inference.")
        return None
    try:
        sess = ort.InferenceSession(path, providers=['CPUExecutionProvider'])
        _model_sess = sess
        log.info("Loaded ONNX model from %s", path)
        return sess
    except Exception as e:
        log.exception("Failed to create ONNX InferenceSession: %s", e)
        _model_sess = None
        return None

def preprocess_image_for_onnx(img_path: str):
    """
    Very simple preprocessing: read image, resize to 640x640, transpose to NCHW, normalize.
    Adjust to your model's preprocessing.
    """
    import cv2
    import numpy as np
    img = cv2.imread(img_path)
    if img is None:
        raise RuntimeError(f"Could not read {img_path}")
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, (640, 640))
    img = img.astype("float32") / 255.0
    # HWC -> CHW
    img = img.transpose(2, 0, 1)
    # add batch
    img = img[None, ...]
    return img

def parse_onnx_outputs(outputs) -> List[Dict[str, Any]]:
    """
    Generic parser: this highly depends on model. We'll attempt best-effort to parse bounding boxes + scores.
    If model is standard YOLO ONNX, first output often contains boxes/conf/cls.
    """
    res = []
    try:
        # outputs may be dict or list
        if isinstance(outputs, dict):
            outputs = list(outputs.values())
        # flatten arrays to lists
        import numpy as np
        arr0 = np.array(outputs[0])
        # Heuristic: if shape is [N, 6] or [N, 85] (yolo), attempt parsing
        if arr0.ndim == 2 and arr0.shape[1] in (6, 85, 7, 7):
            # if 85 -> xywh + 80cls + conf (yolo v5 style)
            for row in arr0:
                # Attempt: [x1,y1,x2,y2,conf,class] or [x,y,w,h,...]
                if row.shape[0] >= 6:
                    # try xyxy,score,cls
                    x1, y1, x2, y2, conf, cls = row[:6]
                    res.append({
                        "xyxy": [float(x1), float(y1), float(x2), float(y2)],
                        "confidence": float(conf),
                        "class": int(cls)
                    })
                else:
                    pass
        else:
            # if single vector output, return it
            res.append({"raw": arr0.tolist()})
    except Exception as e:
        log.warning("Failed to parse onnx outputs heuristically: %s", e)
        res.append({"error": "parsing_failed", "detail": str(e)})
    return res

def predict(file_path: str, conf: float = 0.25, save_txt: bool = False) -> Dict[str, Any]:
    sess = load_model()
    if sess is None:
        return {
            "model_loaded": False,
            "model_path": _model_path,
            "detections": [],
            "note": "ONNX runtime or model unavailable — returned stub"
        }
    try:
        inp = preprocess_image_for_onnx(file_path)
        ort_inputs = {sess.get_inputs()[0].name: inp}
        outputs = sess.run(None, ort_inputs)
        dets = parse_onnx_outputs(outputs)
        # filter by conf if possible
        dets_filtered = []
        for d in dets:
            confv = d.get("confidence", 1.0)
            if confv >= conf:
                dets_filtered.append(d)
        return {
            "model_loaded": True,
            "model_path": _model_path,
            "detections": dets_filtered
        }
    except Exception as e:
        log.exception("ONNX inference failed: %s", e)
        return {
            "model_loaded": True,
            "model_path": _model_path,
            "detections": [],
            "error": str(e)
        }
