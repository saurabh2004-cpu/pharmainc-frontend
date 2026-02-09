"use client";

import {
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  MoreVertical,
} from "lucide-react";
import { Post } from "./types";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePostStore } from "@/store/postStore";
import ExpandedComments from "./ExpandedComments";
import ShareModal from "./ShareModal";
import { useRouter } from "next/navigation";
import { fetchFolderContents, type FolderContentsResponse } from "@/lib/minio/minio-client";
import MediaCarousel from "./MediaCarousel";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  const [isLiking, setIsLiking] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [attachments, setAttachments] = useState<FolderContentsResponse | null>(null);
  const [loadingAttachments, setLoadingAttachments] = useState(false);
  
  const { toggleLike, liked, sharePost, savePost, saved, likedCount } = usePostStore();
  
  const handleLikeClick = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      await toggleLike(post.id);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentClick = () => {
    setShowComments(!showComments);
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (post.authorId) {
      // Navigate based on poster_type: institute goes to /institute, user goes to /profile
      const basePath = post.poster_type === "institute" ? "/institute" : "/profile";
      router.push(`${basePath}/${post.authorId}`);
    }
  };

  const handlePostClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) {
      return;
    }
    router.push(`/post/${post.id}`);
  };

  const handleShareClick = async () => {
    if (isSharing) return;
    setIsSharing(true);
    try {
      await sharePost(post.id);
      setShowShareModal(true);
    } catch (error) {
      console.error('Failed to share post:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleSaveClick = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      savePost(post.id);
    } catch (error) {
      console.error('Failed to save post:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const loadAttachments = async () => {
    if (!post.attachments && typeof post.id === 'string' && loadingAttachments) return;
    
    const attachmentId = (post as any).attachment_id || post.id;
    if (!attachmentId) return;

    setLoadingAttachments(true);
    try {
      const folderContents = await fetchFolderContents(attachmentId.toString());
      if (folderContents.files.length > 0) {
        setAttachments(folderContents);
      }
    } catch (error) {
      console.error('Failed to load attachments:', error);
    } finally {
      setLoadingAttachments(false);
    }
  };

  useEffect(() => {
    const hasAttachmentId = (post as any).attachment_id;
    if (hasAttachmentId && !attachments && !loadingAttachments) {
      loadAttachments();
    }
  }, [post]);
  
  const maxLength = 300; 
  const shouldTruncate = post.content.length > maxLength;
  const displayContent = isExpanded || !shouldTruncate
    ? post.content
    : post.content.substring(0, maxLength) + "...";

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  return (
    <>
      <div 
        onClick={handlePostClick}
        className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-4 flex flex-col gap-2 font-sans cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <img
            src={post.avatar}
            alt={post.author}
            onClick={handleProfileClick}
            className="w-9 h-9 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all"
          />
          <div className="flex flex-col leading-tight">
            <span 
              onClick={handleProfileClick}
              className="font-semibold text-sm text-gray-900 font-sans cursor-pointer hover:text-blue-600 transition-colors"
            >
              {post.author}
            </span>
            <span className="text-xs text-gray-500 font-sans">
              {post.role} • {post.time}
            </span>
          </div>
          <div className="ml-auto">
            <button 
              onClick={(e) => e.stopPropagation()}
              className="h-7 w-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>

        {post.title && (
          <h3 className="font-semibold text-gray-900 text-sm font-sans">{post.title}</h3>
        )}

        <div className="text-sm text-gray-800 whitespace-pre-wrap break-words font-sans">
          {displayContent}
          {shouldTruncate && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand();
              }}
              className="text-blue-600 hover:text-blue-800 ml-1 text-sm font-medium font-sans"
            >
              {isExpanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>

        {post.image && (
          <div className="rounded-lg overflow-hidden border border-gray-100">
            <Image width={1024} height={1024} src={post.image} alt="post" className="w-full h-auto aspect-auto" />
          </div>
        )}

        {/* Multiple Attachments Display with MediaCarousel */}
        {attachments && attachments.files.length > 0 && (
          <div onClick={(e) => e.stopPropagation()}>
            <MediaCarousel files={attachments.files} />
          </div>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-sans"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* <div className="text-xs text-blue-700 font-medium font-sans">
          {post.type === "Research Paper" ? "📄 Research Paper" : "🩺 Case Study"}
        </div> */}

        <div className="flex items-center gap-4 text-xs text-gray-500 border-t border-gray-100 pt-2 font-sans">
          <span>{likedCount[post.id] || post.likes} likes</span>
          <span>{post.comments} comments</span>
          <span>{post.shares} shares</span>
        </div>

        <div className="flex border-t border-gray-100 mt-2 pt-2 gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLikeClick();
            }}
            disabled={isLiking}
            className="flex-1 text-gray-600 hover:text-red-600 hover:bg-red-50 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors disabled:opacity-70 font-sans"
          >
            <Heart className={`h-4 w-4 ${liked[post.id] ? "fill-red-500 text-red-500" : ""}`} />
            {isLiking ? "..." : "Like"}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCommentClick();
            }}
            className="flex-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors font-sans"
          >
            <MessageSquare className="h-4 w-4" />
            Comment
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleShareClick();
            }}
            disabled={isSharing}
            className="flex-1 text-gray-600 hover:text-green-600 hover:bg-green-50 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors disabled:opacity-70 font-sans"
          >
            <Share2 className="h-4 w-4" />
            {isSharing ? "..." : "Share"}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSaveClick();
            }}
            disabled={isSaving}
            className="flex-1 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors disabled:opacity-70 font-sans"
          >
            <Bookmark className={`h-4 w-4 ${saved[post.id] ? "fill-yellow-500 text-yellow-500" : ""}`} />
            {isSaving ? "..." : saved[post.id] ? "Saved" : "Save"}
          </button>
        </div>
      </div>

      {/* Expanded Comments Section */}
      <div onClick={(e) => e.stopPropagation()}>
        <ExpandedComments
          post={post}
          isVisible={showComments}
        />
      </div>

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        post={post}
      />
    </>
  );
}
