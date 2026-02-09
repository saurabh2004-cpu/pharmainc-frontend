import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Post } from '@/app/(home)/home/_components/types'
import { listPosts, createPost, getPost, patchReaction } from '@/lib/api/services/content'
import { useUserStore } from './userStore'
import { fetchFolderContents } from '@/lib/minio/minio-client'

interface PostState {
  posts: Post[]
  loading: boolean
  loadingMore: boolean
  error: string | null
  liked: Record<string | number, boolean>
  likedCount: Record<string | number, number>
  saved: Record<string | number, boolean>
  currentPage: number
  hasMore: boolean
  totalPages: number
  
  fetchPosts: (page?: number, limit?: number, append?: boolean) => Promise<void>
  fetchSinglePost: (postId: string) => Promise<Post | null>
  loadMorePosts: () => Promise<void>
  addPost: (post: Post) => void
  toggleLike: (postId: string | number) => Promise<void>
  sharePost: (postId: string | number) => Promise<void>
  savePost: (postId: string | number) => void
  clearPosts: () => void
  createNewPost: (postData: { title: string; content: string; attachment_id?: string }) => Promise<void>
  // TEMPORARY FIX START - Add utility method to check if post is liked
  isPostLikedByCurrentUser: (postId: string | number) => boolean
  // TEMPORARY FIX END
}

