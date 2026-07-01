# -*- coding: utf-8 -*-
r"""
ארגון תיקיית "בודק אתרוגים" — גרסה מעודכנת עם שמות תיקיות בעברית+אנגלית.

⚠️ חשוב מאוד:
הסקריפט אף פעם לא מוחק קבצים שלא הצליח להעביר.
במקרה של בעיה (קובץ נעול, תיקייה לא ריקה, התנגשות שם) —
הקבצים נשארים במקומם המקורי, ולא נמחקים בכוח.

שימוש:
    python organize_etrog_repo.py --root "C:\Users\User\Desktop\בודק_אתרוגים"      # בדיקה בלבד (Dry-Run)
    python organize_etrog_repo.py --root "C:\Users\User\Desktop\בודק_אתרוגים" --apply  # מבצע בפועל
"""

import os, re, csv, argparse, shutil
from pathlib import Path

# === שמות תיקיות דו־לשוניים (עברית+אנגלית עם _) ===
DOCS_DIR     = "מסמכים_docs"
CONFIG_DIR   = "הגדרות_config"
GIT_DIR      = "גיט_git"
VSCODE_DIR   = "ויזקוד_vscode"
TESTS_DIR    = "בדיקות_tests"
DIAG_DIR     = "אבחון_diagnostic"
DATASET_DIR  = "נתונים_dataset"
RAW_DIR      = "גלמי_raw"
GITHUB_DIR   = "גיטהאב_github"

# === מיפוי תיקיות עליונות לשמות דו-לשוניים (לא מזיזים .github) ===
DIR_BILINGUAL_MAP = {
    'versions': 'גרסאות_versions',
    'versions-viewer': 'צופה_גרסאות_versions-viewer',
    'dataset': DATASET_DIR,
    'src': 'קוד_src',
    'tools': 'כלים_tools',
}

# תיקיות שנמנע מהעברה מתוך dev (בשל קבצי Build/נעילה)
EXCLUDED_DEV_DIRS = { 'dist', 'node_modules', '.vite', '.cache', '.next', 'build', 'out' }

DOCS_FILES   = {"README.md","README_MAIN.md","START_HERE.md","about.html","cursor_.md"}
CONFIG_FILES = {".eslintrc",".eslintrc.cjs",".prettierrc",".prettierignore",".npmrc",".nvmrc",".editorconfig","browserslist"}
GIT_FILES    = {".gitignore",".gitattributes",".gitmessage"}

def safe_mkdir(p: Path):
    p.mkdir(parents=True, exist_ok=True)

def move(plan, src: Path, dst: Path):
    plan.append((str(src), str(dst)))

def normalize_dataset(root: Path, plan: list):
    """
    מסדר את dataset/raw לנתיב:
    נתונים_dataset/גלמי_raw/<שנה>/<חודש-יום>/<ETROG_תאריך_שעה>/view-XX.jpg
    """
    ds = root / DATASET_DIR / RAW_DIR
    if not ds.exists():
        return

    for p in ds.rglob("*"):
        if p.is_file() and p.suffix.lower() in {".jpg",".jpeg",".png",".webp"}:
            parts = p.parts
            etrog_id, date_str = None, None

            for comp in reversed(parts):
                if comp.startswith("ETROG_"):
                    etrog_id = comp
                    break
            for comp in parts:
                if re.fullmatch(r"\d{4}-\d{2}-\d{2}", comp):
                    date_str = comp
                elif re.fullmatch(r"\d{8}", comp):
                    date_str = f"{comp[0:4]}-{comp[4:6]}-{comp[6:8]}"
            if date_str is None and etrog_id:
                m = re.search(r"ETROG_(\d{8})_", etrog_id)
                if m:
                    v = m.group(1)
                    date_str = f"{v[0:4]}-{v[4:6]}-{v[6:8]}"

            if date_str and etrog_id:
                year, month_day = date_str[:4], date_str[5:]
                dst_dir = root / DATASET_DIR / RAW_DIR / year / month_day / etrog_id
            else:
                dst_dir = p.parent

            fname = p.name
            vm = re.search(r"(view[-_ ]?)(\d+)", fname, re.IGNORECASE)
            if vm:
                view_num = int(vm.group(2))
                new_name = f"view-{view_num:02d}{p.suffix.lower()}"
            else:
                new_name = fname

            dst = dst_dir / new_name
            if dst.resolve() != p.resolve():
                safe_mkdir(dst_dir)
                move(plan, p, dst)

