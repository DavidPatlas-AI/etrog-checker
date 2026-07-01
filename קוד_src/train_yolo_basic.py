import argparse
from ultralytics import YOLO

"""
אימון מהיר ל-YOLO (זיהוי/סגמנטציה) על אתרוגים.

דוגמאות:
- סגמנטציה של פרי האתרוג (מסכה):
  python קוד_src/train_yolo_basic.py --task seg --data תיוגים_labels/yolo/etrog.yaml --model yolov8s-seg.pt --epochs 100

- זיהוי פגמים:
  python קוד_src/train_yolo_basic.py --task detect --data תיוגים_labels/yolo/defects.yaml --model yolov8s.pt --epochs 100
"""

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--task', choices=['detect', 'seg'], required=True, help='detect=זיהוי, seg=סגמנטציה')
    ap.add_argument('--data', required=True, help='קובץ YAML של הדאטה (etrog.yaml/defects.yaml)')
    ap.add_argument('--model', default='yolov8s.pt', help='בסיס לאימון (למשל yolov8s.pt או yolov8s-seg.pt)')
    ap.add_argument('--epochs', type=int, default=50)
    ap.add_argument('--imgsz', type=int, default=640)
    args = ap.parse_args()

    yolo = YOLO(args.model)
    if args.task == 'seg':
        yolo.train(data=args.data, task='segment', epochs=args.epochs, imgsz=args.imgsz)
    else:
        yolo.train(data=args.data, task='detect', epochs=args.epochs, imgsz=args.imgsz)


if __name__ == '__main__':
    main()
