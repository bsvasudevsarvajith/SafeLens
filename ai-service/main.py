import os
import shutil
import tempfile
from datetime import datetime
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Header, Security
from fastapi.middleware.cors import CORSMiddleware
from detector import PersonDetector
from video_processor import VideoProcessor
from demo_generator import create_demo_video

app = FastAPI(
    title="WSRS AI Video Inference Service",
    description="Python FastAPI service with YOLO object detection for person density & human activity analysis in Karur District.",
    version="1.0.0"
)

# Enable CORS for Next.js web application
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI detector & processor
detector = PersonDetector(confidence_threshold=0.5, model_name="YOLOv8n")
processor = VideoProcessor(detector)

AI_SECRET_KEY = os.getenv("AI_API_KEY", "wsrs_super_secret_ai_key_2026")

def verify_api_key(x_api_key: str = Header(None)):
    """Validates API Key from header if provided."""
    if x_api_key and x_api_key != AI_SECRET_KEY:
        raise HTTPException(status_code=401, detail="Invalid AI Service API Key")
    return True

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "WSRS AI Video Inference Service",
        "timestamp": datetime.utcnow().isoformat(),
        "model_name": detector.model_name,
        "model_version": detector.model_version
    }

@app.post("/analyze-video")
async def analyze_video(
    video: UploadFile = File(...),
    location_id: str = Form("karur-new-bus-stand"),
    area_id: str = Form("area-01"),
    x_api_key: str = Header(None)
):
    """
    Accepts video upload, runs YOLO person detection frame-by-frame,
    and returns person density statistics and human activity level.
    """
    verify_api_key(x_api_key)

    if not video.filename.endswith(('.mp4', '.avi', '.mov', '.mkv', '.webm')):
        raise HTTPException(status_code=400, detail="Invalid video format. Supported formats: MP4, AVI, MOV, MKV, WEBM")

    # Create temporary file to save uploaded video
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(video.filename)[1]) as tmp:
        shutil.copyfileobj(video.file, tmp)
        tmp_path = tmp.name

    try:
        results = processor.process_video_file(tmp_path, sample_rate_fps=1)
        results["location"] = location_id
        results["area"] = area_id
        results["video_name"] = video.filename
        results["analyzed_at"] = datetime.utcnow().isoformat()
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Video AI processing failed: {str(e)}")
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

@app.post("/analyze-demo")
async def analyze_demo(
    location_id: str = Form("karur-new-bus-stand"),
    area_id: str = Form("area-01")
):
    """
    Generates a quick synthetic demonstration video and analyzes it.
    """
    tmp_path = create_demo_video("temp_demo.mp4", num_frames=90)
    try:
        results = processor.process_video_file(tmp_path, sample_rate_fps=1)
        results["location"] = location_id
        results["area"] = area_id
        results["video_name"] = "karur_demo_camera_feed.mp4"
        results["analyzed_at"] = datetime.utcnow().isoformat()
        return results
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
