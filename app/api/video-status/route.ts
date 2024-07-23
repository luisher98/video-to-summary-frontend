import { NextResponse } from "next/server";


export type VideoInfo = {
  id: string;
  title: string;
  trimmedDescription: string;
  mediumThumbnail: {
    url: string;
    width: number;
    height: number;
  };
  channelTitle: string;
};

export type YouTubeApiResponse = {
  items: YouTubeVideo[];
};

type Thumbnail = {
  url: string;
  width: number;
  height: number;
};

type Snippet = {
  title: string;
  description: string;
  thumbnails: {
    medium: Thumbnail;
  };
  channelTitle: string;
};

type YouTubeVideo = {
  snippet: Snippet;
};


export async function GET(req: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(req.url);
    const GOOGLE_API_URL = process.env.GOOGLE_API_URL;
    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

    if (!GOOGLE_API_URL || !GOOGLE_API_KEY) {
      throw new Error("Missing environment variables");
    }

    const url = searchParams.get("url");

    if (!url) {
      throw new Error("URL parameter is missing");
    }

    const id = url.split("?v=")[1];

    if (!id) {
      throw new Error("Invalid URL format");
    }

    const response = await fetch(
      `${GOOGLE_API_URL}?id=${id}&key=${GOOGLE_API_KEY}&part=snippet`,
    );
    
    const data = (await response.json()) as YouTubeApiResponse;

    if (!response.ok) {
      throw new Error("Failed to fetch data from YouTube API");
    }

    if (data.items.length > 0) {
      return NextResponse.json({ status: 200 });
    } else {
      return NextResponse.json({ status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ status: 500, message: (error as Error).message });
  }
}
