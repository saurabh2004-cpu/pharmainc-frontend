"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import LeftSidebar from "@/components/homefeed-old/LeftSidebar";
import { RightSidebar } from "@/components/homefeed-old/RightSidebar";
import PostComposer from "@/components/homefeed-old/PostComposer";
import PostCard from "@/components/homefeed-old/PostCard";
import { User, Post } from "@/components/homefeed-old/types";
import { createPost, listPosts, getUser, getUserById } from "@/lib/api";
import { toast } from "sonner";

export default function HomeFeed() {
  const [liked, setLiked] = useState<Record<string | number, boolean>>({});
  const [likedCount, setLikedCount] = useState<Record<string | number, number>>({});
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState({
    user: true,
    posts: true,
  });
  const [posts, setPosts] = useState<Post[]>([]);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postAttachmentId, setPostAttachmentId] = useState("");
  const [posting, setPosting] = useState(false);
  const [userCache, setUserCache] = useState<Record<string, User>>({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUser();
        setUser({
          id: userData.id,
          name: userData.name,
          role: userData.role,
          profilePicture: userData.profile_picture,
          location: userData.location,
        });
        setUserCache((prev) => ({
          ...prev,
          [userData.id]: userData,
        }));
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Failed to load user profile");
      } finally {
        setLoading((prev) => ({ ...prev, user: false }));
      }
    };

    fetchUserData();
  }, []);

  const fetchUserForPost = async (userId: string) => {
    try {
      if (userCache[userId]) {
        return userCache[userId];
      }
      const userData = await getUserById(userId);
      setUserCache((prev) => ({
        ...prev,
        [userId]: userData,
      }));
      return userData;
    } catch (error) {
      console.error(`Error fetching user ${userId}:`, error);
      return {
        id: userId,
        name: "Unknown User",
        role: "Unknown Role",
        profilePicture: "/pp.png",
      };
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await listPosts(1, 20);
        const fetchedPosts = response.data || [];
        const authorIds = [...new Set(fetchedPosts.map((post) => post.auth))];
        const authorPromises = authorIds.map((id) => fetchUserForPost(id));
        const authors = await Promise.all(authorPromises);
        const authorsMap = authors.reduce((acc, author) => {
          if (author.id !== undefined) {
            acc[author.id] = author;
          }
          return acc;
        }, {} as Record<string, User>);

        const transformedPosts = await Promise.all(
          fetchedPosts.map(async (post: { id: string; auth: string; created_at: string; content: string; title: string; reactions?: number; shares?: number; imageId?: string }) => {
            const author = authorsMap[post.auth] || {
              id: post.auth,
              name: "Unknown User",
              role: "Unknown Role",
              profilePicture: "/pp.png",
            };
            return {
              id: post.id,
              author: author.name || "Unknown User",
              avatar: author.profilePicture || "/pp.png",
              role: author.role || "Medical Professional",
              time: new Date(post.created_at).toLocaleString(),
              content: post.content,
              title: post.title,
              tags: [],
              type: "Research Paper" as const,
              likes: post.reactions || 0,
              comments: 0,
              shares: post.shares || 0,
              ...(post.imageId && {
                image: `https://content.api.pharminc.in/image/${post.imageId}`,
              }),
            };
          })
        );

        setPosts(transformedPosts);

        const initialLikedCount: Record<string | number, number> = {};
        transformedPosts.forEach((post) => {
          initialLikedCount[post.id] = post.likes;
        });
        setLikedCount(initialLikedCount);
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast.error("Failed to load posts");
      } finally {
        setLoading((prev) => ({ ...prev, posts: false }));
      }
    };

    fetchPosts();
    // eslint-disable-next-line
  }, [fetchUserForPost]);

  const handleLogout = () => {
    console.log("Logging out...");
    // Implement actual logout logic here
  };

  const handlePostCreated = async (postData: {
    title: string;
    content: string;
    attachment_id?: string | null;
  }) => {
    try {
      setPosting(true);
      const cleanedData = {
        ...postData,
        attachment_id: postData.attachment_id || undefined,
      };
      const newPost = await createPost(cleanedData);

      if (!user) {
        throw new Error("User not available");
      }

      const formattedPost: Post = {
        id: newPost.id,
        author: user.name || "Unknown User",
        avatar: user.profilePicture || "/pp.png",
        role: user.role || "Medical Professional",
        time: "Just now",
        content: newPost.content,
        title: newPost.title,
        tags: [],
        type: "Research Paper" as const,
        likes: newPost.reactions || 0,
        comments: 0,
        shares: newPost.shares || 0,
        ...(newPost.attachment_id && {
          image: `https://content.api.pharminc.in/image/${newPost.attachment_id}`,
        }),
      };

      setPosts((prev) => [formattedPost, ...prev]);
      setLikedCount((prev) => ({
        ...prev,
        [formattedPost.id]: formattedPost.likes,
      }));
      setPostTitle("");
      setPostContent("");
      setPostAttachmentId("");
      toast.success("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setPosting(false);
    }
  };

  const handleLike = (postId: number | string) => {
    setLiked((prev) => ({ ...prev, [postId]: !prev[postId] }));
    setLikedCount((prev) => ({
      ...prev,
      [postId]: (prev[postId] || 0) + (liked[postId] ? -1 : 1),
    }));
  };

  if (loading.user || loading.posts) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Medical Network | Home</title>
      </Head>
      <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
        <div className="grid grid-cols-12 gap-8 min-h-screen">
          {/* Left Sidebar */}
          <div className="col-span-3 h-full">
            {user && <LeftSidebar user={user} handleLogout={handleLogout} />}
          </div>
          {/* Main Content */}
          <div className="col-span-6 flex flex-col items-center">
            {user && (
              <PostComposer
                postTitle={postTitle}
                setPostTitle={setPostTitle}
                postContent={postContent}
                setPostContent={setPostContent}
                postAttachmentId={postAttachmentId}
                setPostAttachmentId={setPostAttachmentId}
                onPostCreated={handlePostCreated}
                posting={posting}
                setPosting={setPosting}
                user={user}
              />
            )}
            <div className="w-full max-w-2xl mt-4 flex flex-col gap-4">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={{ ...post, likes: likedCount[post.id] || post.likes }}
                  handleLike={handleLike}
                  liked={liked}
                />
              ))}
            </div>
          </div>
          <div className="col-span-3 h-full">
              <RightSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