export const usePostStore = create<PostState>()(
  devtools(
    (set, get) => ({
      posts: [],
      loading: false,
      loadingMore: false,
      error: null,
      liked: {},
      likedCount: {},
      saved: {},
      currentPage: 1,
      hasMore: true,
      totalPages: 0,

      fetchPosts: async (page = 1, limit = 5, append = false) => {
        if (append) {
          set({ loadingMore: true, error: null })
        } else {
          set({ loading: true, error: null })
        }
        
        try {
          const response = await listPosts(page, limit)
          const fetchedPosts = response.data || []
          const pagination = response.pagination
          
          // Get user store to fetch authors
          const { fetchUserById } = useUserStore.getState()
          
          // Get unique author IDs
          const authorIds = [...new Set(fetchedPosts.map((post: any) => post.auth))]
          
          // Fetch all authors
          const authorPromises = authorIds.map((id: string) => fetchUserById(id))
          const authors = await Promise.all(authorPromises)
          // Create authors map
          const authorsMap = authors.reduce((acc, author) => {
            if (author.id) {
              acc[author.id] = author
            }
            return acc
          }, {} as Record<string, any>)

          // Transform posts to UI-ready format
          const transformedPosts: Post[] = fetchedPosts.map((post: any) => {
            const author = authorsMap[post.auth] || {
              name: "Unknown User",
              role: "Medical Professional",
              profilePicture: "/pp.png",
            }

            console.log(author);
            
            return {
              id: post.id,
              author: author.name || "Unknown User",
              authorId: post.auth, // Store the user ID
              avatar: author.profilePicture || "/pp.png",
              role: author.role || "Medical Professional",
              time: new Date(post.created_at).toLocaleString(),
              content: post.content,
              title: post.title,
              tags: post.tags || [],
              type: "Research Paper" as const,
              likes: post.reactions || 0,
              comments: post.comments || 0,
              shares: post.shares || 0,
              poster_type: (post.poster_type as "user" | "institute") || "user", 
              // Store attachment_id for folder-based attachments
              ...(post.attachment_id && { attachment_id: post.attachment_id }),
              // Keep legacy image support
              ...(post.attachment_id && !post.attachment_id.includes('-') && {
                image: `https://content.api.pharminc.in/image/${post.attachment_id}`,
              }),
            }
          })

          // Initialize like counts
          const initialLikedCount: Record<string | number, number> = {}
          transformedPosts.forEach((post) => {
            initialLikedCount[post.id] = post.likes
          })

          // TEMPORARY FIX START - Initialize liked state from localStorage
          const { currentUser } = useUserStore.getState()
          const initialLikedState: Record<string | number, boolean> = {}
          if (currentUser?.id) {
            const likedPostsKey = 'pharminc_liked_posts'
            const likedPostsData = localStorage.getItem(likedPostsKey)
            const likedPosts: Array<{user_id: string, post_id: string | number}> = 
              likedPostsData ? JSON.parse(likedPostsData) : []
            
            transformedPosts.forEach((post) => {
              const hasLiked = likedPosts.some(
                item => item.user_id === currentUser.id && item.post_id === post.id
              )
              initialLikedState[post.id] = hasLiked
            })
          }
          // TEMPORARY FIX END

          const currentPosts = append ? get().posts : []
          const newPosts = append ? [...currentPosts, ...transformedPosts] : transformedPosts

          set({ 
            posts: newPosts,
            liked: { ...get().liked, ...initialLikedState },
            likedCount: { ...get().likedCount, ...initialLikedCount },
            currentPage: page,
            hasMore: pagination?.hasNext || false,
            totalPages: pagination?.totalPages || 0,
            loading: false,
            loadingMore: false
          })
        } catch (error) {
          console.error('Error fetching posts:', error)
          
          const fallbackLikedCount: Record<string | number, number> = {}

          set({ 
            posts: append ? get().posts : [],
            likedCount: { ...get().likedCount, ...fallbackLikedCount },
            error: 'Failed to fetch posts',
            loading: false,
            loadingMore: false
          })
        }
      },

      fetchSinglePost: async (postId: string) => {
        try {
          const response = await getPost(postId)
          const { fetchUserById } = useUserStore.getState()
          
          // Fetch author
          const author = await fetchUserById(response.auth)
          
          // Transform post to UI-ready format
          const transformedPost: Post = {
            id: response.id,
            author: author.name || "Unknown User",
            authorId: response.auth,
            avatar: author.profilePicture || "/pp.png",
            role: author.role || "Medical Professional",
            time: new Date(response.created_at).toLocaleString(),
            content: response.content,
            title: response.title,
            tags: [],
            type: "Research Paper" as const,
            likes: response.reactions || 0,
            comments: 0,
            shares: response.shares || 0,
            poster_type: (response.poster_type as "user" | "institute") || "user", // Add poster_type from API
            ...(response.attachment_id && { attachment_id: response.attachment_id }),
            ...(response.attachment_id && !response.attachment_id.includes('-') && {
              image: `https://content.api.pharminc.in/image/${response.attachment_id}`,
            }),
          }

          return transformedPost
        } catch (error) {
          console.error('Error fetching single post:', error)
          return null
        }
      },

      loadMorePosts: async () => {
        const { currentPage, hasMore, loadingMore } = get()
        
        if (!hasMore || loadingMore) return
        
        await get().fetchPosts(currentPage + 1, 5, true)
      },

      addPost: (post: Post) => {
        set({ 
          posts: [post, ...get().posts],
          likedCount: { 
            ...get().likedCount, 
            [post.id]: post.likes 
          }
        })
      },

      toggleLike: async (postId: string | number) => {
        // TEMPORARY FIX START - Remove when backend API is ready
        const { currentUser } = useUserStore.getState()
        if (!currentUser?.id) {
          console.error('User not logged in')
          return
        }

        // Get current localStorage data
        const likedPostsKey = 'pharminc_liked_posts'
        const likedPostsData = localStorage.getItem(likedPostsKey)
        const likedPosts: Array<{user_id: string, post_id: string | number}> = 
          likedPostsData ? JSON.parse(likedPostsData) : []
        
        // Check if user has already liked this post
        const hasLiked = likedPosts.some(
          item => item.user_id === currentUser.id && item.post_id === postId
        )
        
        // Update localStorage
        let newLikedPosts
        if (hasLiked) {
          // Remove like
          newLikedPosts = likedPosts.filter(
            item => !(item.user_id === currentUser.id && item.post_id === postId)
          )
        } else {
          // Add like
          newLikedPosts = [...likedPosts, { user_id: currentUser.id, post_id: postId }]
        }
        
        localStorage.setItem(likedPostsKey, JSON.stringify(newLikedPosts))
        
        // Update local state
        const currentLikeCount = get().likedCount[postId] || 0
        const newLikeCount = hasLiked ? currentLikeCount - 1 : currentLikeCount + 1
        
        set({
          liked: { ...get().liked, [postId]: !hasLiked },
          likedCount: {
            ...get().likedCount,
            [postId]: newLikeCount
          }
        })

        // Update the post in the posts array
        const posts = get().posts
        const updatedPosts = posts.map(post => 
          post.id === postId 
            ? { ...post, likes: newLikeCount }
            : post
        )
        set({ posts: updatedPosts })
        // TEMPORARY FIX END
        
        try {
          const response = await patchReaction(postId.toString())
          
          // TEMPORARY FIX START - Comment out backend response handling
          /*
          set({
            liked: { ...get().liked, [postId]: response.reacted },
            likedCount: {
              ...get().likedCount,
              [postId]: response.totalReactions
            }
          })

          // Update the post in the posts array
          const posts = get().posts
          const updatedPosts = posts.map(post => 
            post.id === postId 
              ? { ...post, likes: response.totalReactions }
              : post
          )
          set({ posts: updatedPosts })
          */
          // TEMPORARY FIX END
        } catch (error) {
          console.error('Failed to toggle like:', error)
          // TEMPORARY FIX START - Don't throw error, just log it
          // throw error
          // TEMPORARY FIX END
        }
      },

      sharePost: async (postId: string | number) => {
        try {
          // TODO: Implement share API call when available
          console.log('Sharing post:', postId)
          // This would typically call an API endpoint to track shares
          // await sharePostAPI(postId)
        } catch (error) {
          console.error('Failed to share post:', error)
          throw error
        }
      },

      savePost: (postId: string | number) => {
        const { saved } = get()
        const isSaved = saved[postId] || false
        
        set({
          saved: { ...saved, [postId]: !isSaved }
        })
        
        // TODO: Implement save API call when available
        console.log('Post save status changed:', postId, !isSaved)
        // This would typically call an API endpoint to save/unsave posts
        // savPostAPI(postId, !isSaved)
      },

      clearPosts: () => {
        // TEMPORARY FIX START - Optionally clear localStorage liked posts data
        // Note: Uncomment the line below if you want to clear liked posts on logout
        // localStorage.removeItem('pharminc_liked_posts')
        // TEMPORARY FIX END
        
        set({ 
          posts: [], 
          liked: {}, 
          likedCount: {},
          saved: {},
          error: null,
          currentPage: 1,
          hasMore: true,
          totalPages: 0
        })
      },

      createNewPost: async (postData) => {
        try {
          const newPost = await createPost(postData)
          const { currentUser } = useUserStore.getState()
          
          if (!currentUser) {
            throw new Error("User not available")
          }

          const formattedPost: Post = {
            id: newPost.id,
            author: currentUser.name || "Unknown User",
            avatar: currentUser.profilePicture || "/pp.png",
            role: currentUser.role || "Medical Professional",
            time: "Just now",
            content: newPost.content,
            title: newPost.title,
            tags: [],
            type: "Research Paper" as const,
            likes: newPost.reactions || 0,
            comments: 0,
            shares: newPost.shares || 0,
            poster_type: (newPost.poster_type as "user" | "institute") || "user", // Default to user for new posts
            // Store attachment_id for folder-based attachments
            ...(newPost.attachment_id && { attachment_id: newPost.attachment_id }),
            // Keep legacy image support
            ...(newPost.attachment_id && !newPost.attachment_id.includes('-') && {
              image: `https://content.api.pharminc.in/image/${newPost.attachment_id}`,
            }),
          }

          get().addPost(formattedPost)
          return formattedPost
        } catch (error) {
          console.error('Error creating post:', error)
          throw error
        }
      },

      // TEMPORARY FIX START - Utility method to check if post is liked by current user
      isPostLikedByCurrentUser: (postId: string | number) => {
        const { currentUser } = useUserStore.getState()
        if (!currentUser?.id) return false
        
        // Check from store state first (for performance)
        const storeState = get().liked[postId]
        if (storeState !== undefined) return storeState
        
        // Fallback to localStorage check
        const likedPostsKey = 'pharminc_liked_posts'
        const likedPostsData = localStorage.getItem(likedPostsKey)
        const likedPosts: Array<{user_id: string, post_id: string | number}> = 
          likedPostsData ? JSON.parse(likedPostsData) : []
        
        return likedPosts.some(
          item => item.user_id === currentUser.id && item.post_id === postId
        )
      },
      // TEMPORARY FIX END
    }),
    { name: 'post-store' }
  )
)
