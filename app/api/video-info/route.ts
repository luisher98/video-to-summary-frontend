export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const API_URL = process.env.API_URL ?? "http://localhost:5000";
  const url = searchParams.get("url");
  const res = await fetch(`${API_URL}/api/info?url=${url}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = (await res.json()) as VideoInfo;

  return Response.json(data);
}
