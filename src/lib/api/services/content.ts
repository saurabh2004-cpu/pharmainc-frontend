import { baseApi } from "@/lib/api/axios/api";
import {
  Post,
  PostCreateParams,
  PostUpdateParams,
  PostSearchParams,
  Comment,
  CommentCreateParams,
  CommentUpdateParams,
  CommentSearchParams,
  Application,
  ApplicationCreateParams,
  ApplicationUpdateParams,
  PaginatedResponse,
  ReactionResponse,
} from "@/lib/api/types";
import { PostCleanupService } from "@/lib/services/postCleanupService";

// Post endpoints
export const createPost = async (postData: PostCreateParams): Promise<Post> => {
  const response = await baseApi.post("/private/post", postData);
  return response.data;
};

export const updatePost = async (
  id: string,
  postData: PostUpdateParams
): Promise<Post> => {
  const response = await baseApi.put(`/private/post/${id}`, postData);
  return response.data;
};

export const deletePost = async (id: string): Promise<void> => {
  await baseApi.delete(`/private/post/${id}`);
};

export const deletePostWithCleanup = async (id: string, cleanupStorage: boolean = true): Promise<void> => {
  await baseApi.delete(`/private/post/${id}`);

  if (cleanupStorage) {
    // TODO -> Client side cleanup temporary solution will replace it server side later currently no auth token verification logic
    try {
      await PostCleanupService.cleanupPost(id);
    } catch (error) {
      console.error(`Failed to clean up storage for post ${id}:`, error);
    }
  }
};

export const getPost = async (id: string): Promise<Post> => {
  const response = await baseApi.get(`/public/post/${id}`);
  return response.data;
};

export const listPosts = async (
  page: number = 1,
  limit: number = 10,
  sortBy: string = "created_at",
  sortOrder: "asc" | "desc" = "desc"
): Promise<PaginatedResponse<Post>> => {
  const response = await baseApi.get("/public/post", {
    params: { page, limit, sortBy, sortOrder }
  });
  return response.data;
};

export const getUserPosts = async (
  auth: string,
  page: number = 1,
  limit: number = 10,
  sortBy: string = "created_at",
  sortOrder: "asc" | "desc" = "desc"
): Promise<PaginatedResponse<Post>> => {
  const response = await baseApi.get(`/public/post/user/${auth}`, {
    params: { page, limit, sortBy, sortOrder }
  });
  return response.data;
};

export const searchPosts = async (
  params: PostSearchParams
): Promise<PaginatedResponse<Post>> => {
  const response = await baseApi.get("/public/post/search", { params });
  return response.data;
};

export const getTrendingPosts = async (
  timeframe: "day" | "week" | "month" | "year" = "week",
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<Post>> => {
  const response = await baseApi.get("/public/post/trending", {
    params: { timeframe, page, limit }
  });
  return response.data;
};

export const getPopularPosts = async (
  metric: "reactions" | "shares" | "saves" | "engagement" = "reactions",
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<Post>> => {
  const response = await baseApi.get("/public/post/popular", {
    params: { metric, page, limit }
  });
  return response.data;
};

export const patchReaction = async (id: string): Promise<ReactionResponse> => {
  const response = await baseApi.post(`/private/post/${id}/reaction`, {
    reacted: true
  });
  return response.data;
};

// Comment endpoints
export const createComment = async (
  commentData: CommentCreateParams
): Promise<Comment> => {
  const response = await baseApi.post("/private/comment", commentData);
  return response.data;
};

export const replyToComment = async (
  parent_id: string,
  content: string
): Promise<Comment> => {
  const response = await baseApi.post(`/private/comment/${parent_id}/reply`, { content });
  return response.data;
};

export const updateComment = async (
  id: string,
  commentData: CommentUpdateParams
): Promise<Comment> => {
  const response = await baseApi.put(`/private/comment/${id}`, commentData);
  return response.data;
};

export const deleteComment = async (id: string): Promise<void> => {
  await baseApi.delete(`/private/comment/${id}`);
};

export const getComment = async (id: string): Promise<Comment> => {
  const response = await baseApi.get(`/public/comment/${id}`);
  return response.data;
};

export const listComments = async (
  page: number = 1,
  limit: number = 10,
  sortBy: string = "created_at",
  sortOrder: "asc" | "desc" = "desc"
): Promise<PaginatedResponse<Comment>> => {
  const response = await baseApi.get("/public/comment", {
    params: { page, limit, sortBy, sortOrder }
  });
  return response.data;
};

export const getPostComments = async (
  post_id: string,
  page: number = 1,
  limit: number = 10,
  sortBy: string = "created_at",
  sortOrder: "asc" | "desc" = "desc",
  includeReplies: boolean = true
): Promise<PaginatedResponse<Comment>> => {
  const response = await baseApi.get(`/public/comment/post/${post_id}`, {
    params: { page, limit, sortBy, sortOrder, includeReplies }
  });
  return response.data;
};

export const getUserComments = async (
  auth: string,
  page: number = 1,
  limit: number = 10,
  sortBy: string = "created_at",
  sortOrder: "asc" | "desc" = "desc"
): Promise<PaginatedResponse<Comment>> => {
  const response = await baseApi.get(`/public/comment/user/${auth}`, {
    params: { page, limit, sortBy, sortOrder }
  });
  return response.data;
};

export const getCommentReplies = async (
  commentId: string,
  page: number = 1,
  limit: number = 10,
  sortBy: string = "created_at",
  sortOrder: "asc" | "desc" = "asc",
  nested: boolean = false
): Promise<PaginatedResponse<Comment>> => {
  const response = await baseApi.get(`/public/comment/${commentId}/replies`, {
    params: { page, limit, sortBy, sortOrder, nested }
  });
  return response.data;
};

export const searchComments = async (
  params: CommentSearchParams
): Promise<PaginatedResponse<Comment>> => {
  const response = await baseApi.get("/public/comment/search", { params });
  return response.data;
};

export const getCommentThread = async (
  commentId: string,
  depth: number = 5,
  sortBy: "created_at" | "reactions" = "created_at"
): Promise<{
  comment: Comment;
  replies: Comment[];
  totalReplies: number;
}> => {
  const response = await baseApi.get(`/public/comment/${commentId}/thread`, {
    params: { depth, sortBy }
  });
  return response.data;
};

// Application endpoints
export const createApplication = async (
  applicationData: ApplicationCreateParams
): Promise<Application> => {
  const response = await baseApi.post("/private/application", applicationData);
  return response.data;
};

export const updateApplication = async (
  id: string,
  applicationData: ApplicationUpdateParams
): Promise<Application> => {
  const response = await baseApi.put(`/private/application/${id}`, applicationData);
  return response.data;
};

export const deleteApplication = async (id: string): Promise<void> => {
  await baseApi.delete(`/private/application/${id}`);
};

export const getApplication = async (id: string): Promise<Application> => {
  const response = await baseApi.get(`/private/application/${id}`);
  return response.data;
};

export const getUserApplications = async (): Promise<Application[]> => {
  const response = await baseApi.get("/private/application/my");
  return response.data;
};

export const getJobApplications = async (
  jobId: string
): Promise<Application[]> => {
  const response = await baseApi.get(`/private/application/job/${jobId}`);
  return response.data;
};
