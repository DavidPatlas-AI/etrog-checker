from __future__ import annotations
import json
from pathlib import Path
from typing import Any, Dict, List

import cv2 # type: ignore
import numpy as np

from קוד_src.io_utils import resolve_reports_dir, build_report_paths, imwrite_unicode
from קוד_src.visualize import draw_mask, draw_detections, put_psak
from קוד_src.rule_engine import PsakEngine

try:
	from ultralytics import YOLO  # type: ignore
except Exception:  # pragma: no cover
	YOLO = None  # type: ignore


def is_image(path: Path) -> bool:
	return path.suffix.lower() in {".jpg", ".jpeg", ".png", ".bmp", ".tif", ".tiff", ".webp"}


def color_mask_etrog_bgr(image_bgr: np.ndarray) -> np.ndarray:
	hsv = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2HSV)
	lower = np.array([20, 40, 40], dtype=np.uint8)
	upper = np.array([75, 255, 255], dtype=np.uint8)
	mask = cv2.inRange(hsv, lower, upper)
	mask = cv2.medianBlur(mask, 5)
	return mask


def yolo_detect(model: Any, image_bgr: np.ndarray, return_masks: bool = False):
	if model is None:
		return [], None
	try:
		results = model(image_bgr, verbose=False)
	except Exception:
		return [], None
	if not results:
		return [], None
	res = results[0]
	detections: List[Dict[str, Any]] = []
	try:
		names = res.names if hasattr(res, "names") else {}
		if hasattr(res, "boxes") and res.boxes is not None:
			for b in res.boxes:
				x1, y1, x2, y2 = [float(v) for v in b.xyxy[0].tolist()]
				cls = int(b.cls[0].item()) if getattr(b, "cls", None) is not None else -1
				conf = float(b.conf[0].item()) if getattr(b, "conf", None) is not None else None
				label = names.get(cls, str(cls))
				detections.append({"bbox": [x1, y1, x2, y2], "label": label, "score": conf})
	except Exception:
		pass
	mask_out = None
	if return_masks:
		if hasattr(res, "masks") and res.masks is not None and len(res.masks.data) > 0:
			try:
				mask_out = (res.masks.data[0].cpu().numpy() > 0.5).astype(np.uint8) * 255
				if mask_out.shape[:2] != image_bgr.shape[:2]:
					mask_out = cv2.resize(mask_out, (image_bgr.shape[1], image_bgr.shape[0]), interpolation=cv2.INTER_NEAREST)
			except Exception:
				mask_out = None
		elif detections:
			try:
				mask_out = np.zeros(image_bgr.shape[:2], dtype=np.uint8)
				x1, y1, x2, y2 = [int(v) for v in detections[0]["bbox"]]
				mask_out[y1:y2, x1:x2] = 255
			except Exception:
				mask_out = None
	return detections, mask_out


def main() -> None:
	import argparse

	parser = argparse.ArgumentParser(description="Analyze all images in a folder and save annotated results + JSON reports")
	parser.add_argument("--input", type=str, required=True, help="Input folder with images")
	parser.add_argument("--etrog_model", type=str, default="", help="Path to YOLO model for etrog (seg/det)")
	parser.add_argument("--defects_model", type=str, default="", help="Path to YOLO model for defects detection")
	parser.add_argument("--day", type=int, default=1, help="Day in Sukkot (1=Yom Rishon)")
	parser.add_argument("--reports_dir", type=str, default="", help="Custom reports directory")
	args = parser.parse_args()

	inp = Path(args.input)
	if not inp.exists() or not inp.is_dir():
		raise FileNotFoundError(f"Input folder not found: {inp}")

	reports_dir = Path(args.reports_dir) if args.reports_dir else resolve_reports_dir()
	reports_dir.mkdir(parents=True, exist_ok=True)

	engine = PsakEngine()
	etrog_model = YOLO(args.etrog_model) if YOLO and args.etrog_model else None
	defects_model = YOLO(args.defects_model) if YOLO and args.defects_model else None

	batch_summary: List[Dict[str, Any]] = []

	for p in sorted(inp.iterdir()):
		if not p.is_file() or not is_image(p):
			continue
		img = cv2.imdecode(np.fromfile(str(p), dtype=np.uint8), cv2.IMREAD_COLOR)
		if img is None:
			continue

		mask = None
		detections: List[Dict[str, Any]] = []

		if etrog_model is not None:
			_, mask = yolo_detect(etrog_model, img, return_masks=True)
		else:
			mask = color_mask_etrog_bgr(img)

		if defects_model is not None:
			detections, _ = yolo_detect(defects_model, img, return_masks=False)

		verdict, reason = engine.decide(detections, {"day": args.day})

		vis = img.copy()
		vis = draw_mask(vis, mask)
		vis = draw_detections(vis, detections)
		vis = put_psak(vis, verdict, reason)

		stem = p.stem + "_analyzed"
		img_path, json_path = build_report_paths(stem, reports_dir)
		imwrite_unicode(img_path, vis)
		payload = {
			"source": str(p),
			"verdict": verdict,
			"reason": reason,
			"detections": detections,
			"image": img_path.name,
		}
		json_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
		batch_summary.append({"source": str(p), "image": img_path.name, "json": json_path.name, "verdict": verdict})

	# write batch results
	batch_path = reports_dir / "batch_results.json"
	batch_path.write_text(json.dumps(batch_summary, ensure_ascii=False, indent=2), encoding="utf-8")
	print(f"Saved {len(batch_summary)} results to {batch_path}")


if __name__ == "__main__":
	main()
