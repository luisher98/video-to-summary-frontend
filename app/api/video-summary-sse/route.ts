export const runtime = "node.js";

export const dynamic = "force-dynamic";

export async function GET() {
  let responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const words = searchParams.get("words");
  const res = await fetch(
    `http://localhost:5000/api/summary-sse?url=${url}&words=${words}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const data = (await res.json()) as Summary;

  return Response.json(data);
}
