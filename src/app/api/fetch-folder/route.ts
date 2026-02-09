import { NextRequest, NextResponse } from 'next/server';
import { listFilesInFolder } from '@/lib/minio/minio-server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get('folderId');

    if (!folderId) {
      return NextResponse.json(
        { error: 'Folder ID is required' },
        { status: 400 }
      );
    }

    const files = await listFilesInFolder(folderId);

    const filesWithUrls = files.map(file => ({
      id: file.fileId,
      filename: file.fileName,
      size: file.size,
      content_type: file.contentType,
      url: `/api/cdn/${folderId}/${file.fileId}?filename=${encodeURIComponent(file.fileName)}`,
      objectKey: file.objectKey,
      lastModified: file.lastModified,
      type: getFileTypeFromMime(file.contentType)
    }));

    return NextResponse.json({
      folderId,
      files: filesWithUrls,
      count: filesWithUrls.length
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch folder contents' },
      { status: 500 }
    );
  }
}

function getFileTypeFromMime(mimeType: string): 'image' | 'document' | 'video' | 'other' {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.includes('pdf') || 
      mimeType.includes('document') || 
      mimeType.includes('text') || 
      mimeType.includes('spreadsheet') ||
      mimeType.includes('excel') ||
      mimeType.includes('csv')) {
    return 'document';
  }
  return 'other';
}
