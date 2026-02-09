import { NextRequest, NextResponse } from 'next/server';
import { getFileFromFolder } from '@/lib/minio/minio-server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string[] }> }
) {
  const { id } = await params;
  
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!id || id.length < 2) {
      return NextResponse.json(
        { error: 'Invalid file path. Expected format: /api/resumes/cdn/jobId/fileId' },
        { status: 400 }
      );
    }

    // Format: /api/resumes/cdn/jobId/fileId
    const [jobId, fileId] = id;
    
    // Construct the MinIO object key: posts/resumes/jobId/fileId.extension
    const baseObjectKey = `posts/resumes/${jobId}/${fileId}`;
    
    // Try common document extensions
    const extensions = ['pdf', 'doc', 'docx'];
    
    for (const extension of extensions) {
      try {
        const fullObjectKey = `${baseObjectKey}.${extension}`;
        const { buffer, contentType, fileName } = await getFileFromFolder(fullObjectKey);

        return new NextResponse(new Uint8Array(buffer), {
          headers: {
            'Content-Type': contentType,
            'Content-Disposition': `inline; filename="${filename || fileName}"`,
            'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
            'ETag': `"${jobId}-${fileId}"`,
          },
        });
      } catch (error) {
        // Try next extension
        continue;
      }
    }

    return NextResponse.json(
      { error: 'Resume not found' },
      { status: 404 }
    );

  } catch (error) {
    console.error('Resume CDN error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
