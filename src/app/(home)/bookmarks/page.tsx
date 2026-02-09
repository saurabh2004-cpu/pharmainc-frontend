"use client";

import React, { useState, useEffect } from 'react';
import { Search, Bookmark, MoreVertical, Heart, MessageSquare, Share2, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { LoginPrompt } from './_components/LoginPrompt';
import { useUserStore } from '@/store/userStore';
import { getAuthToken } from '@/lib/api/utils';

interface BookmarkedPost {
  id: string;
  author: string;
  authorId?: string; // User ID of the post author
  avatar: string;
  role: string;
  time: string;
  title?: string;
  content: string;
  image?: string;
  tags?: string[];
  type: "Research Paper" | "Case Study";
  likes: number;
  comments: number;
  shares: number;
}

const BookmarksPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { currentUser, fetchCurrentUser, loading: userLoading } = useUserStore();

  // Empty array since backend bookmarks is not ready
  const bookmarkedPosts: BookmarkedPost[] = [];

  const handleProfileClick = (authorId?: string) => {
    if (authorId) {
      router.push(`/profile/${authorId}`);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken();
      
      if (token) {
        setIsAuthenticated(true);
        if (!currentUser && !userLoading) {
          await fetchCurrentUser();
        }
      } else {
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
  }, [currentUser, fetchCurrentUser, userLoading]);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  // Show login prompt if user is not authenticated
  if (!isAuthenticated) {
    return <LoginPrompt />;
  }
  const filteredPosts = bookmarkedPosts.filter(post =>
    post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-white">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-gray-900" />
            <h1 className="text-xl font-bold text-gray-900 font-sans">Bookmarks</h1>
          </div>
        </div>
        
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search bookmarks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-50 border-none outline-none focus:bg-gray-100"
          />
        </div>
      </div>

      <div className="p-4">
        {filteredPosts.length > 0 ? (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div key={post.id} className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                <div className="flex items-start gap-3">
                  <Image
                    src={post.avatar}
                    alt={post.author}
                    width={48}
                    height={48}
                    onClick={() => handleProfileClick(post.authorId)}
                    className="rounded-full cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 
                          onClick={() => handleProfileClick(post.authorId)}
                          className="font-semibold text-gray-900 font-sans cursor-pointer hover:text-blue-600 transition-colors"
                        >
                          {post.author}
                        </h3>
                        <p className="text-sm text-gray-500 font-sans">{post.role} • {post.time}</p>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-full">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>

                    {post.title && (
                      <h2 className="text-xl font-bold text-gray-900 mb-3 font-sans">{post.title}</h2>
                    )}
                    
                    <p className="text-gray-700 mb-4 font-sans leading-relaxed">{post.content}</p>

                    {post.image && (
                      <div className="mb-4">
                        <Image
                          src={post.image}
                          alt="Post image"
                          width={600}
                          height={300}
                          className="rounded-lg w-full object-cover"
                        />
                      </div>
                    )}

                    {post.tags && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-6">
                        <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm">{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
                          <MessageSquare className="w-4 h-4" />
                          <span className="text-sm">{post.comments}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors">
                          <Share2 className="w-4 h-4" />
                          <span className="text-sm">{post.shares}</span>
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                          {post.type}
                        </span>
                        <button className="text-blue-500 hover:text-blue-600">
                          <Bookmark className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <Bookmark className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2 font-sans">No bookmarks yet</h3>
            <p className="text-gray-400 text-center max-w-sm">
              {searchQuery ? 'No bookmarks match your search.' : 'Bookmarking functionality is coming soon. Save your favorite posts and research papers to access them quickly.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookmarksPage;