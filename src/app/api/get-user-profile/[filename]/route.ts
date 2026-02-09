import { NextRequest, NextResponse } from 'next/server';
import { getProfilePicture } from '@/lib/minio/minio-server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const instituteId = searchParams.get('instituteId');

    const id = userId || instituteId;

    if (!id) {
      return NextResponse.json(
        { error: 'User ID or Institute ID is required' },
        { status: 400 }
      );
    }

    const profilePicture = await getProfilePicture(id);

    if (!profilePicture) {
      return NextResponse.json(
        { error: 'Profile picture not found' },
        { status: 404 }
      );
    }

    const { buffer, contentType, fileName } = profilePicture;

    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Content-Length', buffer.length.toString());
    headers.set('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
    headers.set('Content-Disposition', `inline; filename="${fileName}"`);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers,
    });

  } catch (error) {
    console.error('Get profile picture error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve profile picture' },
      { status: 500 }
    );
  }
}
