import os
import cv2
import base64
import requests
import numpy as np
from typing import List, Dict, Any, Optional

class RoboflowProvider:
    """
    Roboflow AI People Detection Provider.
    Uses model: people-detection-o4rdr/12
    Calls Roboflow Serverless/Hosted Inference API securely on the backend.
    """
    def __init__(
        self,
        api_key: Optional[str] = None,
        model_id: str = "people-detection-o4rdr/12",
        confidence_threshold: float = 0.4
    ):
        self.api_key = api_key or os.getenv("ROBOFLOW_API_KEY", "")
        self.model_id = os.getenv("ROBOFLOW_MODEL_ID", model_id)
        self.confidence_threshold = float(os.getenv("CONFIDENCE_THRESHOLD", confidence_threshold))
        self.api_url = "https://serverless.roboflow.com"
        self.inference_client = None
        self._init_client()

    def _init_client(self):
        """Initializes inference-sdk HTTP client if installed, or falls back to robust REST client."""
        if not self.api_key:
            print("[RoboflowProvider] Warning: ROBOFLOW_API_KEY is not set. Inference calls will use fallback or fail gracefully.")
            return

        try:
            from inference_sdk import InferenceHTTPClient
            self.inference_client = InferenceHTTPClient(
                api_url=self.api_url,
                api_key=self.api_key
            )
            print(f"[RoboflowProvider] InferenceHTTPClient initialized for model {self.model_id}")
        except Exception as e:
            # inference-sdk may not be available on Python 3.13+; REST client is 100% compatible
            print(f"[RoboflowProvider] inference-sdk not available ({e}), using direct Roboflow REST API.")
            self.inference_client = None

    def infer_image_bytes(self, image_bytes: bytes) -> Dict[str, Any]:
        """
        Runs inference on raw image bytes and returns normalized detections.
        """
        # If no API key configured, raise to allow fallback
        if not self.api_key:
            raise ValueError("ROBOFLOW_API_KEY is not configured.")

        # Method A: inference-sdk
        if self.inference_client is not None:
            try:
                raw_result = self.inference_client.infer(image_bytes, model_id=self.model_id)
                return self._normalize_predictions(raw_result)
            except Exception as sdk_err:
                print(f"[RoboflowProvider] Inference client failed ({sdk_err}), falling back to direct REST.")

        # Method B: Direct REST API to Roboflow Hosted Inference
        b64_encoded = base64.b64encode(image_bytes).decode("ascii")
        url = f"https://detect.roboflow.com/{self.model_id}?api_key={self.api_key}"
        
        resp = requests.post(
            url,
            data=b64_encoded,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            timeout=12
        )
        if resp.status_code == 200:
            raw_result = resp.json()
            return self._normalize_predictions(raw_result)
        else:
            raise RuntimeError(f"Roboflow API returned status {resp.status_code}: {resp.text}")

    def infer_frame(self, frame: np.ndarray) -> Dict[str, Any]:
        """
        Runs inference on an OpenCV BGR numpy frame.
        """
        if frame is None or frame.size == 0:
            return {"predictions": [], "people_count": 0, "avg_confidence": 0.0}

        success, buffer = cv2.imencode(".jpg", frame)
        if not success:
            raise RuntimeError("Failed to encode frame as JPEG.")
        return self.infer_image_bytes(buffer.tobytes())

    def _normalize_predictions(self, raw_result: Dict[str, Any]) -> Dict[str, Any]:
        """
        Extracts people bounding boxes and calculates confidence & counts.
        """
        predictions_raw = raw_result.get("predictions", []) if isinstance(raw_result, dict) else []
        people_boxes = []
        confidences = []

        image_info = raw_result.get("image", {})
        img_w = image_info.get("width", 640)
        img_h = image_info.get("height", 480)

        for p in predictions_raw:
            class_name = p.get("class", "").lower()
            confidence = p.get("confidence", 0.0)

            # Filter for person / human detections
            if class_name in ["person", "people", "pedestrian", "human"] or "person" in class_name:
                if confidence >= self.confidence_threshold:
                    x = p.get("x", 0)
                    y = p.get("y", 0)
                    w = p.get("width", 0)
                    h = p.get("height", 0)
                    
                    people_boxes.append({
                        "x": x,
                        "y": y,
                        "width": w,
                        "height": h,
                        "confidence": round(float(confidence), 3),
                        "class": "person",
                        "bbox": [
                            round(max(0, x - w / 2), 1),
                            round(max(0, y - h / 2), 1),
                            round(min(img_w, x + w / 2), 1),
                            round(min(img_h, y + h / 2), 1)
                        ]
                    })
                    confidences.append(confidence)

        avg_conf = round(float(np.mean(confidences)), 3) if confidences else 0.0

        return {
            "predictions": people_boxes,
            "people_count": len(people_boxes),
            "avg_confidence": avg_conf,
            "model_id": self.model_id,
            "provider": "roboflow"
        }
