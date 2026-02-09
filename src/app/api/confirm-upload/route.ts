import { NextRequest, NextResponse } from 'next/server';
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
    const { objectKey, fileName, fileType } = body;

    if (!objectKey || !fileName || !fileType) {
      return NextResponse.json(
        { error: 'Missing required fields: objectKey, fileName, fileType' },
        { status: 400 }
      );
    }

    const client = getMinioClient();
    
    try {
      const stat = await client.statObject(BUCKET_NAME, objectKey);
      
      return NextResponse.json({
        success: true,
        message: 'File upload confirmed successfully',
        objectKey,
        fileName,
        size: stat.size,
        lastModified: stat.lastModified,
      });

    } catch (error) {
      console.error('File not found:', error);
      return NextResponse.json(
        { error: 'File not found - upload may have failed' },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error('File confirmation error:', error);
    return NextResponse.json(
      { error: 'Failed to confirm file upload' },
      { status: 500 }
    );
  }
}
