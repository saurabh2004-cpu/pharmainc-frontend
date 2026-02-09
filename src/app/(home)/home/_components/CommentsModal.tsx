"use client";

import React, { useState, useEffect } from "react";
import { X, MessageSquare, Heart, MoreVertical, Reply, Edit, Trash2, Send } from "lucide-react";
import { Dialog, DialogContent, DialogOverlay, DialogPortal, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUserStore } from "@/store";
import { Comment } from "@/lib/api/types";
import { 
  getPostComments, 
  getCommentReplies, 
  getCommentThread,
  createComment, 
  replyToComment, 
  updateComment, 
  deleteComment 
} from "@/lib/api/services/content";
import { Post } from "./types";
import { getUserInfo, UserInfo } from "./userUtils";

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
}

interface CommentItemProps {
  comment: Comment & { 
    author?: string; 
    avatar?: string; 
    userInfo?: UserInfo;
    replies?: Comment[] 
  };
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
    <div className={`${level > 0 ? 'ml-4 border-l-2 border-blue-200 pl-3' : ''} mb-2 font-sans`}>
      <div className={`${level === 0 ? 'bg-gray-50' : 'bg-white border border-gray-100'} rounded-lg p-2`}>
        <div className="flex items-start gap-2">
          <img
            src={comment.avatar || "/pp.png"}
            alt={comment.author || "User"}
            className="w-7 h-7 rounded-full object-cover flex-shrink-0"
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
            
            {/* User role and specialization */}
            {comment.userInfo && (
              <div className="text-xs text-gray-500 mb-1">
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
                  className="text-sm resize-none min-h-[50px]"
                  placeholder="Edit your comment..."
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleEditSubmit}
                    disabled={!editContent.trim()}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1"
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
                    className="text-xs px-2 py-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-800 whitespace-pre-wrap break-words mb-1">
                {comment.content}
              </div>
            )}
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <button className="hover:text-red-500 flex items-center gap-1">
                <Heart className="h-3 w-3" />
                {comment.reactions || 0}
              </button>
              
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
          <div className="mt-2 space-y-2">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="text-sm resize-none min-h-[50px]"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleReplySubmit}
                disabled={!replyContent.trim()}
                className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1"
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
                className="text-xs px-2 py-1"
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

export default function CommentsModal({ isOpen, onClose, post }: CommentsModalProps) {
  const [comments, setComments] = useState<(Comment & { author?: string; avatar?: string; replies?: Comment[] })[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { currentUser } = useUserStore();

  useEffect(() => {
    if (isOpen && post.id) {
      fetchComments();
    }
  }, [isOpen, post.id]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await getPostComments(post.id.toString(), 1, 50, "created_at", "desc", true);
      
      const transformedComments = await Promise.all(
        response.data.map(async (comment) => {
          const userInfo = await getUserInfo(comment.auth);
          return {
            ...comment,
            author: userInfo.name,
            avatar: userInfo.avatar,
            userInfo: userInfo,
            replies: [] as any[]
          };
        })
      );
      
      const commentsMap = new Map();
      const topLevelComments: any[] = [];
      
      transformedComments.forEach(comment => {
        commentsMap.set(comment.id, comment);
      });
      
      transformedComments.forEach(comment => {
        if (comment.parent_id) {
          const parent = commentsMap.get(comment.parent_id);
          if (parent) {
            parent.replies.push(comment);
          }
        } else {
          topLevelComments.push(comment);
        }
      });
      
      const sortReplies = (comments: any[]): any[] => {
        return comments.map(comment => ({
          ...comment,
          replies: comment.replies.sort((a: any, b: any) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          )
        }));
      };
      
      setComments(sortReplies(topLevelComments));
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateComment = async () => {
    if (!newComment.trim() || !currentUser) return;
    
    setSubmitting(true);
    try {
      const newCommentData = await createComment({
        content: newComment.trim(),
        post_id: post.id.toString()
      });
      
      const userInfo = await getUserInfo(currentUser.id || "");
      
      const commentWithAuthor = {
        ...newCommentData,
        author: currentUser.name || "You",
        avatar: currentUser.profilePicture || "/pp.png",
        userInfo: userInfo,
        replies: []
      };
      
      setComments(prev => [commentWithAuthor, ...prev]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to create comment:", error);
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
        avatar: currentUser.profilePicture || "/pp.png",
        userInfo: userInfo,
        replies: []
      };
      
      const updateNestedComments = (comments: any[]): any[] => {
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
      
      console.log("Reply added successfully!");
    } catch (error) {
      console.error("Failed to reply to comment:", error);
    }
  };

  const handleEdit = async (commentId: string, content: string) => {
    try {
      await updateComment(commentId, { content });
      
      const updateNestedComments = (comments: any[]): any[] => {
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
      
      const removeNestedComments = (comments: any[]): any[] => {
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
      
      const updateNestedComments = (comments: any[]): any[] => {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="bg-black/40" />
        <DialogContent className="max-w-2xl w-full mx-4 max-h-[90vh] p-0 bg-white rounded-2xl shadow-2xl border-0 font-sans flex flex-col">
          <DialogTitle className="sr-only">Comments for {post.title}</DialogTitle>
          
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-700" />
              </button>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 font-sans">
                <MessageSquare className="h-5 w-5" />
                Comments
              </h2>
            </div>
            <div className="text-sm text-gray-500">
              {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
            </div>
          </div>

          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex-shrink-0">
            <div className="flex gap-3">
              <img
                src={post.avatar}
                alt={post.author}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{post.author}</span>
                  <span className="text-xs text-gray-500">{post.time}</span>
                </div>
                {post.title && (
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 font-sans">{post.title}</h3>
                )}
                <p className="text-sm text-gray-800 line-clamp-3 overflow-hidden text-ellipsis">{post.content}</p>
              </div>
            </div>
          </div>

          {currentUser && (
            <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0">
              <div className="flex gap-3">
                <img
                  src={currentUser.profilePicture || "/pp.png"}
                  alt="Your avatar"
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="resize-none min-h-[60px] text-sm"
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handleCreateComment}
                      disabled={!newComment.trim() || submitting}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1.5"
                    >
                      <Send className="h-3 w-3 mr-1" />
                      {submitting ? "Posting..." : "Comment"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-4 py-2 min-h-0">
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="text-gray-500">Loading comments...</div>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    currentUserId={currentUser?.id || ""}
                    postId={post.id.toString()}
                    level={0}
                    onReply={handleReply}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onLoadReplies={handleLoadReplies}
                  />
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
