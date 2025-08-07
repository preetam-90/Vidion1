import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const imageUrl = req.nextUrl.searchParams.get('url');

  if (!imageUrl) {
    return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
  }

  try {
    const response = await fetch(imageUrl);
    console.log(`Proxy fetching ${imageUrl}. Response status: ${response.status}`);

    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch image: ${response.statusText}` }, { status: response.status });
    }

    const contentType = response.headers.get('content-type');
    const arrayBuffer = await response.arrayBuffer();

    const headers = new Headers();
    if (contentType) {
      headers.set('Content-Type', contentType);
    }
    // Set appropriate cache control for images
    headers.set('Cache-Control', 'public, max-age=3600, must-revalidate');

    return new NextResponse(arrayBuffer, { status: 200, headers });
  } catch (error: any) {
    console.error('Error proxying image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
