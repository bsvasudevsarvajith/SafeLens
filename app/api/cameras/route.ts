import { NextRequest, NextResponse } from "next/server";
import { INITIAL_CAMERAS, CameraRecord } from "@/lib/seedData";

// In-memory / server cache fallback for demonstration
let serverCameras: CameraRecord[] = [...INITIAL_CAMERAS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const region = searchParams.get("region");
    const isAdmin = searchParams.get("isAdmin") === "true";

    let filtered = serverCameras;
    if (region && region.toLowerCase() !== "all") {
      filtered = serverCameras.filter(
        (c) => c.regionName.toLowerCase() === region.toLowerCase()
      );
    }

    // Sanitize sensitive RTSP/stream credentials for normal public users
    const sanitized = filtered.map((cam) => {
      if (isAdmin) {
        return cam;
      }
      const { streamUrl, ...safeCam } = cam;
      return {
        ...safeCam,
        // Only return demo stream URL or safe browser-playable URL if applicable
        streamUrl: cam.streamType === "Demo" ? cam.streamUrl : undefined,
      };
    });

    return NextResponse.json({
      success: true,
      count: sanitized.length,
      cameras: sanitized,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch cameras" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.cameraName || !body.regionName || !body.areaName || body.latitude === undefined || body.longitude === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing required camera fields (name, region, area, lat, lng)" },
        { status: 400 }
      );
    }

    const newCamera: CameraRecord = {
      id: `cam-${Date.now()}`,
      cameraName: body.cameraName,
      regionName: body.regionName,
      areaName: body.areaName,
      landmark: body.landmark || "General Intersection",
      latitude: parseFloat(body.latitude),
      longitude: parseFloat(body.longitude),
      cameraType: body.cameraType || "Fixed CCTV",
      streamType: body.streamType || "RTSP",
      streamUrl: body.streamUrl || "",
      status: body.status || "active",
      description: body.description || "Authorized municipal CCTV surveillance node.",
      peopleCount: body.peopleCount || Math.floor(12 + Math.random() * 20),
      crowdDensity: body.crowdDensity || Math.floor(35 + Math.random() * 45),
      activityLevel: body.activityLevel || "HIGH",
      confidence: 0.91,
      lastAnalysisTimestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDemo: body.streamType === "Demo",
    };

    serverCameras.unshift(newCamera);

    return NextResponse.json({
      success: true,
      camera: newCamera,
      message: "Camera registered successfully",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to register camera" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Camera ID required" }, { status: 400 });
    }

    serverCameras = serverCameras.filter((c) => c.id !== id);

    return NextResponse.json({
      success: true,
      message: "Camera deleted successfully",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete camera" },
      { status: 500 }
    );
  }
}
