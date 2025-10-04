# app.py
import os
import logging
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from .utils import save_upload_file, cleanup_file, make_job_outdir, is_video_file
from .detect_ucf_i3d import predict as predict_ucf
from .detect_yolo import predict as predict_yolo
from .detect_onnx import predict as predict_onnx

log = logging.getLogger("anomaly_app")
logging.basicConfig(level=logging.INFO)

app = FastAPI(title="JusticeChain Anomaly Detection")

# Allow CORS from the Node server (adjust origins as needed)
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS", ",".join(origins)).split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
async def predict(file: UploadFile = File(...), threshold: float = Form(0.3), save_txt: bool = Form(False)):
    """
    Automatic anomaly (UCF/I3D) prediction endpoint.
    Accepts multipart file field `file`. Returns JSON with UCF/anomaly results and hints for next steps.
    """
    saved_path = None
    try:
        saved_path = save_upload_file(file)
        log.info("Saved upload to %s", saved_path)

        ucf_result = predict_ucf(saved_path)
        response = {
            "status": "ok",
            "method": "ucf_i3d",
            "ucf": ucf_result,
            "next": {
                "shoplifting_endpoint": "/predict/shoplifting",
                "weapon_endpoint": "/predict/weapon",
                "note": "You can POST the same file to the endpoints above for specialized checks."
            }
        }
        return JSONResponse(content=response)
    except Exception as e:
        log.exception("Error in /predict: %s", e)
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # cleanup tmp file
        try:
            cleanup_file(saved_path)
        except Exception:
            pass

@app.post("/predict/shoplifting")
async def predict_shoplifting(file: UploadFile = File(...), conf: float = Form(0.25), save_txt: bool = Form(False)):
    """
    Shoplifting detection using YOLO model (.pt)
    """
    saved_path = None
    try:
        saved_path = save_upload_file(file)
        log.info("Saved shoplifting upload to %s", saved_path)
        outdir = make_job_outdir("shoplifting")
        res = predict_yolo(saved_path, conf=conf, save_txt=save_txt)
        return {"status": "ok", "method": "yolo_shoplifting", "outdir": outdir, "result": res}
    except Exception as e:
        log.exception("Error in /predict/shoplifting: %s", e)
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        try:
            cleanup_file(saved_path)
        except Exception:
            pass

@app.post("/predict/weapon")
async def predict_weapon(file: UploadFile = File(...), conf: float = Form(0.25), save_txt: bool = Form(False)):
    """
    Weapon detection using ONNX model
    """
    saved_path = None
    try:
        saved_path = save_upload_file(file)
        log.info("Saved weapon upload to %s", saved_path)
        outdir = make_job_outdir("weapon")
        res = predict_onnx(saved_path, conf=conf, save_txt=save_txt)
        return {"status": "ok", "method": "onnx_weapon", "outdir": outdir, "result": res}
    except Exception as e:
        log.exception("Error in /predict/weapon: %s", e)
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        try:
            cleanup_file(saved_path)
        except Exception:
            pass

# Basic root
@app.get("/")
async def root():
    return {"msg": "JusticeChain Anomaly Detection FastAPI running"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("FASTAPI_PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)
