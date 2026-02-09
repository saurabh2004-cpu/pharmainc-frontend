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


export const uploadFileToMinio = async (
  file: File | Buffer, 
  fileName: string, 
  contentType: string, 
  type: string = 'files'
): Promise<{ fileId: string; objectKey: string }> => {
  const client = getMinioClient();
  
  const fileId = uuidv4();
  const fileExtension = fileName.split('.').pop() || '';
  const objectKey = `posts/${fileId}.${fileExtension}`;

  const bucketExists = await client.bucketExists(BUCKET_NAME);
  if (!bucketExists) {
    await client.makeBucket(BUCKET_NAME);
  }

  let buffer: Buffer;
  if (file instanceof File) {
    const arrayBuffer = await file.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
  } else {
    buffer = file;
  }

  await client.putObject(BUCKET_NAME, objectKey, buffer, buffer.length, {
    'Content-Type': contentType,
  });

  return { fileId, objectKey };
};

export const uploadFileToFolder = async (
  file: File | Buffer, 
  fileName: string, 
  contentType: string, 
  folderId: string
): Promise<{ fileId: string; objectKey: string; fileName: string }> => {
  const client = getMinioClient();
  
  const fileId = uuidv4();
  const fileExtension = fileName.split('.').pop() || '';
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const objectKey = `posts/${folderId}/${fileId}.${fileExtension}`;

  const bucketExists = await client.bucketExists(BUCKET_NAME);
  if (!bucketExists) {
    await client.makeBucket(BUCKET_NAME);
  }

  let buffer: Buffer;
  if (file instanceof File) {
    const arrayBuffer = await file.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
  } else {
    buffer = file;
  }

  await client.putObject(BUCKET_NAME, objectKey, buffer, buffer.length, {
    'Content-Type': contentType,
    'X-Original-Filename': sanitizedFileName,
  });

  return { fileId, objectKey, fileName: sanitizedFileName };
};

export const listFilesInFolder = async (folderId: string): Promise<Array<{
  fileId: string;
  objectKey: string;
  fileName: string;
  contentType: string;
  size: number;
  lastModified: Date;
}>> => {
  const client = getMinioClient();
  const prefix = `posts/${folderId}/`;
  
  const stream = client.listObjects(BUCKET_NAME, prefix, false);
  const files: Array<{
    fileId: string;
    objectKey: string;
    fileName: string;
    contentType: string;
    size: number;
    lastModified: Date;
  }> = [];

  const objectsToProcess: any[] = [];

  return new Promise((resolve, reject) => {
    stream.on('data', (obj) => {
      objectsToProcess.push(obj);
    });

    stream.on('end', async () => {
      
      try {
        for (const obj of objectsToProcess) {
          try {
            const stat = await client.statObject(BUCKET_NAME, obj.name!);
            const pathParts = obj.name!.split('/');
            const fileNameWithExt = pathParts[pathParts.length - 1];
            const fileId = fileNameWithExt.split('.')[0];
            const originalFileName = stat.metaData['x-original-filename'] || fileNameWithExt;
            
            files.push({
              fileId,
              objectKey: obj.name!,
              fileName: originalFileName,
              contentType: stat.metaData['content-type'] || 'application/octet-stream',
              size: obj.size!,
              lastModified: obj.lastModified!,
            });
          } catch (error) {
            console.error('Error getting file stat:', error);
          }
        }
        
        resolve(files);
      } catch (error) {
        console.error('Error processing objects:', error);
        reject(error);
      }
    });

    stream.on('error', (error) => {
      console.error('Stream error:', error);
      reject(error);
    });
  });
};

export const getFileFromMinio = async (fileId: string, type: string = 'files', extension: string = ''): Promise<{
  buffer: Buffer;
  contentType: string;
  etag: string;
}> => {
  const client = getMinioClient();
  
  const tryExtensions = async (baseKey: string, extensions: string[]): Promise<{
    buffer: Buffer;
    contentType: string;
    etag: string;
  }> => {
    for (const ext of extensions) {
      try {
        const objectKey = `${baseKey}.${ext}`;
        const fileStream = await client.getObject(BUCKET_NAME, objectKey);
        
        const chunks: Buffer[] = [];
        for await (const chunk of fileStream) {
          chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        const stat = await client.statObject(BUCKET_NAME, objectKey);
        const contentType = stat.metaData['content-type'] || 'application/octet-stream';

        return {
          buffer,
          contentType,
          etag: stat.etag
        };
      } catch (error) {
        continue;
      }
    }
    throw new Error('File not found with any common extension');
  };

  if (extension) {
    try {
      const objectKey = `posts/${fileId}.${extension}`;
      const fileStream = await client.getObject(BUCKET_NAME, objectKey);
      
      const chunks: Buffer[] = [];
      for await (const chunk of fileStream) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);

      const stat = await client.statObject(BUCKET_NAME, objectKey);
      const contentType = stat.metaData['content-type'] || 'application/octet-stream';

      return {
        buffer,
        contentType,
        etag: stat.etag
      };
    } catch (error) {
        console.warn(`Exact match failed for ${fileId}.${extension}, trying common extensions...`);
    }
  }

  const baseKey = `posts/${fileId}`;
  let commonExtensions: string[] = [];
  
  switch (type) {
    case 'image':
      commonExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
      break;
    case 'video':
      commonExtensions = ['mp4', 'webm', 'avi', 'mov'];
      break;
    case 'document':
      commonExtensions = ['pdf', 'doc', 'docx', 'txt'];
      break;
    default:
      commonExtensions = ['jpg', 'png', 'pdf', 'txt'];
  }

  return await tryExtensions(baseKey, commonExtensions);
};

