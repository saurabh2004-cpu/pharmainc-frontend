import { NextRequest, NextResponse } from 'next/server';
import { getFileFromFolder, getFileFromMinio } from '@/lib/minio/minio-server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string[] }> }
) {
  const {id} = await params; 
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    const type = searchParams.get('type');
    const ext = searchParams.get('ext');

    if (id && id.length === 2) {
      const [folderId, fileId] = id;
      const objectKey = `posts/${folderId}/${fileId}`;

      try {
        const extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm', 'pdf', 'doc', 'docx', 'txt', 'csv', 'xls', 'xlsx'];
        
        for (const extension of extensions) {
          try {
            const fullObjectKey = `${objectKey}.${extension}`;
            const { buffer, contentType, fileName } = await getFileFromFolder(fullObjectKey);

            return new NextResponse(new Uint8Array(buffer), {
              headers: {
                'Content-Type': contentType,
                'Content-Disposition': `inline; filename="${filename || fileName}"`,
                'Cache-Control': 'public, max-age=31536000, immutable',
                'ETag': `"${folderId}-${fileId}"`,
              },
            });
          } catch (error) {
            continue;
          }
        }

        return NextResponse.json(
          { error: 'File not found' },
          { status: 404 }
        );
      } catch (error) {
        console.error('Error fetching file from folder:', error);
        return NextResponse.json(
          { error: 'Failed to fetch file' },
          { status: 500 }
        );
      }
    }

    if (id && id.length === 1) {
      const [fileId] = id;

      try {
        const { buffer, contentType } = await getFileFromMinio(fileId, type || 'files', ext || '');

        return new NextResponse(new Uint8Array(buffer), {
          headers: {
            'Content-Type': contentType,
            'Content-Disposition': `inline; filename="${fileId}.${ext || 'file'}"`,
            'Cache-Control': 'public, max-age=31536000, immutable',
            'ETag': `"${fileId}"`,
          },
        });
      } catch (error) {
        console.error('Error fetching legacy file:', error);
        return NextResponse.json(
          { error: 'File not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Invalid file path' },
      { status: 400 }
    );

  } catch (error) {
    console.error('CDN error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
