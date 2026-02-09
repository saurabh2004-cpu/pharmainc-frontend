import { Button } from "@/components/ui/button";
import {
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  MoreVertical,
} from "lucide-react";
import { Post } from "./types";
import { useState } from "react";

interface PostCardProps {
  post: Post;
  handleLike: (postId: number | string) => void;
  liked: Record<string | number, boolean>;
}

export default function PostCard({ post, handleLike, liked }: PostCardProps) {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 300; 
  const shouldTruncate = post.content.length > maxLength;
  const displayContent = expanded
    ? post.content
    : shouldTruncate
    ? post.content.substring(0, maxLength) + "..."
    : post.content;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-4 flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <img
          src={post.avatar}
          alt={post.author}
          className="w-9 h-9 rounded-full object-cover"
        />
        <div className="flex flex-col leading-tight">
          <span className="font-semibold text-sm text-gray-900">
            {post.author}
          </span>
          <span className="text-xs text-gray-500">
            {post.role} • {post.time}
          </span>
        </div>
        <div className="ml-auto">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-400 hover:text-gray-700"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Post title */}
      {post.title && (
        <h3 className="font-semibold text-gray-900 text-sm">{post.title}</h3>
      )}

      {/* Post content with proper wrapping and read more */}
      <div className="text-sm text-gray-800 whitespace-pre-wrap break-words">
        {displayContent}
        {shouldTruncate && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-blue-600 hover:text-blue-800 ml-1 text-sm font-medium"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      {post.image && (
        <div className="rounded-lg overflow-hidden border border-gray-100">
          <img src={post.image} alt="post" className="w-full h-auto" />
        </div>
      )}

      <div className="flex flex-wrap gap-1">
        {post.tags?.map((tag) => (
          <span
            key={tag}
            className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="text-xs text-blue-700 font-medium">
        {post.type === "Research Paper" ? "📄 Research Paper" : "🩺 Case Study"}
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500 border-t border-gray-100 pt-2">
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => handleLike(post.id)}
        >
          <Heart
            className={`h-3.5 w-3.5 ${
              liked[post.id] ? "fill-red-500 text-red-500" : ""
            }`}
          />
          <span>{post.likes} likes</span>
        </div>
        <span>{post.comments} comments</span>
        <span>{post.shares} shares</span>
      </div>

      <div className="flex border-t border-gray-100 mt-2 pt-2 gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 text-gray-600 hover:text-red-600 hover:bg-red-50 py-1"
          onClick={() => handleLike(post.id)}
        >
          <Heart className="h-4 w-4 mr-1" /> Like
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 py-1"
        >
          <MessageSquare className="h-4 w-4 mr-1" /> Comment
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 text-gray-600 hover:text-green-600 hover:bg-green-50 py-1"
        >
          <Share2 className="h-4 w-4 mr-1" /> Share
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 py-1"
        >
          <Bookmark className="h-4 w-4 mr-1" /> Save
        </Button>
      </div>
    </div>
  );
}
