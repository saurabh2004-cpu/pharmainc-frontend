
import { baseApi, baseApiServer } from "@/lib/api/axios/api";
import {
  User,
  UserCreateParams,
  UserUpdateParams,
  UserSearchParams,
  PaginatedResponse,
  SearchUsersResponse,
} from "@/lib/api/types";

export const createUser = async (userData: UserCreateParams): Promise<User> => {
  console.log("Creating user with data:", userData);
  const response = await baseApi.post("/priv/user", userData);
  return response.data;
};

export const getUser = async (): Promise<User> => {
  const response = await baseApi.get("/user/my-profile");
  return response.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const response = await baseApi.get(`/user/get-user/${id}`);
  return response.data;
};

export const getUserByIdServer = async (id: string): Promise<User> => {
  const response = await baseApiServer.get(`/user/get-user/${id}`);
  return response.data;
};

export const updateUser = async (userId: string, userData: UserUpdateParams): Promise<User> => {
  const response = await baseApi.put(`/user/update-user/${userId}`, userData);
  return response.data;
};

export const deleteUser = async (): Promise<void> => {
  await baseApi.delete("/private/user");
  return;
};

export const searchUsers = async (
  params: UserSearchParams
): Promise<SearchUsersResponse> => {
  const response = await baseApi.get("/pub/user/search", { params });
  return response.data;
};

export const listUsers = async (
  page: number = 1,
  limit: number = 10,
  fields?: string
): Promise<PaginatedResponse<User>> => {
  const response = await baseApi.get("/pub/user", {
    params: { page, limit, fields }
  });
  return response.data;
};

export const downloadResume = async (userId: string): Promise<Blob> => {
  const response = await baseApi.get(`/user/resume/download/${userId}`, {
    responseType: 'blob',
  });

  console.log("download resume response", response);
  return response.data;
};

export const checkProfileCompletion = async (): Promise<{ isVerified: boolean; isComplete: boolean; error?: string }> => {
  const response = await baseApi.get('/user/check-profile-completion');
  return response.data;
};