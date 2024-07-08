import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const GOOGLE_API_URL = process.env.GOOGLE_API_URL;
    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

    if (!GOOGLE_API_URL || !GOOGLE_API_KEY) {
      throw new Error("Missing environment variables");
    }

    const url = searchParams.get("url");

    const id = url.split("?v=")[1];

    const res = await fetch(
      `${GOOGLE_API_URL}?id=${id}&key=${GOOGLE_API_KEY}&part=snippet`,
    );
    const data = await res.json();

    if (data.items.length > 0) {
      return NextResponse.json({ status: 200 });
    } else {
      return NextResponse.json({ status: 404 });
    }
  } catch (error) {}
}
