import { NextRequest, NextResponse } from 'next/server';
import { uploadProfilePicture } from '@/lib/minio/minio-server';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    const instituteId = formData.get('instituteId') as string;

    const id = userId || instituteId;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: 'No user ID or institute ID provided' },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit for profile pictures)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      );
    }

    // Convert image to PNG and resize if necessary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const processedBuffer = await sharp(buffer)
      .resize(400, 400, { fit: 'cover', position: 'center' }) // Square crop
      .png()
      .toBuffer();

    const { fileId, objectKey, fileName } = await uploadProfilePicture(
      processedBuffer,
      file.name,
      id
    );

    const profilePictureUrl = `/api/get-user-profile/${fileName}?userId=${id}`;

    return NextResponse.json({
      id: fileId,
      filename: fileName,
      size: processedBuffer.length,
      content_type: 'image/png',
      url: profilePictureUrl,
      type: 'image',
      extension: 'png',
      objectKey,
      userId: id
    });

  } catch (error) {
    console.error('Profile picture upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload profile picture' },
      { status: 500 }
    );
  }
}
