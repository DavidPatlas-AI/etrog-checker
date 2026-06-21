from __future__ import annotations
import json
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import cv2 # type: ignore
import numpy as np # type: ignore

from קוד_src.io_utils import resolve_reports_dir, timestamp_str, build_report_paths, imwrite_unicode
from קוד_src.visualize import draw_mask, draw_detections, put_psak
from קוד_src.rule_engine import PsakEngine

try:
	from ultralytics import YOLO  # type: ignore
except Exception:  # pragma: no cover
	YOLO = None  # type: ignore


def color_mask_etrog_bgr(image_bgr: np.ndarray) -> np.ndarray:
	"""Very simple HSV-based mask heuristic for etrog-like color."""
	hsv = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2HSV)
	lower = np.array([20, 40, 40], dtype=np.uint8)
	upper = np.array([75, 255, 255], dtype=np.uint8)
	mask = cv2.inRange(hsv, lower, upper)
	mask = cv2.medianBlur(mask, 5)
	return mask


def yolo_detect(
	model: Any,
	image_bgr: np.ndarray,
	return_masks: bool = False,
	) -> Tuple[List[Dict[str, Any]], Optional[np.ndarray]]:
	"""Run a YOLO model, return detections list and an optional mask for etrog.
	This function is resilient across detection/segmentation models.
	"""
	if model is None:
		return [], None
	results = model(image_bgr, verbose=False)
	if not results:
		return [], None
	res = results[0]
	# Build detections
	detections: List[Dict[str, Any]] = []
	try:
		names = res.names if hasattr(res, "names") else {}
		if hasattr(res, "boxes") and res.boxes is not None:
			for b in res.boxes:
				x1, y1, x2, y2 = [float(v) for v in b.xyxy[0].tolist()]
				cls = int(b.cls[0].item()) if getattr(b, "cls", None) is not None else -1
				conf = float(b.conf[0].item()) if getattr(b, "conf", None) is not None else None
				label = names.get(cls, str(cls))
				detections.append({
					"bbox": [x1, y1, x2, y2],
					"label": label,
					"score": conf,
				})
	except Exception:
		pass

	mask_out: Optional[np.ndarray] = None
	if return_masks:
		# Prefer polygon/segmentations when available
		if hasattr(res, "masks") and res.masks is not None and len(res.masks.data) > 0:
			try:
				mask_out = (res.masks.data[0].cpu().numpy() > 0.5).astype(np.uint8) * 255
				# Resize to frame size if needed
				if mask_out.shape[:2] != image_bgr.shape[:2]:
					mask_out = cv2.resize(mask_out, (image_bgr.shape[1], image_bgr.shape[0]), interpolation=cv2.INTER_NEAREST)
			except Exception:
				mask_out = None
		elif detections:
			# fallback to first bbox as rectangular mask
			try:
				mask_out = np.zeros(image_bgr.shape[:2], dtype=np.uint8)
				x1, y1, x2, y2 = [int(v) for v in detections[0]["bbox"]]
				mask_out[y1:y2, x1:x2] = 255
			except Exception:
				mask_out = None

	return detections, mask_out


def save_report(base_stem: str, image_bgr: np.ndarray, detections: List[Dict[str, Any]], verdict: str, reason: str, reports_dir: Optional[Path] = None) -> None:
	img_path, json_path = build_report_paths(base_stem, reports_dir)
	imwrite_unicode(img_path, image_bgr)
	payload = {
		"timestamp": base_stem.split("_")[-1],
		"verdict": verdict,
		"reason": reason,
		"detections": detections,
		"image": img_path.name,
	}
	json_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def main() -> None:
	import argparse

	parser = argparse.ArgumentParser(description="Realtime Etrog analyzer")
	parser.add_argument("--etrog_model", type=str, default="", help="Path to YOLO model for etrog (seg/det)")
	parser.add_argument("--defects_model", type=str, default="", help="Path to YOLO model for defects detection")
	parser.add_argument("--camera", type=int, default=0, help="Camera index")
	parser.add_argument("--day", type=int, default=1, help="Day in Sukkot (1=Yom Rishon)")
	parser.add_argument("--reports_dir", type=str, default="", help="Custom reports directory")
	args = parser.parse_args()

	reports_dir = Path(args.reports_dir) if args.reports_dir else resolve_reports_dir()
	engine = PsakEngine()

	etrog_model = YOLO(args.etrog_model) if YOLO and args.etrog_model else None
	defects_model = YOLO(args.defects_model) if YOLO and args.defects_model else None

	cap = cv2.VideoCapture(args.camera)
	if not cap.isOpened():
		raise RuntimeError("Cannot open camera")

	while True:
		ok, frame = cap.read()
		if not ok:
			break

		mask = None
		detections: List[Dict[str, Any]] = []

		if etrog_model is not None:
			_, mask = yolo_detect(etrog_model, frame, return_masks=True)
		else:
			mask = color_mask_etrog_bgr(frame)

		if defects_model is not None:
			detections, _ = yolo_detect(defects_model, frame, return_masks=False)

		verdict, reason = engine.decide(detections, {"day": args.day})

		vis = frame.copy()
		vis = draw_mask(vis, mask)
		vis = draw_detections(vis, detections)
		vis = put_psak(vis, verdict, reason)

		cv2.imshow("Etrog Realtime", vis)
		key = cv2.waitKey(1) & 0xFF
		if key in (27, ord("q")):
			break
		if key == ord("s"):
			stamp = timestamp_str()
			stem = f"etrog_{stamp}"
			save_report(stem, vis, detections, verdict, reason, reports_dir)

	cap.release()
	cv2.destroyAllWindows()


if __name__ == "__main__":
	main()
