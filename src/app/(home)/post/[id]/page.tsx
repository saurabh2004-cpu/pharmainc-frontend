"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Heart, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  MoreVertical,
  Send,
  Reply,
  Edit,
  Trash2,
  ChevronDown
} from 'lucide-react';
import { getPost, getPostComments, createComment, replyToComment, updateComment, deleteComment, getCommentReplies, patchReaction } from '@/lib/api/services/content';
import { Post, Comment } from '@/lib/api/types';
import { useUserStore, usePostStore } from '@/store';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { fetchFolderContents, type FolderContentsResponse } from '@/lib/minio/minio-client';
import MediaCarousel from '../../home/_components/MediaCarousel';
import ShareModal from '../../home/_components/ShareModal';

interface UserInfo {
  name: string;
  avatar: string;
  role: string;
  specialization?: string;
  location?: string;
}

const getUserInfo = async (userId: string): Promise<UserInfo> => {
  try {
    const { fetchUserById } = useUserStore.getState();
    const userData = await fetchUserById(userId);
    return {
      name: userData.name || 'Unknown User',
      avatar: userData.profilePicture || '/pp.png',
      role: userData.role || 'Medical Professional',
      specialization: userData.speciality || undefined,
      location: userData.location || undefined
    };
  } catch (error) {
    console.error('Failed to fetch user info:', error);
    return {
      name: 'Unknown User',
      avatar: '/pp.png',
      role: 'Medical Professional'
    };
  }
};

interface CommentWithReplies extends Comment {
  replies?: CommentWithReplies[];
  author?: string;
  avatar?: string;
  userInfo?: UserInfo;
}

interface ExtendedPost extends Post {
  user?: {
    name: string;
    profile_picture?: string;
    role: string;
  };
  attachment_id?: string;
}

interface CommentItemProps {
  comment: CommentWithReplies;
  currentUserId: string;
  postId: string;
  level: number;
  onReply: (commentId: string, content: string) => void;
  onEdit: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  onLoadReplies: (commentId: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUserId,
  postId,
  level,
  onReply,
  onEdit,
  onDelete,
  onLoadReplies
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [editContent, setEditContent] = useState(comment.content);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);

  const isOwner = comment.auth === currentUserId;
  const maxLevel = 3; // Maximum nesting level
  
  useEffect(() => {
    const handleClickOutside = () => setShowDropdown(false);
    if (showDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showDropdown]);

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return;
    
    await onReply(comment.id, replyContent.trim());
    setReplyContent("");
    setShowReplyForm(false);
  };

  const handleEditSubmit = async () => {
    if (!editContent.trim()) return;
    
    await onEdit(comment.id, editContent.trim());
    setIsEditing(false);
  };

