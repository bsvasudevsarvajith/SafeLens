import { NextRequest, NextResponse } from "next/server";
import { isWithinKarurDistrict, UNSUPPORTED_LOCATION_MESSAGE } from "@/lib/geo/karurBounds";
import { generateRoutesToBusStand } from "@/lib/geo/routingService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { startLat, startLng, originName } = body;

    if (startLat === undefined || startLng === undefined) {
      return NextResponse.json(
        { success: false, error: "Latitude and longitude coordinates are required." },
        { status: 400 }
      );
    }

    const lat = parseFloat(startLat);
    const lng = parseFloat(startLng);

    // Enforce Karur District Geographic Restriction
    const isSupported = isWithinKarurDistrict(lat, lng);

    if (!isSupported) {
      return NextResponse.json(
        {
          success: false,
          isSupportedArea: false,
          error: "UNSUPPORTED_LOCATION",
          details: UNSUPPORTED_LOCATION_MESSAGE,
        },
        { status: 400 }
      );
    }

    // Generate Candidate Routes to Karur New Bus Stand
    const routes = generateRoutesToBusStand({ lat, lng }, originName || "Selected Origin");

    return NextResponse.json({
      success: true,
      isSupportedArea: true,
      destination: {
        id: "karur-new-bus-stand",
        name: "Karur New Bus Stand",
        district: "Karur",
        state: "Tamil Nadu",
        lat: 10.9602,
        lng: 78.0766,
      },
      routes: routes,
      recommendedRouteId: routes.find((r) => r.isRecommended)?.id || routes[0].id,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to calculate routes." },
      { status: 500 }
    );
  }
}
