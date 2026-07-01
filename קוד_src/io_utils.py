from __future__ import annotations
from pathlib import Path
from datetime import datetime
from typing import Tuple
import numpy as np # type: ignore
import cv2 # type: ignore


def resolve_reports_dir(preferred: Path | None = None) -> Path:
	"""Return a Windows-safe reports directory path.
	If a preferred path is provided, ensure it exists. Otherwise, try known variants
	and create a safe default if none exist.
	"""
	if preferred is not None:
		preferred.mkdir(parents=True, exist_ok=True)
		return preferred

	candidates = [
		Path("דוחות_reports"),
		Path('דו"חות_reports'),
		Path("דו״חות_reports"),
	]
	for p in candidates:
		if p.exists():
			return p
	# default to safe folder name
	safe = candidates[0]
	safe.mkdir(parents=True, exist_ok=True)
	return safe


def timestamp_str() -> str:
	return datetime.now().strftime("%Y%m%d_%H%M%S")


def build_report_paths(base_stem: str, reports_dir: Path | None = None) -> Path | Tuple[Path, Path]:
	"""Return (image_path, json_path) for a given base name in the reports dir."""
	reports = resolve_reports_dir(reports_dir)
	img_path = reports / f"{base_stem}.jpg"
	json_path = reports / f"{base_stem}.json"
	return img_path, json_path


def imwrite_unicode(path: Path, image: np.ndarray) -> bool:
	"""Write image to a Unicode path on Windows using imencode+tofile."""
	ext = path.suffix if path.suffix else ".jpg"
	ok, buf = cv2.imencode(ext, image)
	if not ok:
		return False
	buf.tofile(str(path))
	return True