  const handleLoadReplies = async () => {
    setLoadingReplies(true);
    await onLoadReplies(comment.id);
    setLoadingReplies(false);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className={`${level > 0 ? 'ml-4 border-l-2 border-blue-200 pl-3' : ''} mb-3 font-sans`}>
      <div className={`${level === 0 ? 'bg-gray-50' : 'bg-white border border-gray-100'} rounded-lg p-3`}>
        <div className="flex items-start gap-3">
          <img
            src={comment.avatar || "/pp.png"}
            alt={comment.author || "User"}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm text-gray-900">
                {comment.author || "Anonymous"}
              </span>
              <span className="text-xs text-gray-500">
                {formatTimeAgo(comment.created_at)}
              </span>
              {comment.updated_at !== comment.created_at && (
                <span className="text-xs text-gray-400">(edited)</span>
              )}
            </div>
            
            {comment.userInfo && (
              <div className="text-xs text-gray-500 mb-2">
                {comment.userInfo.role}
                {comment.userInfo.specialization && ` • ${comment.userInfo.specialization}`}
                {comment.userInfo.location && ` • ${comment.userInfo.location}`}
              </div>
            )}
            
            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="text-sm resize-none min-h-[60px]"
                  placeholder="Edit your comment..."
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleEditSubmit}
                    disabled={!editContent.trim()}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1"
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setEditContent(comment.content);
                    }}
                    className="text-xs px-3 py-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-800 whitespace-pre-wrap break-words mb-2">
                {comment.content}
              </div>
            )}
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              {/* <button className="hover:text-red-500 flex items-center gap-1">
                <Heart className="h-3 w-3" />
                {comment.reactions || 0}
              </button> */}
              
              {level < maxLevel && (
                <button
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="hover:text-blue-500 flex items-center gap-1"
                >
                  <Reply className="h-3 w-3" />
                  Reply
                </button>
              )}
              
              {comment.replies && comment.replies.length > 0 && (
                <span className="text-gray-400">
                  {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                </span>
              )}
            </div>
          </div>
          
          {isOwner && (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDropdown(!showDropdown);
                }}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <MoreVertical className="h-4 w-4 text-gray-500" />
              </button>
              
              {showDropdown && (
                <div 
                  className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      onDelete(comment.id);
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {showReplyForm && (
          <div className="mt-3 ml-11 space-y-2">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="text-sm resize-none min-h-[60px]"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleReplySubmit}
                disabled={!replyContent.trim()}
                className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1"
              >
                <Send className="h-3 w-3 mr-1" />
                Reply
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowReplyForm(false);
                  setReplyContent("");
                }}
                className="text-xs px-3 py-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
              postId={postId}
              level={level + 1}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              onLoadReplies={onLoadReplies}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser, fetchUserById } = useUserStore();
  const { toggleLike, liked, sharePost, savePost, saved } = usePostStore();
  
  const [post, setPost] = useState<ExtendedPost | null>(null);
  const [comments, setComments] = useState<CommentWithReplies[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [attachments, setAttachments] = useState<FolderContentsResponse | null>(null);
  const [loadingAttachments, setLoadingAttachments] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const postId = params.id as string;

  useEffect(() => {
    if (postId) {
      fetchPost();
      fetchComments();
    }
  }, [postId]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const postData = await getPost(postId);
      
      const authorData = await fetchUserById(postData.auth);
      const user = {
        name: authorData.name || 'Unknown User',
        profile_picture: authorData.profilePicture || '/pp.png',
        role: authorData.role || 'Medical Professional'
      };
      
      setPost({ ...postData, user });
      
      // Initialize like state
      setLikeCount(postData.reactions || 0);
      setIsLiked(liked[postData.id] || false);
      
      // Load attachments if they exist
      const hasAttachmentId = (postData as any).attachment_id;
      if (hasAttachmentId) {
        loadAttachments(hasAttachmentId);
      }
    } catch (error) {
      console.error('Failed to fetch post:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAttachments = async (attachmentId: string) => {
    if (loadingAttachments) return;
    
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

  const fetchComments = async () => {
    try {
      setCommentsLoading(true);
      const response = await getPostComments(postId, 1, 50, "created_at", "desc", true);
      
      const transformedComments = await Promise.all(
        response.data.map(async (comment) => {
          const userInfo = await getUserInfo(comment.auth);
          return {
            ...comment,
            author: userInfo.name,
            avatar: userInfo.avatar,
            userInfo: userInfo,
            replies: [] as CommentWithReplies[]
          };
        })
      );
      
      const commentsMap = new Map();
      const topLevelComments: CommentWithReplies[] = [];
      
      transformedComments.forEach(comment => {
        commentsMap.set(comment.id, comment);
      });
      
      transformedComments.forEach(comment => {
        if (comment.parent_id) {
          const parent = commentsMap.get(comment.parent_id);
          if (parent) {
            if (!parent.replies) parent.replies = [];
            parent.replies.push(comment);
          }
        } else {
          topLevelComments.push(comment);
        }
      });
      
      const sortReplies = (comments: CommentWithReplies[]): CommentWithReplies[] => {
        return comments.map(comment => ({
          ...comment,
          replies: comment.replies ? comment.replies.sort((a: CommentWithReplies, b: CommentWithReplies) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          ) : []
        }));
      };
      
      const sortedComments = sortReplies(topLevelComments);
      setComments(sortedComments);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !currentUser || submitting) return;

    try {
      setSubmitting(true);
      const newCommentData = await createComment({
        content: newComment,
        post_id: postId
      });
      
      const userInfo = await getUserInfo(currentUser.id || "");
      
      const commentWithAuthor = {
        ...newCommentData,
        author: currentUser.name || "You",
        avatar: currentUser.profile_picture || "/pp.png",
        userInfo: userInfo,
        replies: []
      };
      
      setComments(prev => [commentWithAuthor, ...prev]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to create comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (commentId: string, content: string) => {
    if (!currentUser) return;
    
    try {
      const reply = await replyToComment(commentId, content);
      const userInfo = await getUserInfo(currentUser.id || "");
      const replyWithAuthor = {
        ...reply,
        author: currentUser.name || "You",
        avatar: currentUser.profile_picture || "/pp.png",
        userInfo: userInfo,
        replies: []
      };
      
      const updateNestedComments = (comments: CommentWithReplies[]): CommentWithReplies[] => {
        return comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), replyWithAuthor]
            };
          }
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: updateNestedComments(comment.replies)
            };
          }
          return comment;
        });
      };
      
      setComments(prev => updateNestedComments(prev));
    } catch (error) {
      console.error("Failed to reply to comment:", error);
    }
  };

  const handleEdit = async (commentId: string, content: string) => {
    try {
      await updateComment(commentId, { content });
      
      const updateNestedComments = (comments: CommentWithReplies[]): CommentWithReplies[] => {
        return comments.map(comment => {
          if (comment.id === commentId) {
            return { ...comment, content, updated_at: new Date().toISOString() };
          }
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: updateNestedComments(comment.replies)
            };
          }
          return comment;
        });
      };
      
      setComments(prev => updateNestedComments(prev));
    } catch (error) {
      console.error("Failed to edit comment:", error);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    
    try {
      await deleteComment(commentId);
      
      const removeNestedComments = (comments: CommentWithReplies[]): CommentWithReplies[] => {
        return comments
          .filter(comment => comment.id !== commentId)
          .map(comment => ({
            ...comment,
            replies: comment.replies ? removeNestedComments(comment.replies) : []
          }));
      };
      
      setComments(prev => removeNestedComments(prev));
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const handleLoadReplies = async (commentId: string) => {
    try {
      const response = await getCommentReplies(commentId, 1, 20);
      const repliesWithAuthor = await Promise.all(
        response.data.map(async (reply) => {
          const userInfo = await getUserInfo(reply.auth);
          return {
            ...reply,
            author: userInfo.name,
            avatar: userInfo.avatar,
            userInfo: userInfo,
            replies: []
          };
        })
      );
      
      const updateNestedComments = (comments: CommentWithReplies[]): CommentWithReplies[] => {
        return comments.map(comment => {
          if (comment.id === commentId) {
            return { ...comment, replies: repliesWithAuthor };
          }
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: updateNestedComments(comment.replies)
            };
          }
          return comment;
        });
      };
      
      setComments(prev => updateNestedComments(prev));
    } catch (error) {
      console.error("Failed to load replies:", error);
    }
  };

  const handleLikeClick = async () => {
    if (isLiking || !post) return;
    setIsLiking(true);
    try {
      const response = await patchReaction(post.id);
      setIsLiked(response.reacted);
      setLikeCount(response.totalReactions);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleShareClick = async () => {
    if (isSharing || !post) return;
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
    if (isSaving || !post) return;
    setIsSaving(true);
    try {
      savePost(post.id);
    } catch (error) {
      console.error('Failed to save post:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="flex items-center gap-4 p-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-bold">Post</h1>
            </div>
          </div>
          
          <div className="flex justify-center items-center py-12">
            <div className="text-lg text-gray-600">Loading post...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="flex items-center gap-4 p-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-bold">Post</h1>
            </div>
          </div>
          
          <div className="flex justify-center items-center py-12">
            <div className="text-lg text-gray-600">Post not found</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex-1">
      <div className="mx-auto w-full bg-white min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center gap-4 p-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-bold">Post</h1>
          </div>
        </div>

        {/* Post Content */}
        <div className="border-b border-gray-200">
          <div className="p-6">
            {/* Author Info */}
            <div className="flex items-center gap-3 mb-4">
              <Image
                src={post.user?.profile_picture || '/pp.png'}
                alt={post.user?.name || 'Author'}
                width={48}
                height={48}
                className="rounded-full object-cover w-12 h-12 flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-gray-900">{post.user?.name}</span>
                </div>
                <span className="text-sm text-gray-500">{post.user?.role}</span>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <MoreVertical className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Post Title */}
            {post.title && (
              <h2 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h2>
            )}

            {/* Post Content */}
            <div className="text-gray-900 text-base leading-relaxed mb-4 whitespace-pre-wrap">
              {post.content}
            </div>

            {/* Attachments Display */}
            {loadingAttachments && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Loading attachments...</div>
              </div>
            )}
            
            {attachments && attachments.files.length > 0 && (
              <div className="mb-4">
                <MediaCarousel files={attachments.files} />
              </div>
            )}

            {/* Post Meta */}
            <div className="text-sm text-gray-500 mb-4">
              {formatDate(post.created_at)}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 py-3 border-y border-gray-200">
              <span className="text-sm">
                <span className="font-bold text-gray-900">{likeCount}</span>
                <span className="text-gray-500 ml-1">Likes</span>
              </span>
              <span className="text-sm">
                <span className="font-bold text-gray-900">{comments.length}</span>
                <span className="text-gray-500 ml-1">Comments</span>
              </span>
              <span className="text-sm">
                <span className="font-bold text-gray-900">{post.shares || 0}</span>
                <span className="text-gray-500 ml-1">Shares</span>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-around py-2">
              <button 
                onClick={handleLikeClick}
                disabled={isLiking}
                className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors flex-1 justify-center disabled:opacity-70"
              >
                <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                <span className={`font-medium ${isLiked ? "text-red-500" : "text-gray-600"}`}>
                  {isLiking ? "..." : "Like"}
                </span>
              </button>
              <button className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors flex-1 justify-center">
                <MessageSquare className="h-5 w-5 text-gray-600" />
                <span className="text-gray-600 font-medium">Comment</span>
              </button>
              <button 
                onClick={handleShareClick}
                disabled={isSharing}
                className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors flex-1 justify-center disabled:opacity-70"
              >
                <Share2 className="h-5 w-5 text-gray-600" />
                <span className="text-gray-600 font-medium">{isSharing ? "..." : "Share"}</span>
              </button>
              <button 
                onClick={handleSaveClick}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors flex-1 justify-center disabled:opacity-70"
              >
                <Bookmark className={`h-5 w-5 ${saved[post.id] ? "fill-yellow-500 text-yellow-500" : "text-gray-600"}`} />
                <span className={`font-medium ${saved[post.id] ? "text-yellow-500" : "text-gray-600"}`}>
                  {isSaving ? "..." : saved[post.id] ? "Saved" : "Save"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Comment Input */}
        {currentUser && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex gap-3">
              <Image
                src={currentUser.profile_picture || '/pp.png'}
                alt='Your avatar'
                width={40}
                height={40}
                className="rounded-full object-cover w-10 h-10 flex-shrink-0"
              />
              <div className="flex-1 space-y-2">
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="resize-none min-h-[60px] text-sm bg-white border-none outline-none"
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || submitting}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2"
                  >
                    <Send className="h-3 w-3 mr-1" />
                    {submitting ? "Posting..." : "Comment"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="space-y-1 p-4">
          {commentsLoading ? (
            <div className="flex justify-center py-8">
              <div className="text-gray-600">Loading comments...</div>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            <>
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  currentUserId={currentUser?.id || ""}
                  postId={postId}
                  level={0}
                  onReply={handleReply}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onLoadReplies={handleLoadReplies}
                />
              ))}
            </>
          )}
        </div>
      </div>
      
      {post && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          post={{
            id: post.id,
            author: post.user?.name || 'Unknown User',
            authorId: post.auth,
            avatar: post.user?.profile_picture || '/pp.png',
            role: post.user?.role || 'Medical Professional',
            time: formatDate(post.created_at),
            title: post.title,
            content: post.content,
            tags: [],
            type: "Research Paper",
            likes: post.reactions || 0,
            comments: comments.length,
            shares: post.shares || 0,
          }}
        />
      )}
    </div>
  );
}
