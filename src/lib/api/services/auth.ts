import { baseApi } from "@/lib/api/axios/api";
import { AuthParams, AuthResponse, AuthSignInParams } from "@/lib/api/types";

export const login = async (credentials: AuthSignInParams): Promise<AuthResponse> => {
  const response = await baseApi.post<AuthResponse>("/user/signin-user", credentials);
  return response.data;
};


export const register = async (credentials: AuthParams): Promise<number> => {
  const response = await baseApi.post("/user/create-user", credentials);
  return response.status;
};


export const loginInstitute = async (credentials: AuthSignInParams): Promise<AuthResponse> => {
  const response = await baseApi.post<AuthResponse>("/institute/signin-institute", credentials);
  return response.data;
  return response.data;
};


export const registerInstitute = async (credentials: any): Promise<number> => {
  const response = await baseApi.post("/institute/create-institute", credentials);
  return response.status;
};




