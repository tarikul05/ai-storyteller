import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const storyId = searchParams.get('storyId');
  const sceneNum = searchParams.get('sceneNum');

  if (!storyId || sceneNum === null) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/story-image/${storyId}/${sceneNum}` || `http://localhost:8000/story-image/${storyId}/${sceneNum}`;

    const response = await fetch(backendUrl);
    
    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }

    const imageBuffer = await response.arrayBuffer();
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
  }
}