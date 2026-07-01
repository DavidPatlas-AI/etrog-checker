from __future__ import annotations
from pathlib import Path
from typing import Dict, Any, List, Tuple
import yaml # type: ignore


class PsakEngine:
	"""Loads YAML rules and applies a simple decision policy on detections.

	Detections format: List of dicts with keys:
	- label: str in {stain, scratch, hole, pitom_missing, pitom_broken, peel_missing}
	- score: float (optional)
	- bbox: [x1,y1,x2,y2] (optional)
	- attrs: dict with additional attributes (e.g., {"hole_through": True}) (optional)
	"""

	def __init__(self, yaml_path: Path = Path("כללים_rules/psak.yaml")) -> None:
		self.yaml_path = yaml_path
		with open(self.yaml_path, "r", encoding="utf-8") as f:
			self.rules = yaml.safe_load(f) or {}
		self.labels_map: Dict[str, str] = (self.rules.get("labels") or {
			"mehudar": "mehudar",
			"kosher": "kosher",
			"bediavad": "bediavad",
			"pasul": "pasul",
		})

	def decide(self, detections: List[Dict[str, Any]], context: Dict[str, Any] | None = None) -> Tuple[str, str]:
		"""Return (verdict_label, reason)."""
		context = context or {}
		day = int(context.get("day", 1))
		pitom_rules = (self.rules.get("pitom") or {})
		yom_rishon_required = bool(pitom_rules.get("yom_rishon_required", True))

		counts: Dict[str, int] = {}
		for d in detections:
			lbl = str(d.get("label", "")).strip()
			counts[lbl] = counts.get(lbl, 0) + 1

		# Critical halachic conditions first
		if day == 1 and yom_rishon_required and counts.get("pitom_missing", 0) > 0:
			return self.labels_map.get("pasul", "pasul"), "חסר פיטום ביום ראשון"

		# If there is a through-hole, it's pasul; shallow hole -> bediavad
		for d in detections:
			if d.get("label") == "hole":
				attrs = d.get("attrs") or {}
				if attrs.get("through") is True:
					return self.labels_map.get("pasul", "pasul"), "חורים עוברים"
				else:
					return self.labels_map.get("bediavad", "bediavad"), "חורים שטחיים"

		# Pitom broken typically non-mehudar; treat as bediavad
		if counts.get("pitom_broken", 0) > 0:
			return self.labels_map.get("bediavad", "bediavad"), "פיטום שבור"

		# Many stains/scratches degrade
		stains = counts.get("stain", 0)
		scratches = counts.get("scratch", 0)
		peel_missing = counts.get("peel_missing", 0)

		if peel_missing > 0:
			return self.labels_map.get("bediavad", "bediavad"), "חסר קליפת פרי"

		if stains >= 3 or scratches >= 3:
			return self.labels_map.get("bediavad", "bediavad"), "ריבוי כתמים/שריטות"
		if stains >= 1 or scratches >= 1:
			return self.labels_map.get("kosher", "kosher"), "כתמים/שריטות קלים"

		return self.labels_map.get("mehudar", "mehudar"), "נקי מפגמים משמעותיים"
