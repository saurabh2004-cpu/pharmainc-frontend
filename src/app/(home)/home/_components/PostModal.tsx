"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Image, FileIcon, Link2, FileText, Globe, Loader2, AlertCircle, Video } from "lucide-react";
import { Dialog, DialogContent, DialogOverlay, DialogPortal, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { usePostStore } from "@/store";
import { uploadMultipleFiles, getFileTypeFromMime, type FileUploadResponse } from "@/lib/minio/minio-client";
import { User } from "./types";
import { v4 as uuidv4 } from 'uuid';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export default function PostModal({ isOpen, onClose, user }: PostModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [currentFolderId, setCurrentFolderId] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<{[key: number]: number}>({});
  const [currentlyUploading, setCurrentlyUploading] = useState<number>(-1);
  const { createNewPost } = usePostStore();
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Clean up object URLs to prevent memory leaks
      selectedFiles.forEach(file => {
        if (file instanceof File) {
          const url = URL.createObjectURL(file);
          URL.revokeObjectURL(url);
        }
      });
      
      setTitle("");
      setContent("");
      setSelectedFiles([]);
      setCurrentFolderId("");
      setUploadError(null);
      setIsUploading(false);
      setUploadProgress({});
      setCurrentlyUploading(-1);
    }
  }, [isOpen]);

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      selectedFiles.forEach(file => {
        if (file instanceof File) {
          const url = URL.createObjectURL(file);
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [selectedFiles]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!content.trim() || !title.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      let attachmentId = currentFolderId;
      
      // Upload files if there are selected files
      if (selectedFiles.length > 0) {
        setIsUploading(true);
        const folderId = currentFolderId || uuidv4();
        setCurrentFolderId(folderId);
        attachmentId = folderId;
        
        console.log('Uploading files to folder:', folderId);
        
        const uploadedResults = await uploadMultipleFiles(
          selectedFiles, 
          folderId,
          (fileIndex: number, progress: number) => {
            setCurrentlyUploading(fileIndex);
            setUploadProgress(prev => ({
              ...prev,
              [fileIndex]: progress
            }));
          }
        );
        
        console.log('Upload results:', uploadedResults);
        setCurrentlyUploading(-1);
      }
      
      await createNewPost({
        title: title.trim(),
        content: content.trim(),
        attachment_id: attachmentId || undefined,
      });
      
      // Reset form and close modal
      setTitle("");
      setContent("");
      setSelectedFiles([]);
      setCurrentFolderId("");
      setUploadError(null);
      setUploadProgress({});
      setCurrentlyUploading(-1);
      onClose();
    } catch (error) {
      console.error("Failed to create post:", error);
      setUploadError(error instanceof Error ? error.message : 'Failed to create post');
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  const handleImageUpload = () => {
    imageInputRef.current?.click();
  };

  const handleDocumentUpload = () => {
    documentInputRef.current?.click();
  };

  const onImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      console.log("Image files selected:", fileArray);
      setSelectedFiles(prev => [...prev, ...fileArray]);
      setUploadError(null);
      e.target.value = ''; // Reset input
    }
  };

  const onDocumentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      console.log("Document files selected:", fileArray);
      setSelectedFiles(prev => [...prev, ...fileArray]);
      setUploadError(null);
      e.target.value = ''; // Reset input
    }
  };

  const removeSelectedFile = (index: number) => {
    const fileToRemove = selectedFiles[index];
    if (fileToRemove instanceof File) {
      const url = URL.createObjectURL(fileToRemove);
      URL.revokeObjectURL(url);
    }
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setUploadError(null);
  };

  const handleLinkAttach = () => {
    // Handle link attachment logic here
    console.log("Link attachment clicked");
  };

  const handleResearchAttach = () => {
    // Handle research paper attachment logic here
    console.log("Research attachment clicked");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isPostDisabled) {
        handleSubmit();
      }
    }
  };

  const isPostDisabled = !content.trim() || !title.trim() || isSubmitting;
  const characterCount = content.length;
  const maxCharacters = 280;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogPortal>
          <DialogOverlay className="bg-black/40" />
          <DialogContent className="max-w-xl w-full mx-4 p-0 bg-white rounded-2xl shadow-2xl border-0 font-sans max-h-[90vh] flex flex-col">
            <DialogTitle className="sr-only">Create New Post</DialogTitle>
            
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  disabled={isSubmitting}
                >
                  <X className="h-5 w-5 text-gray-700" />
                </button>
                <h1 className="text-xl font-bold text-gray-900 font-sans">Create Post</h1>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleSubmit}
                  disabled={isPostDisabled}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  title="Post (Ctrl+Enter)"
                >
                  {isSubmitting ? (
                    isUploading ? (
                      currentlyUploading >= 0 ? 
                        `Uploading ${currentlyUploading + 1}/${selectedFiles.length}...` : 
                        "Uploading files..."
                    ) : "Posting..."
                  ) : (
                    selectedFiles.length > 0 ? `Post with ${selectedFiles.length} file(s)` : "Post"
                  )}
                </Button>
              </div>
            </div>

            <div className="px-4 py-3 flex-1 overflow-y-auto">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={user?.profilePicture || "/pp.png"}
                  alt="Your avatar"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex items-center gap-2 text-blue-500 text-sm font-medium">
                  <Globe className="h-4 w-4" />
                  <span>Everyone can reply</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Input
                    placeholder="Add a title for your post"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border-none shadow-none text-lg font-medium placeholder-gray-400 p-0 focus-visible:ring-0 font-sans"
                    disabled={isSubmitting}
                    required
                  />
                  <div className="h-px bg-gray-200 mt-3"></div>
                </div>
                
                <Textarea
                  placeholder="What's happening in your practice today?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="border-none shadow-none text-xl placeholder-gray-500 resize-none min-h-[120px] p-0 focus-visible:ring-0 font-sans leading-6"
                  disabled={isSubmitting}
                  maxLength={maxCharacters}
                />
              </div>

              {/* Upload Error Display */}
              {uploadError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                  <span className="text-sm text-red-700">{uploadError}</span>
                  <button 
                    onClick={() => setUploadError(null)}
                    className="ml-auto text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Selected Files Preview */}
              {selectedFiles.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-medium text-gray-700">
                      Selected Files ({selectedFiles.length}) - Will upload when posting
                    </div>
                    <button
                      onClick={() => {
                        setSelectedFiles([]);
                        setUploadError(null);
                      }}
                      className="text-xs text-gray-500 hover:text-gray-700 underline"
                      disabled={isSubmitting}
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3 bg-blue-50 max-h-60 overflow-y-auto">
                    <div className="grid gap-2">
                      {selectedFiles.map((file, index) => {
                        const isImage = file.type.startsWith('image/');
                        const isVideo = file.type.startsWith('video/');
                        const isCurrentlyUploading = currentlyUploading === index;
                        const progress = uploadProgress[index] || 0;
                        const isUploaded = !isUploading && progress === 100;
                        
                        return (
                          <div key={index} className="flex items-center gap-3 p-2 bg-white rounded border relative">
                            {isUploading && isCurrentlyUploading && (
                              <div className="absolute inset-0 bg-blue-50/80 rounded flex items-center justify-center z-10">
                                <div className="flex items-center gap-2">
                                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                  <span className="text-sm text-blue-700 font-medium">
                                    {Math.round(progress)}%
                                  </span>
                                </div>
                              </div>
                            )}
                            
                            <div className="flex-shrink-0">
                              {isImage ? (
                                <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : isVideo ? (
                                <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center relative">
                                  <video
                                    src={URL.createObjectURL(file)}
                                    className="w-full h-full object-cover"
                                    muted
                                  />
                                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                    <Video className="h-6 w-6 text-white" />
                                  </div>
                                </div>
                              ) : (
                                <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center">
                                  <FileIcon className="h-6 w-6 text-green-500" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {file.name}
                                {isUploaded && (
                                  <span className="ml-2 text-green-600 text-xs">✓ Uploaded</span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center gap-2">
                                <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                <span>•</span>
                                <span className="truncate">{file.type}</span>
                              </div>
                              {isUploading && isCurrentlyUploading && (
                                <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                                  <div 
                                    className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => removeSelectedFile(index)}
                              className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
                              disabled={isSubmitting}
                              title="Remove file"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-2 text-xs text-blue-600 font-medium flex items-center gap-1">
                      <span>💡</span>
                      <span>
                        {isUploading 
                          ? `Uploading ${currentlyUploading + 1} of ${selectedFiles.length} files...`
                          : "Files will be uploaded when you click 'Post'"
                        }
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleImageUpload}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors group"
                    disabled={isSubmitting || isUploading}
                    title="Add photos or videos"
                  >
                    {isUploading ? (
                      <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                    ) : (
                      <Image className="h-5 w-5 text-blue-500 group-hover:text-blue-600" />
                    )}
                    <span className="text-sm text-blue-500 group-hover:text-blue-600 font-medium">
                      Photos/Videos
                    </span>
                    {selectedFiles.filter(f => f.type.startsWith('image/') || f.type.startsWith('video/')).length > 0 && (
                      <span className="ml-1 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                        {selectedFiles.filter(f => f.type.startsWith('image/') || f.type.startsWith('video/')).length}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleDocumentUpload}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-green-50 rounded-lg transition-colors group"
                    disabled={isSubmitting || isUploading}
                    title="Add documents"
                  >
                    <FileIcon className="h-5 w-5 text-green-500 group-hover:text-green-600" />
                    {selectedFiles.filter(f => !f.type.startsWith('image/') && !f.type.startsWith('video/')).length > 0 && (
                      <span className="ml-1 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                        {selectedFiles.filter(f => !f.type.startsWith('image/') && !f.type.startsWith('video/')).length}
                      </span>
                    )}
                  </button>

                  {/* <button
                    type="button"
                    onClick={handleLinkAttach}
                    className="p-2 hover:bg-purple-50 rounded-full transition-colors group"
                    disabled={isSubmitting}
                    title="Add link"
                  >
                    <Link2 className="h-5 w-5 text-purple-500 group-hover:text-purple-600" />
                  </button>

                  <button
                    type="button"
                    onClick={handleResearchAttach}
                    className="p-2 hover:bg-orange-50 rounded-full transition-colors group"
                    disabled={isSubmitting}
                    title="Add research"
                  >
                    <FileText className="h-5 w-5 text-orange-500 group-hover:text-orange-600" />
                  </button> */}
                  
                    <div className="text-xs text-gray-400 hidden sm:block ml-auto">
                    Ctrl+Enter to post
                    </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {characterCount > 0 && (
                      <>
                        <div className="relative w-8 h-8">
                          <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                            <circle
                              cx="16"
                              cy="16"
                              r="14"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                              className="text-gray-200"
                            />
                            <circle
                              cx="16"
                              cy="16"
                              r="14"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                              strokeDasharray={`${(characterCount / maxCharacters) * 87.96} 87.96`}
                              className={
                                characterCount > maxCharacters 
                                  ? 'text-red-500' 
                                  : characterCount > maxCharacters * 0.8 
                                  ? 'text-orange-500' 
                                  : 'text-blue-500'
                              }
                            />
                          </svg>
                          {characterCount > maxCharacters * 0.8 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className={`text-xs font-bold ${
                                characterCount > maxCharacters 
                                  ? 'text-red-500' 
                                  : 'text-orange-500'
                              }`}>
                                {maxCharacters - characterCount}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {characterCount > maxCharacters * 0.9 && (
                          <div className="text-sm text-gray-500">
                            {characterCount}/{maxCharacters}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={onImageSelect}
      />
      <input
        ref={documentInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.csv,.xls,.xlsx,.ppt,.pptx"
        multiple
        className="hidden"
        onChange={onDocumentSelect}
      />
    </>
  );
}
