import os
import cv2
import base64
import requests
import numpy as np

class RoboflowRESTClient:
    """Lightweight REST client wrapper for Roboflow Hosted Inference API (Python 3.13+ compatible)."""
    def __init__(self, api_key: str, api_url: str = "https://detect.roboflow.com"):
        self.api_key = api_key
        self.base_url = api_url.rstrip("/")

    def infer(self, image_data: bytes, model_id: str = "detect-persons-bghyp/4"):
        b64_str = base64.b64encode(image_data).decode("ascii")
        url = f"{self.base_url}/{model_id}?api_key={self.api_key}"
        resp = requests.post(
            url,
            data=b64_str,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            timeout=10
        )
        if resp.status_code == 200:
            return resp.json()
        raise RuntimeError(f"Roboflow API error ({resp.status_code}): {resp.text}")

class PersonDetector:
    def __init__(
        self,
        confidence_threshold: float = 0.5,
        model_name: str = "detect-persons-bghyp/4",
        api_key: str = None
    ):
        self.confidence_threshold = confidence_threshold
        self.model_name = model_name
        self.model_version = "Roboflow 4.0 / YOLOv8"
        self.roboflow_client = None
        self.yolo_model = None
        self.hog = None

        self.api_key = api_key or os.getenv("ROBOFLOW_API_KEY", "dP4J83atFgW7aEs30MAi")
        self.model_id = os.getenv("ROBOFLOW_MODEL_ID", "detect-persons-bghyp/4")
        self._init_models()

    def _init_models(self):
        """Initializes Roboflow HTTP Client with fallbacks to YOLOv8 & OpenCV HOG."""
        # 1. Attempt Roboflow Inference HTTP Client / REST Client
        if self.api_key:
            try:
                from inference_sdk import InferenceHTTPClient
                self.roboflow_client = InferenceHTTPClient(
                    api_url="https://serverless.roboflow.com",
                    api_key=self.api_key
                )
                print(f"[WSRS AI] Initialized Roboflow Inference SDK Client (Model: {self.model_id})")
            except Exception as err:
                print(f"[WSRS AI] Using direct Roboflow REST Client ({err}). Model: {self.model_id}")
                self.roboflow_client = RoboflowRESTClient(api_key=self.api_key)

        # 2. Attempt Ultralytics YOLOv8 local model fallback
        try:
            from ultralytics import YOLO
            self.yolo_model = YOLO("yolov8n.pt")
            print(f"[WSRS AI] Loaded local Ultralytics YOLO model: yolov8n.pt")
        except Exception as e:
            print(f"[WSRS AI] YOLO fallback initialization info ({e}). Using OpenCV HOG.")

        # Always initialize OpenCV HOG as ultimate fallback
        try:
            self.hog = cv2.HOGDescriptor()
            self.hog.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())
        except Exception as hog_err:
            print(f"[WSRS AI] HOG init note: {hog_err}")

    def detect_persons_in_frame(self, frame: np.ndarray) -> int:
        """Processes a single BGR image frame and returns detected person count."""
        if frame is None or frame.size == 0:
            return 0

        # Method 1: Roboflow Serverless Hosted Inference
        if self.roboflow_client is not None:
            try:
                # Convert OpenCV BGR frame to JPEG byte buffer for Roboflow API
                _, buffer = cv2.imencode(".jpg", frame)
                response = self.roboflow_client.infer(buffer.tobytes(), model_id=self.model_id)

                predictions = response.get("predictions", []) if isinstance(response, dict) else []
                # Count predictions matching person class & confidence threshold
                person_count = sum(
                    1 for pred in predictions 
                    if pred.get("confidence", 0) >= self.confidence_threshold
                )
                return person_count
            except Exception as rf_err:
                print(f"[WSRS AI] Roboflow Inference API fallback: {rf_err}")

        # Method 2: Ultralytics YOLOv8 Local Model Fallback
        if self.yolo_model is not None:
            try:
                results = self.yolo_model(frame, classes=[0], conf=self.confidence_threshold, verbose=False)
                if len(results) > 0 and results[0].boxes is not None:
                    return len(results[0].boxes)
            except Exception as err:
                print(f"[WSRS AI] Local YOLO frame inference error: {err}")

        # Method 3: OpenCV HOG People Detector Fallback
        if self.hog is not None:
            try:
                h, w = frame.shape[:2]
                scale = 600.0 / max(h, w)
                resized = cv2.resize(frame, (int(w * scale), int(h * scale))) if scale < 1.0 else frame
                boxes, _ = self.hog.detectMultiScale(resized, winStride=(8, 8), padding=(4, 4), scale=1.05)
                return len(boxes)
            except Exception as e:
                print(f"[WSRS AI] OpenCV HOG error: {e}")

        return 0


