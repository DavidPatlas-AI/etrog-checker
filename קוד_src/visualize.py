from __future__ import annotations
import cv2
import numpy as np
from typing import List, Dict, Any, Optional


def draw_mask(image: np.ndarray, mask: Optional[np.ndarray], color=(0, 200, 0), alpha: float = 0.35) -> np.ndarray:
	if mask is None:
		return image
	vis = image.copy()
	if mask.dtype != np.uint8:
		mask_bin = (mask > 0.5).astype(np.uint8)
	else:
		mask_bin = (mask > 0).astype(np.uint8)
	colored = np.zeros_like(image)
	colored[:, :] = color
	colored = cv2.bitwise_and(colored, colored, mask=mask_bin)
	vis = cv2.addWeighted(vis, 1.0, colored, alpha, 0)
	return vis


def draw_detections(image: np.ndarray, detections: List[Dict[str, Any]]) -> np.ndarray:
	vis = image.copy()
	for det in detections:
		x1, y1, x2, y2 = [int(v) for v in det.get("bbox", [0, 0, 0, 0])]
		label = str(det.get("label", "defect"))
		score = det.get("score")
		caption = f"{label}"
		if isinstance(score, (int, float)):
			caption += f" {score:.2f}"
		cv2.rectangle(vis, (x1, y1), (x2, y2), (0, 0, 255), 2)
		cv2.putText(vis, caption, (x1, max(0, y1 - 6)), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2, cv2.LINE_AA)
	return vis


def put_psak(image: np.ndarray, verdict_label: str, reason: str = "") -> np.ndarray:
	vis = image.copy()
	# choose color by label
	color_map = {
		"mehudar": (0, 180, 0),
		"kosher": (0, 140, 0),
		"bediavad": (0, 140, 180),
		"pasul": (0, 0, 180),
	}
	bg = color_map.get(verdict_label, (60, 60, 60))
	pad = 10
	height = 48
	cv2.rectangle(vis, (0, 0), (vis.shape[1], height + 2 * pad), bg, -1)
	text = f"פסק: {verdict_label}"
	if reason:
		text += f" — {reason}"
	cv2.putText(vis, text, (10, 28 + pad), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2, cv2.LINE_AA)
	return vis
