# backend/python/detect_onnx.py
import argparse
import onnxruntime as ort
import numpy as np
from pathlib import Path
import cv2
import json
import sys
import time

def parse_args():
    parser = argparse.ArgumentParser(description="Run ONNX model inference on a video.")
    parser.add_argument('--video', type=str, required=True, help='Path to input video file')
    parser.add_argument('--model', type=str, required=True, help='Path to ONNX model file (.onnx)')
    parser.add_argument('--conf', type=float, default=0.25, help='Confidence threshold (default: 0.25)')
    parser.add_argument('--iou', type=float, default=0.45, help='IoU threshold for NMS (default: 0.45)')
    parser.add_argument('--save-txt', action='store_true', help='Save detection results to txt files')
    parser.add_argument('--save-video', action='store_true', help='Save annotated video')
    parser.add_argument('--output', type=str, default=None, help='Output folder to save annotated video and summary')
    return parser.parse_args()

def letterbox(img, new_shape=(640, 640), color=(114, 114, 114), auto=False, scaleFill=False, scaleup=True):
    shape = img.shape[:2]
    if isinstance(new_shape, int):
        new_shape = (new_shape, new_shape)
    r = min(new_shape[0] / shape[0], new_shape[1] / shape[1])
    if not scaleup:
        r = min(r, 1.0)
    ratio = r, r
    new_unpad = int(round(shape[1] * r)), int(round(shape[0] * r))
    dw, dh = new_shape[1] - new_unpad[0], new_shape[0] - new_unpad[1]
    if auto:
        dw, dh = np.mod(dw, 32), np.mod(dh, 32)
    elif scaleFill:
        dw, dh = 0.0, 0.0
        new_unpad = (new_shape[1], new_shape[0])
        ratio = new_shape[1] / shape[1], new_shape[0] / shape[0]
    dw /= 2
    dh /= 2
    if shape[::-1] != new_unpad:
        img = cv2.resize(img, new_unpad, interpolation=cv2.INTER_LINEAR)
    top, bottom = int(round(dh - 0.1)), int(round(dh + 0.1))
    left, right = int(round(dw - 0.1)), int(round(dw + 0.1))
    img = cv2.copyMakeBorder(img, top, bottom, left, right, cv2.BORDER_CONSTANT, value=color)
    if img.shape[:2] != new_shape:
        img = cv2.resize(img, (new_shape[1], new_shape[0]), interpolation=cv2.INTER_LINEAR)
    return img, ratio, (dw, dh)

def non_max_suppression(boxes, scores, score_threshold=0.25, iou_threshold=0.45):
    if len(boxes) == 0:
        return []
    boxes_xywh = []
    for box in boxes:
        x1, y1, x2, y2 = box
        w = x2 - x1
        h = y2 - y1
        boxes_xywh.append([x1, y1, w, h])
    indices = cv2.dnn.NMSBoxes(boxes_xywh, scores, score_threshold, iou_threshold)
    if len(indices) > 0:
        return indices.flatten()
    else:
        return []

