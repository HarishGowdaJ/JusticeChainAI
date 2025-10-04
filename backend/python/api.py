# backend/python/api.py
import os
import sys
import traceback
from pathlib import Path

# ensure backend/python is on sys.path when running directly
this_dir = Path(__file__).resolve().parent
if str(this_dir) not in sys.path:
    sys.path.insert(0, str(this_dir))

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn

from utils import make_job_outdir
import detect_onnx
import detect_yolo
import detect_ucf_i3d

app = FastAPI(title="Video Detection API (debug)")

class DetectRequest(BaseModel):
    video_path: str
    conf: float = 0.25
    threshold: float = 0.3
    model_path: str = None
    save_txt: bool = False

@app.get("/health")
def health():
    return {"status": "ok"}

def safe_check_file(path_str: str, desc: str):
    p = Path(path_str)
    if not p.exists():
        raise FileNotFoundError(f"{desc} not found: {path_str}")
    if not p.is_file():
        raise FileNotFoundError(f"{desc} is not a file: {path_str}")
    return p.resolve()

@app.post("/detect/weapons")
def detect_weapons(req: DetectRequest):
    try:
        # ensure video exists
        video_path = req.video_path
        try:
            vp = safe_check_file(video_path, "Video file")
        except FileNotFoundError as e:
            # return a helpful error (400)
            raise HTTPException(status_code=400, detail=str(e))

        outputs_root = os.environ.get("BACKEND_OUTPUTS")
        outdir = make_job_outdir(base_dir=outputs_root, prefix="weapons")

        # determine model path
        model = req.model_path or str(Path(__file__).resolve().parent / "models" / "best.onnx")
        try:
            safe_check_file(model, "ONNX model file")
        except FileNotFoundError as e:
            raise HTTPException(status_code=400, detail=str(e))

        # Run detector and capture exceptions
        try:
            summary = detect_onnx.detect(
                video_path=str(vp),
                model_path=str(model),
                conf_threshold=req.conf,
                iou_threshold=0.45,
                save_txt=req.save_txt,
                save_video=True,
                output_dir=str(outdir)
            )
        except Exception as e:
            tb = traceback.format_exc()
            print("Exception in detect_onnx.detect():")
            print(tb)
            # return traceback in response for debugging (remove in prod)
            raise HTTPException(status_code=500, detail={"error": str(e), "traceback": tb})

        return {"status": "ok", "outdir": str(outdir), "summary": summary}
    except HTTPException:
        raise
    except Exception as e:
        tb = traceback.format_exc()
        print("Unexpected exception in /detect/weapons:")
        print(tb)
        raise HTTPException(status_code=500, detail={"error": str(e), "traceback": tb})

@app.post("/detect/shoplifting")
def detect_shoplifting(req: DetectRequest):
    try:
        # check video
        try:
            vp = safe_check_file(req.video_path, "Video file")
        except FileNotFoundError as e:
            raise HTTPException(status_code=400, detail=str(e))

        outputs_root = os.environ.get("BACKEND_OUTPUTS")
        outdir = make_job_outdir(base_dir=outputs_root, prefix="shoplifting")
        model = req.model_path or str(Path(__file__).resolve().parent / "models" / "best.pt")
        try:
            safe_check_file(model, "YOLO model file")
        except FileNotFoundError as e:
            raise HTTPException(status_code=400, detail=str(e))

        try:
            summary = detect_yolo.detect(
                video_path=str(vp),
                model_path=str(model),
                outdir=str(outdir),
                conf_threshold=req.conf,
                save_txt=req.save_txt
            )
        except Exception as e:
            tb = traceback.format_exc()
            print("Exception in detect_yolo.detect():")
            print(tb)
            raise HTTPException(status_code=500, detail={"error": str(e), "traceback": tb})

        return {"status": "ok", "outdir": str(outdir), "summary": summary}
    except HTTPException:
        raise
    except Exception as e:
        tb = traceback.format_exc()
        print("Unexpected exception in /detect/shoplifting:")
        print(tb)
        raise HTTPException(status_code=500, detail={"error": str(e), "traceback": tb})

@app.post("/detect/anomaly")
def detect_anomaly(req: DetectRequest):
    try:
        try:
            vp = safe_check_file(req.video_path, "Video file")
        except FileNotFoundError as e:
            raise HTTPException(status_code=400, detail=str(e))

        outputs_root = os.environ.get("BACKEND_OUTPUTS")
        outdir = make_job_outdir(base_dir=outputs_root, prefix="anomaly")
        model = req.model_path or str(Path(__file__).resolve().parent / "models" / "i3d_ucf.pth")
        # model may not exist for stub; check but allow if not present for stub
        if not Path(model).exists():
            print(f"Warning: anomaly model not found at {model}; using stub inference.")

        try:
            summary = detect_ucf_i3d.detect(
                video_path=str(vp),
                model_path=str(model),
                outdir=str(outdir),
                threshold=req.threshold,
                save_video=False
            )
        except Exception as e:
            tb = traceback.format_exc()
            print("Exception in detect_ucf_i3d.detect():")
            print(tb)
            raise HTTPException(status_code=500, detail={"error": str(e), "traceback": tb})

        return {"status": "ok", "outdir": str(outdir), "summary": summary}
    except HTTPException:
        raise
    except Exception as e:
        tb = traceback.format_exc()
        print("Unexpected exception in /detect/anomaly:")
        print(tb)
        raise HTTPException(status_code=500, detail={"error": str(e), "traceback": tb})

if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
