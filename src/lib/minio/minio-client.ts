export interface FileUploadResponse {
  id: string;
  filename: string;
  size: number;
  content_type: string;
  url: string;
  type?: string;
  extension?: string;
  objectKey?: string;
  folderId?: string;
}

// Helper function to get cookie value
function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

export interface PresignedUrlResponse {
  presignedUrl: string;
  fileId: string;
  objectKey: string;
  fileName: string;
  fileUrl: string;
  folderId: string;
  fileExtension: string;
}

export interface FolderContentsResponse {
  folderId: string;
  files: FileUploadResponse[];
  count: number;
}

export interface FileUploadParams {
  file: File;
  type?: 'image' | 'document' | 'video';
  folderId: string;
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
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ],
  video: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov']
};

export const getFileTypeFromMime = (mimeType: string): 'image' | 'document' | 'video' | 'other' => {
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
};

export const getPresignedUrl = async (
  fileName: string,
  fileType: string,
  fileSize: number,
  folderId: string
): Promise<PresignedUrlResponse> => {
  try {
    const response = await fetch('/api/presigned-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName,
        fileType,
        fileSize,
        folderId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to get presigned URL: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get presigned URL failed:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Failed to get presigned URL. Please try again.');
  }
};

export const uploadFileWithPresignedUrl = async (
  file: File,
  presignedUrl: string,
  onProgress?: (progress: number) => void
): Promise<void> => {
  try {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            onProgress(progress);
          }
        });
      }

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed due to network error'));
      });

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload was aborted'));
      });

      xhr.open('PUT', presignedUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  } catch (error) {
    console.error('File upload to presigned URL failed:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Failed to upload file. Please try again.');
  }
};

export const confirmFileUpload = async (
  objectKey: string,
  fileName: string,
  fileType: string
): Promise<void> => {
  try {
    const response = await fetch('/api/confirm-upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        objectKey,
        fileName,
        fileType,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to confirm upload: ${response.status}`);
    }
  } catch (error) {
    console.error('Confirm upload failed:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Failed to confirm upload. Please try again.');
  }
};

export const uploadFile = async (
  { file, type, folderId }: FileUploadParams,
  onProgress?: (progress: number) => void
): Promise<FileUploadResponse> => {
  try {
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 10MB');
    }

    const presignedData = await getPresignedUrl(file.name, file.type, file.size, folderId);
    
    await uploadFileWithPresignedUrl(file, presignedData.presignedUrl, onProgress);
    
    await confirmFileUpload(presignedData.objectKey, presignedData.fileName, file.type);
    
    return {
      id: presignedData.fileId,
      filename: presignedData.fileName,
      size: file.size,
      content_type: file.type,
      url: presignedData.fileUrl,
      type: getFileTypeFromMime(file.type),
      extension: presignedData.fileExtension,
      objectKey: presignedData.objectKey,
      folderId: presignedData.folderId,
    };

  } catch (error) {
    console.error('File upload failed:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Failed to upload file. Please try again.');
  }
};

export const uploadMultipleFiles = async (
  files: File[],
  folderId: string,
  onProgress?: (fileIndex: number, progress: number) => void
): Promise<FileUploadResponse[]> => {
  const results: FileUploadResponse[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileType = getFileTypeFromMime(file.type);
    
    try {
      const result = await uploadFile(
        { 
          file, 
          type: fileType !== 'other' ? fileType : undefined, 
          folderId 
        },
        onProgress ? (progress) => onProgress(i, progress) : undefined
      );
      
      results.push(result);
    } catch (error) {
      console.error(`Failed to upload file ${file.name}:`, error);
      throw new Error(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return results;
};

export const fetchFolderContents = async (folderId: string): Promise<FolderContentsResponse> => {
  try {
    const response = await fetch(`/api/fetch-folder?folderId=${folderId}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to fetch folder contents: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch folder contents failed:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Failed to fetch folder contents. Please try again.');
  }
};

export const getFileUrl = (fileId: string, type: string = 'files', extension: string = ''): string => {
  return `/api/cdn/${fileId}?type=${type}&ext=${extension}`;
};

export const getFolderFileUrl = (folderId: string, fileId: string, filename?: string): string => {
  const url = `/api/cdn/${folderId}/${fileId}`;
  return filename ? `${url}?filename=${encodeURIComponent(filename)}` : url;
};

export const deleteFolder = async (folderId: string): Promise<void> => {
  try {
    let token: string | null = null;
    if (typeof document !== 'undefined') {
      token = getCookieValue('token') || getCookieValue('auth-token') || getCookieValue('authToken');
    }
    
    const response = await fetch(`/api/delete?folderId=${folderId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to delete folder: ${response.status}`);
    }
  } catch (error) {
    console.error('Delete folder failed:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Failed to delete folder. Please try again.');
  }
};

export const deleteFile = async (fileId: string, extension?: string): Promise<void> => {
  try {
    const url = `/api/delete?fileId=${fileId}${extension ? `&extension=${extension}` : ''}`;
    const response = await fetch(url, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to delete file: ${response.status}`);
    }
  } catch (error) {
    console.error('Delete file failed:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Failed to delete file. Please try again.');
  }
};
