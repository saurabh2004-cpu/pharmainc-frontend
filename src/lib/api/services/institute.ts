import { baseApi, } from "@/lib/api/axios/api";
import {
  Institution,
  InstitutionCreateParams,
  InstitutionUpdateParams,
  InstitutionSearchParams,
  PaginatedResponse,
  SearchInstitutionsResponse,
  InstituteStats,
} from "@/lib/api/types";

export const createInstitution = async (
  institutionData: InstitutionCreateParams
): Promise<Institution> => {
  const response = await baseApi.post("/priv/institute", institutionData);
  return response.data;
};

export const getInstitution = async (): Promise<Institution> => {
  const response = await baseApi.get("/institute/my-profile");

  console.log("response my institute", response.data)

  return response.data;
};

export const getInstitutionById = async (id: string): Promise<Institution> => {
  const response = await baseApi.get(`/institute/get-institute/${id}`);
  return response.data;
};

export const updateInstitution = async (
  id: string,
  institutionData: InstitutionUpdateParams
): Promise<Institution> => {
  const response = await baseApi.put(`/institute/update-institute/${id}`, institutionData);
  return response.data;
};

export const deleteInstitution = async (): Promise<void> => {
  await baseApi.delete("/private/institute");
};

export const searchInstitutions = async (
  params: InstitutionSearchParams
): Promise<SearchInstitutionsResponse> => {
  const response = await baseApi.get("/pub/institute/search", { params });
  return response.data;
};

export const listInstitutions = async (
  page: number = 1,
  limit: number = 10,
  fields?: string
): Promise<PaginatedResponse<Institution>> => {
  const response = await baseApi.get("/pub/institute", {
    params: { page, limit, fields }
  });
  return response.data;
};

export const getInstituteStats = async (): Promise<InstituteStats> => {
  const response = await baseApi.get("/institute/my-stats");
  return response.data;
};

export const getInstituteWallet = async (): Promise<{ credits: number, id: string }> => {
  const response = await baseApi.get("/institute/my-wallet");
  return response.data;
};


// export const createInstitution = async (
//   institutionData: InstitutionCreateParams
// ): Promise<Institution> => {
//   const response = await instituteApi.post("/private/institution", institutionData);
//   return response.data;
// };


// export const getInstitutionById = async (id: string): Promise<Institution> => {
//   const response = await instituteApi.get(`/public/institution/${id}`);
//   return response.data;
// };

// export const searchInstitutions = async (
//   params: InstitutionSearchParams
// ): Promise<PaginatedResponse<Institution>> => {
//   const response = await instituteApi.get("/institution/search", { params });
//   return response.data;
// };

// export const listInstitutions = async (
//   page: number = 1,
//   limit: number = 10,
//   fields?: string
// ): Promise<PaginatedResponse<Institution>> => {
//   const response = await instituteApi.get("/public/institution", {
//     params: { page, limit, fields }
//   });
//   return response.data;
// };