export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')
    const res = await fetch(`http://localhost:5000/api/summary?url=${url}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await res.json() as Summary;
   
    return Response.json(data)
  }