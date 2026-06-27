import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
        return new NextResponse("Missing url parameter", { status: 400 });
    }

    try {
        // Fetch the target image from the internal/external server (e.g. Minio)
        const response = await fetch(url);
        if (!response.ok) {
            return new NextResponse("Failed to fetch image from source", { status: response.status });
        }

        const contentType = response.headers.get("content-type") || "image/png";
        const body = response.body;

        // Return the image stream with correct content type and caching header
        return new NextResponse(body, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch (error) {
        return new NextResponse("Error fetching image through proxy", { status: 500 });
    }
}