def detect(video_path, model_path, conf_threshold=0.25, iou_threshold=0.45, save_txt=False, save_video=False, output_dir=None):
    """
    Run ONNX model and return summary dict. Writes annotated video + summary.json to output_dir if provided.
    """
    video_path = Path(video_path)
    model_path = Path(model_path)
    outdir = Path(output_dir) if output_dir else None

    if not video_path.exists():
        raise FileNotFoundError(f"Video file not found: {video_path}")

    if not model_path.exists():
        raise FileNotFoundError(f"Model file not found: {model_path}")

    # Create output dir if requested
    if outdir:
        outdir.mkdir(parents=True, exist_ok=True)

    # Load ONNX model
    available = ort.get_available_providers()
    if 'CUDAExecutionProvider' in available:
        providers = ['CUDAExecutionProvider', 'CPUExecutionProvider']
    else:
        providers = ['CPUExecutionProvider']
    session = ort.InferenceSession(str(model_path), providers=providers)

    # Safe input shape parse
    input_details = session.get_inputs()[0]
    input_name = input_details.name
    input_shape = input_details.shape
    try:
        if len(input_shape) >= 4 and input_shape[-2] and input_shape[-1]:
            input_height = int(input_shape[-2])
            input_width = int(input_shape[-1])
        else:
            input_height, input_width = 640, 640
    except Exception:
        input_height, input_width = 640, 640

    cap = cv2.VideoCapture(str(video_path))
    if not cap.isOpened():
        raise RuntimeError(f"Cannot open video file {video_path}")

    fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    out_writer = None
    output_path = None
    if save_video:
        if outdir:
            output_path = outdir / "annotated.mp4"
        else:
            output_path = Path("output_annotated.mp4")
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out_writer = cv2.VideoWriter(str(output_path), fourcc, fps, (width, height))

    frame_count = 0
    total_detections = 0
    confidence_sum = 0.0
    all_confidences = []
    detection_classes = {}

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        frame_count += 1

        img, ratio, (dw, dh) = letterbox(frame, new_shape=(input_height, input_width), auto=False)
        if img.shape != (input_height, input_width, 3):
            img = cv2.resize(img, (input_width, input_height))
        img = img.transpose(2, 0, 1).astype(np.float32) / 255.0
        img = np.expand_dims(img, axis=0)

        # Run inference
        outputs = session.run(None, {input_name: img})
        if len(outputs) == 0:
            continue
        output = outputs[0]
        # handle potential shapes: try to obtain predictions in a robust way
        try:
            # assume [batch, 84, N] or [batch, N, 84]
            out_arr = np.array(output)
            if out_arr.ndim == 3:
                # collapse batch if present
                out = out_arr[0]
                # if shape is (84, N) -> transpose
                if out.shape[0] < out.shape[1]:
                    out = out.T
            else:
                out = out_arr
        except Exception:
            out = output

        # Ensure we have [N, C] shape
        out = np.array(out)
        if out.ndim == 2 and out.shape[1] >= 5:
            # assume each row is [cx, cy, w, h, conf_class0, class1...]
            boxes = out[:, :4]
            scores = out[:, 4:]
        else:
            # fallback: skip frame
            continue

        max_scores = np.max(scores, axis=1)
        max_classes = np.argmax(scores, axis=1)
        valid = max_scores >= conf_threshold
        if np.any(valid):
            valid_boxes = boxes[valid]
            valid_scores = max_scores[valid]
            valid_classes = max_classes[valid]

            x1 = valid_boxes[:, 0] - valid_boxes[:, 2] / 2
            y1 = valid_boxes[:, 1] - valid_boxes[:, 3] / 2
            x2 = valid_boxes[:, 0] + valid_boxes[:, 2] / 2
            y2 = valid_boxes[:, 1] + valid_boxes[:, 3] / 2

            x1 = (x1 - dw) / ratio[0]
            y1 = (y1 - dh) / ratio[1]
            x2 = (x2 - dw) / ratio[0]
            y2 = (y2 - dh) / ratio[1]

            x1 = np.clip(x1, 0, width)
            y1 = np.clip(y1, 0, height)
            x2 = np.clip(x2, 0, width)
            y2 = np.clip(y2, 0, height)

            boxes_xyxy = np.column_stack([x1, y1, x2, y2])

            keep = non_max_suppression(boxes_xyxy, valid_scores, conf_threshold, iou_threshold)
            if len(keep) > 0:
                final_boxes = boxes_xyxy[keep]
                final_scores = valid_scores[keep]
                final_classes = valid_classes[keep]
                total_detections += len(final_boxes)
                confidence_sum += float(np.sum(final_scores))
                all_confidences.extend(final_scores.tolist())
                for cls_id, conf in zip(final_classes, final_scores):
                    name = f"class_{int(cls_id)}"
                    if name not in detection_classes:
                        detection_classes[name] = {'count': 0, 'conf_sum': 0.0}
                    detection_classes[name]['count'] += 1
                    detection_classes[name]['conf_sum'] += float(conf)
                for box, score, cls_id in zip(final_boxes, final_scores, final_classes):
                    x1_, y1_, x2_, y2_ = map(int, box)
                    cv2.rectangle(frame, (x1_, y1_), (x2_, y2_), (0, 255, 0), 2)
                    label = f"class_{int(cls_id)}: {score:.2f}"
                    tsize = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 2)[0]
                    cv2.rectangle(frame, (x1_, y1_ - tsize[1] - 6), (x1_ + tsize[0], y1_), (0, 255, 0), -1)
                    cv2.putText(frame, label, (x1_, y1_ - 4), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 2)

        if save_video and out_writer:
            out_writer.write(frame)

    cap.release()
    if out_writer:
        out_writer.release()

    average_confidence = (confidence_sum / total_detections) if total_detections > 0 else 0.0

    summary = {
        "script": "detect_onnx",
        "input_video": str(video_path),
        "output_video": str(output_path) if output_path else None,
        "total_frames": frame_count,
        "total_detections": int(total_detections),
        "average_confidence": float(average_confidence),
        "detections_by_class": detection_classes
    }

    # Write summary if requested
    if outdir:
        try:
            summary_path = outdir / "summary.json"
            with open(summary_path, "w") as f:
                json.dump(summary, f, indent=2)
        except Exception as e:
            print("Warning: failed to write summary.json:", str(e))

    # Also print summary to stdout for external parsers
    try:
        print(json.dumps(summary))
        sys.stdout.flush()
    except Exception:
        pass

    return summary

if __name__ == '__main__':
    args = parse_args()
    detect(args.video, args.model, args.conf, args.iou, args.save_txt, args.save_video, args.output)
