import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const path = searchParams.get("path");
  const fileName = searchParams.get("filename") || "download";

  if (!path) {
    return new NextResponse("Missing path", { status: 400 });
  }

  // Construct full URL if it's a relative path
  const url = path.startsWith("http")
    ? path
    : process.env.NEXT_PUBLIC_URL_ENDPOINT
    ? `${process.env.NEXT_PUBLIC_URL_ENDPOINT.replace(/\/$/, "")}/${path.replace(/^\//, "")}`
    : null;

  if (!url) {
    return new NextResponse("Invalid configuration", { status: 500 });
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return new NextResponse(`Failed to fetch image: ${response.statusText}`, { status: response.status });
    }

    const blob = await response.blob();
    const headers = new Headers();
    headers.set("Content-Type", blob.type);
    headers.set("Content-Disposition", `attachment; filename="${fileName}"`);

    return new NextResponse(blob, { headers });
  } catch (error) {
    console.error("Download error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
