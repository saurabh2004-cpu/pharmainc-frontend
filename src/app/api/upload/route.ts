import { NextRequest, NextResponse } from 'next/server';
import { uploadFileToFolder } from '@/lib/minio/minio-server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folderId = formData.get('folderId') as string;
    const type = formData.get('type') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!folderId) {
      return NextResponse.json(
        { error: 'No folder ID provided' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    const allowedTypes = {
      image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      document: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      ],
      video: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov', 'video/quicktime']
    };

    const fileType = type as keyof typeof allowedTypes;
    if (fileType && allowedTypes[fileType] && !allowedTypes[fileType].includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type for ${fileType}` },
        { status: 400 }
      );
    }
    
    const { fileId, objectKey, fileName } = await uploadFileToFolder(
      file,
      file.name,
      file.type,
      folderId
    );

    const fileExtension = file.name.split('.').pop() || '';

    return NextResponse.json({
      id: fileId,
      filename: fileName,
      size: file.size,
      content_type: file.type,
      url: `/api/cdn/${folderId}/${fileId}?filename=${encodeURIComponent(fileName)}`,
      type: fileType,
      extension: fileExtension,
      objectKey,
      folderId
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
