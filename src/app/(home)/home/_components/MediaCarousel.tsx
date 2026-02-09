"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Download, Play, FileText, FileImage, Video } from "lucide-react";
import { type FileUploadResponse } from "@/lib/minio/minio-client";

interface MediaCarouselProps {
  files: FileUploadResponse[];
  className?: string;
}

export default function MediaCarousel({ files, className = "" }: MediaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  if (!files || files.length === 0) return null;

  const mediaFiles = files.filter(file => 
    file.content_type.startsWith('image/') || file.content_type.startsWith('video/')
  );
  
  const documentFiles = files.filter(file => 
    !file.content_type.startsWith('image/') && !file.content_type.startsWith('video/')
  );

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % mediaFiles.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + mediaFiles.length) % mediaFiles.length);
  };

  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith('image/')) return <FileImage className="h-4 w-4" />;
    if (contentType.startsWith('video/')) return <Video className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {mediaFiles.length > 0 && (
        <div className="relative rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
          <div className="relative aspect-video bg-black">
            {mediaFiles[currentIndex].content_type.startsWith('image/') ? (
              <Image
                src={mediaFiles[currentIndex].url}
                alt={mediaFiles[currentIndex].filename}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="relative w-full h-full">
                <video
                  src={mediaFiles[currentIndex].url}
                  controls
                  className="w-full h-full object-contain"
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            
            {mediaFiles.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevSlide();
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  aria-label="Previous media"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextSlide();
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  aria-label="Next media"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
            
            {mediaFiles.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                {currentIndex + 1} / {mediaFiles.length}
              </div>
            )}
            
            {mediaFiles[currentIndex].content_type.startsWith('video/') && (
              <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                <Play className="h-3 w-3" />
                Video
              </div>
            )}
          </div>
          
          {mediaFiles.length > 1 && (
            <div className="p-2 bg-gray-50 border-t border-gray-200">
              <div className="flex gap-2 overflow-x-auto">
                {mediaFiles.map((file, index) => (
                  <button
                    key={file.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(index);
                    }}
                    className={`relative flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-colors ${
                      index === currentIndex ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {file.content_type.startsWith('image/') ? (
                      <Image
                        src={file.url}
                        alt={file.filename}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <Play className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {documentFiles.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs text-gray-600 font-medium">
            Documents ({documentFiles.length})
          </div>
          <div className="grid gap-2">
            {documentFiles.map((file) => (
              <div key={file.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex-shrink-0 text-gray-500">
                  {getFileIcon(file.content_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {file.filename}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(file.url, '_blank');
                  }}
                  className="flex-shrink-0 p-2 hover:bg-gray-200 rounded-full transition-colors"
                  title="Download"
                >
                  <Download className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div className="text-xs text-gray-500 flex items-center gap-4">
          {mediaFiles.length > 0 && (
            <span>{mediaFiles.length} media file{mediaFiles.length !== 1 ? 's' : ''}</span>
          )}
          {documentFiles.length > 0 && (
            <span>{documentFiles.length} document{documentFiles.length !== 1 ? 's' : ''}</span>
          )}
        </div>
      )}
    </div>
  );
}
