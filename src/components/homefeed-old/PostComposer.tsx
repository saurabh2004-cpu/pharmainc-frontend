"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image, FileIcon, Link2, FileText, Filter } from "lucide-react";
import { User } from "./types";
import { createPost } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";

interface PostComposerProps {
  postTitle: string;
  setPostTitle: (value: string) => void;
  postContent: string;
  setPostContent: (value: string) => void;
  postAttachmentId: string;
  setPostAttachmentId: (value: string) => void;
  onPostCreated: (newPost: { id: string; title: string; content: string; attachment_id?: string }) => void;
  posting: boolean;
  setPosting: (value: boolean) => void;
  user: User;
}

export default function PostComposer({
  postTitle,
  setPostTitle,
  postContent,
  setPostContent,
  postAttachmentId,
  setPostAttachmentId,
  onPostCreated,
  posting,
  setPosting,
  user,
}: PostComposerProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      // You would typically upload the file here and get an attachment ID
      // For now, we'll just store the file
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle || !postContent) {
      toast.error("Title and Content are required!");
      return;
    }

    setPosting(true);
    const loadingToast = toast.loading("Creating your post...");

    try {
      // First upload the file if there is one
      const attachmentId = postAttachmentId;
      if (selectedFile) {
        // Here you would implement file upload logic
        // const uploadResponse = await uploadFile(selectedFile);
        // attachmentId = uploadResponse.id;
        // For now, we'll just use the manually entered attachment ID
      }

      const postData = {
        title: postTitle,
        content: postContent,
        attachment_id: attachmentId || undefined,
      };

      const newPost = await createPost(postData);

      toast.dismiss(loadingToast);
      toast.success("Your post has been created!");

      // Reset form
      setPostTitle("");
      setPostContent("");
      setPostAttachmentId("");
      setSelectedFile(null);

      // Notify parent component
      onPostCreated(newPost);
    } catch (error) {
      console.error("Error creating post:", error);
      toast.dismiss(loadingToast);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 w-full max-w-2xl mt-6 px-6 py-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Feed</h2>
        <Button variant="ghost" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <form onSubmit={handlePostSubmit}>
        <div className="flex gap-3">
          <img
            src={user?.profilePicture || "/pp.png"}
            alt={user?.firstName || "User"}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 flex flex-col gap-2">
            <Input
              type="text"
              placeholder="Post title (required)"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              required
              className="bg-gray-50 border-gray-200 h-10 text-sm"
            />
            <Input
              type="text"
              placeholder="Attachment ID (optional)"
              value={postAttachmentId}
              onChange={(e) => setPostAttachmentId(e.target.value)}
              className="bg-gray-50 border-gray-200 h-10 text-sm"
            />
            <textarea
              placeholder="Share your medical insights, research, or case studies…"
              className="flex-1 bg-gray-50 border-gray-200 h-20 p-2 text-sm rounded"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          <label htmlFor="file-upload">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:bg-blue-50 cursor-pointer"
            >
              <div>
                <Image className="h-4 w-4 mr-2" />
                Photo
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>
            </Button>
          </label>
          <Button
            variant="ghost"
            size="sm"
            className="text-green-600 hover:bg-green-50"
          >
            <FileIcon className="h-4 w-4 mr-2" />
            Document
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-purple-600 hover:bg-purple-50"
          >
            <Link2 className="h-4 w-4 mr-2" />
            Video
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-yellow-600 hover:bg-yellow-50"
          >
            <FileText className="h-4 w-4 mr-2" />
            Poll
          </Button>
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="ml-auto text-blue-600 hover:bg-blue-50"
            disabled={posting}
          >
            {posting ? "Posting..." : "Post"}
          </Button>
        </div>
        {selectedFile && (
          <div className="mt-2 text-sm text-gray-600">
            File selected: {selectedFile.name}
          </div>
        )}
      </form>
    </div>
  );
}
