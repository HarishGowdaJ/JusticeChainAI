# detect_ucf_i3d.py
"""
Light wrapper for an I3D UCF-style anomaly classifier.
This tries to use PyTorch to load i3d_ucf.pth placed at backend/python/models/i3d_ucf.pth
If torch or the model is missing, it returns a stub response.

Replace load_model() and predict() with your exact model code and preprocessing if needed.
"""
import os
import logging
from typing import Dict, Any
import numpy as np

log = logging.getLogger(__name__)

MODEL_REL_PATHS = [
    os.path.join(os.path.dirname(__file__), "..", "python", "models", "i3d_ucf.pth"),
    os.path.join(os.path.dirname(__file__), "models", "i3d_ucf.pth"),
]

# Try to import torch if available
try:
    import torch
    TORCH_AVAILABLE = True
except Exception:
    TORCH_AVAILABLE = False

_model = None
_model_path = None

def find_model_file() -> str:
    for p in MODEL_REL_PATHS:
        if os.path.exists(p):
            return p
    # also try backend/python/models
    alt = os.path.join(os.path.dirname(__file__), "..", "python", "models", "i3d_ucf.pth")
    if os.path.exists(alt):
        return alt
    return None

def load_model():
    global _model, _model_path
    if _model is not None:
        return _model

    model_file = find_model_file()
    _model_path = model_file
    if not model_file:
        log.warning("I3D model file not found; will run stub.")
        return None

    if not TORCH_AVAILABLE:
        log.warning("PyTorch not available; cannot load I3D model. Install torch to enable real inference.")
        return None

    try:
        # --- USER ACTION: adapt loading to your saved model format ---
        # Example: if you saved entire model state_dict for custom I3D class,
        # you must import your model class and load state_dict.
        #
        # from i3d_model import InceptionI3d
        # model = InceptionI3d(num_classes=400, in_channels=3)
        # model.load_state_dict(torch.load(model_file, map_location='cpu'))
        # model.eval()
        #
        # For now, we'll attempt a generic torch.load (may or may not work)
        model = torch.load(model_file, map_location='cpu')
        if isinstance(model, torch.nn.Module):
            model.eval()
            _model = model
            log.info("Loaded I3D model (nn.Module) from %s", model_file)
        else:
            # some checkpoints store dicts; leave as-is
            _model = model
            log.info("Loaded I3D checkpoint object from %s", model_file)
    except Exception as e:
        log.exception("Failed to load I3D model: %s", e)
        _model = None

    return _model

def predict(file_path: str) -> Dict[str, Any]:
    """
    Predict anomaly on video or image (if image, run image-based heuristics).
    Returns a structured dict:
    {
      "type": "video"|"image",
      "anomaly_score": float,        # 0..1
      "anomaly_label": "normal"|"suspicious",
      "details": {...}
    }
    """
    # If no torch or model, return stub
    model = load_model()
    from .utils import is_video_file, sample_frames
    is_video = is_video_file(file_path)

    if model is None:
        # Simple heuristic stub: for video, return random-ish score based on size or length
        try:
            if is_video:
                import cv2
                cap = cv2.VideoCapture(file_path)
                fps = cap.get(cv2.CAP_PROP_FPS) or 25
                total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
                cap.release()
                duration = (total / fps) if fps else 0
                score = min(0.9, 0.1 + (duration / 60.0))  # longer videos => higher anomaly_score (stub)
            else:
                # image: compute edge density as naive anomaly proxy
                import cv2
                img = cv2.imread(file_path, cv2.IMREAD_GRAYSCALE)
                if img is None:
                    score = 0.0
                else:
                    edges = cv2.Canny(img, 100, 200)
                    density = edges.mean()
                    score = min(0.9, density / 255.0 * 2.0)
        except Exception:
            score = 0.35
        return {
            "type": "video" if is_video else "image",
            "anomaly_score": float(round(score, 4)),
            "anomaly_label": "suspicious" if score > 0.5 else "normal",
            "model_loaded": False,
            "model_path": _model_path
        }

    # If model exists and torch available — placeholder example inference:
    if TORCH_AVAILABLE and isinstance(model, object):
        try:
            # Basic flow:
            # 1) sample N frames
            # 2) preprocess -> tensor of shape [1, C, T, H, W] if model expects video clip
            # 3) run model(model_input) and map to anomaly score
            frames = sample_frames(file_path, num_frames=16, max_width=224)
            if not frames:
                return {
                    "type": "video" if is_video else "image",
                    "anomaly_score": 0.0,
                    "anomaly_label": "normal",
                    "model_loaded": True,
                    "model_path": _model_path,
                    "note": "no-frames-extracted"
                }
            # Convert frames (BGR -> RGB)
            import torch
            frames_rgb = [np.ascontiguousarray(f[..., ::-1]) for f in frames]
            arr = np.stack(frames_rgb, axis=0)  # T,H,W,3
            arr = arr.transpose(3, 0, 1, 2)     # C,T,H,W
            tensor = torch.from_numpy(arr).unsqueeze(0).float() / 255.0  # 1,C,T,H,W
            # run no_grad
            model.eval()
            with torch.no_grad():
                out = model(tensor) if callable(model) else None
            # Interpret output
            # Replace following with your model's actual output handling
            if out is None:
                score = 0.4
            else:
                # if out is tensor or numpy
                if isinstance(out, torch.Tensor):
                    outv = out.detach().cpu().numpy()
                else:
                    outv = np.array(out)
                # simple aggregate
                score = float(np.mean(outv).item() if outv.size else 0.0)
                # normalize heuristically
                score = max(0.0, min(1.0, (score + 0.5)))
            return {
                "type": "video" if is_video else "image",
                "anomaly_score": float(round(score, 4)),
                "anomaly_label": "suspicious" if score > 0.5 else "normal",
                "model_loaded": True,
                "model_path": _model_path
            }
        except Exception as e:
            log.exception("Error during I3D inference (fallback to stub): %s", e)
            return {
                "type": "video" if is_video else "image",
                "anomaly_score": 0.35,
                "anomaly_label": "normal",
                "model_loaded": True,
                "model_path": _model_path,
                "error": str(e)
            }

    # default stub
    return {
        "type": "video" if is_video else "image",
        "anomaly_score": 0.3,
        "anomaly_label": "normal",
        "model_loaded": False,
        "model_path": _model_path
    }
