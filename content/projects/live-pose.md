+++
title = "live-pose-detection"
weight = 3
description = "desktop pose estimation: reps + form scoring (MediaPipe · PySide6)"
[extra]
link = "https://github.com/abuzarai/Live-Pose-Detection"

[taxonomies]
tags = ["cv", "python", "desktop"]
+++

A desktop app for real-time pose estimation from a webcam — 33 full-body
keypoints at 30+ FPS on CPU via MediaPipe PoseLandmarker.

- **Exercise reps** — squat and push-up counting with configurable angle
  thresholds
- **Form scoring** — green/yellow/red skeleton overlay from joint-angle
  quality
- **Posture analysis** — forward head, uneven shoulders, rounded back, neck
  tilt
- **Live angle timeline** — a chart of joint angles over the last 300 frames
- **Reference skeleton** — semi-transparent guide overlay to compare poses
- **Video input** — run recorded .mp4 / .avi / .mov files instead of the
  camera
- **Session export** — annotated MP4 plus CSV/JSON keypoint data per session
- **Multi-person** — up to 3 people tracked with proximity-assigned IDs

PySide6 window with live feed and tabbed panels; OpenCV + NumPy/SciPy +
Matplotlib underneath, uv for packaging, pytest for testing (15 tests).

**Built with:** MediaPipe PoseLandmarker · PySide6 · OpenCV · Python · pytest.