export const getFileFromFolder = async (objectKey: string): Promise<{
  buffer: Buffer;
  contentType: string;
  etag: string;
  fileName: string;
}> => {
  const client = getMinioClient();
  
  try {
    const fileStream = await client.getObject(BUCKET_NAME, objectKey);
    
    const chunks: Buffer[] = [];
    for await (const chunk of fileStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    const stat = await client.statObject(BUCKET_NAME, objectKey);
    const contentType = stat.metaData['content-type'] || 'application/octet-stream';
    const fileName = stat.metaData['x-original-filename'] || objectKey.split('/').pop() || 'file';

    return {
      buffer,
      contentType,
      etag: stat.etag,
      fileName
    };
  } catch (error) {
    throw new Error(`File not found: ${objectKey}`);
  }
};


export const deleteFileFromMinio = async (fileId: string, type: string = 'files', extension: string = ''): Promise<void> => {
  const client = getMinioClient();
  
  try {
    if (extension) {
      const objectKey = `posts/${fileId}.${extension}`;
      await client.removeObject(BUCKET_NAME, objectKey);
      return;
    }

    const commonExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'pdf', 'doc', 'docx', 'txt'];
    
    for (const ext of commonExtensions) {
      try {
        const objectKey = `posts/${fileId}.${ext}`;
        await client.statObject(BUCKET_NAME, objectKey);
        await client.removeObject(BUCKET_NAME, objectKey);
        return;
      } catch (error) {
        continue;
      }
    }
    
    throw new Error('File not found');
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

export const deleteFolderFromMinio = async (folderId: string): Promise<void> => {
  const client = getMinioClient();
  const prefix = `posts/${folderId}/`;
  
  try {
    const stream = client.listObjects(BUCKET_NAME, prefix, false);
    const objectsToDelete: string[] = [];

    return new Promise((resolve, reject) => {
      stream.on('data', (obj) => {
        if (obj.name) {
          objectsToDelete.push(obj.name);
        }
      });

      stream.on('end', async () => {
        try {
          if (objectsToDelete.length > 0) {
            await client.removeObjects(BUCKET_NAME, objectsToDelete);
          }
          resolve();
        } catch (error) {
          reject(error);
        }
      });

      stream.on('error', (error) => {
        reject(error);
      });
    });
  } catch (error) {
    console.error('Error deleting folder:', error);
    throw error;
  }
};

export const uploadProfilePicture = async (
  file: File | Buffer,
  fileName: string,
  userId: string
): Promise<{ fileId: string; objectKey: string; fileName: string }> => {
  const client = getMinioClient();
  
  await deleteProfilePicture(userId);
  
  const fileId = uuidv4();
  const objectKey = `profiles/${userId}/${fileId}.png`; // Always convert to PNG
  
  const bucketExists = await client.bucketExists(BUCKET_NAME);
  if (!bucketExists) {
    await client.makeBucket(BUCKET_NAME);
  }

  let buffer: Buffer;
  if (file instanceof File) {
    const arrayBuffer = await file.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
  } else {
    buffer = file;
  }

  await client.putObject(BUCKET_NAME, objectKey, buffer, buffer.length, {
    'Content-Type': 'image/png',
    'X-Original-Filename': fileName,
  });

  return { fileId, objectKey, fileName: `${fileId}.png` };
};

export const getProfilePicture = async (userId: string): Promise<{
  buffer: Buffer;
  contentType: string;
  fileName: string;
} | null> => {
  const client = getMinioClient();
  const prefix = `profiles/${userId}/`;
  
  try {
    const stream = client.listObjects(BUCKET_NAME, prefix, false);
    let profilePicture: string | null = null;

    return new Promise((resolve, reject) => {
      stream.on('data', (obj) => {
        if (obj.name && (obj.name.endsWith('.png') || obj.name.endsWith('.jpg') || obj.name.endsWith('.jpeg'))) {
          profilePicture = obj.name;
        }
      });

      stream.on('end', async () => {
        if (!profilePicture) {
          resolve(null);
          return;
        }

        try {
          const fileStream = await client.getObject(BUCKET_NAME, profilePicture);
          
          const chunks: Buffer[] = [];
          for await (const chunk of fileStream) {
            chunks.push(chunk);
          }
          const buffer = Buffer.concat(chunks);

          const stat = await client.statObject(BUCKET_NAME, profilePicture);
          const fileName = profilePicture.split('/').pop() || 'profile.png';
          
          let contentType = 'image/png';
          if (profilePicture.endsWith('.jpg') || profilePicture.endsWith('.jpeg')) {
            contentType = 'image/jpeg';
          }

          resolve({
            buffer,
            contentType,
            fileName
          });
        } catch (error) {
          reject(error);
        }
      });

      stream.on('error', (error) => {
        reject(error);
      });
    });
  } catch (error) {
    console.error('Error getting profile picture:', error);
    return null;
  }
};

export const deleteProfilePicture = async (userId: string): Promise<void> => {
  const client = getMinioClient();
  const prefix = `profiles/${userId}/`;
  
  try {
    const stream = client.listObjects(BUCKET_NAME, prefix, false);
    const objectsToDelete: string[] = [];

    return new Promise((resolve, reject) => {
      stream.on('data', (obj) => {
        if (obj.name) {
          objectsToDelete.push(obj.name);
        }
      });

      stream.on('end', async () => {
        try {
          if (objectsToDelete.length > 0) {
            await client.removeObjects(BUCKET_NAME, objectsToDelete);
          }
          resolve();
        } catch (error) {
          reject(error);
        }
      });

      stream.on('error', (error) => {
        reject(error);
      });
    });
  } catch (error) {
    console.error('Error deleting profile picture:', error);
  }
};
