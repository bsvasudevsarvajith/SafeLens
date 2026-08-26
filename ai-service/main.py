import os
import sys
import shutil
import tempfile
from datetime import datetime
from typing import Optional
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware

# Ensure root directory is on python path for importing ai modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from ai.services.crowd_analyzer import CrowdAnalyzer

app = FastAPI(
    title="SafeRoute Women – AI Video & Crowd Inference Service",
    description="Python FastAPI service with Roboflow AI (people-detection-o4rdr/12) for person density & crowd activity analysis.",
    version="2.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize unified Crowd Analyzer
analyzer = CrowdAnalyzer()

AI_SECRET_KEY = os.getenv("AI_API_KEY", "wsrs_super_secret_ai_key_2026")

def verify_api_key(x_api_key: Optional[str] = Header(None)):
    """Validates API Key from header if provided."""
    if x_api_key and x_api_key != AI_SECRET_KEY:
        raise HTTPException(status_code=401, detail="Invalid AI Service API Key")
    return True

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "SafeRoute Women AI Inference Service",
        "timestamp": datetime.utcnow().isoformat(),
        "model_id": "people-detection-o4rdr/12",
        "provider": analyzer.provider_type,
        "roboflow_configured": bool(analyzer.roboflow_provider.api_key)
    }

@app.post("/analyze-image")
async def analyze_image_endpoint(
    image: UploadFile = File(...),
    location_name: Optional[str] = Form("Karur"),
    region: Optional[str] = Form("Karur"),
    area: Optional[str] = Form("Central"),
    latitude: Optional[float] = Form(10.9601),
    longitude: Optional[float] = Form(78.0766),
    x_api_key: Optional[str] = Header(None)
):
    """
    Accepts single image upload, runs Roboflow people detection,
    and returns detected bounding boxes, people count, average confidence, and activity level.
    """
    verify_api_key(x_api_key)

    if not image.filename.lower().endswith(('.jpg', '.jpeg', '.png', '.webp', '.bmp')):
        raise HTTPException(status_code=400, detail="Supported image formats: JPG, JPEG, PNG, WEBP, BMP")

    image_bytes = await image.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Empty image payload received.")

    try:
        results = analyzer.analyze_image(image_bytes)
        results["image_name"] = image.filename
        results["location"] = {
            "name": location_name,
            "region": region,
            "area": area,
            "latitude": latitude,
            "longitude": longitude
        }
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image AI analysis failed: {str(e)}")

@app.post("/analyze-video")
async def analyze_video_endpoint(
    video: UploadFile = File(...),
    region: Optional[str] = Form("Karur"),
    area: Optional[str] = Form("Bus Stand"),
    landmark: Optional[str] = Form("Main Entrance"),
    latitude: Optional[float] = Form(10.9601),
    longitude: Optional[float] = Form(78.0766),
    sample_rate_fps: Optional[int] = Form(1),
    x_api_key: Optional[str] = Header(None)
):
    """
    Accepts video upload, samples frames at configurable FPS (e.g. 1 frame/sec),
    sends to Roboflow people detection, aggregates counts, and returns crowd statistics.
    """
    verify_api_key(x_api_key)

    if not video.filename.lower().endswith(('.mp4', '.avi', '.mov', '.mkv', '.webm')):
        raise HTTPException(status_code=400, detail="Supported video formats: MP4, AVI, MOV, MKV, WEBM")

    # Create temporary file
    suffix = os.path.splitext(video.filename)[1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        shutil.copyfileobj(video.file, tmp)
        tmp_path = tmp.name

    try:
        results = analyzer.analyze_video(tmp_path, sample_rate_fps=sample_rate_fps)
        results["video_name"] = video.filename
        results["region"] = region
        results["area"] = area
        results["landmark"] = landmark
        results["latitude"] = latitude
        results["longitude"] = longitude
        results["analyzed_at"] = datetime.utcnow().isoformat()
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Video AI processing failed: {str(e)}")
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

@app.post("/analyze-cctv-frame")
async def analyze_cctv_frame_endpoint(
    camera_id: str = Form("demo-cam-01"),
    camera_name: str = Form("Karur Bus Stand Camera 01"),
    frame_image: Optional[UploadFile] = File(None),
    x_api_key: Optional[str] = Header(None)
):
    """
    Accepts a frame from an authorized CCTV camera stream or uses demo camera frame,
    runs people detection, and returns real-time crowd metrics.
    """
    verify_api_key(x_api_key)

    if frame_image is not None:
        frame_bytes = await frame_image.read()
    else:
        # Use demo sample frame
        frame_bytes = f"cctv_frame_{camera_id}_{datetime.utcnow().timestamp()}".encode("utf-8")

    results = analyzer.analyze_image(frame_bytes)
    results["camera_id"] = camera_id
    results["camera_name"] = camera_name
    return results

@app.post("/analyze-demo")
async def analyze_demo_endpoint(
    region: Optional[str] = Form("Karur"),
    area: Optional[str] = Form("Bus Stand"),
    latitude: Optional[float] = Form(10.9601),
    longitude: Optional[float] = Form(78.0766)
):
    """
    Generates synthetic sample video analysis for demonstration.
    """
    results = analyzer._generate_fallback_video_stats()
    results["region"] = region
    results["area"] = area
    results["latitude"] = latitude
    results["longitude"] = longitude
    results["analyzed_at"] = datetime.utcnow().isoformat()
    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