def collect_moves(root: Path) -> list[tuple[str,str]]:
    plan = []
    docs   = root / DOCS_DIR
    config = root / CONFIG_DIR
    gitdir = root / GIT_DIR
    vscode = root / VSCODE_DIR
    tests  = root / TESTS_DIR / DIAG_DIR

    # 0) שינוי שמות תיקיות עליונות לשמות דו-לשוניים
    for src_name, dst_name in DIR_BILINGUAL_MAP.items():
        if src_name in ('.github', 'dev'):
            continue
        src_path = root / src_name
        dst_path = root / dst_name
        if src_path.exists() and src_path.resolve() != dst_path.resolve():
            safe_mkdir(dst_path.parent)
            move(plan, src_path, dst_path)

    # 0.1) העברה בטוחה של תוכן dev → פיתוח_dev (דלג על dist/node_modules וכד')
    dev_src = root / 'dev'
    dev_dst = root / 'פיתוח_dev'
    if dev_src.exists():
        safe_mkdir(dev_dst)
        for item in dev_src.iterdir():
            if item.is_dir() and item.name in EXCLUDED_DEV_DIRS:
                continue
            move(plan, item, dev_dst / item.name)

    for name in DOCS_FILES:
        src = root / name
        if src.exists():
            safe_mkdir(docs); move(plan, src, docs / src.name)
    for p in root.glob("README*.md"):
        if p.exists(): safe_mkdir(docs); move(plan, p, docs / p.name)

    for name in CONFIG_FILES:
        src = root / name
        if src.exists():
            safe_mkdir(config); move(plan, src, config / src.name)

    for name in GIT_FILES:
        src = root / name
        if src.exists():
            safe_mkdir(gitdir); move(plan, src, gitdir / src.name)
    husky = root / ".husky"
    if husky.exists(): safe_mkdir(gitdir); move(plan, husky, gitdir / husky.name)

    vs = root / ".vscode"
    if vs.exists():
        safe_mkdir(vscode)
        for item in vs.iterdir(): move(plan, item, vscode / item.name)

    css_diag = root / "css_diagnostic"
    if css_diag.exists():
        safe_mkdir(tests)
        for item in css_diag.iterdir(): move(plan, item, tests / item.name)

    normalize_dataset(root, plan)
    return plan

def ensure_top_dirs(root: Path):
    """Create the recommended top-level bilingual directories if missing."""
    for name in [
        DOCS_DIR,
        CONFIG_DIR,
        GIT_DIR,
        VSCODE_DIR,
        TESTS_DIR,
        (Path(TESTS_DIR)/DIAG_DIR).as_posix(),
        DATASET_DIR,
        (Path(DATASET_DIR)/RAW_DIR).as_posix(),
        GITHUB_DIR,
    ]:
        safe_mkdir(root / Path(name))

def apply_moves(plan: list[tuple[str,str]]):
    for s,d in plan:
        s_p, d_p = Path(s), Path(d)
        d_p.parent.mkdir(parents=True, exist_ok=True)
        if s_p.exists():
            try:
                if d_p.exists():
                    base, suf = d_p.stem, d_p.suffix
                    i=1
                    while True:
                        cand = d_p.with_name(f"{base}({i}){suf}")
                        if not cand.exists():
                            d_p = cand; break
                        i+=1
                shutil.move(str(s_p), str(d_p))
            except Exception as e:
                print(f"⚠️ לא הועבר: {s_p} (נשאר במקומו) — {e}")

def write_plan(plan, out: Path):
    out.parent.mkdir(parents=True, exist_ok=True)
    with open(out,"w",newline="",encoding="utf-8") as f:
        w=csv.writer(f); w.writerow(["source","dest"]); w.writerows(plan)

if __name__=="__main__":
    ap=argparse.ArgumentParser()
    ap.add_argument("--root",required=True,help="נתיב לתיקייה הראשית")
    ap.add_argument("--apply",action="store_true",help="לבצע בפועל (ברירת מחדל: בדיקה בלבד)")
    args=ap.parse_args()
    root=Path(args.root).resolve()
    plan=collect_moves(root)
    print(f"נמצאו {len(plan)} מהלכים אפשריים.")
    write_plan(plan, root/"move_plan.csv")
    if args.apply:
        print("מתחיל יישום בפועל...")
        ensure_top_dirs(root)
        apply_moves(plan)
        print("✅ בוצע. קבצים שלא הועברו נשארו במקומם.")
    else:
        print("💡 מצב בדיקה בלבד (Dry-Run).")


