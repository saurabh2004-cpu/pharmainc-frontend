import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import * as Minio from 'minio';

const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT || "";
const BUCKET_NAME = process.env.MINIO_BUCKET || "";
const ACCESS_KEY = process.env.MINIO_ACCESS_KEY || "";
const SECRET_KEY = process.env.MINIO_SECRET_KEY || "";

let minioClient: Minio.Client | null = null;

const getMinioClient = (): Minio.Client => {
  if (!minioClient) {
    minioClient = new Minio.Client({
      endPoint: MINIO_ENDPOINT,
      useSSL: true,
      accessKey: ACCESS_KEY,
      secretKey: SECRET_KEY,
      region: 'us-east-1',
    });
  }
  return minioClient;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileName, fileType, fileSize, folderId } = body;

    if (!fileName || !fileType || !fileSize || !folderId) {
      return NextResponse.json(
        { error: 'Missing required fields: fileName, fileType, fileSize, folderId' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (fileSize > maxSize) {
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

    const isValidType = Object.values(allowedTypes).flat().includes(fileType);
    if (!isValidType) {
      return NextResponse.json(
        { error: `Invalid file type: ${fileType}` },
        { status: 400 }
      );
    }

    const client = getMinioClient();
    
    const fileId = uuidv4();
    const fileExtension = fileName.split('.').pop() || '';
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const objectKey = `posts/${folderId}/${fileId}.${fileExtension}`;

    const bucketExists = await client.bucketExists(BUCKET_NAME);
    if (!bucketExists) {
      await client.makeBucket(BUCKET_NAME);
    }

    const presignedUrl = await client.presignedPutObject(
      BUCKET_NAME,
      objectKey,
      24 * 60 * 60 // 24 hours
    );

    const fileUrl = `/api/cdn/${folderId}/${fileId}?filename=${encodeURIComponent(sanitizedFileName)}`;

    return NextResponse.json({
      presignedUrl,
      fileId,
      objectKey,
      fileName: sanitizedFileName,
      fileUrl,
      folderId,
      fileExtension
    });

  } catch (error) {
    console.error('Presigned URL generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate presigned URL' },
      { status: 500 }
    );
  }
}
