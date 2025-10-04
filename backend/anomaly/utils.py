# utils.py
import os
import uuid
import shutil
import logging
from typing import Tuple, List
import cv2
import numpy as np

log = logging.getLogger(__name__)

BASE_DIR = os.path.dirname(__file__)
TMP_DIR = os.path.join(BASE_DIR, "tmp")
OUT_DIR = os.path.join(BASE_DIR, "outputs")
os.makedirs(TMP_DIR, exist_ok=True)
os.makedirs(OUT_DIR, exist_ok=True)

def save_upload_file(upload_file) -> str:
    """
    Save FastAPI UploadFile to TMP_DIR and return absolute path.
    """
    fname = f"{uuid.uuid4().hex}_{os.path.basename(upload_file.filename)}"
    dest = os.path.join(TMP_DIR, fname)
    with open(dest, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
    return dest

def cleanup_file(path: str):
    try:
        if path and os.path.exists(path):
            os.remove(path)
    except Exception as e:
        log.warning("cleanup_file failed: %s", e)

def make_job_outdir(prefix: str = "job") -> str:
    d = os.path.join(OUT_DIR, f"{prefix}_{uuid.uuid4().hex[:8]}")
    os.makedirs(d, exist_ok=True)
    return d

def is_video_file(path: str) -> bool:
    ext = os.path.splitext(path)[1].lower()
    return ext in [".mp4", ".avi", ".mov", ".mkv", ".webm"]

def sample_frames(video_path: str, num_frames: int = 8, max_width: int = 320) -> List[np.ndarray]:
    """
    Sample `num_frames` frames evenly spaced across the video.
    Returns list of BGR numpy arrays (resized to max_width maintaining aspect).
    """
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise RuntimeError(f"Cannot open video {video_path}")

    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
    if total <= 0:
        # fallback: read until end
        frames = []
        while True:
            ret, frame = cap.read()
            if not ret: break
            frames.append(frame)
        cap.release()
        total = len(frames)
        if total == 0:
            return []
        # pick frames evenly
        idxs = np.linspace(0, total-1, num_frames, dtype=int)
        selected = [frames[i] for i in idxs]
    else:
        idxs = np.linspace(0, max(total-1,0), num_frames, dtype=int)
        selected = []
        for i in idxs:
            cap.set(cv2.CAP_PROP_POS_FRAMES, int(i))
            ret, frame = cap.read()
            if not ret:
                continue
            selected.append(frame)
        cap.release()

    # resize frames
    out = []
    for f in selected:
        h, w = f.shape[:2]
        if w > max_width:
            new_h = int(h * (max_width / w))
            f = cv2.resize(f, (max_width, new_h))
        out.append(f)
    return out
