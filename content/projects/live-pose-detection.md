+++
title = "Live Pose Detection"
description = "Real-time desktop pose estimation for fitness: 33-keypoint tracking at 30+ FPS on CPU, with rep counting, form scoring, and posture analysis."
weight = 3

[extra]
repository = "https://github.com/abuzarai/Live-Pose-Detection"
technologies = ["MediaPipe", "OpenCV", "Python", "PySide6"]
+++

Built on MediaPipe PoseLandmarker and OpenCV, it tracks 33 full-body
keypoints from a webcam feed.

- Exercise reps: squat and push-up counting with configurable angle
  thresholds
- Form scoring: green/yellow/red skeleton overlay from joint-angle quality
- Posture analysis: forward head, uneven shoulders, rounded back, neck tilt
- Live angle timeline: a chart of joint angles over the last 300 frames
- Reference skeleton: semi-transparent guide overlay to compare poses
- Video input: run recorded .mp4 / .avi / .mov files instead of the camera
- Session export: annotated MP4 plus CSV/JSON keypoint data per session
- Multi-person: up to 3 people tracked with proximity-assigned IDs

It's a PySide6 app with a live feed and tabbed panels, built on OpenCV +
NumPy/SciPy + Matplotlib, packaged with uv, and tested with pytest (15
tests).
