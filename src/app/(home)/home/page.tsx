"use client";

import React, { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { useUserStore, usePostStore } from '@/store'
import PostComposer from './_components/PostComposer';
import PostCard from './_components/PostCard';
import SearchBar from './_components/SearchBar';
import { redirect } from 'next/navigation';

export default function HomeFeed() {
  const { 
    currentUser, 
    loading: userLoading, 
    fetchCurrentUser 
  } = useUserStore()

  const { 
    posts, 
    loading: postsLoading, 
    loadingMore,
    hasMore,
    likedCount, 
    fetchPosts,
    loadMorePosts
  } = usePostStore()

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px'
  })

  useEffect(() => {
    fetchCurrentUser()
    fetchPosts()
  }, [fetchCurrentUser, fetchPosts])

  useEffect(() => {
    if (inView && hasMore && !loadingMore) {
      loadMorePosts()
    }
  }, [inView, hasMore, loadingMore, loadMorePosts])

  if(true){
    return redirect("/find-jobs");
  }

  if (userLoading || postsLoading) {
    return (
      <div className="space-y-6">
        <SearchBar />
        <div className="flex justify-center items-center py-12 p-4 ">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      
      <SearchBar />

      {currentUser && (
        <div className="px-4">
          <PostComposer user={currentUser!} />
        </div>
      )}

      <div className="space-y-4 p-4 ">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={{ ...post, likes: likedCount[post.id] || post.likes }}
          />
        ))}
        
        {hasMore && (
          <div ref={ref} className="flex justify-center py-4">
            {loadingMore && (
              <div className="text-lg text-gray-600">Loading more posts...</div>
            )}
          </div>
        )}
        
        {!hasMore && posts.length > 0 && (
          <div className="flex justify-center py-4">
            <div className="text-lg text-gray-500">No more posts to load</div>
          </div>
        )}
      </div>
    </div>
  )
}
