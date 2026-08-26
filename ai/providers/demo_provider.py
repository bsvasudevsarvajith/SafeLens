import time
import random
import numpy as np
from typing import Dict, Any, Optional

class DemoProvider:
    """
    High-fidelity Synthetic & Deterministic Demo AI Provider.
    Generates realistic bounding boxes, crowd density, and confidence metrics
    when physical CCTV or Roboflow keys are not connected.
    """
    def __init__(self, model_id: str = "demo-people-detector-v1"):
        self.model_id = model_id

    def infer_image_bytes(self, image_bytes: bytes, target_count: Optional[int] = None) -> Dict[str, Any]:
        """Generates realistic synthetic person detection bounding boxes for an image."""
        # Use image length as seed for deterministic demo results
        seed_val = len(image_bytes) % 1000
        rng = random.Random(seed_val + int(time.time() // 30))
        
        count = target_count if target_count is not None else rng.randint(18, 34)
        boxes = []
        confidences = []

        width = 640
        height = 480

        for i in range(count):
            bw = rng.randint(30, 80)
            bh = rng.randint(80, 180)
            bx = rng.randint(int(bw / 2) + 10, width - int(bw / 2) - 10)
            by = rng.randint(int(bh / 2) + 20, height - int(bh / 2) - 10)
            conf = round(rng.uniform(0.82, 0.97), 3)

            boxes.append({
                "x": bx,
                "y": by,
                "width": bw,
                "height": bh,
                "confidence": conf,
                "class": "person",
                "bbox": [
                    max(0, bx - bw // 2),
                    max(0, by - bh // 2),
                    min(width, bx + bw // 2),
                    min(height, by + bh // 2)
                ]
            })
            confidences.append(conf)

        avg_conf = round(float(np.mean(confidences)), 3) if confidences else 0.91

        return {
            "predictions": boxes,
            "people_count": count,
            "avg_confidence": avg_conf,
            "model_id": self.model_id,
            "provider": "demo"
        }

    def infer_frame(self, frame: np.ndarray, frame_idx: int = 0) -> Dict[str, Any]:
        """Generates realistic smooth person count for consecutive video frames."""
        # Smooth oscillation over time to mimic real movement
        base_count = 24
        variation = int(6 * np.sin(frame_idx * 0.2) + 3 * np.cos(frame_idx * 0.5))
        count = max(4, base_count + variation + random.randint(-2, 2))
        
        # Create mock bytes to invoke infer_image_bytes
        mock_bytes = b"frame_" + str(frame_idx).encode("utf-8")
        return self.infer_image_bytes(mock_bytes, target_count=count)
