import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Heart, Share2, Bookmark, MessageSquare, MoreHorizontal, Trash2 } from "lucide-react";
import { getUserPosts, deletePost } from "@/lib/api/services/content";
import { Post, PaginatedResponse } from "@/lib/api/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/userStore";
import { PostCleanupService } from "@/lib/services/postCleanupService";
import Link from "next/link";

interface ProfilePostsTabProps {
  userId: string;
}

export const ProfilePostsTab = ({ userId }: ProfilePostsTabProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    hasNext: false,
    totalPages: 0,
    total: 0
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState<string | null>(null);
  
  const { currentUser } = useUserStore();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response: PaginatedResponse<Post> = await getUserPosts(userId, 1, 10);
        setPosts(response.data);
        setPagination({
          page: response.pagination.page,
          hasNext: response.pagination.hasNext,
          totalPages: response.pagination.totalPages,
          total: response.pagination.total
        });
      } catch (err) {
        console.error("Error fetching user posts:", err);
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchPosts();
    }
  }, [userId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const handleDeletePost = (postId: string) => {
    setSelectedPostId(postId);
    setDeleteModalOpen(true);
    setPopoverOpen(null);
  };

  const confirmDeletePost = async () => {
    if (deleteConfirmText.toLowerCase() !== "delete" || !selectedPostId) {
      return;
    }

    try {
      setDeleting(true);
      const selectedPost = posts.find(post => post.id === selectedPostId);
      
      await deletePost(selectedPostId);

      if (selectedPost?.attachment_id) {
        try {
          console.log(`Cleaning up Minio folder for attachment_id: ${selectedPost.attachment_id}`);
          await PostCleanupService.cleanupPost(selectedPost.attachment_id);
          console.log(`Successfully deleted Minio folder for post attachment: ${selectedPost.attachment_id}`);
        } catch (minioError) {
          console.error(`Failed to delete Minio folder for attachment_id ${selectedPost.attachment_id}:`, minioError);
        }
      } else {
        console.log(`Post ${selectedPostId} has no attachment_id, skipping Minio cleanup`);
      }
      
      setPosts(prevPosts => prevPosts.filter(post => post.id !== selectedPostId));
      setPagination(prev => ({
        ...prev,
        total: prev.total - 1
      }));
      
      setDeleteModalOpen(false);
      setSelectedPostId(null);
      setDeleteConfirmText("");
    } catch (err) {
      console.error("Error deleting post:", err);
      setError("Failed to delete post");
    } finally {
      setDeleting(false);
    }
  };

  const isCurrentUserProfile = currentUser?.id === userId;

  if (loading) {
    return (
      <Card className="rounded-xl shadow-lg border-0 bg-white/90 backdrop-blur-xs">
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border rounded-xl p-4 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
                <div className="flex gap-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="rounded-xl shadow-lg border-0 bg-white/90 backdrop-blur-xs">
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (posts.length === 0) {
    return (
      <Card className="rounded-xl shadow-lg border-0 bg-white/90 backdrop-blur-xs">
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No posts yet</p>
            <p className="text-sm">This user hasn't shared any posts.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl shadow-lg border-0 bg-white/90 backdrop-blur-xs">
      <CardContent className="p-6">
        <div className="space-y-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/post/${post.id}`}>
            <div className="border rounded-xl p-4 hover:border-blue-200 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg flex-1">
                  {post.title}
                </h3>
                {isCurrentUserProfile && (
                  <Popover open={popoverOpen === post.id} onOpenChange={(open) => setPopoverOpen(open ? post.id : null)}>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40" align="end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Post
                      </Button>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
              <p className="text-gray-700 mb-3 overflow-hidden" style={{ 
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical' as any,
                textOverflow: 'ellipsis'
              }}>
                {post.content}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.created_at)}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{post.reactions || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Share2 className="h-4 w-4" />
                    <span>{post.shares || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bookmark className="h-4 w-4" />
                    <span>{post.saves || 0}</span>
                  </div>
                </div>
              </div>
            </div>
            </Link>
          ))}
          
          {pagination.total > 0 && (
            <div className="text-center text-sm text-gray-500 pt-4 border-t">
              Showing {posts.length} of {pagination.total} posts
              {pagination.hasNext && (
                <button className="ml-2 text-blue-500 hover:text-blue-600">
                  Load more
                </button>
              )}
            </div>
          )}
        </div>
      </CardContent>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="delete-confirm" className="block text-sm font-medium mb-2">
                Type "delete" to confirm:
              </label>
              <Input
                id="delete-confirm"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type 'delete' to confirm"
                className="w-full"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteModalOpen(false);
                setDeleteConfirmText("");
                setSelectedPostId(null);
              }}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeletePost}
              disabled={deleteConfirmText.toLowerCase() !== "delete" || deleting}
            >
              {deleting ? "Deleting..." : "Delete Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
