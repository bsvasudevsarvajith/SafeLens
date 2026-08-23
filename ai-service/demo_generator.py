import cv2
import numpy as np
import os

def create_demo_video(output_path: str = "demo_karur_camera.mp4", num_frames: int = 60):
    """Generates a small valid MP4 video with moving figures for local AI testing."""
    width, height = 640, 480
    fps = 30
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

    for i in range(num_frames):
        # Dark navy street background
        frame = np.full((height, width, 3), (40, 25, 15), dtype=np.uint8)

        # Draw simulated street lamp light beam
        cv2.circle(frame, (320, 240), 180, (120, 100, 70), -1)

        # Draw simulated moving human figures (ellipses & circles)
        num_persons = 12 + (i % 8)
        for p in range(num_persons):
            x = int(100 + (p * 40 + i * 3) % (width - 150))
            y = int(180 + (p * 25) % (height - 200))
            # Body & head
            cv2.circle(frame, (x, y - 25), 10, (200, 220, 240), -1)
            cv2.ellipse(frame, (x, y + 10), (12, 25), 0, 0, 360, (180, 200, 220), -1)

        out.write(frame)

    out.release()
    print(f"[WSRS AI] Created test video at: {output_path}")
    return output_path

if __name__ == "__main__":
    create_demo_video()
