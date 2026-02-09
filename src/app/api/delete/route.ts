import { NextRequest, NextResponse } from 'next/server';
import { deleteFolderFromMinio } from '@/lib/minio/minio-server';

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication from request headers
    // Temporary solution - replace with proper auth token verification later
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get('folderId');

    if (!folderId) {
      return NextResponse.json(
        { error: 'Folder ID is required' },
        { status: 400 }
      );
    }

    await deleteFolderFromMinio(folderId);

    return NextResponse.json(
      { message: 'Folder deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete folder error:', error);
    
    return NextResponse.json(
      { error: 'Failed to delete folder' },
      { status: 500 }
    );
  }
}
