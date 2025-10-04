JusticeChain Anomaly Detection (replacement templates)

Files:
- app.py                : FastAPI app
- utils.py              : file helpers, frame sampling
- detect_ucf_i3d.py     : I3D/UCF detector wrapper (PyTorch)
- detect_yolo.py        : ultralytics YOLO wrapper
- detect_onnx.py        : ONNX Runtime wrapper
- requirements.txt

Models:
Place your models in:
  backend/python/models/
  - best.pt        (YOLO shoplifting)
  - best.onnx      (ONNX weapon model)
  - i3d_ucf.pth    (I3D UCF anomaly)

Install:
  cd backend/anomaly
  python -m venv venv
  source venv/bin/activate
  pip install -r requirements.txt
  # if you need onnxruntime-gpu or torch-cuda install specially as appropriate.

Run:
  # from backend/anomaly
  uvicorn app:app --host 0.0.0.0 --port 8000 --reload

Notes:
- The detection wrappers include stubs and heuristics so the service will run even if heavy ML libs are missing. For real inference you should:
  - Adapt detect_ucf_i3d.load_model() to instantiate your I3D model class and call load_state_dict()
  - Adapt preprocess and output-handling in detect_onnx.py and detect_yolo.py if your model expects custom shapes or outputs
- Keep an eye on timeouts; large videos may require long processing times.
